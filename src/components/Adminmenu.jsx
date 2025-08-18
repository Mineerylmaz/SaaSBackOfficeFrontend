import React, { useState } from "react";
import styled from "styled-components";
import { FaUsers, FaFileInvoiceDollar, FaCogs } from "react-icons/fa";

const Sidebar = styled.nav`
  position: fixed;
  top: ${({ navOffset }) => `${navOffset}px`};
  left: 0;
  width: 250px;
  height: calc(100vh - ${({ navOffset }) => `${navOffset}px`});
  background-color: #122339;
  padding: 20px;
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: none;

  @media (min-width: 1024px) {
    display: block; /* sadece desktop’ta yan menü */
  }
`;

const TabStrip = styled.div`
  position: sticky;
  top: ${({ navOffset }) => `${navOffset}px`};
  z-index: 999;
  background: rgba(18, 35, 57, 0.8); /* cam efekt */
  backdrop-filter: blur(8px);
  padding: 10px 12px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (min-width: 1024px) {
    display: none; /* desktop’ta gizle */
  }
`;

const TabButton = styled.button`
  white-space: nowrap;
  border: 1px solid ${({ active }) =>
        active ? "transparent" : "rgba(255,255,255,.15)"};
  background: ${({ active }) =>
        active ? "linear-gradient(135deg, #00AEEF, #0055A4)" : "transparent"};
  color: ${({ active }) => (active ? "#fff" : "#cbd5e1")};
  padding: 8px 14px;
  font-weight: 700;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(255, 255, 255, 0.35);
  }
`;

const MenuItem = ({ icon, text, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            padding: "10px",
            cursor: "pointer",
            color: active ? "#2f81f7" : "#9aa6b2",
            fontWeight: active ? "800" : "500",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: active ? "4px solid #2f81f7" : "4px solid transparent",
            borderRadius: "0 10px 10px 0",
        }}
    >
        {icon} {text}
    </div>
);

export default function ResponsiveMenu({ navOffset = 64, admin }) {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menus = [
        { key: "dashboard", text: "Dashboard", icon: <FaUsers /> },
        { key: "users", text: "Kullanıcılar", icon: <FaUsers /> },
        { key: "pricing", text: "Fiyatları Kontrol Et", icon: <FaFileInvoiceDollar /> },
        { key: "settings", text: "Ayarlar", icon: <FaCogs /> },
    ];

    return (
        <>
            {/* mobil görünüm: blur efektli tab strip */}
            <TabStrip navOffset={navOffset}>
                {menus.map((m) => (
                    <TabButton
                        key={m.key}
                        active={activeTab === m.key}
                        onClick={() => setActiveTab(m.key)}
                    >
                        {m.text}
                    </TabButton>
                ))}
            </TabStrip>

            {/* desktop görünüm: klasik sidebar */}
            <Sidebar navOffset={navOffset}>
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                        src={admin.avatar}
                        alt="avatar"
                        style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                    />
                    <div>
                        <h3 style={{ margin: "0", color: "#d1eaff" }}>{admin.name}</h3>
                        <p style={{ margin: "0", color: "#227BBF" }}>{admin.role}</p>
                    </div>
                </div>

                {menus.map((m) => (
                    <MenuItem
                        key={m.key}
                        icon={m.icon}
                        text={m.text}
                        active={activeTab === m.key}
                        onClick={() => setActiveTab(m.key)}
                    />
                ))}
            </Sidebar>
        </>
    );
}
