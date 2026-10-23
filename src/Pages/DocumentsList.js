// DocumentsList.jsx — COMPLETE DOCUMENTS ADMIN LIST
import { useState, useEffect } from "react";
import {
  FaTrash, FaEye, FaEdit, FaTimes, FaSpinner, FaPlus,
  FaImage, FaRupeeSign, FaTag, FaCheckCircle, FaFileAlt,
  FaStar, FaBox, FaPlusCircle, FaMinusCircle, FaTruck,
} from "react-icons/fa";
import axios from "axios";

// ✅ API base — change prefix if routes mounted elsewhere
const API_BASE = "https://designback.onrender.com";
const API_PREFIX = "/api/admin";

/* ---------- Image URL Helper ---------- */
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ---------- Reusable Info Row ---------- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
    <span className="text-xs font-medium text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-xs text-gray-800 text-right break-all">
      {value !== undefined && value !== null && value !== ""
        ? String(value)
        : "N/A"}
    </span>
  </div>
);

export default function DocumentsList() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    unit: "for 1 piece",
    deliveryTime: "4 Hrs Delivery",
    category: "Document Printing",
    status: "active",
    features: "",
    additionalInfo: [], // [{ key, value }]
  });

  // Image state
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);

  /* ================= FETCH ================= */
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}${API_PREFIX}/getalldocuments`);
      if (res.data?.data) setDocuments(res.data.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      alert("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  /* ================= OPEN FORM ================= */
  const handleOpenForm = (doc = null) => {
    if (doc) {
      setIsEditing(true);
      setSelectedDoc(doc);
      setFormData({
        slug: doc.slug || "",
        name: doc.name || "",
        description: doc.description || "",
        price: doc.price ?? "",
        originalPrice: doc.originalPrice ?? "",
        unit: doc.unit || "for 1 piece",
        deliveryTime: doc.deliveryTime || "4 Hrs Delivery",
        category: doc.category || "Document Printing",
        status: doc.status || "active",
        features: (doc.features || []).join("\n"),
        additionalInfo: Object.entries(doc.additionalInfo || {}).map(
          ([key, value]) => ({ key, value })
        ),
      });
      setExistingImages(doc.images || []);
    } else {
      setIsEditing(false);
      setSelectedDoc(null);
      setFormData({
        slug: "",
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        unit: "for 1 piece",
        deliveryTime: "4 Hrs Delivery",
        category: "Document Printing",
        status: "active",
        features: "",
        additionalInfo: [],
      });
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setReplaceImages(false);
    setShowFormModal(true);
  };

  /* ================= NEW IMAGE PICKER ================= */
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removeNewImage = (idx) => {
    URL.revokeObjectURL(newImagePreviews[idx]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ================= ADD / REMOVE ADDITIONAL INFO ROW ================= */
  const addInfoRow = () =>
    setFormData((p) => ({
      ...p,
      additionalInfo: [...p.additionalInfo, { key: "", value: "" }],
    }));

  const updateInfoRow = (idx, field, val) =>
    setFormData((p) => ({
      ...p,
      additionalInfo: p.additionalInfo.map((row, i) =>
        i === idx ? { ...row, [field]: val } : row
      ),
    }));

  const removeInfoRow = (idx) =>
    setFormData((p) => ({
      ...p,
      additionalInfo: p.additionalInfo.filter((_, i) => i !== idx),
    }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.price) {
      alert("Name and Price are required");
      return;
    }
    if (!isEditing && !formData.slug.trim()) {
      alert("Slug is required");
      return;
    }
    if (!isEditing && newImageFiles.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    if (isEditing && replaceImages && newImageFiles.length === 0) {
      alert("You chose to replace images, but uploaded none. Uncheck the option or upload new images.");
      return;
    }

    setSubmitLoading(true);
    const data = new FormData();

    // Basic fields
    if (formData.slug) data.append("slug", formData.slug.trim().toLowerCase());
    data.append("name", formData.name.trim());
    data.append("description", formData.description || "");
    data.append("price", formData.price);
    if (formData.originalPrice)
      data.append("originalPrice", formData.originalPrice);
    data.append("unit", formData.unit || "for 1 piece");
    data.append("deliveryTime", formData.deliveryTime || "4 Hrs Delivery");
    data.append("category", formData.category || "Document Printing");
    data.append("status", formData.status || "active");

    // Features — one per line → array
    const featuresArr = (formData.features || "")
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    data.append("features", JSON.stringify(featuresArr));

    // Additional info → plain object
    const addInfoObj = {};
    (formData.additionalInfo || []).forEach(({ key, value }) => {
      if (key && key.trim()) addInfoObj[key.trim()] = value || "";
    });
    data.append("additionalInfo", JSON.stringify(addInfoObj));

    // Images
    newImageFiles.forEach((f) => data.append("images", f));
    if (isEditing && replaceImages) data.append("replaceImages", "true");

    try {
      if (isEditing) {
        await axios.put(
          `${API_BASE}${API_PREFIX}/updatedocument/${selectedDoc._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Document updated successfully!");
      } else {
        await axios.post(`${API_BASE}${API_PREFIX}/createdocument`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Document created successfully!");
      }
      setShowFormModal(false);
      fetchDocuments();
    } catch (err) {
      console.error("Error saving document:", err);
      alert(err.response?.data?.message || "Failed to save document");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.name}"? This will also remove its images.`)) return;
    setDeletingId(doc._id);
    try {
      await axios.delete(
        `${API_BASE}${API_PREFIX}/deletedocument/${doc._id}`
      );
      alert("Document deleted successfully");
      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredDocs = documents.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.slug?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    );
  });

  /* ================= LOADING ================= */
  if (loading && documents.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <>
      <div className="p-4 md:p-6 border rounded-xl shadow-xl bg-white/90 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <FaFileAlt /> Manage Custom Documents
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenForm()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
              <FaPlus /> Add New Document
            </button>
            <button
              onClick={fetchDocuments}
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
            placeholder="🔍 Search documents by name, slug, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <th className="p-3 text-left rounded-tl-xl text-sm w-16">Image</th>
                <th className="p-3 text-left text-sm">Name</th>
                <th className="p-3 text-left text-sm">Price</th>
                <th className="p-3 text-left text-sm">Category</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left rounded-tr-xl text-sm w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    No documents found. Click "Add New Document" to create one.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc._id}
                    className="border-b border-gray-200 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <td className="p-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {doc.images?.[0] ? (
                          <img
                            src={getImageUrl(doc.images[0])}
                            alt={doc.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaImage className="text-gray-400" />
                        )}
                        {doc.images?.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl">
                            +{doc.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-gray-800 text-sm">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-gray-500">/{doc.slug}</p>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-green-600 text-sm flex items-center gap-1">
                        <FaRupeeSign size={12} /> {doc.price}
                      </span>
                      {doc.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through ml-1">
                          ₹{doc.originalPrice}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {doc.category || "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doc.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setShowViewModal(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenForm(doc)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg transition-all"
                          title="Edit Document"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                          title="Delete Document"
                          disabled={deletingId === doc._id}
                        >
                          {deletingId === doc._id ? (
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
      {/* ADD / EDIT DOCUMENT MODAL                                    */}
      {/* ============================================================ */}
      {showFormModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg sticky top-0 z-10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                {isEditing ? <FaEdit /> : <FaPlus />}
                {isEditing ? "Edit Document" : "Add New Document"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[80vh] overflow-y-auto">
              {/* ───── BASIC INFO ───── */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                <FaTag /> Basic Info
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                    {isEditing && (
                      <span className="text-[10px] text-gray-400 ml-1">
                        (read-only)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required={!isEditing}
                    disabled={isEditing}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g. unbound, wiro"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g. Unbound Document Printing"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none"
                    placeholder="Short product description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="Document Printing"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* ───── PRICING ───── */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                <FaRupeeSign /> Pricing & Delivery
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g. 1400"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g. 1600 (optional)"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="for 1 piece"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    placeholder="4 Hrs Delivery"
                    value={formData.deliveryTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* ───── FEATURES ───── */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                <FaCheckCircle /> Features
              </h4>
              <div className="mb-5">
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none font-mono"
                  placeholder={"High-quality loose sheet document printing\nAvailable in B&W or color printing\nEconomical black and white option\nIdeal for handouts and bulk prints"}
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  One feature per line — each becomes a bullet point on the frontend.
                </p>
              </div>

              {/* ───── ADDITIONAL INFO ───── */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                <FaBox /> Additional Info
              </h4>
              <div className="mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {formData.additionalInfo.length === 0 ? (
                  <p className="text-xs text-gray-500 mb-2">
                    No additional info. Add key-value pairs like "Printing Method: Digital Printing".
                  </p>
                ) : (
                  <div className="space-y-2 mb-2">
                    {formData.additionalInfo.map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Key"
                          className="w-1/3 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={row.key}
                          onChange={(e) =>
                            updateInfoRow(idx, "key", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={row.value}
                          onChange={(e) =>
                            updateInfoRow(idx, "value", e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeInfoRow(idx)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Remove"
                        >
                          <FaMinusCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={addInfoRow}
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                >
                  <FaPlusCircle /> Add Row
                </button>
              </div>

              {/* ───── IMAGES ───── */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                <FaImage /> Images{" "}
                {!isEditing && <span className="text-red-500">*</span>}
              </h4>
              <div className="mb-2">
                {/* Existing images (edit mode) */}
                {isEditing && existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Existing Images ({existingImages.length}){" "}
                      {replaceImages && (
                        <span className="text-red-500 font-semibold">
                          — will be replaced
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, i) => (
                        <div
                          key={i}
                          className={`w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 ${
                            replaceImages ? "opacity-40" : ""
                          }`}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`existing-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New image previews */}
                {newImagePreviews.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-green-600 font-medium mb-2">
                      New Images ({newImagePreviews.length}) — will be{" "}
                      {isEditing && !replaceImages ? "appended" : "uploaded"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {newImagePreviews.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-green-300 bg-gray-50"
                        >
                          <img
                            src={src}
                            alt={`new-${i}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                            title="Remove"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File input */}
                <label className="block">
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-50 transition-all">
                    <FaPlus className="mx-auto text-purple-500 text-xl mb-1" />
                    <p className="text-sm font-medium text-gray-700">
                      {isEditing ? "Add More Images" : "Upload Images"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Multiple allowed • JPG, PNG, WEBP • Max 10MB each
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewImages}
                  />
                </label>

                {/* Replace checkbox (edit only) */}
                {isEditing && existingImages.length > 0 && (
                  <label className="flex items-center gap-2 mt-3 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replaceImages}
                      onChange={(e) => setReplaceImages(e.target.checked)}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span>
                      <strong className="text-red-500">Replace all existing images</strong>{" "}
                      with new uploads
                    </span>
                  </label>
                )}
              </div>

              {/* Footer */}
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
                  {submitLoading
                    ? "Saving..."
                    : isEditing
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW DOCUMENT MODAL                                          */}
      {/* ============================================================ */}
      {showViewModal && selectedDoc && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaEye className="text-purple-600" /> Document Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="p-4 max-h-[75vh] overflow-y-auto">
              {/* Image Gallery */}
              {selectedDoc.images?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Images ({selectedDoc.images.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedDoc.images.map((img, i) => (
                      <div
                        key={i}
                        className="w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`doc-${i}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-3">
                <InfoRow label="Document ID" value={selectedDoc._id} />
                <InfoRow label="Slug" value={selectedDoc.slug} />
                <InfoRow label="Name" value={selectedDoc.name} />
                <InfoRow label="Category" value={selectedDoc.category} />
                <InfoRow label="Unit" value={selectedDoc.unit} />
                <InfoRow label="Delivery" value={selectedDoc.deliveryTime} />
                <InfoRow
                  label="Price"
                  value={`₹${selectedDoc.price}${
                    selectedDoc.originalPrice
                      ? ` (was ₹${selectedDoc.originalPrice})`
                      : ""
                  }`}
                />
                <InfoRow label="Status" value={selectedDoc.status} />
                <InfoRow
                  label="Rating"
                  value={`${selectedDoc.rating || 0} ★ (${selectedDoc.reviewsCount || 0} reviews)`}
                />
                <InfoRow
                  label="Created"
                  value={new Date(selectedDoc.createdAt).toLocaleString()}
                />
              </div>

              {/* Description */}
              {selectedDoc.description && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Description
                  </p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                    {selectedDoc.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {selectedDoc.features?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Features
                  </p>
                  <ul className="list-disc list-inside bg-gray-50 p-2 rounded border border-gray-200 space-y-1">
                    {selectedDoc.features.map((f, i) => (
                      <li key={i} className="text-xs text-gray-700">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              {selectedDoc.additionalInfo &&
                Object.keys(selectedDoc.additionalInfo).length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Additional Info
                    </p>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                      {Object.entries(selectedDoc.additionalInfo).map(
                        ([k, v]) => (
                          <InfoRow key={k} label={k} value={v} />
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Reviews (read-only) */}
              {selectedDoc.reviews?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> Reviews (
                    {selectedDoc.reviews.length})
                  </p>
                  <div className="space-y-2">
                    {selectedDoc.reviews.slice(0, 3).map((r, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-semibold text-gray-800">
                            {r.user}
                          </span>
                          <span className="text-yellow-400 text-xs">
                            {"★".repeat(r.rating)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{r.comment}</p>
                      </div>
                    ))}
                    {selectedDoc.reviews.length > 3 && (
                      <p className="text-[11px] text-gray-500 text-center">
                        +{selectedDoc.reviews.length - 3} more reviews
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleOpenForm(selectedDoc);
                }}
                className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaEdit size={14} /> Edit Document
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