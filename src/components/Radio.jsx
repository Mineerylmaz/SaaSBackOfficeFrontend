import React from "react";
import styled from "styled-components";

const Radio = ({ selectedMenu, setSelectedMenu, admin }) => {
  return (
    <Nav>
      {admin && (
        <AdminCard>
          <Avatar src={admin.avatar} alt="avatar" />
          <AdminInfo>
            <AdminName>{admin.name}</AdminName>
            <AdminRole>{admin.role}</AdminRole>
          </AdminInfo>
        </AdminCard>
      )}

      <MenuItem
        active={selectedMenu === "profile"}
        onClick={() => setSelectedMenu("profile")}
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z" />
          <path
            fillRule="evenodd"
            d="M8 8a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
        Profil
      </MenuItem>

      <MenuItem
        active={selectedMenu === "static"}
        onClick={() => setSelectedMenu("static")}
      >
        Static URL Ayarları
      </MenuItem>

      <MenuItem
        active={selectedMenu === "rt"}
        onClick={() => setSelectedMenu("rt")}
      >
        Real Time URL Ayarları
      </MenuItem>

      <MenuItem
        active={selectedMenu === "notifications"}
        onClick={() => setSelectedMenu("notifications")}
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 25"
        >
          <path
            fillRule="evenodd"
            fill="#7D8590"
            d="m11.9572 4.31201c-3.35401 0-6.00906 2.59741-6.00906 5.67742v3.29037c0 .1986-.05916.3927-.16992.5576l-1.62529 2.4193-.01077.0157c-.18701.2673-.16653.5113-.07001.6868.10031.1825.31959.3528.67282.3528h14.52603c.2546 0 .5013-.1515.6391-.3968.1315-.2343.1117-.4475-.0118-.6093-.0065-.0085-.0129-.0171-.0191-.0258l-1.7269-2.4194c-.121-.1695-.186-.3726-.186-.5809v-3.29037c0-1.54561-.6851-3.023-1.7072-4.00431-1.1617-1.01594-2.6545-1.67311-4.3019-1.67311zm-8.00906 5.67742c0-4.27483 3.64294-7.67742 8.00906-7.67742 2.2055 0 4.1606.88547 5.6378 2.18455.01.00877.0198.01774.0294.02691 1.408 1.34136 2.3419 3.34131 2.3419 5.46596v2.97007l1.5325 2.1471c.6775.8999.6054 1.9859.1552 2.7877-.4464.795-1.3171 1.4177-2.383 1.4177h-14.52603c-2.16218 0-3.55087-2.302-2.24739-4.1777l1.45056-2.1593zm4.05187 11.32257c0-.5523.44772-1 1-1h5.99999c.5523 0 1 .4477 1 1s-.4477 1-1 1h-5.99999c-.55228 0-1-.4477-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Bildirimler
      </MenuItem>
    </Nav>
  );
};

export default Radio;

const Nav = styled.nav`
  position: fixed;  /* burası önemli */
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
  z-index: 100; /* üstte görünmesi için */
`;


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
