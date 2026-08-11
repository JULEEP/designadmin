import React, { useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ isCollapsed, isMobile, onToggle }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://31.97.206.144:4061";
      await axios.post(`${apiUrl}/api/admin/logout`, {}, { withCredentials: true });
      localStorage.removeItem("authToken");
      alert("Logout successful");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isDropdownActive = (dropdown) => {
    if (!dropdown) return false;
    return dropdown.some(item => location.pathname === item.path);
  };

  const elements = [
    {
      icon: <i className="ri-dashboard-line text-xl"></i>,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <i className="ri-group-line text-xl"></i>,
      name: "Users",
      dropdown: [
        { name: "User List", path: "/users" },
      ],
    },
    {
      icon: <i className="ri-calendar-check-line text-xl"></i>,
      name: "Orders",
      dropdown: [
        { name: "All Orders", path: "/orderlist" },
      ],
    },
    {
      icon: <i className="ri-truck-line text-xl"></i>,
      name: "Delivery",
      dropdown: [
        { name: "Delivery Fair", path: "/fair" },
        { name: "Delivery Boys", path: "/deliveryboy" },
      ],
    },
    {
      icon: <i className="ri-store-line text-xl"></i>,
      name: "Business",
      dropdown: [
        { name: "Business Details", path: "/business" },
      ],
    },
    {
      icon: <i className="ri-file-text-line text-xl"></i>,
      name: "Bill Books",
      dropdown: [
        { name: "Create Bill Book", path: "/create-billbook" },
        { name: "Bill Book List", path: "/billbooks" },
      ],
    },
    {
      icon: <i className="ri-layout-line text-xl"></i>,
      name: "Flex Books",
      dropdown: [
        { name: "Create Flex Book", path: "/create-flexbook" },
        { name: "Flex Book List", path: "/flexbooks" },
      ],
    },
    {
      icon: <i className="ri-id-card-line text-xl"></i>,
      name: "Visiting Cards",
      dropdown: [
        { name: "Create Visiting Card", path: "/create-visitingcard" },
        { name: "All Visiting Cards", path: "/visitingcards" },
        { name: "Digital Cards", path: "/digital-cards" },
        { name: "Printed Cards", path: "/printed-cards" },
      ],
    },
    {
      icon: <i className="ri-stethoscope-line text-xl"></i>,
      name: "Doctor Prescription",
      dropdown: [
        { name: "Create Prescription", path: "/create-prescription" },
        { name: "All Prescriptions", path: "/prescriptions" },
      ],
    },
    {
      icon: <i className="ri-heart-line text-xl"></i>,
      name: "Wedding Cards",
      dropdown: [
        { name: "Create Wedding Card", path: "/create-weddingcard" },
        { name: "All Wedding Cards", path: "/weddingcards" },
      ],
    },
    {
      icon: <i className="ri-receipt-line text-xl"></i>,
      name: "Receipts",
      dropdown: [
        { name: "Create Receipt", path: "/create-receipt" },
        { name: "All Receipts", path: "/receipts" },
      ],
    },
    {
      icon: <i className="ri-image-line text-xl"></i>,
      name: "Banners",
      dropdown: [
        { name: "Create Banner", path: "/create-banner" },
        { name: "All Banners", path: "/banners" },
        { name: "Active Banners", path: "/active-banners" },
      ],
    },
    {
      icon: <i className="ri-settings-3-line text-xl"></i>,
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
      icon: <i className="ri-logout-box-r-line text-xl"></i>,
      name: "Logout",
      action: handleLogout,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      <div
        className={`fixed md:relative z-50 transition-all duration-300 ease-in-out ${
          isMobile 
            ? isCollapsed 
              ? "-translate-x-full" 
              : "translate-x-0"
            : isCollapsed 
              ? "w-20" 
              : "w-72"
        } h-screen flex flex-col`}
        style={{
          background: "linear-gradient(135deg, #e6f0ff 0%, #d4e4ff 100%)",
          boxShadow: "0 20px 35px -10px rgba(59, 130, 246, 0.2)",
        }}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 py-6 px-4 flex items-center justify-between border-b border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className={`flex items-center ${(!isCollapsed || isMobile) ? 'space-x-3' : 'justify-center w-full'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur-md opacity-40" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="ri-admin-line text-white text-xl"></i>
              </div>
            </div>
            {(!isCollapsed || isMobile) && (
              <div>
                <h1 className="text-blue-800 font-bold text-lg tracking-wide">
                  Admin Portal
                </h1>
                <p className="text-[10px] text-blue-500/70">Liquid Admin</p>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              onClick={onToggle}
              className="text-blue-600/70 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100/50 transition-all"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {elements.map((item, idx) => (
              <div key={idx}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        isDropdownActive(item.dropdown)
                          ? 'bg-gradient-to-r from-blue-200/80 to-indigo-200/80 border border-blue-300/50 shadow-sm'
                          : 'hover:bg-blue-100/50'
                      }`}
                    >
                      <span className={`text-xl ${isDropdownActive(item.dropdown) ? 'text-blue-600' : 'text-blue-500/70'}`}>
                        {item.icon}
                      </span>
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className={`ml-4 flex-1 text-left font-medium ${
                            isDropdownActive(item.dropdown) ? 'text-blue-800' : 'text-blue-700/80'
                          }`}>
                            {item.name}
                          </span>
                          <FaChevronDown
                            className={`text-xs transition-transform duration-200 ${
                              openDropdown === item.name ? "rotate-180 text-blue-500" : "text-blue-400/60"
                            }`}
                          />
                        </>
                      )}
                    </button>
                    
                    {/* Dropdown Menu - No underlines */}
                    {openDropdown === item.name && (!isCollapsed || isMobile) && (
                      <div className="ml-9 mt-2 mb-2 space-y-1">
                        {item.dropdown.map((subItem, subIdx) => (
                          <Link
                            key={subIdx}
                            to={subItem.path}
                            onClick={() => {
                              setOpenDropdown(null);
                              if (isMobile && onToggle) onToggle();
                            }}
                            className={`flex items-center py-2.5 px-4 text-sm rounded-xl transition-all duration-200 ${
                              isActive(subItem.path)
                                ? 'bg-gradient-to-r from-blue-200/80 to-indigo-200/80 border-l-2 border-blue-500'
                                : 'hover:bg-blue-100/50'
                            }`}
                            style={{ textDecoration: 'none' }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                              isActive(subItem.path) ? 'bg-blue-500' : 'bg-blue-300/60'
                            }`} />
                            <span className={`text-sm ${
                              isActive(subItem.path) ? 'text-blue-800 font-medium' : 'text-blue-700/70'
                            }`}
                            style={{ textDecoration: 'none' }}>
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  item.path ? (
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (isMobile && onToggle) onToggle();
                      }}
                      className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-200/80 to-indigo-200/80 border border-blue-300/50 shadow-sm'
                          : 'hover:bg-blue-100/50'
                      } ${item.name === 'Logout' ? 'mt-6 border-t border-blue-200/50 pt-4' : ''}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <span className={`text-xl ${isActive(item.path) ? 'text-blue-600' : 'text-blue-500/70'}`}>
                        {item.icon}
                      </span>
                      {(!isCollapsed || isMobile) && (
                        <span className={`ml-4 ${isActive(item.path) ? 'text-blue-800 font-medium' : 'text-blue-700/80'} ${item.name === 'Logout' ? 'text-red-500' : ''}`}
                        style={{ textDecoration: 'none' }}>
                          {item.name}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-blue-100/50 ${
                        item.name === 'Logout' ? 'mt-6 border-t border-blue-200/50 pt-4' : ''
                      }`}
                    >
                      <span className="text-xl text-blue-500/70">
                        {item.icon}
                      </span>
                      {(!isCollapsed || isMobile) && (
                        <span className="ml-4 text-red-500">
                          {item.name}
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="p-5 border-t border-blue-200/50 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-blue-500/70">SYSTEM ONLINE</span>
            </div>
            <p className="text-[10px] text-blue-400/60">Liquid Admin Panel v2.0</p>
            <p className="text-[9px] text-blue-300/50 mt-1">© 2026 All rights reserved</p>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        
        /* Ensure all buttons and links are clickable and no underlines */
        button, a {
          cursor: pointer;
          user-select: none;
          text-decoration: none !important;
        }
        
        a:hover, a:focus, a:active {
          text-decoration: none !important;
        }
        
        /* Remove any pointer-events issues */
        .fixed, .relative, .absolute {
          pointer-events: auto;
        }
        
        /* Ensure z-index properly set */
        .z-50 {
          z-index: 50;
        }
        
        .z-40 {
          z-index: 40;
        }
        
        /* Remove any default link styles */
        a:link, a:visited, a:hover, a:active {
          text-decoration: none !important;
        }
      `}</style>
    </>
  );
};

export default Sidebar;