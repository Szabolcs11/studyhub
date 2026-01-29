import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreateNoteModal from "./CreateNoteModal";
import { ENDPOINTS } from "../../constans";
import axios from "axios";
import { toast } from "react-toastify";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle, isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(ENDPOINTS.AUTHENTICATE, {}, { withCredentials: true });
        setIsAuthenticated(response.data.success);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(ENDPOINTS.LOGOUT, {}, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/auth/login");
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleCreateNote = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowCreateModal(true);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const navItems = [
    {
      path: "/",
      label: "Főoldal",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/courses",
      label: "Kurzusok",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      path: "/settings",
      label: "Beállítások",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31 2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543-.94-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 002.572 1.065c.426 1.756 2.924 1.756 3.35 0a1.724 1.724 0 002.573-1.066c1.543.94 3.31-.826 2.37-2.37a1.724 1.724 0 001.065-2.572c1.756-.426 1.756-2.924 0-3.35a1.724 1.724 0 00-1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="sidebar-logo-icon">SH</div>
            <span className="sidebar-logo-text">StudyHub</span>
          </Link>
          {onToggle && (
            <button className="sidebar-toggle" onClick={onToggle}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menü</div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActivePath(item.path) ? "active" : ""}`}
                data-tooltip={isCollapsed ? item.label : undefined}
                onClick={() => {
                  if (isMobileOpen && onMobileClose) {
                    onMobileClose();
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            ))}

            <button
              className="nav-action-button"
              onClick={handleCreateNote}
              data-tooltip={isCollapsed ? "Jegyzet létrehozása" : undefined}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="nav-action-text">Jegyzet létrehozása</span>
            </button>
          </div>

          {isAuthenticated && (
            <div className="nav-section">
              <div className="nav-section-title">Fiók</div>

              <button
                className="nav-item"
                onClick={handleLogout}
                data-tooltip={isCollapsed ? "Kijelentkezés" : undefined}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "var(--spacing-3)",
                }}
              >
                <span className="nav-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                <span className="nav-text">Kijelentkezés</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {showCreateModal && (
        <CreateNoteModal onClose={() => setShowCreateModal(false)} onSubmit={() => {}} isLoading={false} />
      )}
    </>
  );
};

export default Sidebar;
