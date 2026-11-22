// LetterheadsAdmin.jsx — COMPLETE LETTERHEADS ADMIN LIST
import { useState, useEffect } from "react";
import {
  FaTrash, FaEye, FaEdit, FaTimes, FaSpinner, FaPlus,
  FaImage, FaRupeeSign, FaTag, FaCheckCircle, FaFileAlt,
  FaStar, FaBox, FaPlusCircle, FaMinusCircle,
} from "react-icons/fa";
import axios from "axios";

const API_BASE = "https://designback.onrender.com";
const API_PREFIX = "/api/admin";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-2 py-1 border-b border-gray-100 last:border-0">
    <span className="text-xs font-medium text-gray-500 flex-shrink-0">{label}</span>
    <span className="text-xs text-gray-800 text-right break-all">
      {value !== undefined && value !== null && value !== "" ? String(value) : "N/A"}
    </span>
  </div>
);

export default function LetterheadsAdmin() {
  const [letterheads, setLetterheads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedLh, setSelectedLh] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    slug: "", name: "", description: "",
    price: "", originalPrice: "",
    unit: "per piece", deliveryTime: "4 Hrs Delivery",
    category: "Stationery", status: "active",
    features: "", additionalInfo: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);

  /* ================= FETCH ================= */
  const fetchLetterheads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}${API_PREFIX}/getallletterheads`);
      if (res.data?.data) setLetterheads(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch letterheads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLetterheads(); }, []);

  /* ================= OPEN FORM ================= */
  const handleOpenForm = (lh = null) => {
    if (lh) {
      setIsEditing(true);
      setSelectedLh(lh);
      setFormData({
        slug: lh.slug || "",
        name: lh.name || "",
        description: lh.description || "",
        price: lh.price ?? "",
        originalPrice: lh.originalPrice ?? "",
        unit: lh.unit || "per piece",
        deliveryTime: lh.deliveryTime || "4 Hrs Delivery",
        category: lh.category || "Stationery",
        status: lh.status || "active",
        features: (lh.features || []).join("\n"),
        additionalInfo: Object.entries(lh.additionalInfo || {}).map(([key, value]) => ({ key, value })),
      });
      setExistingImages(lh.images || []);
    } else {
      setIsEditing(false);
      setSelectedLh(null);
      setFormData({
        slug: "", name: "", description: "",
        price: "", originalPrice: "",
        unit: "per piece", deliveryTime: "4 Hrs Delivery",
        category: "Stationery", status: "active",
        features: "", additionalInfo: [],
      });
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setReplaceImages(false);
    setShowFormModal(true);
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles((p) => [...p, ...files]);
    setNewImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewImage = (idx) => {
    URL.revokeObjectURL(newImagePreviews[idx]);
    setNewImageFiles((p) => p.filter((_, i) => i !== idx));
    setNewImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const addInfoRow = () =>
    setFormData((p) => ({ ...p, additionalInfo: [...p.additionalInfo, { key: "", value: "" }] }));

  const updateInfoRow = (idx, field, val) =>
    setFormData((p) => ({
      ...p,
      additionalInfo: p.additionalInfo.map((r, i) => (i === idx ? { ...r, [field]: val } : r)),
    }));

  const removeInfoRow = (idx) =>
    setFormData((p) => ({ ...p, additionalInfo: p.additionalInfo.filter((_, i) => i !== idx) }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return alert("Name and Price are required");
    if (!isEditing && !formData.slug.trim()) return alert("Slug is required");
    if (!isEditing && newImageFiles.length === 0) return alert("Please upload at least one image");
    if (isEditing && replaceImages && newImageFiles.length === 0)
      return alert("Replace checked but no new images. Uncheck or upload.");

    setSubmitLoading(true);
    const data = new FormData();
    if (formData.slug) data.append("slug", formData.slug.trim().toLowerCase());
    data.append("name", formData.name.trim());
    data.append("description", formData.description || "");
    data.append("price", formData.price);
    if (formData.originalPrice) data.append("originalPrice", formData.originalPrice);
    data.append("unit", formData.unit || "per piece");
    data.append("deliveryTime", formData.deliveryTime || "4 Hrs Delivery");
    data.append("category", formData.category || "Stationery");
    data.append("status", formData.status || "active");

    const featuresArr = (formData.features || "").split("\n").map(f => f.trim()).filter(Boolean);
    data.append("features", JSON.stringify(featuresArr));

    const addInfoObj = {};
    (formData.additionalInfo || []).forEach(({ key, value }) => {
      if (key?.trim()) addInfoObj[key.trim()] = value || "";
    });
    data.append("additionalInfo", JSON.stringify(addInfoObj));

    newImageFiles.forEach((f) => data.append("images", f));
    if (isEditing && replaceImages) data.append("replaceImages", "true");

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}${API_PREFIX}/updateletterhead/${selectedLh._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Letterhead updated!");
      } else {
        await axios.post(`${API_BASE}${API_PREFIX}/createletterhead`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Letterhead created!");
      }
      setShowFormModal(false);
      fetchLetterheads();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (lh) => {
    if (!window.confirm(`Delete "${lh.name}"? Images will also be removed.`)) return;
    setDeletingId(lh._id);
    try {
      await axios.delete(`${API_BASE}${API_PREFIX}/deleteletterhead/${lh._id}`);
      alert("Deleted successfully");
      setLetterheads((p) => p.filter((d) => d._id !== lh._id));
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = letterheads.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.slug?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    );
  });

  if (loading && letterheads.length === 0)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );

  return (
    <>
      <div className="p-4 md:p-6 border rounded-xl shadow-xl bg-white/90 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <FaFileAlt /> Manage Letterheads
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenForm()} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg flex items-center gap-2 text-sm font-medium">
              <FaPlus /> Add New Letterhead
            </button>
            <button onClick={fetchLetterheads} className="text-purple-600 hover:text-purple-800 bg-purple-50 p-2.5 rounded-xl" title="Refresh">🔄</button>
          </div>
        </div>

        <div className="mb-5">
          <input
            className="w-full md:w-1/3 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="🔍 Search by name, slug, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center p-6 text-gray-500">No letterheads found.</td></tr>
              ) : filtered.map((lh) => (
                <tr key={lh._id} className="border-b border-gray-200 hover:bg-purple-50">
                  <td className="p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      {lh.images?.[0] ? (
                        <img src={getImageUrl(lh.images[0])} alt={lh.name} className="w-full h-full object-cover" />
                      ) : <FaImage className="text-gray-400" />}
                      {lh.images?.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl">+{lh.images.length - 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-800 text-sm">{lh.name}</p>
                    <p className="text-[11px] text-gray-500">/{lh.slug}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-green-600 text-sm flex items-center gap-1"><FaRupeeSign size={12} /> {lh.price}</span>
                    {lh.originalPrice && <span className="text-[10px] text-gray-400 line-through ml-1">₹{lh.originalPrice}</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{lh.category || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lh.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {lh.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedLh(lh); setShowViewModal(true); }} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg" title="View"><FaEye size={14} /></button>
                      <button onClick={() => handleOpenForm(lh)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg" title="Edit"><FaEdit size={14} /></button>
                      <button onClick={() => handleDelete(lh)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg" disabled={deletingId === lh._id} title="Delete">
                        {deletingId === lh._id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======= ADD/EDIT MODAL ======= */}
      {showFormModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg sticky top-0 z-10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                {isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? "Edit Letterhead" : "Add New Letterhead"}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-white hover:bg-white/20 p-1 rounded-lg"><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[80vh] overflow-y-auto">
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaTag /> Basic Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                  <input type="text" required={!isEditing} disabled={isEditing} className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-100" placeholder="standard-letterhead" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" required className="w-full p-2 border rounded-lg text-sm" placeholder="Standard Letterhead" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} className="w-full p-2 border rounded-lg text-sm resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full p-2 border rounded-lg text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaRupeeSign /> Pricing & Delivery</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) <span className="text-red-500">*</span></label>
                  <input type="number" required min="0" step="any" className="w-full p-2 border rounded-lg text-sm" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" min="0" step="any" className="w-full p-2 border rounded-lg text-sm" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <input type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.deliveryTime} onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })} />
                </div>
              </div>

              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaCheckCircle /> Features</h4>
              <div className="mb-5">
                <textarea rows={4} className="w-full p-2 border rounded-lg text-sm resize-none font-mono" placeholder={"One feature per line"} value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </div>

              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaBox /> Additional Info</h4>
              <div className="mb-5 bg-gray-50 p-3 rounded-lg border">
                {formData.additionalInfo.map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <input type="text" placeholder="Key" className="w-1/3 p-2 border rounded-lg text-sm" value={row.key} onChange={(e) => updateInfoRow(idx, "key", e.target.value)} />
                    <input type="text" placeholder="Value" className="flex-1 p-2 border rounded-lg text-sm" value={row.value} onChange={(e) => updateInfoRow(idx, "value", e.target.value)} />
                    <button type="button" onClick={() => removeInfoRow(idx)} className="text-red-500 p-2"><FaMinusCircle /></button>
                  </div>
                ))}
                <button type="button" onClick={addInfoRow} className="text-xs font-medium text-purple-600 flex items-center gap-1"><FaPlusCircle /> Add Row</button>
              </div>

              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaImage /> Images {!isEditing && <span className="text-red-500">*</span>}</h4>
              <div className="mb-2">
                {isEditing && existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Existing ({existingImages.length}) {replaceImages && <span className="text-red-500 font-semibold">— will be replaced</span>}</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, i) => (
                        <div key={i} className={`w-20 h-20 rounded-lg overflow-hidden border ${replaceImages ? "opacity-40" : ""}`}>
                          <img src={getImageUrl(img)} alt={`e-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newImagePreviews.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-green-600 font-medium mb-2">New ({newImagePreviews.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {newImagePreviews.map((src, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-green-300">
                          <img src={src} alt={`n-${i}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"><FaTimes size={10} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block">
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-50">
                    <FaPlus className="mx-auto text-purple-500 text-xl mb-1" />
                    <p className="text-sm font-medium text-gray-700">{isEditing ? "Add More Images" : "Upload Images"}</p>
                    <p className="text-xs text-gray-500">Multiple allowed • JPG, PNG, WEBP • Max 10MB each</p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleNewImages} />
                </label>

                {isEditing && existingImages.length > 0 && (
                  <label className="flex items-center gap-2 mt-3 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={replaceImages} onChange={(e) => setReplaceImages(e.target.checked)} className="w-4 h-4 text-red-500" />
                    <span><strong className="text-red-500">Replace all existing images</strong> with new uploads</span>
                  </label>
                )}
              </div>

              <div className="flex gap-2 mt-6 pt-3 border-t">
                <button type="button" onClick={() => setShowFormModal(false)} className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" disabled={submitLoading} className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-70">
                  {submitLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaCheckCircle size={14} />}
                  {submitLoading ? "Saving..." : isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======= VIEW MODAL ======= */}
      {showViewModal && selectedLh && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b sticky top-0 bg-white rounded-t-lg z-10">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2"><FaEye className="text-purple-600" /> Letterhead Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><FaTimes /></button>
            </div>
            <div className="p-4 max-h-[75vh] overflow-y-auto">
              {selectedLh.images?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Images ({selectedLh.images.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedLh.images.map((img, i) => (
                      <div key={i} className="w-full h-24 rounded-lg overflow-hidden border bg-gray-50">
                        <img src={getImageUrl(img)} alt={`d-${i}`} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 border mb-3">
                <InfoRow label="ID" value={selectedLh._id} />
                <InfoRow label="Slug" value={selectedLh.slug} />
                <InfoRow label="Name" value={selectedLh.name} />
                <InfoRow label="Category" value={selectedLh.category} />
                <InfoRow label="Unit" value={selectedLh.unit} />
                <InfoRow label="Delivery" value={selectedLh.deliveryTime} />
                <InfoRow label="Price" value={`₹${selectedLh.price}${selectedLh.originalPrice ? ` (was ₹${selectedLh.originalPrice})` : ""}`} />
                <InfoRow label="Status" value={selectedLh.status} />
                <InfoRow label="Rating" value={`${selectedLh.rating || 0} ★ (${selectedLh.reviewsCount || 0} reviews)`} />
                <InfoRow label="Created" value={new Date(selectedLh.createdAt).toLocaleString()} />
              </div>

              {selectedLh.description && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border">{selectedLh.description}</p>
                </div>
              )}

              {selectedLh.features?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Features</p>
                  <ul className="list-disc list-inside bg-gray-50 p-2 rounded border space-y-1">
                    {selectedLh.features.map((f, i) => <li key={i} className="text-xs text-gray-700">{f}</li>)}
                  </ul>
                </div>
              )}

              {selectedLh.additionalInfo && Object.keys(selectedLh.additionalInfo).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Additional Info</p>
                  <div className="bg-gray-50 rounded-lg p-2 border">
                    {Object.entries(selectedLh.additionalInfo).map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
                  </div>
                </div>
              )}

              {selectedLh.reviews?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><FaStar className="text-yellow-400" /> Reviews ({selectedLh.reviews.length})</p>
                  <div className="space-y-2">
                    {selectedLh.reviews.slice(0, 3).map((r, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-2 border">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-semibold text-gray-800">{r.user}</span>
                          <span className="text-yellow-400 text-xs">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="text-xs text-gray-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
              <button onClick={() => { setShowViewModal(false); handleOpenForm(selectedLh); }} className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium"><FaEdit size={14} /> Edit</button>
              <button onClick={() => setShowViewModal(false)} className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}