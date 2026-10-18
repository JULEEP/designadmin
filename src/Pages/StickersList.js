// StickersList.jsx - COMPLETE STICKERS ADMIN LIST WITH ADD, VIEW, EDIT, DELETE
import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEye,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaPlus,
  FaImage,
  FaBox,
  FaRupeeSign,
  FaTag,
  FaCheckCircle
} from "react-icons/fa";
import axios from "axios";

const API_BASE = "https://designback.onrender.com";

/* ---------- Image URL Helper ---------- */
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ---------- Small Reusable UI Helpers ---------- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
    <span className="text-xs font-medium text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-xs text-gray-800 text-right break-all">
      {value !== undefined && value !== null && value !== "" ? String(value) : "N/A"}
    </span>
  </div>
);

export default function StickersList() {
  const [stickers, setStickers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modals state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch Stickers
  const fetchStickers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/admin/getallstickers`);
      if (res.data && res.data.data) {
        setStickers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching stickers:", error);
      alert("Failed to fetch stickers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStickers();
  }, []);

  // Handle Form Open (Add / Edit)
  const handleOpenForm = (sticker = null) => {
    if (sticker) {
      setIsEditing(true);
      setSelectedSticker(sticker);
      setFormData({
        name: sticker.name || "",
        price: sticker.price || "",
        unit: sticker.unit || "",
      });
      setImagePreview(getImageUrl(sticker.image));
      setImageFile(null);
    } else {
      setIsEditing(false);
      setSelectedSticker(null);
      setFormData({ name: "", price: "", unit: "" });
      setImagePreview(null);
      setImageFile(null);
    }
    setShowFormModal(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("unit", formData.unit);
    
    // Agar naya image select kiya hai toh
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/api/admin/updatesticker/${selectedSticker._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Sticker updated successfully!");
      } else {
        if (!imageFile && !isEditing) {
          alert("Please select an image to upload");
          setSubmitLoading(false);
          return;
        }
        await axios.post(`${API_BASE}/api/admin/createsticker`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Sticker added successfully!");
      }
      setShowFormModal(false);
      fetchStickers();
    } catch (error) {
      console.error("Error saving sticker:", error);
      alert(error.response?.data?.message || "Failed to save sticker");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sticker?")) {
      setDeleteLoading(true);
      try {
        await axios.delete(`${API_BASE}/api/admin/deletesticker/${id}`);
        alert("Sticker deleted successfully");
        setStickers(stickers.filter((s) => s._id !== id));
      } catch (error) {
        console.error("Error deleting sticker:", error);
        alert("Failed to delete sticker");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Filter Stickers
  const filteredStickers = stickers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && stickers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading stickers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="p-4 md:p-6 border rounded-xl shadow-xl bg-white/90 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <FaTag /> Manage Stickers & Labels
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
              <FaPlus /> Add New Sticker
            </button>
            <button
              onClick={fetchStickers}
              className="text-purple-600 hover:text-purple-800 transition-colors bg-purple-50 p-2.5 rounded-xl"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            className="w-full md:w-1/3 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            placeholder="🔍 Search stickers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
                <th className="p-3 text-left rounded-tl-xl text-sm w-16">Image</th>
                <th className="p-3 text-left text-sm">Name</th>
                <th className="p-3 text-left text-sm">Price</th>
                <th className="p-3 text-left text-sm">Unit</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left rounded-tr-xl text-sm w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStickers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No stickers found. Click "Add New Sticker" to create one.
                  </td>
                </tr>
              ) : (
                filteredStickers.map((sticker) => (
                  <tr
                    key={sticker._id}
                    className="border-b border-gray-200 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <td className="p-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {sticker.image ? (
                          <img
                            src={getImageUrl(sticker.image)}
                            alt={sticker.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaImage className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-gray-800 text-sm">
                      {sticker.name}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-green-600 text-sm flex items-center gap-1">
                        <FaRupeeSign size={12} /> {sticker.price}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{sticker.unit}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sticker.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sticker.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSticker(sticker);
                            setShowViewModal(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenForm(sticker)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all"
                          title="Edit Sticker"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(sticker._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                          title="Delete Sticker"
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? (
                            <FaSpinner className="animate-spin" size={14} />
                          ) : (
                            <FaTrash size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT STICKER MODAL                                     */}
      {/* ============================================================ */}
      {showFormModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                {isEditing ? <FaEdit /> : <FaPlus />}
                {isEditing ? "Edit Sticker" : "Add New Sticker"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sticker Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="e.g. Vinyl Cut-out Stickers"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="e.g. 822"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    placeholder="e.g. for 1 piece, for 1 roll"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sticker Image {!isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, WEBP. Max size: 10MB.
                  </p>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex gap-2 mt-6 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-70"
                >
                  {submitLoading ? (
                    <FaSpinner className="animate-spin" size={14} />
                  ) : (
                    <FaCheckCircle size={14} />
                  )}
                  {submitLoading ? "Saving..." : isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW STICKER MODAL                                           */}
      {/* ============================================================ */}
      {showViewModal && selectedSticker && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaEye className="text-purple-600" /> Sticker Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Image Display */}
              {selectedSticker.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 mb-4 bg-gray-50 flex items-center justify-center">
                  <img
                    src={getImageUrl(selectedSticker.image)}
                    alt={selectedSticker.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Info Details */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <InfoRow label="Sticker ID" value={selectedSticker._id} />
                <InfoRow label="Name" value={selectedSticker.name} />
                <InfoRow label="Price" value={`₹${selectedSticker.price}`} />
                <InfoRow label="Unit" value={selectedSticker.unit} />
                <InfoRow
                  label="Status"
                  value={selectedSticker.isActive ? "Active" : "Inactive"}
                />
                <InfoRow
                  label="Created At"
                  value={new Date(selectedSticker.createdAt).toLocaleString()}
                />
              </div>
            </div>

            <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleOpenForm(selectedSticker);
                }}
                className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaEdit size={14} /> Edit Sticker
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}