import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

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
  top: 0px;
  left: ${({ isOpen }) => (isOpen ? "0" : "-220px")};
  
  width: 220px;
  height: 100vh;
  background-color: #0d1117;
  padding: 20px;
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #d1eaff;
  z-index: 100;
  transition: left 0.3s ease;

  @media (min-width: 769px) {
    left: 0;
  }
`;

const Hamburger = styled.div`
  display: none;
  position: fixed;
  top: 15px;
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
    margin: 3px 0;
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
  color: ${({ active, darkMode }) =>
    active ? "#2f81f7" : darkMode ? "#94a3b8" : "#000"};
  font-weight: ${({ active }) => (active ? "700" : "400")};
  font-size: 16px;
  cursor: pointer;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: ${({ active }) =>
    active ? "4px solid #2f81f7" : "4px solid transparent"};
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

const Radio = ({ selectedMenu, setSelectedMenu, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const isResizing = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const menu = searchParams.get("menu");
    if (menu) {
      setSelectedMenu(menu);
    }
  }, []);


  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing.current) {
        let newWidth = e.clientX;
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

  const menuItems = [
    { key: "ayarlar", label: "Ayarlar" },
    { key: "urlresults", label: "URL Sonuçları" },

    { key: "sonuc", label: "Sonuc" },
    { key: "roller", label: "Roller", adminOnly: true },
  ];

  return (
    <>
      {/* Hamburger Menu Button */}
      <Hamburger onClick={() => setIsOpen(true)}>
        <div></div>
        <div></div>
        <div></div>
      </Hamburger>

      {/* Sidebar */}
      <Nav style={{ width: sidebarWidth }} isOpen={isOpen}>
        <Resizer onMouseDown={() => (isResizing.current = true)} />
        <CloseButton onClick={() => setIsOpen(false)}>✕ Kapat</CloseButton>

        {menuItems.map((item) => {
          if (!canViewMenu(role, item.key, item.adminOnly)) return null;

          return (
            <MenuItem
              darkMode={darkMode}
              key={item.key}
              active={selectedMenu === item.key}
              onClick={() => {
                setSelectedMenu(item.key);
                setSearchParams({ menu: item.key });
              }}

            >
              {item.label}
            </MenuItem>
          );
        })}
      </Nav>
    </>
  );
};

export default Radio;
