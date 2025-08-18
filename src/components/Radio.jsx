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
const Content = styled.main`
  padding: 16px;
  /* navbar yüksekliği kadar üstten boşluk */
  margin-top: ${props => (props.navOffset || 64)}px;

  @media (min-width: 1024px) {
    margin-left: ${props => (props.sidebarWidth || 220)}px;
  }
`;


// === Styles
const Nav = styled.nav`
  position: fixed;
  top: ${({ navOffset }) => `${navOffset}px`}; /* NAVBAR ALTINA OTURT */
  left: 0;
  width: ${({ sidebarWidth }) => `${sidebarWidth}px`};
  height: calc(100vh - ${({ navOffset }) => `${navOffset}px`});
  background-color: #0d1117;
  padding: 20px 16px;
  display: none; /* mobilde gizli */
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #d1eaff;
  z-index: 1000; /* navbar’ın altında kalmasın */
  border-right: 1px solid rgba(255,255,255,.06);

  @media (min-width: 1024px) {
    display: flex; /* sadece desktop/tablet genişlikte sidebar göster */
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
  @media (max-width: 1023px) { display: none; }
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#2f81f7" : "#9aa6b2")};
  font-weight: ${({ active }) => (active ? "800" : "500")};
  font-size: 15px;
  cursor: pointer;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: ${({ active }) =>
    active ? "4px solid #2f81f7" : "4px solid transparent"};
  border-radius: 0 10px 10px 0;
  transition: all .2s ease;
  &:hover { color: #2f81f7; background: rgba(255,255,255,.04); }
`;

/* Mobil tablet için: navbarın hemen altında yatay sekme barı */
const TabStrip = styled.div`
  position: sticky;
  top: ${({ navOffset }) => `${navOffset}px`};
  z-index: 999;
  background: rgba(13,17,23,.85);
  backdrop-filter: blur(8px);
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255,255,255,.06);

  @media (min-width: 1024px) {
    display: none; /* desktop’ta yatay şerit gizleniyor */
  }
`;

const Pill = styled.button`
  white-space: nowrap;
  border: 1px solid ${({ active }) => (active ? "transparent" : "rgba(255,255,255,.15)")};
  background: ${({ active }) => (active ? "linear-gradient(135deg, #00AEEF, #0055A4)" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#cbd5e1")};
  padding: 8px 14px;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  transition: all .2s ease;
  &:hover { border-color: rgba(255,255,255,.35); }
`;

// === Component
const Radio = ({ selectedMenu, setSelectedMenu, role, navOffset = 64 }) => {
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const isResizing = useRef(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const menu = searchParams.get("menu");
    if (menu) setSelectedMenu(menu);
  }, []); // eslint-disable-line

  useEffect(() => {
    function handleMouseMove(e) {
      if (isResizing.current) {
        let newWidth = e.clientX;
        if (newWidth < 160) newWidth = 160;
        if (newWidth > 360) newWidth = 360;
        setSidebarWidth(newWidth);
      }
    }
    function handleMouseUp() { isResizing.current = false; }
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
    { key: "sonuc", label: "Sonuç" },
    { key: "kullanıcılar", label: "Kullanıcılar", adminOnly: true },
  ];

  const visibleItems = menuItems.filter(i => canViewMenu(role, i.key, i.adminOnly));

  return (
    <>
      {/* Mobil/Tablet: Yatay sekme şeridi */}
      <TabStrip navOffset={navOffset}>
        {visibleItems.map((item) => (
          <Pill
            key={item.key}
            active={selectedMenu === item.key}
            onClick={() => {
              setSelectedMenu(item.key);
              setSearchParams({ menu: item.key });
            }}
          >
            {item.label}
          </Pill>
        ))}
      </TabStrip>

      {/* Desktop: Sabit yan menü */}
      <Nav navOffset={navOffset} sidebarWidth={sidebarWidth}>
        <Resizer onMouseDown={() => (isResizing.current = true)} />
        {visibleItems.map((item) => (
          <MenuItem
            key={item.key}
            active={selectedMenu === item.key}
            onClick={() => {
              setSelectedMenu(item.key);
              setSearchParams({ menu: item.key });
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Nav>
    </>
  );
};

export default Radio;
