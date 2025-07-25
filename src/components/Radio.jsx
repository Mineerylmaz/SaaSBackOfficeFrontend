import React from "react";
import { useState, useRef } from "react";
import styled from "styled-components";
import { useEffect } from "react";
const adminRoles = ["admin", "superadmin", "user"];
const canViewMenu = (role, menuKey, adminOnly) => {
  if (adminOnly && !adminRoles.includes(role)) return false;

  if (adminRoles.includes(role)) return true;

  if (role === "viewer") {
    const hiddenForViewer = ["urlresults", "upload", "invite"];
    return !hiddenForViewer.includes(menuKey);
  }

  if (role === "editor") {
    const hiddenForEditor = ["invite"];
    return !hiddenForEditor.includes(menuKey);
  }

  return false;
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background-color: #0d1117;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #d1eaff;
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${({ isOpen }) => (isOpen ? "0" : "-220px")};
    width: 220px;
    height: 100vh;
    padding: 20px;
    background-color: #0d1117;
    transition: left 0.3s ease;
    box-shadow: ${({ isOpen }) =>
    isOpen ? "2px 0 5px rgba(0,0,0,0.5)" : "none"};
  }
`;

const Hamburger = styled.div`
  display: none;
  position: fixed;
  top: 55px;
  left: 15px;
  width: 30px;
  height: 22px;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 110;

  div {
    height: 4px;
    background: #2f81f7;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const CloseButton = styled.button`
  display: none;
  margin-bottom: 20px;
  color: #2f81f7;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#2f81f7" : "#94a3b8")};
  font-weight: ${({ active }) => (active ? "700" : "400")};
  font-size: 16px;
  cursor: pointer;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: ${({ active }) => (active ? "4px solid #2f81f7" : "4px solid transparent")};
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;

  &:hover {
    color: #2f81f7;
  }
`;


const Resizer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  z-index: 101;
`;
const Content = styled.div`
  margin-left: ${({ sidebarWidth }) => sidebarWidth}px;
  padding: 20px;
  transition: margin-left 0.2s ease;
`;




const Radio = ({ selectedMenu, setSelectedMenu, role }) => {
  const [width, setWidth] = useState(220);
  const isResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { key: "profile", label: "Profil" },
    { key: "static", label: "Static URL Ayarları" },
    { key: "rt", label: "Real Time URL Ayarları" },
    { key: "urlresults", label: "URL Sonuçları" },
    { key: "upload", label: "Dosya Yükle" },
    { key: "roller", label: "Roller", adminOnly: true },
    { key: "notifications", label: "Bildirimler", adminOnly: true },
  ];






  const onMouseDown = () => {
    isResizing.current = true;
  };

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing.current) {
        let newWidth = e.clientX;
        // Minimum ve maksimum genişlik sınırları
        if (newWidth < 100) newWidth = 100;
        if (newWidth > 400) newWidth = 400;
        setSidebarWidth(newWidth);
      }
    }

    function handleMouseUp() {
      isResizing.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  function handleMouseDown() {
    isResizing.current = true;
  }
  return (
    <div style={{ width: sidebarWidth }} className="sidebar">
      <div onMouseDown={handleMouseDown} className="resizer" />

      {menuItems.map((item) => {
        if (!canViewMenu(role, item.key, item.adminOnly)) return null;

        return (
          <MenuItem
            key={item.key}
            active={selectedMenu === item.key}
            onClick={() => setSelectedMenu(item.key)}
          >
            <span style={{ marginRight: 8 }}>{item.icon}</span>
            {item.label}
          </MenuItem>
        );
      })}
    </div>
  );
};

export default Radio;






const AdminCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 2px solid #227bbf;
`;

const AdminInfo = styled.div``;

const AdminName = styled.h3`
  margin: 0;
  font-weight: 600;
`;

const AdminRole = styled.p`
  margin: 0;
  color: #227bbf;
  font-size: 0.9em;
`;



