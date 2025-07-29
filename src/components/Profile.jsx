import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem("themeColor") || "#1e3a5f");
  const [avatar, setAvatar] = useState(user.avatar || 'https://i.pravatar.cc/100');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const avatarOptions = [
    'https://i.pravatar.cc/100?img=1',
    'https://i.pravatar.cc/100?img=2',
    'https://i.pravatar.cc/100?img=3',
    'https://i.pravatar.cc/100?img=4',
  ];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);

  }, [darkMode]);





  const handleAvatarChange = (url) => {
    setAvatar(url);
    // Backend'e kaydetme işlemi yapılabilir burada
  };



  return (
    <Wrapper>
      <Sidebar style={{ backgroundColor: themeColor }}>
        <div className="user-card">
          <img src={avatar} alt="avatar" />
          <h4>{user.firstname} {user.lastname}</h4>
          <p>{user.email}</p>
        </div>
        <nav>
          <button onClick={() => setActiveTab('profile')}>Profil Bilgileri</button>
          <button onClick={() => setActiveTab('avatar')}>Profil Fotoğrafı</button>
          <button onClick={() => setActiveTab('danger')}>Hesap İşlemleri</button>
        </nav>
      </Sidebar>
      <Content>
        {activeTab === 'profile' && (
          <ProfileCard>
            <h2>Profil Bilgileri</h2>
            <InfoRow><Label>Email:</Label> <Value>{user.email}</Value></InfoRow>
            <InfoRow><Label>Rol:</Label> <Value>{user.role}</Value></InfoRow>
            <InfoRow><Label>Plan:</Label> <Value>{user?.plan?.name || 'Yok'}</Value></InfoRow>
          </ProfileCard>
        )}



        {activeTab === 'avatar' && (
          <section>
            <h2>Profil Fotoğrafı Seç</h2>
            <AvatarGrid>
              {avatarOptions.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`avatar-${idx}`}
                  className={avatar === url ? 'active' : ''}
                  onClick={() => handleAvatarChange(url)}
                />
              ))}
            </AvatarGrid>
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

const fadeScale = keyframes`
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  color: white;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user-card {
    text-align: center;
    margin-bottom: 20px;
    img {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      object-fit: cover;
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
      background: rgba(255,255,255,0.1);
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
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
        padding: 10px;
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
      margin: 10px 0;
    }
  }
`;

const ProfileCard = styled.section`
  max-width: 500px;
  margin: 0 auto;
  background: ${({ theme }) => theme === 'dark' ? '#222' : '#fff'};
  color: ${({ theme }) => theme === 'dark' ? '#eee' : '#333'};
  border-radius: 15px;
  padding: 30px 40px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  animation: ${fadeScale} 0.4s ease forwards;
  transition: background 0.3s, color 0.3s;
  h2 {
    margin-bottom: 25px;
    font-weight: 700;
    letter-spacing: 1.1px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme === 'dark' ? '#444' : '#eee'};
  font-size: 18px;
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#aaa' : '#555'};
`;

const Value = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
`;

const AvatarGrid = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    &.active {
      border-color: #1e3a5f;
    }
  }
`;

export default Profile;
