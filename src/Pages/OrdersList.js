// OrdersList.jsx - COMPLETE ORDERS LIST WITH VIEW, EDIT, DELETE & DOWNLOAD
import { useState, useEffect } from "react";
import { 
  FaTrash, 
  FaEye, 
  FaEdit,
  FaTimes, 
  FaSpinner, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUser, 
  FaCalendarAlt, 
  FaBox, 
  FaTruck,
  FaShoppingCart,
  FaDownload,
  FaFileAlt,
  FaPrint,
  FaSave,
  FaUserEdit,
  FaIdCard,
  FaSyncAlt,
  FaInfoCircle,
  FaUserCircle,
  FaHistory,
  FaCheckCircle,
  FaClock,
  FaRupeeSign
} from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";
import moment from "moment";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    paymentStatus: "",
    estimatedDelivery: ""
  });
  const [statusData, setStatusData] = useState({
    status: ""
  });
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("https://designback.onrender.com/api/auth/allorders")
      .then((res) => {
        if (res.data && res.data.data) {
          setOrders(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this order?`)) {
      setDeleteLoading(true);
      try {
        await axios.delete(`https://designback.onrender.com/api/auth/deleteorder/${id}`);
        alert("Order deleted successfully");
        setOrders(orders.filter((order) => order._id !== id));
        if (selectedOrder?._id === id) {
          setShowModal(false);
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order");
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditData({
      status: order.status || "Pending",
      paymentStatus: order.paymentStatus || "pending",
      estimatedDelivery: order.estimatedDelivery ? moment(order.estimatedDelivery).format('YYYY-MM-DD') : ""
    });
    setShowEditModal(true);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusData({
      status: order.status || "Pending"
    });
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    setStatusLoading(true);
    try {
      await axios.put(`https://designback.onrender.com/api/auth/updateorderstatus/${selectedOrder._id}`, {
        status: statusData.status
      });
      alert(`Order status updated to ${statusData.status} successfully!`);
      setShowStatusModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setEditLoading(true);
    try {
      await axios.put(`https://designback.onrender.com/api/auth/updateorder/${selectedOrder._id}`, {
        status: editData.status,
        paymentStatus: editData.paymentStatus,
        estimatedDelivery: editData.estimatedDelivery
      });
      alert("Order updated successfully!");
      setShowEditModal(false);
      fetchOrders();
      setSelectedOrder({
        ...selectedOrder,
        status: editData.status,
        paymentStatus: editData.paymentStatus,
        estimatedDelivery: editData.estimatedDelivery
      });
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    } finally {
      setEditLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://designback.onrender.com/api/auth/updateorderstatus/${id}`, { status: newStatus });
      alert(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handlePaymentStatusChange = async (id, newPaymentStatus) => {
    try {
      await axios.put(`https://designback.onrender.com/api/auth/updateorderpayment/${id}`, { paymentStatus: newPaymentStatus });
      alert(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  const downloadInvoice = (order) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderId || order._id.slice(-8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 15px; margin-bottom: 15px; }
          .header h1 { color: #4F46E5; margin: 0; font-size: 24px; }
          .order-info { display: flex; justify-content: space-between; margin-bottom: 15px; flex-wrap: wrap; gap: 8px; }
          .order-info div { background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .table th { background: #4F46E5; color: white; padding: 8px; text-align: left; font-size: 14px; }
          .table td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #059669; }
          .footer { margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p style="font-size:14px;">Order #${order.orderId || order._id.slice(-8)}</p>
        </div>
        
        <div class="order-info">
          <div><strong>Customer:</strong> ${order.userId?.fullName || order.userId?.firstName + ' ' + order.userId?.lastName || 'Guest'}</div>
          <div><strong>Date:</strong> ${moment(order.orderDate).format('DD MMM YYYY')}</div>
          <div><strong>Status:</strong> ${order.status}</div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${item.designTitle || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.price * item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total">
          Total: ₹${order.total || 0}
        </div>

        ${order.addressId ? `
          <div style="margin-top: 15px; padding: 12px; background: #f9fafb; border-radius: 6px; font-size: 14px;">
            <strong>Delivery Address:</strong><br>
            ${order.addressId.fullName || 'N/A'}<br>
            ${order.addressId.address || 'N/A'}<br>
            ${order.addressId.city || ''}, ${order.addressId.state || ''} - ${order.addressId.pincode || ''}<br>
            Phone: ${order.addressId.phoneNumber || 'N/A'}
          </div>
        ` : ''}

        <div class="footer">
          Thank you for your business!
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${order.orderId || order._id.slice(-8)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportData = (type) => {
    const exportOrders = filteredOrders.map((order) => ({
      "Customer Name": order.userId?.fullName || `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.trim() || "N/A",
      "Customer Email": order.userId?.email || "N/A",
      "Customer Phone": order.userId?.phoneNumber || "N/A",
      "Order Date": moment(order.orderDate).format('DD MMM YYYY'),
      "Status": order.status,
      "Payment Method": order.paymentMethod?.toUpperCase() || "N/A",
      "Payment Status": order.paymentStatus || "N/A",
      "Subtotal": `₹${order.subtotal || 0}`,
      "Delivery Charge": `₹${order.deliveryCharge || 0}`,
      "Total": `₹${order.total || 0}`,
      "Items Count": order.items?.length || 0,
      "Estimated Delivery": order.estimatedDelivery ? moment(order.estimatedDelivery).format('DD MMM YYYY') : "N/A",
      "Delivery Boy": order.assignedDeliveryBoy?.name || "Not Assigned"
    }));
    const ws = utils.json_to_sheet(exportOrders);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.${type}`);
  };

  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = 
      (order.userId?.email || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.phoneNumber || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.firstName || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.lastName || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.fullName || "").toLowerCase().includes(searchTerm) ||
      (order.assignedDeliveryBoy?.name || "").toLowerCase().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (method) => {
    const methodMap = {
      'cod': 'bg-orange-100 text-orange-800',
      'online': 'bg-green-100 text-green-800',
      'bank': 'bg-blue-100 text-blue-800'
    };
    return methodMap[method] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('DD MMM YYYY');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format('DD MMM YYYY, hh:mm A');
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <FaClock className="text-yellow-500" />,
      'Confirmed': <FaCheckCircle className="text-blue-500" />,
      'Processing': <FaSpinner className="text-purple-500" />,
      'Shipped': <FaTruck className="text-indigo-500" />,
      'Delivered': <FaCheckCircle className="text-green-500" />,
      'Cancelled': <FaTimes className="text-red-500" />
    };
    return icons[status] || <FaClock className="text-gray-500" />;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="p-4 md:p-6 border rounded-xl shadow-xl bg-white/90 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <FaBox className="inline-block mr-2" /> All Orders
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Total Orders: {filteredOrders.length}
            </div>
            <button 
              onClick={fetchOrders}
              className="text-purple-600 hover:text-purple-800 transition-colors"
              title="Refresh"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <input
            className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            placeholder="🔍 Search by Customer, Email or Phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm bg-white text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            className="p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm bg-white text-sm"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Payment</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online</option>
            <option value="bank">Bank Transfer</option>
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => exportData("csv")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-1 text-sm"
            >
              <FaFileAlt size={14} /> CSV
            </button>
            <button 
              onClick={() => exportData("xlsx")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-1 text-sm"
            >
              <FaDownload size={14} /> Excel
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
                <th className="p-2.5 text-left rounded-tl-xl text-sm">#</th>
                <th className="p-2.5 text-left text-sm">Customer</th>
                <th className="p-2.5 text-left text-sm">Items</th>
                <th className="p-2.5 text-left text-sm">Total</th>
                <th className="p-2.5 text-left text-sm">Payment</th>
                <th className="p-2.5 text-left text-sm">Status</th>
                <th className="p-2.5 text-left text-sm">Delivery Boy</th>
                <th className="p-2.5 text-left rounded-tr-xl text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={order._id} className="border-b border-gray-200 hover:bg-purple-50 transition-colors duration-200">
                  <td className="p-2.5 font-medium text-gray-600 text-sm">{index + 1 + indexOfFirstOrder}</td>
                  <td className="p-2.5">
                    <div className="font-medium text-gray-800 text-sm">
                      {order.userId?.fullName || `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.trim() || "Guest"}
                    </div>
                    <div className="text-xs text-gray-500">{order.userId?.email || "No email"}</div>
                  </td>
                  <td className="p-2.5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                      {order.items?.length || 0} items
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-bold text-green-600 text-sm">₹{order.total || 0}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentBadge(order.paymentMethod)}`}>
                      {order.paymentMethod?.toUpperCase() || "N/A"}
                    </span>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {order.paymentStatus || "pending"}
                    </div>
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-2.5">
                    {order.assignedDeliveryBoy ? (
                      <div className="flex items-center gap-1.5">
                        {order.assignedDeliveryBoy.profilePhoto ? (
                          <img 
                            src={`https://designback.onrender.com${order.assignedDeliveryBoy.profilePhoto}`}
                            alt={order.assignedDeliveryBoy.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-gray-400 text-lg" />
                        )}
                        <span className="text-xs text-gray-700">{order.assignedDeliveryBoy.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not Assigned</span>
                    )}
                  </td>
                  <td className="p-2.5">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        title="Update Status"
                      >
                        <FaSyncAlt size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        title="Edit Order"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        title="Download Invoice"
                      >
                        <FaDownload size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all duration-200 shadow-sm"
                        title="Delete Order"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {currentOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-3 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {order.userId?.fullName || `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.trim() || "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">{order.userId?.email || "No email"}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => handleOpenStatusModal(order)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-lg"
                  >
                    <FaSyncAlt size={12} />
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-lg"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg"
                  >
                    <FaDownload size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="text-sm font-bold text-green-600">₹{order.total || 0}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                  {order.status || "Pending"}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentBadge(order.paymentMethod)}`}>
                  {order.paymentMethod?.toUpperCase() || "N/A"}
                </span>
                <span className="text-xs text-gray-500">{order.items?.length || 0} items</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {order.assignedDeliveryBoy ? (
                  <span className="flex items-center gap-1">
                    <FaUser size={10} /> {order.assignedDeliveryBoy.name}
                  </span>
                ) : (
                  <span>No delivery boy assigned</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 pt-3 border-t">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-1.5 rounded-xl transition-all duration-300 text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
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
              className={`px-4 py-1.5 rounded-xl transition-all duration-300 text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* VIEW ORDER DETAILS MODAL - OUTSIDE TABLE */}
      {/* ============================================================ */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <FaShoppingCart className="text-purple-600" />
                Order Details - {selectedOrder.orderId || selectedOrder._id.slice(-8)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Status & Payment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Order Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`font-bold text-sm ${selectedOrder.status === 'Delivered' ? 'text-green-600' : selectedOrder.status === 'Cancelled' ? 'text-red-600' : 'text-indigo-600'}`}>
                      {selectedOrder.status || "Pending"}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Payment</p>
                  <p className="font-bold text-sm text-gray-800">{selectedOrder.paymentMethod?.toUpperCase() || "N/A"}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {selectedOrder.paymentStatus || "pending"}
                  </span>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Amount</p>
                  <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                    <FaRupeeSign size={14} /> {selectedOrder.total || 0}
                  </p>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-purple-500" /> Customer Information
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-medium text-gray-600">Name:</span> {selectedOrder.userId?.fullName || `${selectedOrder.userId?.firstName || ''} ${selectedOrder.userId?.lastName || ''}`.trim() || "Guest"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Email:</span> {selectedOrder.userId?.email || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Phone:</span> {selectedOrder.userId?.phoneNumber || "N/A"}</p>
                    <p className="text-sm"><span className="font-medium text-gray-600">Order Date:</span> {formatDateTime(selectedOrder.orderDate)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" /> Delivery Address
                  </h4>
                  {selectedOrder.addressId ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-800">{selectedOrder.addressId?.fullName || "N/A"}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.addressId?.address || "N/A"}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.addressId?.city || ""}, {selectedOrder.addressId?.state || ""} - {selectedOrder.addressId?.pincode || ""}
                      </p>
                      <p className="text-sm text-gray-600">Phone: {selectedOrder.addressId?.phoneNumber || "N/A"}</p>
                      {selectedOrder.estimatedDelivery && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                          <FaTruck size={12} /> Estimated: {formatDate(selectedOrder.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No delivery address available</p>
                  )}
                </div>
              </div>

              {/* Delivery Boy Details */}
              {selectedOrder.assignedDeliveryBoy && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaTruck className="text-indigo-500" /> Delivery Boy Details
                  </h4>
                  <div className="flex items-center gap-3">
                    {selectedOrder.assignedDeliveryBoy.profilePhoto ? (
                      <img 
                        src={`https://designback.onrender.com${selectedOrder.assignedDeliveryBoy.profilePhoto}`}
                        alt={selectedOrder.assignedDeliveryBoy.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400 text-4xl" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{selectedOrder.assignedDeliveryBoy.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaPhone size={10} /> {selectedOrder.assignedDeliveryBoy.phone}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaEnvelope size={10} /> {selectedOrder.assignedDeliveryBoy.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Vehicle: {selectedOrder.assignedDeliveryBoy.vehicleName || "N/A"} ({selectedOrder.assignedDeliveryBoy.vehicleNumber || "N/A"})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBox className="text-blue-500" /> Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2 flex flex-col md:flex-row gap-2 items-start md:items-center border border-gray-200">
                      {item.image && (
                        <img 
                          src={`https://designback.onrender.com${item.image}`} 
                          alt={item.designTitle}
                          className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs">{item.designTitle || "Product"}</p>
                        <div className="flex flex-wrap gap-1 text-[10px] text-gray-600 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span>Size: {item.size || "N/A"}</span>
                          <span>Color: {item.color || "N/A"}</span>
                          <span>Material: {item.material || "N/A"}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-green-600 text-sm">₹{item.price || 0}</p>
                        <p className="text-[10px] text-gray-500">Subtotal: ₹{(item.price || 0) * (item.quantity || 1)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Subtotal: ₹{selectedOrder.subtotal || 0}</p>
                  <p className="text-xs text-gray-600">Delivery Charge: ₹{selectedOrder.deliveryCharge || 0}</p>
                </div>
                <div>
                  <p className="text-base font-bold text-green-600">Total: ₹{selectedOrder.total || 0}</p>
                </div>
              </div>

              {/* Status Track */}
              {selectedOrder.statusTrack && selectedOrder.statusTrack.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaHistory className="text-purple-500" /> Order Timeline
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.statusTrack.map((track, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(track.status)}
                          <span className="font-medium text-sm text-gray-800">{track.status}</span>
                          {track.note && (
                            <span className="text-xs text-gray-500">- {track.note}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {moment(track.timestamp).format('DD MMM YYYY, hh:mm A')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - ONLY Close Button */}
            <div className="flex gap-2 p-3 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FaSyncAlt size={14} />
                Update Order Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800 font-mono text-sm">
                  {selectedOrder.orderId || selectedOrder._id.slice(-8)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Customer</p>
                <p className="font-medium text-gray-800 text-sm">
                  {selectedOrder.userId?.fullName || 
                   `${selectedOrder.userId?.firstName || ''} ${selectedOrder.userId?.lastName || ''}`.trim() || "Guest"}
                </p>
                <p className="text-xs text-gray-600">{selectedOrder.userId?.email}</p>
                <p className="text-xs text-gray-500 mt-2">Current Status</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status || "Pending"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
                  value={statusData.status}
                  onChange={(e) => setStatusData({...statusData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <FaInfoCircle size={12} />
                  Note: Status will be updated immediately
                </p>
              </div>
            </div>

            <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                disabled={statusLoading}
              >
                {statusLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaSyncAlt size={14} />}
                {statusLoading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FaUserEdit size={14} />
                Edit Order
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:bg-white/20 p-1 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-semibold text-gray-800 font-mono text-sm">
                  {selectedOrder.orderId || selectedOrder._id.slice(-8)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Customer</p>
                <p className="font-medium text-gray-800 text-sm">
                  {selectedOrder.userId?.fullName || 
                   `${selectedOrder.userId?.firstName || ''} ${selectedOrder.userId?.lastName || ''}`.trim() || "Guest"}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    value={editData.paymentStatus}
                    onChange={(e) => setEditData({...editData, paymentStatus: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    value={editData.estimatedDelivery}
                    onChange={(e) => setEditData({...editData, estimatedDelivery: e.target.value})}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500">Order Total</p>
                  <p className="text-lg font-bold text-green-600">₹{selectedOrder.total || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Items: {selectedOrder.items?.length || 0} | Payment: {selectedOrder.paymentMethod?.toUpperCase() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                className="flex-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1 text-sm"
                disabled={editLoading}
              >
                {editLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}