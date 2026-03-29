import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ isCollapsed, isMobile }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      // Get API URL based on environment
      const apiUrl = process.env.REACT_APP_API_URL || "http://31.97.206.144:4061";

      // Make the POST request to the logout API
      await axios.post(`${apiUrl}/api/admin/logout`, {}, { withCredentials: true });

      // Remove the token from localStorage
      localStorage.removeItem("authToken");

      // Alert the user and redirect to login
      alert("Logout successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const elements = [
    {
      icon: <i className="ri-dashboard-fill text-white"></i>,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <i className="ri-user-fill text-white"></i>,
      name: "Users",
      dropdown: [
        { name: "User List", path: "/users" },
        { name: "Active Users", path: "/active-users" },
        { name: "New Users", path: "/new-users" },
        { name: "User Reports", path: "/user-reports" },
      ],
    },
    {
      icon: <i className="ri-calendar-check-fill text-white"></i>,
      name: "Bookings",
      dropdown: [
        { name: "All Bookings", path: "/bookings" },
        { name: "Pending Bookings", path: "/pending-bookings" },
        { name: "Confirmed Bookings", path: "/confirmed-bookings" },
        { name: "Booking Reports", path: "/booking-reports" },
      ],
    },
    {
      icon: <i className="ri-file-text-fill text-white"></i>,
      name: "Bill Books",
      dropdown: [
        { name: "Create Bill Book", path: "/create-billbook" },
        { name: "Bill Book List", path: "/billbooks" },
        { name: "Bill Book Types", path: "/billbook-types" },
        { name: "Bill Book Orders", path: "/billbook-orders" },
      ],
    },
    {
      icon: <i className="ri-id-card-fill text-white"></i>,
      name: "Visiting Cards",
      dropdown: [
        { name: "Create Visiting Card", path: "/create-visitingcard" },
        { name: "All Visiting Cards", path: "/visitingcards" },
        { name: "Digital Cards", path: "/digital-cards" },
        { name: "Printed Cards", path: "/printed-cards" },
      ],
    },
    {
      icon: <i className="ri-image-fill text-white"></i>,
      name: "Banners",
      dropdown: [
        { name: "Create Banner", path: "/create-banner" },
        { name: "All Banners", path: "/banners" },
        { name: "Active Banners", path: "/active-banners" },
      ],
    },
    {
      icon: <i className="ri-settings-3-fill text-white"></i>,
      name: "Settings",
      dropdown: [
        { name: "General Settings", path: "/settings" },
        { name: "Payment Settings", path: "/payment-settings" },
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Profile", path: "/profile" },
      ],
    },
    {
      icon: <i className="ri-logout-box-fill text-white"></i>,
      name: "Logout",
      action: handleLogout,
    },
  ];

  return (
    <div
      className={`transition-all duration-300 ${isMobile ? (isCollapsed ? "w-0" : "w-64") : isCollapsed ? "w-16" : "w-64"} h-screen overflow-y-scroll no-scrollbar flex flex-col bg-gradient-to-b from-gray-800 to-blue-900`}
    >
      {/* Sidebar Header */}
      <div className="sticky top-0 p-4 font-bold text-white flex justify-center text-xl bg-gradient-to-r from-blue-900 to-indigo-800 border-b border-blue-700">
        <div className="flex items-center space-x-2">
          <i className="ri-admin-fill text-2xl"></i>
          {(!isCollapsed || isMobile) && <span>Admin Portal</span>}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`flex flex-col ${isCollapsed && "items-center"} space-y-1 mt-4 px-2`}>
        {elements.map((item, idx) => (
          <div key={idx} className="mb-1">
            {item.dropdown ? (
              <>
                <div
                  className={`flex items-center py-3 px-4 font-semibold text-sm text-white mx-2 rounded-lg cursor-pointer hover:bg-blue-700/50 transition-colors duration-200 ${openDropdown === item.name ? 'bg-blue-700/30' : ''}`}
                  onClick={() => toggleDropdown(item.name)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="ml-4">{item.name}</span>
                      <FaChevronDown
                        className={`ml-auto text-xs transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : "rotate-0"}`}
                      />
                    </>
                  )}
                </div>
                {openDropdown === item.name && (!isCollapsed || isMobile) && (
                  <div className="ml-6 mr-2 mt-1 mb-2 p-2 bg-blue-800/30 rounded-lg">
                    {item.dropdown.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className="flex items-center space-x-2 py-2.5 px-3 text-sm font-medium text-gray-200 hover:text-white hover:bg-blue-700/40 rounded-md transition-colors duration-150"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <i className="ri-arrow-right-s-line text-blue-300"></i>
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center py-3 px-4 font-semibold text-sm text-white mx-2 rounded-lg hover:bg-blue-700/50 transition-colors duration-200 ${item.name === 'Logout' ? 'hover:bg-red-700/50 mt-8 border-t border-blue-700 pt-4' : ''}`}
                onClick={item.action ? item.action : null}
              >
                <span className="text-xl">{item.icon}</span>
                {(!isCollapsed || isMobile) && (
                  <span className={`ml-4 ${item.name === 'Logout' ? 'text-red-200' : ''}`}>
                    {item.name}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer - Only visible when expanded */}
      {(!isCollapsed || isMobile) && (
        <div className="mt-auto p-4 border-t border-blue-700">
          <div className="text-center">
            <div className="text-xs text-blue-300 mb-1">Admin Panel v1.0</div>
            <div className="text-xs text-blue-400">© 2026 All rights reserved</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;