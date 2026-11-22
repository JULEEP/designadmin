// BookletsAdmin.jsx
import { useState, useEffect } from "react";
import {
  FaTrash, FaEye, FaEdit, FaTimes, FaSpinner, FaPlus,
  FaImage, FaRupeeSign, FaTag, FaCheckCircle, FaBook,
  FaStar, FaBox, FaPlusCircle, FaMinusCircle,
} from "react-icons/fa";
import axios from "axios";

const API_BASE = "https://designback.onrender.com";
const API_PREFIX = "/api/admin";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
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

export default function BookletsAdmin() {
  const [booklets, setBooklets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedBk, setSelectedBk] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    slug: "", name: "", description: "",
    price: "", originalPrice: "",
    unit: "for 1 piece", deliveryTime: "4 Hrs Delivery",
    category: "Booklets & Reports", status: "active",
    features: "", additionalInfo: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);

  const fetchBooklets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}${API_PREFIX}/getallbooklets`);
      if (res.data?.data) setBooklets(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch booklets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooklets(); }, []);

  const handleOpenForm = (bk = null) => {
    if (bk) {
      setIsEditing(true);
      setSelectedBk(bk);
      setFormData({
        slug: bk.slug || "",
        name: bk.name || "",
        description: bk.description || "",
        price: bk.price ?? "",
        originalPrice: bk.originalPrice ?? "",
        unit: bk.unit || "for 1 piece",
        deliveryTime: bk.deliveryTime || "4 Hrs Delivery",
        category: bk.category || "Booklets & Reports",
        status: bk.status || "active",
        features: (bk.features || []).join("\n"),
        additionalInfo: Object.entries(bk.additionalInfo || {}).map(([key, value]) => ({ key, value })),
      });
      setExistingImages(bk.images || []);
    } else {
      setIsEditing(false);
      setSelectedBk(null);
      setFormData({
        slug: "", name: "", description: "",
        price: "", originalPrice: "",
        unit: "for 1 piece", deliveryTime: "4 Hrs Delivery",
        category: "Booklets & Reports", status: "active",
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
    data.append("unit", formData.unit || "for 1 piece");
    data.append("deliveryTime", formData.deliveryTime || "4 Hrs Delivery");
    data.append("category", formData.category || "Booklets & Reports");
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
        await axios.put(`${API_BASE}${API_PREFIX}/updatebooklet/${selectedBk._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Booklet updated!");
      } else {
        await axios.post(`${API_BASE}${API_PREFIX}/createbooklet`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Booklet created!");
      }
      setShowFormModal(false);
      fetchBooklets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (bk) => {
    if (!window.confirm(`Delete "${bk.name}"? Images will also be removed.`)) return;
    setDeletingId(bk._id);
    try {
      await axios.delete(`${API_BASE}${API_PREFIX}/deletebooklet/${bk._id}`);
      alert("Deleted successfully");
      setBooklets((p) => p.filter((d) => d._id !== bk._id));
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = booklets.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.slug?.toLowerCase().includes(q) ||
      d.category?.toLowerCase().includes(q)
    );
  });

  if (loading && booklets.length === 0)
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
            <FaBook /> Manage Booklets
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenForm()} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg flex items-center gap-2 text-sm font-medium">
              <FaPlus /> Add New Booklet
            </button>
            <button onClick={fetchBooklets} className="text-purple-600 hover:text-purple-800 bg-purple-50 p-2.5 rounded-xl" title="Refresh">🔄</button>
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
                <tr><td colSpan="6" className="text-center p-6 text-gray-500">No booklets found.</td></tr>
              ) : filtered.map((bk) => (
                <tr key={bk._id} className="border-b border-gray-200 hover:bg-purple-50">
                  <td className="p-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      {bk.images?.[0] ? (
                        <img src={getImageUrl(bk.images[0])} alt={bk.name} className="w-full h-full object-cover" />
                      ) : <FaImage className="text-gray-400" />}
                      {bk.images?.length > 1 && (
                        <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 rounded-tl">+{bk.images.length - 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-800 text-sm">{bk.name}</p>
                    <p className="text-[11px] text-gray-500">/{bk.slug}</p>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-green-600 text-sm flex items-center gap-1"><FaRupeeSign size={12} /> {bk.price}</span>
                    {bk.originalPrice && <span className="text-[10px] text-gray-400 line-through ml-1">₹{bk.originalPrice}</span>}
                  </td>
                  <td className="p-3 text-sm text-gray-600">{bk.category || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bk.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {bk.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedBk(bk); setShowViewModal(true); }} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg" title="View"><FaEye size={14} /></button>
                      <button onClick={() => handleOpenForm(bk)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg" title="Edit"><FaEdit size={14} /></button>
                      <button onClick={() => handleDelete(bk)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg" disabled={deletingId === bk._id} title="Delete">
                        {deletingId === bk._id ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg sticky top-0 z-10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                {isEditing ? <FaEdit /> : <FaPlus />} {isEditing ? "Edit Booklet" : "Add New Booklet"}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="text-white hover:bg-white/20 p-1 rounded-lg"><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 max-h-[80vh] overflow-y-auto">
              {/* Basic Info */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaTag /> Basic Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                  <input type="text" required={!isEditing} disabled={isEditing} className="w-full p-2 border rounded-lg text-sm disabled:bg-gray-100" placeholder="softcover-reports" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" required className="w-full p-2 border rounded-lg text-sm" placeholder="Softcover Reports" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
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

              {/* Pricing */}
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

              {/* Features */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaCheckCircle /> Features</h4>
              <div className="mb-5">
                <textarea rows={4} className="w-full p-2 border rounded-lg text-sm resize-none font-mono" placeholder={"One feature per line"} value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </div>

              {/* Additional Info */}
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

              {/* Images */}
              <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><FaImage /> Images {!isEditing && <span className="text-red-500">*</span>}</h4>
              <div className="mb-2">
                {isEditing && existingImages.length > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500">Existing ({existingImages.length})</p>
                      <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={replaceImages} 
                          onChange={(e) => setReplaceImages(e.target.checked)} 
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        Replace all existing images
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, i) => (
                        <div key={i} className={`w-20 h-20 rounded-lg overflow-hidden border relative ${replaceImages ? "opacity-40 grayscale" : ""}`}>
                          <img src={getImageUrl(img)} alt={`b-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleNewImages} 
                    className="hidden" 
                    id="bk-img-upload" 
                  />
                  <label htmlFor="bk-img-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <FaImage className="text-gray-400 text-2xl" />
                    <span className="text-sm text-gray-600">Click to upload new images</span>
                    <span className="text-xs text-gray-400">(Max 10 images)</span>
                  </label>
                </div>

                {newImagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">New Selection ({newImagePreviews.length})</p>
                    <div className="flex flex-wrap gap-3">
                      {newImagePreviews.map((src, i) => (
                        <div key={i} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img src={src} alt="preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowFormModal(false)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                >
                  {submitLoading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                  {isEditing ? "Update Booklet" : "Create Booklet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedBk && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaBook className="text-purple-600" /> {selectedBk.name}
              </h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-200"><FaTimes /></button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div className="space-y-3">
                  <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    {selectedBk.images?.[0] ? (
                      <img src={getImageUrl(selectedBk.images[0])} alt={selectedBk.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={48} /></div>
                    )}
                  </div>
                  {selectedBk.images?.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedBk.images.slice(1).map((img, i) => (
                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{selectedBk.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">Slug: /{selectedBk.slug}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedBk.description || "No description available."}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-purple-700 flex items-center"><FaRupeeSign size={18} /> {selectedBk.price}</span>
                      {selectedBk.originalPrice && <span className="text-sm text-gray-400 line-through">₹{selectedBk.originalPrice}</span>}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Unit:</span> {selectedBk.unit}</p>
                      <p><span className="font-medium">Delivery:</span> {selectedBk.deliveryTime}</p>
                      <p><span className="font-medium">Category:</span> {selectedBk.category}</p>
                    </div>
                  </div>

                  {selectedBk.features?.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Features</h5>
                      <ul className="space-y-1">
                        {selectedBk.features.map((feat, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={12} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedBk.additionalInfo && Object.keys(selectedBk.additionalInfo).length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Additional Info</h5>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        {Object.entries(selectedBk.additionalInfo).map(([key, val]) => (
                          <InfoRow key={key} label={key} value={val} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t">
                     <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${selectedBk.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        Status: {selectedBk.status}
                     </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end">
               <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}