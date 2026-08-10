// DeliveryFair.jsx - Admin Delivery Fair Management with Extra Per KM Charge
import { useState, useEffect } from "react";
import { 
  FaTruck, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaRupeeSign,
  FaSearch,
  FaDownload,
  FaFileAlt,
  FaRulerHorizontal,
  FaMoneyBillWave
} from "react-icons/fa";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeliveryFair() {
  const [deliveryFairs, setDeliveryFairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFair, setEditingFair] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    km: "",
    amount: "",
    extraPerKm: ""
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDeliveryFairs();
  }, []);

  const fetchDeliveryFairs = () => {
    setLoading(true);
    axios
      .get("https://designback.onrender.com/api/admin/deliveryfairs")
      .then((res) => {
        if (res.data && res.data.data) {
          setDeliveryFairs(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery fairs:", error);
        toast.error("Failed to fetch delivery fairs");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setEditingFair(null);
    setFormData({
      km: "",
      amount: "",
      extraPerKm: ""
    });
    setShowModal(true);
  };

  const openEditModal = (fair) => {
    setEditingFair(fair);
    setFormData({
      km: fair.km || "",
      amount: fair.amount || "",
      extraPerKm: fair.extraPerKm || ""
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        km: parseFloat(formData.km),
        amount: parseFloat(formData.amount),
        extraPerKm: parseFloat(formData.extraPerKm) || 0
      };

      if (editingFair) {
        await axios.put(`https://designback.onrender.com/api/admin/deliveryfair/${editingFair._id}`, payload);
        toast.success("Delivery fair updated successfully!");
      } else {
        await axios.post("https://designback.onrender.com/api/admin/deliveryfair", payload);
        toast.success("Delivery fair added successfully!");
      }

      setShowModal(false);
      setShowEditModal(false);
      fetchDeliveryFairs();
    } catch (error) {
      console.error("Error saving delivery fair:", error);
      toast.error(error.response?.data?.message || "Failed to save delivery fair");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery fair?")) {
      setDeleteLoading(true);
      try {
        await axios.delete(`https://designback.onrender.com/api/admin/deliveryfair/${id}`);
        toast.success("Delivery fair deleted successfully!");
        fetchDeliveryFairs();
      } catch (error) {
        console.error("Error deleting delivery fair:", error);
        toast.error("Failed to delete delivery fair");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const exportData = (type) => {
    const exportData = filteredFairs.map((fair, index) => ({
      "S.No": index + 1,
      "KM": fair.km || 0,
      "Amount (₹)": fair.amount || 0,
      "Extra Per KM (₹)": fair.extraPerKm || 0,
      "Created At": new Date(fair.createdAt).toLocaleDateString(),
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Delivery Fairs");
    writeFile(wb, `delivery_fairs_${new Date().toISOString().split('T')[0]}.${type}`);
    toast.success(`Data exported as ${type.toUpperCase()}`);
  };

  const filteredFairs = deliveryFairs.filter((fair) => {
    const searchTerm = search.toLowerCase();
    return (
      fair.km?.toString().includes(searchTerm) ||
      fair.amount?.toString().includes(searchTerm) ||
      fair.extraPerKm?.toString().includes(searchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFairs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFairs.length / itemsPerPage);

  const sortedFairs = [...currentItems].sort((a, b) => (a.km || 0) - (b.km || 0));

  if (loading && deliveryFairs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading delivery fairs...</p>
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
          <FaTruck className="text-blue-600" /> Delivery Fair Management
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            Total: {filteredFairs.length}
          </span>
          <button
            onClick={fetchDeliveryFairs}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
            title="Refresh"
          >
            🔄
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-1.5 text-sm"
          >
            <FaPlus size={12} /> Add Delivery Fair
          </button>
        </div>
      </div>

      {/* Search & Export */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            placeholder="Search by KM, Amount or Extra Per KM..."
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
              <th className="p-2 text-left text-sm font-semibold text-gray-700">KM</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Amount (₹)</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Extra Per KM (₹)</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Created</th>
              <th className="p-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFairs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500 text-sm">
                  No delivery fairs found
                </td>
              </tr>
            ) : (
              sortedFairs.map((fair, index) => (
                <tr key={fair._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="p-2 font-medium text-gray-600 text-sm">{index + 1 + indexOfFirstItem}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-1.5">
                      <FaRulerHorizontal className="text-blue-500" size={12} />
                      <span className="font-medium text-gray-800 text-sm">{fair.km || 0} km</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="font-bold text-green-600 text-sm flex items-center gap-0.5">
                      <FaRupeeSign size={10} /> {fair.amount || 0}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="font-medium text-orange-600 text-sm flex items-center gap-0.5">
                      <FaMoneyBillWave size={10} /> {fair.extraPerKm || 0}
                    </span>
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {new Date(fair.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(fair)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(fair._id)}
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
        {sortedFairs.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm">
            No delivery fairs found
          </div>
        ) : (
          sortedFairs.map((fair) => (
            <div key={fair._id} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-1.5 text-sm">
                    <FaRulerHorizontal className="text-blue-500" size={12} />
                    {fair.km || 0} km
                  </p>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-0.5 mt-1">
                    <FaRupeeSign size={10} /> {fair.amount || 0}
                  </p>
                  <p className="text-xs text-orange-600 flex items-center gap-0.5 mt-0.5">
                    <FaMoneyBillWave size={10} /> Extra: {fair.extraPerKm || 0}/km
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(fair)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEdit size={10} />
                  </button>
                  <button
                    onClick={() => handleDelete(fair._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <FaSpinner className="animate-spin" size={10} /> : <FaTrash size={10} />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Created: {new Date(fair.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredFairs.length > 0 && (
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

      {/* Add Modal - CLEAN WHITE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaPlus size={14} className="text-blue-600" />
                Add Delivery Fair
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Base KM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter base kilometers"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: e.target.value})}
                    required
                    min="0"
                    step="0.1"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Example: 4 (for 4km base)</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Base Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter base delivery amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Example: 40 (for 4km)</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Extra Charge Per KM (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter extra charge per km"
                    value={formData.extraPerKm}
                    onChange={(e) => setFormData({...formData, extraPerKm: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Example: 10 (for each extra km)</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
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

      {/* Edit Modal - CLEAN WHITE */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaEdit size={14} className="text-yellow-600" />
                Edit Delivery Fair
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Base KM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter base kilometers"
                    value={formData.km}
                    onChange={(e) => setFormData({...formData, km: e.target.value})}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Base Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter base delivery amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Extra Charge Per KM (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="Enter extra charge per km"
                    value={formData.extraPerKm}
                    onChange={(e) => setFormData({...formData, extraPerKm: e.target.value})}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
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