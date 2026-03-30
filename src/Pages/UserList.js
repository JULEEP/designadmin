import { useState, useEffect } from "react";
import { FaTrash, FaEye, FaTimes, FaSpinner, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaIdCard, FaUser, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUpload } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost:4050/api/admin/users")
      .then((res) => {
        if (res.data && res.data.users) {
          setUsers(res.data.users);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:4050/api/admin/deleteusers/${id}`);
        alert("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
        if (selectedUser?._id === id) {
          setShowModal(false);
          setSelectedUser(null);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const exportData = (type) => {
    const exportUsers = filteredUsers.map((user) => ({
      ID: user._id,
      "Full Name": user.fullName || `${user.firstName} ${user.lastName}`,
      "First Name": user.firstName || "N/A",
      "Last Name": user.lastName || "N/A",
      Email: user.email || "N/A",
      "Phone Number": user.phoneNumber || "N/A",
      Address: user.address || "N/A",
      "Account Status": user.isActive ? "Active" : "Inactive",
      "Member Since": user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
      "Last Login": user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never",
      "Business Name": user.businessDetails?.companyName || "N/A",
      "Business Address": user.businessDetails?.companyAddress || "N/A",
      "Business Email": user.businessDetails?.companyEmail || "N/A",
      "Business Phone": user.businessDetails?.companyPhone || "N/A",
      "GST Number": user.businessDetails?.gstNumber || "N/A",
      "PAN Number": user.businessDetails?.panNumber || "N/A",
      "Company Website": user.businessDetails?.companyWebsite || "N/A"
    }));
    const ws = utils.json_to_sheet(exportUsers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, `users_${new Date().toISOString().split('T')[0]}.${type}`);
  };

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();
    return (
      (user.fullName || `${user.firstName} ${user.lastName}`).toLowerCase().includes(searchTerm) ||
      (user.email || "").toLowerCase().includes(searchTerm) ||
      (user.phoneNumber || "").toLowerCase().includes(searchTerm) ||
      (user.businessDetails?.companyName || "").toLowerCase().includes(searchTerm)
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 border rounded-xl shadow-xl bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          All Users
        </h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Users: {filteredUsers.length}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
          placeholder="🔍 Search by name, email, phone or business..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex gap-3">
          <button 
            onClick={() => exportData("csv")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            📊 CSV
          </button>
          <button 
            onClick={() => exportData("xlsx")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            📈 Excel
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
              <th className="p-3 text-left rounded-tl-xl">SL</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Business</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left rounded-tr-xl">Action</th>
             </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-purple-50 transition-colors duration-200">
                <td className="p-3 font-medium text-gray-600">{index + 1 + indexOfFirstUser}</td>
                <td className="p-3">
                  <div className="font-semibold text-gray-800">{user.fullName || `${user.firstName} ${user.lastName}`}</div>
                  {user.businessDetails?.companyName && (
                    <div className="text-xs text-gray-500 mt-1">{user.businessDetails.companyName}</div>
                  )}
                </td>
                <td className="p-3 text-gray-700">{user.email || "N/A"}</td>
                <td className="p-3 text-gray-700">{user.phoneNumber || "N/A"}</td>
                <td className="p-3">
                  {user.businessDetails?.companyName ? (
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">Registered</span>
                  ) : (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Not Added</span>
                  )}
                </td>
                <td className="p-3">
                  {user.isActive ? (
                    <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full w-fit">
                      <FaCheckCircle className="text-xs" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full w-fit">
                      <FaTimesCircle className="text-xs" /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 shadow-sm"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.fullName || `${user.firstName} ${user.lastName}`)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 shadow-sm"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentUsers.map((user, index) => (
          <div key={user._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{user.fullName || `${user.firstName} ${user.lastName}`}</h3>
                <p className="text-sm text-gray-500 mt-1">{user.email || "No email"}</p>
                <p className="text-sm text-gray-500">{user.phoneNumber || "No phone"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(user._id, user.fullName || `${user.firstName} ${user.lastName}`)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.businessDetails?.companyName ? (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Business: {user.businessDetails.companyName}</span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">No Business Details</span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-xl transition-all duration-300 ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
            }`}
          >
            ← Previous
          </button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-xl transition-all duration-300 ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUser />
                User Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaUser className="text-white text-3xl" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`}</h2>
                  <p className="text-gray-500">User ID: {selectedUser._id}</p>
                  <div className="flex gap-2 mt-2">
                    {selectedUser.isActive ? (
                      <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                        <FaCheckCircle /> Active Account
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm">
                        <FaTimesCircle /> Inactive Account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-purple-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">First Name</p>
                    <p className="font-medium text-gray-800">{selectedUser.firstName || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Name</p>
                    <p className="font-medium text-gray-800">{selectedUser.lastName || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">{selectedUser.email || "N/A"} <FaEnvelope className="text-gray-400 text-sm" /></p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">{selectedUser.phoneNumber || "N/A"} <FaPhone className="text-gray-400 text-sm" /></p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                    <p className="font-medium text-gray-800 flex items-start gap-1">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                      {selectedUser.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-600" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                    <p className="font-medium text-gray-800">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Login</p>
                    <p className="font-medium text-gray-800">{formatDateTime(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-purple-600" />
                  Business Details
                </h4>
                {selectedUser.businessDetails ? (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Name</p>
                        <p className="font-semibold text-gray-800">{selectedUser.businessDetails.companyName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Phone</p>
                        <p className="font-medium text-gray-800">{selectedUser.businessDetails.companyPhone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Email</p>
                        <p className="font-medium text-gray-800">{selectedUser.businessDetails.companyEmail || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Website</p>
                        <p className="font-medium text-gray-800">{selectedUser.businessDetails.companyWebsite || "N/A"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Company Address</p>
                        <p className="font-medium text-gray-800">{selectedUser.businessDetails.companyAddress || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">GST Number</p>
                        <p className="font-medium text-gray-800 flex items-center gap-1">
                          <FaIdCard className="text-gray-400" />
                          {selectedUser.businessDetails.gstNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">PAN Number</p>
                        <p className="font-medium text-gray-800 flex items-center gap-1">
                          <FaIdCard className="text-gray-400" />
                          {selectedUser.businessDetails.panNumber || "N/A"}
                        </p>
                      </div>
                      {selectedUser.businessDetails.logo && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Company Logo</p>
                          <div className="mt-2">
                            <img 
                              src={`http://localhost:4050${selectedUser.businessDetails.logo}`} 
                              alt="Company Logo" 
                              className="max-h-24 object-contain bg-white rounded-lg p-2 border"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <FaBuilding className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No business details added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedUser._id, selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
              >
                <FaTrash /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}