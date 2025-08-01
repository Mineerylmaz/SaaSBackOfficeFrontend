import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import { useSearchParams } from "react-router-dom";

const Profile = ({ user }) => {

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem("themeColor") || "#1e3a5f");
  const [avatar, setAvatar] = useState(user.avatar || 'https://i.pravatar.cc/100');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const [searchParams, setSearchParams] = useSearchParams();


  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);


  useEffect(() => {
    const tab = searchParams.get("tab") || "profile";
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const avatarOptions = [
    null, // boş avatar seçeneği
    'https://i.pravatar.cc/100?img=1',
    'https://i.pravatar.cc/100?img=2',
    'https://i.pravatar.cc/100?img=3',
    'https://i.pravatar.cc/100?img=4',
    'https://i.pravatar.cc/100?img=5',
    'https://i.pravatar.cc/100?img=6',
    'https://i.pravatar.cc/100?img=7',
    'https://i.pravatar.cc/100?img=8',
    'https://i.pravatar.cc/100?img=9',
    'https://i.pravatar.cc/100?img=10',
    'https://i.pravatar.cc/100?img=11',
    'https://i.pravatar.cc/100?img=12',
    'https://i.pravatar.cc/100?img=13',
    'https://i.pravatar.cc/100?img=14',
    'https://i.pravatar.cc/100?img=15',
    'https://i.pravatar.cc/100?img=16',
    'https://i.pravatar.cc/100?img=17',
    'https://i.pravatar.cc/100?img=18',
    'https://i.pravatar.cc/100?img=19',
    'https://i.pravatar.cc/100?img=20',

  ];


  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);

  }, [darkMode]);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:5000/upload', { // backend ile aynı URL olmalı
        method: 'POST', // backend POST bekliyor
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // data.fileUrl: "/uploads/avatar_123456.png"
        setAvatar(`http://localhost:5000${data.fileUrl}`); // tam url yapıyoruz
        // localStorage güncelle
        const updatedUser = { ...user, avatar: `http://localhost:5000${data.fileUrl}` };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error('Avatar yüklenemedi');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Hesabınız 30 gün içinde kalıcı olarak silinecektir.',
      text: 'Emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch('http://localhost:5000/api/users/users/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (res.ok) {
        Swal.fire('Başarılı', 'Hesap silme işlemi başlatıldı. 30 gün içinde geri dönebilirsiniz.', 'success');
      } else {
        Swal.fire('Hata', 'Hesap silme işlemi başarısız oldu.', 'error');
      }
    } catch (error) {
      Swal.fire('Hata', 'Hesap silme işlemi başarısız oldu.', 'error');
    }
  };


  const handleAvatarChange = async (url) => {
    // Boş avatar seçilmişse url boş string olabilir
    setAvatar(url || '');

    try {
      // Güncelle backend'e boş avatar gönder
      const res = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          avatar: url || '',
        }),
      });

      if (res.ok) {
        const updatedUser = { ...user, avatar: url || '' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error('Avatar kaydedilemedi');
      }
    } catch (error) {
      console.error('Hata:', error);
    }
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
          <button onClick={() => handleTabChange('profile')}>Profil Bilgileri</button>
          <button onClick={() => handleTabChange('avatar')}>Profil Fotoğrafı</button>
          <button onClick={() => handleTabChange('danger')}>Hesap İşlemleri</button>

        </nav>
      </Sidebar>
      <Content>
        {activeTab === 'profile' && (
          <ProfileCard>
            <h2>Profil Bilgileri</h2>
            <InfoRow><Label>Email:</Label> <Value>{user.email}</Value></InfoRow>
            <InfoRow><Label>Rol:</Label> <Value>{user.role}</Value></InfoRow>
            <InfoRow><Label>Plan:</Label> <Value>{user?.plan?.name || 'Yok'}</Value></InfoRow>

            {user.plan_start_date && (
              <InfoRow>
                <Label>Başlangıç Tarihi:</Label>
                <Value>{new Date(user.plan_start_date).toLocaleDateString()}</Value>
              </InfoRow>
            )}
            {user.plan_end_date && (
              <InfoRow>
                <Label>Bitiş Tarihi:</Label>
                <Value>{new Date(user.plan_end_date).toLocaleDateString()}</Value>
              </InfoRow>
            )}
          </ProfileCard>
        )}


        {activeTab === 'avatar' && (
          <section>
            <h2>Profil Fotoğrafı Seç</h2>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <AvatarGrid>
              {avatarOptions.map((url, idx) => {
                if (url === null) {
                  // Boş avatar seçeneği - burası label olacak input için
                  return (
                    <EmptyAvatarLabel
                      htmlFor="fileInput"
                      key={idx}
                      className={avatar === '' || avatar === null ? 'active' : ''}
                      title="Fotoğraf yükle"
                    >
                      <span>+</span>
                    </EmptyAvatarLabel>
                  );
                }
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`avatar-${idx}`}
                    className={avatar === url ? 'active' : ''}
                    onClick={() => handleAvatarChange(url)}
                  />
                );
              })}
            </AvatarGrid>

          </section>
        )}



        {activeTab === 'danger' && (
          <section>
            <h2>Hesap İşlemleri</h2>
            <button
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={handleDeleteAccount}
            >
              Hesabı Sil
            </button>
          </section>
        )}

      </Content>
    </Wrapper>
  );
};
const EmptyAvatarLabel = styled.label`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px dashed #1e3a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e3a5f;
  font-size: 24px;
  user-select: none;

  &.active {
    border-color: #345678;
    background-color: rgba(30, 58, 95, 0.1);
  }

  &:hover {
    background-color: rgba(30, 58, 95, 0.2);
  }
`;



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
