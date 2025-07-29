// components/SettingsLayout.jsx
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
                    <button onClick={() => setActiveTab('password')}>Şifre Değiştir</button>
                    <button onClick={() => setActiveTab('theme')}>Tema Ayarları</button>
                    <button onClick={() => setActiveTab('danger')}>Hesap İşlemleri</button>
                </nav>
            </Sidebar>
            <Content>
                {activeTab === 'profile' && (
                    <section>
                        <h2>Profil Bilgileri</h2>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Rol:</strong> {user.role}</p>
                        <p><strong>Plan:</strong> {user?.plan?.name || 'Yok'}</p>
                        {/* Profil düzenleme alanları eklenebilir */}
                    </section>
                )}
                {activeTab === 'password' && (
                    <section>
                        <h2>Şifre Değiştir</h2>
                        <form>
                            <input type="password" placeholder="Eski Şifre" />
                            <input type="password" placeholder="Yeni Şifre" />
                            <input type="password" placeholder="Yeni Şifre Tekrar" />
                            <button type="submit">Kaydet</button>
                        </form>
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
                        <button style={{ backgroundColor: 'red', color: 'white' }}>Hesabı Sil</button>
                    </section>
                )}
            </Content>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
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
    h4, p {
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

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;

      input {
        padding: 8px;
        font-size: 16px;
      }

      button {
        padding: 10px;
        background-color: #1e3a5f;
        color: white;
        border: none;
        cursor: pointer;
        &:hover {
          background-color: #345678;
        }
      }
    }

    label {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
`;

export default SettingsLayout;