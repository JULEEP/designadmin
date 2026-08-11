// Business.jsx - Complete Business Management
import { useState, useEffect } from "react";
import { 
  FaBuilding, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaEye,
  FaInfoCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLocationArrow,
  FaAddressCard
} from "react-icons/fa";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Business() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [viewingBusiness, setViewingBusiness] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    latitude: "",
    longitude: "",
    isActive: true,
    businessLogo: ""
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = () => {
    setLoading(true);
    axios
      .get("https://designback.onrender.com/api/admin/allbusiness")
      .then((res) => {
        if (res.data && res.data.data) {
          setBusinesses(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching businesses:", error);
        toast.error("Failed to fetch businesses");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setEditingBusiness(null);
    setFormData({
      businessName: "",
      businessAddress: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      website: "",
      latitude: "",
      longitude: "",
      isActive: true,
      businessLogo: ""
    });
    setShowModal(true);
  };

  const openEditModal = (business) => {
    setEditingBusiness(business);
    setFormData({
      businessName: business.businessName || "",
      businessAddress: business.businessAddress || "",
      city: business.city || "",
      state: business.state || "",
      pincode: business.pincode || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      latitude: business.latitude || "",
      longitude: business.longitude || "",
      isActive: business.isActive !== undefined ? business.isActive : true,
      businessLogo: business.businessLogo || ""
    });
    setShowEditModal(true);
  };

  const openViewModal = (business) => {
    setViewingBusiness(business);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0
      };

      if (editingBusiness) {
        await axios.put(`https://designback.onrender.com/api/admin/updatebusiness/${editingBusiness._id}`, payload);
        toast.success("Business updated successfully!");
      } else {
        await axios.post("https://designback.onrender.com/api/admin/addbusiness", payload);
        toast.success("Business added successfully!");
      }

      setShowModal(false);
      setShowEditModal(false);
      fetchBusinesses();
    } catch (error) {
      console.error("Error saving business:", error);
      toast.error(error.response?.data?.message || "Failed to save business");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      setDeleteLoading(true);
      try {
        await axios.delete(`https://designback.onrender.com/api/admin/deletebusiness/${id}`);
        toast.success("Business deleted successfully!");
        fetchBusinesses();
      } catch (error) {
        console.error("Error deleting business:", error);
        toast.error("Failed to delete business");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const exportData = (type) => {
    const exportData = filteredBusinesses.map((business, index) => ({
      "S.No": index + 1,
      "Business Name": business.businessName || "N/A",
      "Address": business.businessAddress || "N/A",
      "City": business.city || "N/A",
      "State": business.state || "N/A",
      "Phone": business.phone || "N/A",
      "Email": business.email || "N/A",
      "Status": business.isActive ? "Active" : "Inactive",
      "Created At": new Date(business.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Businesses");
    writeFile(wb, `businesses_${new Date().toISOString().split('T')[0]}.${type}`);
    toast.success(`Data exported as ${type.toUpperCase()}`);
  };

  const filteredBusinesses = businesses.filter((business) => {
    const searchTerm = search.toLowerCase();
    return (
      business.businessName?.toLowerCase().includes(searchTerm) ||
      business.businessAddress?.toLowerCase().includes(searchTerm) ||
      business.city?.toLowerCase().includes(searchTerm) ||
      business.phone?.includes(searchTerm) ||
      business.email?.toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBusinesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && businesses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaBuilding className="text-blue-600" /> Business Details
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            Total: {filteredBusinesses.length}
          </span>
          <button
            onClick={fetchBusinesses}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-1.5 text-sm"
          >
            <FaPlus size={12} /> Add Business
          </button>
        </div>
      </div>

      {/* Search & Export */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            placeholder="Search by Business Name, Address, City, Phone or Email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportData("csv")}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-1 text-sm"
          >
            <FaFileAlt size={12} /> CSV
          </button>
          <button
            onClick={() => exportData("xlsx")}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-1 text-sm"
          >
            <FaDownload size={12} /> Excel
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-2 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Business</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Address</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500 text-sm">
                  No businesses found
                </td>
              </tr>
            ) : (
              currentItems.map((business, index) => (
                <tr key={business._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-2 font-medium text-gray-600 text-sm">{index + 1 + indexOfFirstItem}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {business.businessLogo ? (
                        <img 
                          src={`https://designback.onrender.com${business.businessLogo}`} 
                          alt={business.businessName}
                          className="w-8 h-8 rounded object-cover border"
                        />
                      ) : (
                        <FaBuilding className="text-gray-400 text-xl" />
                      )}
                      <span className="font-medium text-gray-800 text-sm">{business.businessName || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="text-sm text-gray-600 truncate max-w-[150px] block">
                      {business.businessAddress || "N/A"}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <FaCity className="text-gray-400" size={10} />
                      {business.city || "N/A"}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="text-sm">
                      <p className="text-gray-800 flex items-center gap-1">
                        <FaPhone className="text-gray-400" size={10} />
                        {business.phone || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1 text-xs">
                        <FaEnvelope className="text-gray-400" size={10} />
                        {business.email || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {business.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openViewModal(business)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        onClick={() => openEditModal(business)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(business._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="Delete"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2">
        {currentItems.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm">
            No businesses found
          </div>
        ) : (
          currentItems.map((business) => (
            <div key={business._id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {business.businessLogo ? (
                    <img 
                      src={`https://designback.onrender.com${business.businessLogo}`} 
                      alt={business.businessName}
                      className="w-10 h-10 rounded object-cover border"
                    />
                  ) : (
                    <FaBuilding className="text-gray-400 text-2xl" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{business.businessName || "N/A"}</p>
                    <p className="text-xs text-gray-500">{business.city || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openViewModal(business)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEye size={10} />
                  </button>
                  <button
                    onClick={() => openEditModal(business)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button
                    onClick={() => handleDelete(business._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <FaSpinner className="animate-spin" size={10} /> : <FaTrash size={10} />}
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaMapMarkerAlt size={10} /> {business.businessAddress || "N/A"}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaPhone size={10} /> {business.phone || "N/A"}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaEnvelope size={10} /> {business.email || "N/A"}
                </p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  business.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {business.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredBusinesses.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg transition-all duration-300 text-sm ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            ← Previous
          </button>
          <span className="text-gray-600 font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg transition-all duration-300 text-sm ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW DETAILS MODAL */}
      {/* ============================================================ */}
      {showViewModal && viewingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaBuilding className="text-blue-600" />
                Business Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Business Header */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {viewingBusiness.businessLogo ? (
                  <img 
                    src={`https://designback.onrender.com${viewingBusiness.businessLogo}`} 
                    alt={viewingBusiness.businessName}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-blue-500"
                  />
                ) : (
                  <FaBuilding className="text-gray-400 text-6xl" />
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{viewingBusiness.businessName || "N/A"}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt size={12} /> {viewingBusiness.businessAddress || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaCity size={12} /> {viewingBusiness.city || "N/A"}, {viewingBusiness.state || "N/A"} - {viewingBusiness.pincode || "N/A"}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewingBusiness.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingBusiness.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Contact Info */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" size={14} />
                    Contact Information
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm"><span className="font-medium text-gray-600">Phone:</span> {viewingBusiness.phone || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Email:</span> {viewingBusiness.email || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Website:</span> {viewingBusiness.website || "N/A"}</p>
                  </div>
                </div>

                {/* Location Info */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaLocationArrow className="text-blue-500" size={14} />
                    Location Details
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm"><span className="font-medium text-gray-600">Address:</span> {viewingBusiness.businessAddress || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">City:</span> {viewingBusiness.city || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">State:</span> {viewingBusiness.state || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Pincode:</span> {viewingBusiness.pincode || "N/A"}</p>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaGlobe className="text-blue-500" size={14} />
                    Coordinates
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm"><span className="font-medium text-gray-600">Latitude:</span> {viewingBusiness.latitude || "0"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Longitude:</span> {viewingBusiness.longitude || "0"}</p>
                    {viewingBusiness.latitude && viewingBusiness.longitude && (
                      <a 
                        href={`https://www.google.com/maps?q=${viewingBusiness.latitude},${viewingBusiness.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm hover:underline flex items-center gap-1"
                      >
                        <FaLocationArrow size={12} /> View on Map
                      </a>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" size={14} />
                    Additional Information
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm flex items-center gap-1">
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        viewingBusiness.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingBusiness.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Created:</span> {formatDate(viewingBusiness.createdAt)}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Last Updated:</span> {formatDate(viewingBusiness.updatedAt)}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">ID:</span> <span className="text-xs text-gray-500">{viewingBusiness._id}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-2 p-3 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-lg">
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(viewingBusiness);
                }}
                className="flex-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
              >
                <FaEdit size={14} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaPlus size={14} className="text-blue-600" />
                Add Business
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter business address"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Website URL"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="e.g., 28.6139"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="e.g., 77.2090"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
                  disabled={formLoading}
                >
                  {formLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                  {formLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaEdit size={14} className="text-yellow-600" />
                Edit Business
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter business address"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Website URL"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="e.g., 28.6139"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="e.g., 77.2090"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-1.5 text-sm"
                  disabled={formLoading}
                >
                  {formLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                  {formLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}