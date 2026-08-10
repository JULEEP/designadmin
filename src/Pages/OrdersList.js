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
  FaIdCard
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
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    paymentStatus: "",
    estimatedDelivery: ""
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
        // Using the new delete endpoint
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

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setEditLoading(true);
    try {
      // Using the new update endpoint
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
      // Using the new status update endpoint
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
      // Using the new payment status update endpoint
      await axios.put(`https://designback.onrender.com/api/auth/updateorderpayment/${id}`, { paymentStatus: newPaymentStatus });
      alert(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  };

  // Download Invoice
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
      "Total": `₹${order.total || 0}`,
      "Items Count": order.items?.length || 0,
      "Estimated Delivery": order.estimatedDelivery ? moment(order.estimatedDelivery).format('DD MMM YYYY') : "N/A"
    }));
    const ws = utils.json_to_sheet(exportOrders);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Orders");
    writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.${type}`);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = 
      (order.userId?.email || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.phoneNumber || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.firstName || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.lastName || "").toLowerCase().includes(searchTerm) ||
      (order.userId?.fullName || "").toLowerCase().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Get status badge color
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
              <th className="p-2.5 text-left text-sm">Date</th>
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
                <td className="p-2.5 text-xs text-gray-600">
                  {formatDate(order.orderDate)}
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
            <div className="text-xs text-gray-400 mt-1">{formatDate(order.orderDate)}</div>
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

      {/* View Order Details Modal - COMPACT */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[75vh] bg-white rounded-2xl shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FaShoppingCart size={16} />
                Order Details - {selectedOrder.orderId || selectedOrder._id.slice(-8)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Order Status</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status || "Pending"}
                    </span>
                    <select
                      className="ml-1 text-xs border rounded-lg px-1.5 py-0.5"
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    <FaIdCard className="inline mr-1" size={10} />
                    {selectedOrder.orderId || selectedOrder._id.slice(-8)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Payment</p>
                  <p className="font-medium text-gray-800 text-sm">{selectedOrder.paymentMethod?.toUpperCase() || "N/A"}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <p className="text-xs text-gray-600">Status: {selectedOrder.paymentStatus || "pending"}</p>
                    <select
                      className="ml-1 text-xs border rounded-lg px-1.5 py-0.5"
                      value={selectedOrder.paymentStatus || "pending"}
                      onChange={(e) => handlePaymentStatusChange(selectedOrder._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">Total Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{selectedOrder.total || 0}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-2.5">
                <h4 className="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <FaUser className="text-purple-600" size={14} />
                  Customer Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Full Name</p>
                      <p className="font-medium text-gray-800 text-sm">
                        {selectedOrder.userId?.fullName || 
                         `${selectedOrder.userId?.firstName || ''} ${selectedOrder.userId?.lastName || ''}`.trim() || "Guest"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="font-medium text-gray-800 text-sm flex items-center gap-1 break-all">
                        <FaEnvelope className="text-gray-400 flex-shrink-0" size={12} />
                        {selectedOrder.userId?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Phone</p>
                      <p className="font-medium text-gray-800 text-sm flex items-center gap-1">
                        <FaPhone className="text-gray-400 flex-shrink-0" size={12} />
                        {selectedOrder.userId?.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Order Date</p>
                      <p className="font-medium text-gray-800 text-sm flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-400 flex-shrink-0" size={12} />
                        {formatDateTime(selectedOrder.orderDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-2.5">
                <h4 className="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-purple-600" size={14} />
                  Delivery Address
                </h4>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  {selectedOrder.addressId ? (
                    <>
                      <p className="font-medium text-gray-800 text-sm">{selectedOrder.addressId?.fullName || "N/A"}</p>
                      <p className="text-gray-600 text-xs">{selectedOrder.addressId?.address || "N/A"}</p>
                      <p className="text-gray-600 text-xs">
                        {selectedOrder.addressId?.city || ""}, {selectedOrder.addressId?.state || ""} - {selectedOrder.addressId?.pincode || ""}
                      </p>
                      <p className="text-gray-600 text-xs">{selectedOrder.addressId?.country || ""}</p>
                      <p className="text-gray-600 text-xs">Phone: {selectedOrder.addressId?.phoneNumber || "N/A"}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">No delivery address available</p>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <div className="mt-1.5 text-xs text-blue-600 flex items-center gap-1">
                      <FaTruck size={12} />
                      Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-2.5">
                <h4 className="text-sm font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
                  <FaBox className="text-purple-600" size={14} />
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-1.5">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2 flex flex-col md:flex-row gap-2 items-start md:items-center">
                      {item.image && (
                        <img 
                          src={`https://designback.onrender.com${item.image}`} 
                          alt={item.designTitle}
                          className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-xs break-words">{item.designTitle || "Product"}</p>
                        <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-600 mt-0.5">
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
              <div className="bg-gray-100 rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                <div>
                  <p className="text-xs text-gray-600">Subtotal: ₹{selectedOrder.subtotal || 0}</p>
                  <p className="text-xs text-gray-600">Shipping: ₹0</p>
                </div>
                <div>
                  <p className="text-base font-bold text-green-600">Total: ₹{selectedOrder.total || 0}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 border-t bg-gray-50 rounded-b-2xl flex flex-wrap justify-end gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => downloadInvoice(selectedOrder)}
                className="px-2.5 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center gap-1 text-xs"
              >
                <FaDownload size={12} /> Invoice
              </button>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 flex items-center gap-1 text-xs"
              >
                <FaPrint size={12} /> Print
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleEdit(selectedOrder);
                }}
                className="px-2.5 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 flex items-center gap-1 text-xs"
              >
                <FaEdit size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(selectedOrder._id)}
                className="px-2.5 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-1 text-xs"
                disabled={deleteLoading}
              >
                {deleteLoading ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md max-h-[75vh] bg-white rounded-2xl shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FaUserEdit size={16} />
                Edit Order - {selectedOrder.orderId || selectedOrder._id.slice(-8)}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-2.5 p-2.5 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-500">Order ID</p>
                <p className="font-medium text-gray-800 font-mono text-sm">{selectedOrder.orderId || selectedOrder._id.slice(-8)}</p>
                <p className="text-[10px] text-gray-500 mt-1.5">Customer</p>
                <p className="font-medium text-gray-800 text-sm">
                  {selectedOrder.userId?.fullName || 
                   `${selectedOrder.userId?.firstName || ''} ${selectedOrder.userId?.lastName || ''}`.trim() || "Guest"}
                </p>
                <p className="text-xs text-gray-600">{selectedOrder.userId?.email}</p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
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
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
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
                  <label className="block text-xs font-medium text-gray-700 mb-0.5">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                    value={editData.estimatedDelivery}
                    onChange={(e) => setEditData({...editData, estimatedDelivery: e.target.value})}
                  />
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-500">Order Total</p>
                  <p className="text-lg font-bold text-green-600">₹{selectedOrder.total || 0}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Items: {selectedOrder.items?.length || 0} | Payment: {selectedOrder.paymentMethod?.toUpperCase() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-2.5 border-t bg-gray-50 rounded-b-2xl flex flex-wrap justify-end gap-1.5 flex-shrink-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOrder}
                className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1 text-xs"
                disabled={editLoading}
              >
                {editLoading ? <FaSpinner className="animate-spin" size={12} /> : <FaSave size={12} />}
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}