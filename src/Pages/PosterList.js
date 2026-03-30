import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes, FaEye, FaDownload, FaImage, FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPalette, FaFont } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

export default function BillBookList() {
  const [billbooks, setBillbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedBillbook, setSelectedBillbook] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Edit Modal
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
  });

  const API_BASE_URL = "https://designback.onrender.com";

  useEffect(() => {
    fetchBillBooks();
  }, []);

  const fetchBillBooks = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/admin/allbillbooks`)
      .then((res) => {
        if (res.data && res.data.success) {
          setBillbooks(res.data.data || []);
        } else {
          setBillbooks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching billbooks:", error);
        alert("Error loading billbooks data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Get full image URL
  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    if (filePath.startsWith('/')) return `${API_BASE_URL}${filePath}`;
    return `${API_BASE_URL}/${filePath}`;
  };

  // Filter billbooks based on search
  const filteredBillbooks = billbooks.filter((item) =>
    (item.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
    (item._id || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredBillbooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBillbooks.slice(indexOfFirstItem, indexOfLastItem);

  // Handle Delete
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    axios
      .delete(`${API_BASE_URL}/api/admin/billbook/${itemToDelete}`)
      .then((res) => {
        if (res.data.success) {
          setBillbooks(billbooks.filter(item => item._id !== itemToDelete));
          alert("Billbook deleted successfully!");
        } else {
          alert("Failed to delete: " + (res.data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert("Error deleting billbook");
      })
      .finally(() => {
        setDeleteModal(false);
        setItemToDelete(null);
      });
  };

  // Handle Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditData({
      companyName: item.companyName || "",
      companyAddress: item.companyAddress || "",
      companyEmail: item.companyEmail || "",
      companyPhone: item.companyPhone || "",
      customerName: item.customerName || "",
      customerAddress: item.customerAddress || "",
      customerEmail: item.customerEmail || "",
      customerPhone: item.customerPhone || "",
    });
    setEditModal(true);
  };

  const saveEdit = () => {
    if (!editingItem) return;

    axios
      .put(`${API_BASE_URL}/api/admin/billbook/${editingItem._id}`, editData)
      .then((res) => {
        if (res.data.success) {
          setBillbooks(billbooks.map(item => 
            item._id === editingItem._id ? { ...item, ...editData } : item
          ));
          alert("Billbook updated successfully!");
          setEditModal(false);
        } else {
          alert("Failed to update: " + (res.data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
        alert("Error updating billbook");
      });
  };

  // View Full Details
  const viewDetails = (item) => {
    setSelectedBillbook(item);
    setDetailsModal(true);
  };

  // Preview Image
  const previewImage = (filePath) => {
    const imageUrl = getImageUrl(filePath);
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setPreviewModal(true);
    } else {
      alert("No preview image available");
    }
  };

  // Download Image
  const downloadImage = (item) => {
    const imageUrl = getImageUrl(item.previewImage);
    
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${item.companyName || 'billbook'}_${item._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No image available to download");
    }
  };

  // Export to Excel/CSV
  const exportData = (type) => {
    const exportData = filteredBillbooks.map((item, index) => ({
      "SI No": index + 1,
      "ID": item._id,
      "Company Name": item.companyName || "N/A",
      "Company Address": item.companyAddress || "N/A",
      "Company Email": item.companyEmail || "N/A",
      "Company Phone": item.companyPhone || "N/A",
      "Customer Name": item.customerName || "N/A",
      "Customer Address": item.customerAddress || "N/A",
      "Customer Email": item.customerEmail || "N/A",
      "Customer Phone": item.customerPhone || "N/A",
      "Use Template": item.useTemplate ? "Yes" : "No",
      "Template Image": item.templateImage || "N/A",
      "Preview Image": item.previewImage || "N/A",
      "Status": item.status || "N/A",
      "Created Date": item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
      "Created Time": item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "N/A"
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "BillBooks");
    writeFile(wb, `billbooks_${new Date().toISOString().split('T')[0]}.${type}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">BillBook Records</h2>
          <p className="text-gray-600">Total: {filteredBillbooks.length} items</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => exportData("csv")} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            Export CSV
          </button>
          <button 
            onClick={() => exportData("xlsx")} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search by company name, customer name or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="absolute left-3 top-3 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading billbooks...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <FaImage className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-lg">No billbooks found</p>
                      <p className="text-sm">Try adjusting your search or add new billbooks</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((item, index) => {
                    const previewUrl = getImageUrl(item.previewImage);
                    return (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {indexOfFirstItem + index + 1}
                        </td>
                        
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div 
                            className="w-16 h-16 rounded border border-gray-300 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-gray-100 flex items-center justify-center"
                            onClick={() => previewImage(item.previewImage)}
                          >
                            {previewUrl ? (
                              <img 
                                src={previewUrl}
                                alt={item.companyName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaImage size={24} />
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                              <FaBuilding className="text-blue-500 text-xs" />
                              {item.companyName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                {item.companyEmail || "No email"}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <FaPhone className="text-gray-400 text-xs" />
                                {item.companyPhone || "No phone"}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                              <FaUser className="text-green-500 text-xs" />
                              {item.customerName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                {item.customerEmail || "No email"}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <FaPhone className="text-gray-400 text-xs" />
                                {item.customerPhone || "No phone"}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status || 'Active'}
                          </span>
                          {item.useTemplate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                              Template
                            </span>
                          )}
                        </td>
                        
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => viewDetails(item)}
                              className="text-purple-600 hover:text-purple-900 p-1.5 rounded hover:bg-purple-50"
                              title="View Details"
                            >
                              <FaEye size={15} />
                            </button>
                            
                            <button
                              onClick={() => previewImage(item.previewImage)}
                              className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50"
                              title="Preview Image"
                              disabled={!item.previewImage}
                            >
                              <FaImage size={15} />
                            </button>
                            
                            <button
                              onClick={() => downloadImage(item)}
                              className="text-green-600 hover:text-green-900 p-1.5 rounded hover:bg-green-50"
                              title="Download"
                              disabled={!item.previewImage}
                            >
                              <FaDownload size={15} />
                            </button>
                            
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-yellow-600 hover:text-yellow-900 p-1.5 rounded hover:bg-yellow-50"
                              title="Edit"
                            >
                              <FaEdit size={15} />
                            </button>
                            
                            <button
                              onClick={() => confirmDelete(item._id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <FaTrash size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredBillbooks.length > 0 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredBillbooks.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredBillbooks.length}</span> results
                  </p>
                </div>
                
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Preview Modal */}
      {previewModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Image Preview</h3>
              <button
                onClick={() => setPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4 flex justify-center items-center h-[calc(90vh-80px)]">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Found";
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && selectedBillbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-semibold">BillBook Details</h3>
              <button
                onClick={() => setDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Company Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
                  <FaBuilding /> Company Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-medium">Company Name:</span> {selectedBillbook.companyName || "N/A"}</div>
                  <div><span className="font-medium">Company Address:</span> {selectedBillbook.companyAddress || "N/A"}</div>
                  <div><span className="font-medium">Company Email:</span> {selectedBillbook.companyEmail || "N/A"}</div>
                  <div><span className="font-medium">Company Phone:</span> {selectedBillbook.companyPhone || "N/A"}</div>
                </div>
              </div>

              {/* Customer Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <FaUser /> Customer Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-medium">Customer Name:</span> {selectedBillbook.customerName || "N/A"}</div>
                  <div><span className="font-medium">Customer Address:</span> {selectedBillbook.customerAddress || "N/A"}</div>
                  <div><span className="font-medium">Customer Email:</span> {selectedBillbook.customerEmail || "N/A"}</div>
                  <div><span className="font-medium">Customer Phone:</span> {selectedBillbook.customerPhone || "N/A"}</div>
                </div>
              </div>

              {/* Design Section */}
              {selectedBillbook.design && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-purple-600 mb-3 flex items-center gap-2">
                    <FaPalette /> Design Settings
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="font-medium">Background Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedBillbook.design?.backgroundColor }}></div>
                        {selectedBillbook.design?.backgroundColor}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Text Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedBillbook.design?.textColor }}></div>
                        {selectedBillbook.design?.textColor}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Accent Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded border" style={{ backgroundColor: selectedBillbook.design?.accentColor }}></div>
                        {selectedBillbook.design?.accentColor}
                      </div>
                    </div>
                    <div><span className="font-medium">Font Family:</span> {selectedBillbook.design?.fontFamily}</div>
                    <div><span className="font-medium">Rounded Corners:</span> {selectedBillbook.design?.roundedCorners ? "Yes" : "No"}</div>
                    <div><span className="font-medium">Show Shadow:</span> {selectedBillbook.design?.shadow ? "Yes" : "No"}</div>
                    <div><span className="font-medium">Show Border:</span> {selectedBillbook.design?.border ? "Yes" : "No"}</div>
                    <div><span className="font-medium">Show Logo:</span> {selectedBillbook.design?.showLogo ? "Yes" : "No"}</div>
                  </div>
                </div>
              )}

              {/* Files Section */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-indigo-600 mb-3">Files</h4>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedBillbook.templateImage && (
                    <div>
                      <span className="font-medium">Template Image:</span>
                      <div className="mt-1">
                        <img 
                          src={getImageUrl(selectedBillbook.templateImage)} 
                          alt="Template" 
                          className="w-32 h-32 object-cover rounded border cursor-pointer"
                          onClick={() => previewImage(selectedBillbook.templateImage)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {selectedBillbook.previewImage && (
                    <div>
                      <span className="font-medium">Preview Image:</span>
                      <div className="mt-1">
                        <img 
                          src={getImageUrl(selectedBillbook.previewImage)} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded border cursor-pointer"
                          onClick={() => previewImage(selectedBillbook.previewImage)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {selectedBillbook.logo && (
                    <div>
                      <span className="font-medium">Logo:</span>
                      <div className="mt-1">
                        <img 
                          src={getImageUrl(selectedBillbook.logo)} 
                          alt="Logo" 
                          className="w-32 h-32 object-cover rounded border cursor-pointer"
                          onClick={() => previewImage(selectedBillbook.logo)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20' rx='2.18' ry='2.18'%3E%3C/rect%3E%3Cpath d='M8 2v20M16 2v20M2 8h20M2 16h20'%3E%3C/path%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-600 mb-3">Meta Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-medium">ID:</span> {selectedBillbook._id}</div>
                  <div><span className="font-medium">Status:</span> {selectedBillbook.status}</div>
                  <div><span className="font-medium">Use Template:</span> {selectedBillbook.useTemplate ? "Yes" : "No"}</div>
                  <div><span className="font-medium">Created:</span> {formatDate(selectedBillbook.createdAt)}</div>
                  <div><span className="font-medium">Last Updated:</span> {formatDate(selectedBillbook.updatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">Edit BillBook</h3>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editData.companyName}
                    onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editData.companyAddress}
                    onChange={(e) => setEditData({...editData, companyAddress: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData.companyEmail}
                      onChange={(e) => setEditData({...editData, companyEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData.companyPhone}
                      onChange={(e) => setEditData({...editData, companyPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-3">Customer Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData.customerName}
                      onChange={(e) => setEditData({...editData, customerName: e.target.value})}
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Address</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData.customerAddress}
                      onChange={(e) => setEditData({...editData, customerAddress: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                      <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData.customerEmail}
                        onChange={(e) => setEditData({...editData, customerEmail: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editData.customerPhone}
                        onChange={(e) => setEditData({...editData, customerPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-center mb-2">Confirm Delete</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this billbook? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}