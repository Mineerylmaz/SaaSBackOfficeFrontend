
import React, { useState } from 'react';
import styled from 'styled-components';

const SettingsLayout = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Wrapper>
      <Sidebar>
        <div className="user-card">
          <img src={user.avatar || 'https://i.pravatar.cc/100'} alt="avatar" />
          <h4>{user.email}</h4>
          <p>{user.role}</p>
        </div>
        <nav>
          <button onClick={() => setActiveTab('profile')}>Profil Bilgileri</button>
          <button onClick={() => setActiveTab('theme')}>Tema Ayarları</button>
          <button onClick={() => setActiveTab('danger')}>Hesap İşlemleri</button>
        </nav>
      </Sidebar>
      <Content>
        {activeTab === 'profile' && (
          <section>
            <h2>Profil Bilgileri</h2>
            <ProfileCard>
              <strong>Email:</strong> <span>{user.email}</span>
              <strong>Rol:</strong> <span>{user.role}</span>
              <strong>Plan:</strong> <span>{user?.plan?.name || 'Yok'}</span>

              {user.plan_start_date && (
                <>
                  <strong>Başlangıç Tarihi:</strong>
                  <span>{new Date(user.plan_start_date).toLocaleDateString()}</span>
                </>
              )}
              {user.plan_end_date && (
                <>
                  <strong>Bitiş Tarihi:</strong>
                  <span>{new Date(user.plan_end_date).toLocaleDateString()}</span>
                </>
              )}
            </ProfileCard>
          </section>
        )}

        {activeTab === 'theme' && (
          <section>
            <h2>Tema Ayarları</h2>
            <label>
              <input type="checkbox" /> Karanlık Mod
            </label>
          </section>
        )}

        {activeTab === 'danger' && (
          <section>
            <h2>Hesap İşlemleri</h2>
            <DangerButton>Hesabı Sil</DangerButton>
          </section>
        )}
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1e3a5f;
  color: white;
  padding: 20px;
  .user-card {
    text-align: center;
    margin-bottom: 20px;
    img {
      border-radius: 50%;
      width: 80px;
      height: 80px;
    }
    h4,
    p {
      margin: 10px 0;
    }
  }
  nav button {
    display: block;
    width: 100%;
    margin: 8px 0;
    padding: 10px;
    background: transparent;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    &:hover {
      background: #345678;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    nav button {
      text-align: center;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  background: #f9f9f9;
  section {
    max-width: 500px;
    margin: 0 auto;
    h2 {
      margin-bottom: 20px;
    }
    label {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;

const ProfileCard = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 10px 20px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const DangerButton = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: darkred;
  }
`;

export default SettingsLayout;
