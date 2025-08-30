import React, { useState, useEffect, useRef } from "react";
import "./ProfileDropdown.css"; // CSS moved to external file for clarity

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="profile-container">
      <div
        className="profile-btn"
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
          alt="Profile"
        />
      </div>

      <div
        ref={menuRef}
        className={`dropdown-menu ${open ? "active" : ""}`}
      >
        <div className="menu-item">
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </div>
        <div className="menu-item">
          <i className="fas fa-sign-out-alt"></i> Logout
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;