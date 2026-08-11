// DeliveryBoy.jsx - Complete Delivery Boy Management with View Details
import { useState, useEffect } from "react";
import { 
  FaUser, 
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
  FaIdCard,
  FaMotorcycle,
  FaCar,
  FaBicycle,
  FaImage,
  FaUserCircle,
  FaTruck,
  FaEye,
  FaAddressCard,
  FaInfoCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeliveryBoy() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBoy, setEditingBoy] = useState(null);
  const [viewingBoy, setViewingBoy] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    profilePhoto: null,
    vehiclePhoto: null,
    licensePhoto: null,
    aadharPhoto: null
  });
  const [previewUrls, setPreviewUrls] = useState({
    profilePhoto: null,
    vehiclePhoto: null,
    licensePhoto: null,
    aadharPhoto: null
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isActive: true,
    vehicleName: "",
    vehicleNumber: "",
    licenseNumber: "",
    aadharNumber: "",
    profilePhoto: "",
    vehiclePhoto: "",
    licensePhoto: "",
    aadharPhoto: ""
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = () => {
    setLoading(true);
    axios
      .get("https://designback.onrender.com/api/admin/alldeliveryboy")
      .then((res) => {
        if (res.data && res.data.data) {
          setDeliveryBoys(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery boys:", error);
        toast.error("Failed to fetch delivery boys");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setEditingBoy(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isActive: true,
      vehicleName: "",
      vehicleNumber: "",
      licenseNumber: "",
      aadharNumber: "",
      profilePhoto: "",
      vehiclePhoto: "",
      licensePhoto: "",
      aadharPhoto: ""
    });
    setPreviewUrls({
      profilePhoto: null,
      vehiclePhoto: null,
      licensePhoto: null,
      aadharPhoto: null
    });
    setSelectedFiles({
      profilePhoto: null,
      vehiclePhoto: null,
      licensePhoto: null,
      aadharPhoto: null
    });
    setShowModal(true);
  };

  const openEditModal = (boy) => {
    setEditingBoy(boy);
    setFormData({
      name: boy.name || "",
      email: boy.email || "",
      phone: boy.phone || "",
      password: "",
      address: boy.address || "",
      city: boy.city || "",
      state: boy.state || "",
      pincode: boy.pincode || "",
      isActive: boy.isActive !== undefined ? boy.isActive : true,
      vehicleName: boy.vehicleName || "",
      vehicleNumber: boy.vehicleNumber || "",
      licenseNumber: boy.licenseNumber || "",
      aadharNumber: boy.aadharNumber || "",
      profilePhoto: boy.profilePhoto || "",
      vehiclePhoto: boy.vehiclePhoto || "",
      licensePhoto: boy.licensePhoto || "",
      aadharPhoto: boy.aadharPhoto || ""
    });
    setPreviewUrls({
      profilePhoto: boy.profilePhoto || null,
      vehiclePhoto: boy.vehiclePhoto || null,
      licensePhoto: boy.licensePhoto || null,
      aadharPhoto: boy.aadharPhoto || null
    });
    setSelectedFiles({
      profilePhoto: null,
      vehiclePhoto: null,
      licensePhoto: null,
      aadharPhoto: null
    });
    setShowEditModal(true);
  };

  const openViewModal = (boy) => {
    setViewingBoy(boy);
    setShowViewModal(true);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles({ ...selectedFiles, [field]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls({ ...previewUrls, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'profilePhoto' && key !== 'vehiclePhoto' && key !== 'licensePhoto' && key !== 'aadharPhoto') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedFiles.profilePhoto) {
        formDataToSend.append('profilePhoto', selectedFiles.profilePhoto);
      }
      if (selectedFiles.vehiclePhoto) {
        formDataToSend.append('vehiclePhoto', selectedFiles.vehiclePhoto);
      }
      if (selectedFiles.licensePhoto) {
        formDataToSend.append('licensePhoto', selectedFiles.licensePhoto);
      }
      if (selectedFiles.aadharPhoto) {
        formDataToSend.append('aadharPhoto', selectedFiles.aadharPhoto);
      }

      if (editingBoy) {
        await axios.put(`https://designback.onrender.com/api/admin/updatedeliveryboy/${editingBoy._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Delivery boy updated successfully!");
      } else {
        await axios.post("https://designback.onrender.com/api/admin/adddeliveryboy", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Delivery boy added successfully!");
      }

      setShowModal(false);
      setShowEditModal(false);
      fetchDeliveryBoys();
    } catch (error) {
      console.error("Error saving delivery boy:", error);
      toast.error(error.response?.data?.message || "Failed to save delivery boy");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery boy?")) {
      setDeleteLoading(true);
      try {
        await axios.delete(`https://designback.onrender.com/api/admin/deletedeliveryboy/${id}`);
        toast.success("Delivery boy deleted successfully!");
        fetchDeliveryBoys();
      } catch (error) {
        console.error("Error deleting delivery boy:", error);
        toast.error("Failed to delete delivery boy");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const exportData = (type) => {
    const exportData = filteredBoys.map((boy, index) => ({
      "S.No": index + 1,
      "Name": boy.name || "N/A",
      "Email": boy.email || "N/A",
      "Phone": boy.phone || "N/A",
      "City": boy.city || "N/A",
      "Vehicle": boy.vehicleName || "N/A",
      "Vehicle Number": boy.vehicleNumber || "N/A",
      "Status": boy.isActive ? "Active" : "Inactive",
      "Created At": new Date(boy.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Delivery Boys");
    writeFile(wb, `delivery_boys_${new Date().toISOString().split('T')[0]}.${type}`);
    toast.success(`Data exported as ${type.toUpperCase()}`);
  };

  const filteredBoys = deliveryBoys.filter((boy) => {
    const searchTerm = search.toLowerCase();
    return (
      boy.name?.toLowerCase().includes(searchTerm) ||
      boy.email?.toLowerCase().includes(searchTerm) ||
      boy.phone?.includes(searchTerm) ||
      boy.city?.toLowerCase().includes(searchTerm) ||
      boy.vehicleName?.toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBoys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBoys.length / itemsPerPage);

  const getVehicleIcon = (type) => {
    if (!type) return <FaMotorcycle className="text-gray-400" />;
    const lower = type.toLowerCase();
    if (lower.includes('car')) return <FaCar className="text-blue-500" />;
    if (lower.includes('cycle') || lower.includes('bicycle')) return <FaBicycle className="text-green-500" />;
    return <FaMotorcycle className="text-purple-500" />;
  };

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

  if (loading && deliveryBoys.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading delivery boys...</p>
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
          <FaTruck className="text-blue-600" /> Delivery Boys
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            Total: {filteredBoys.length}
          </span>
          <button
            onClick={fetchDeliveryBoys}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-1.5 text-sm"
          >
            <FaPlus size={12} /> Add Delivery Boy
          </button>
        </div>
      </div>

      {/* Search & Export */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            placeholder="Search by Name, Email, Phone, City or Vehicle..."
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
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Vehicle</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500 text-sm">
                  No delivery boys found
                </td>
              </tr>
            ) : (
              currentItems.map((boy, index) => (
                <tr key={boy._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-2 font-medium text-gray-600 text-sm">{index + 1 + indexOfFirstItem}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {boy.profilePhoto ? (
                        <img 
                          src={`https://designback.onrender.com${boy.profilePhoto}`} 
                          alt={boy.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      ) : (
                        <FaUserCircle className="text-gray-400 text-2xl" />
                      )}
                      <span className="font-medium text-gray-800 text-sm">{boy.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="text-sm">
                      <p className="text-gray-800 flex items-center gap-1">
                        <FaEnvelope className="text-gray-400" size={10} />
                        {boy.email || "N/A"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1 text-xs">
                        <FaPhone className="text-gray-400" size={10} />
                        {boy.phone || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      <FaCity className="text-gray-400" size={10} />
                      {boy.city || "N/A"}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1.5">
                      {getVehicleIcon(boy.vehicleName)}
                      <span className="text-sm text-gray-700">{boy.vehicleName || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      boy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {boy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openViewModal(boy)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        onClick={() => openEditModal(boy)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(boy._id)}
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
            No delivery boys found
          </div>
        ) : (
          currentItems.map((boy) => (
            <div key={boy._id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {boy.profilePhoto ? (
                    <img 
                      src={`https://designback.onrender.com${boy.profilePhoto}`} 
                      alt={boy.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-3xl" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{boy.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{boy.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openViewModal(boy)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEye size={10} />
                  </button>
                  <button
                    onClick={() => openEditModal(boy)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button
                    onClick={() => handleDelete(boy._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <FaSpinner className="animate-spin" size={10} /> : <FaTrash size={10} />}
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaEnvelope size={10} /> {boy.email || "N/A"}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <FaCity size={10} /> {boy.city || "N/A"}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  {getVehicleIcon(boy.vehicleName)} {boy.vehicleName || "N/A"}
                </p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  boy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {boy.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredBoys.length > 0 && (
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
      {showViewModal && viewingBoy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Delivery Boy Details
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
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {viewingBoy.profilePhoto ? (
                  <img 
                    src={`https://designback.onrender.com${viewingBoy.profilePhoto}`} 
                    alt={viewingBoy.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 text-6xl" />
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{viewingBoy.name || "N/A"}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaEnvelope size={12} /> {viewingBoy.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaPhone size={12} /> {viewingBoy.phone || "N/A"}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    viewingBoy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewingBoy.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Personal Info */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" size={14} />
                    Personal Information
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm"><span className="font-medium text-gray-600">Name:</span> {viewingBoy.name || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Email:</span> {viewingBoy.email || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Phone:</span> {viewingBoy.phone || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Address:</span> {viewingBoy.address || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">City:</span> {viewingBoy.city || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">State:</span> {viewingBoy.state || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Pincode:</span> {viewingBoy.pincode || "N/A"}</p>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMotorcycle className="text-blue-500" size={14} />
                    Vehicle Information
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm flex items-center gap-1">
                      {getVehicleIcon(viewingBoy.vehicleName)}
                      <span className="font-medium text-gray-600">Vehicle:</span> {viewingBoy.vehicleName || "N/A"}
                    </p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Vehicle Number:</span> {viewingBoy.vehicleNumber || "N/A"}</p>
                    {viewingBoy.vehiclePhoto && (
                      <div className="mt-1">
                        <p className="text-xs font-medium text-gray-600 mb-1">Vehicle Photo:</p>
                        <img 
                          src={`https://designback.onrender.com${viewingBoy.vehiclePhoto}`} 
                          alt="Vehicle"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaIdCard className="text-blue-500" size={14} />
                    Documents
                  </h5>
                  <div className="space-y-1.5">
                    <p className="text-sm"><span className="font-medium text-gray-600">License Number:</span> {viewingBoy.licenseNumber || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Aadhar Number:</span> {viewingBoy.aadharNumber || "N/A"}</p>
                    <div className="flex gap-2 mt-1">
                      {viewingBoy.licensePhoto && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-0.5">License:</p>
                          <img 
                            src={`https://designback.onrender.com${viewingBoy.licensePhoto}`} 
                            alt="License"
                            className="w-20 h-16 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                      {viewingBoy.aadharPhoto && (
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-0.5">Aadhar:</p>
                          <img 
                            src={`https://designback.onrender.com${viewingBoy.aadharPhoto}`} 
                            alt="Aadhar"
                            className="w-20 h-16 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
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
                        viewingBoy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingBoy.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Created:</span> {formatDate(viewingBoy.createdAt)}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Last Updated:</span> {formatDate(viewingBoy.updatedAt)}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">ID:</span> <span className="text-xs text-gray-500">{viewingBoy._id}</span></p>
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
                  openEditModal(viewingBoy);
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
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaPlus size={14} className="text-blue-600" />
                Add Delivery Boy
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    />
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMotorcycle className="text-blue-500" /> Vehicle Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="e.g., Honda Activa"
                        value={formData.vehicleName}
                        onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="e.g., MH-01-AB-1234"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaIdCard className="text-blue-500" /> Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="License number"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Aadhar Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="Aadhar number"
                        value={formData.aadharNumber}
                        onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaImage className="text-blue-500" /> Photos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      />
                      {previewUrls.profilePhoto && (
                        <img src={previewUrls.profilePhoto} alt="Profile" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'vehiclePhoto')}
                      />
                      {previewUrls.vehiclePhoto && (
                        <img src={previewUrls.vehiclePhoto} alt="Vehicle" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        License Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'licensePhoto')}
                      />
                      {previewUrls.licensePhoto && (
                        <img src={previewUrls.licensePhoto} alt="License" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Aadhar Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'aadharPhoto')}
                      />
                      {previewUrls.aadharPhoto && (
                        <img src={previewUrls.aadharPhoto} alt="Aadhar" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
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

              {/* Modal Footer */}
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
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaEdit size={14} className="text-yellow-600" />
                Edit Delivery Boy
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Password (Leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    />
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMotorcycle className="text-blue-500" /> Vehicle Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="e.g., Honda Activa"
                        value={formData.vehicleName}
                        onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="e.g., MH-01-AB-1234"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaIdCard className="text-blue-500" /> Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="License number"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Aadhar Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                        placeholder="Aadhar number"
                        value={formData.aadharNumber}
                        onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaImage className="text-blue-500" /> Photos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      />
                      {previewUrls.profilePhoto && (
                        <img src={previewUrls.profilePhoto} alt="Profile" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Vehicle Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'vehiclePhoto')}
                      />
                      {previewUrls.vehiclePhoto && (
                        <img src={previewUrls.vehiclePhoto} alt="Vehicle" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        License Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'licensePhoto')}
                      />
                      {previewUrls.licensePhoto && (
                        <img src={previewUrls.licensePhoto} alt="License" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Aadhar Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-1 border border-gray-300 rounded-lg text-sm"
                        onChange={(e) => handleFileChange(e, 'aadharPhoto')}
                      />
                      {previewUrls.aadharPhoto && (
                        <img src={previewUrls.aadharPhoto} alt="Aadhar" className="mt-1 w-16 h-16 object-cover rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
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

              {/* Modal Footer */}
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