import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import { useSearchParams } from "react-router-dom";
import '../styles/Profile.css';

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
      const res = await fetch('http://localhost:32807/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        setAvatar(`http://localhost:32807${data.fileUrl}`);

        const updatedUser = { ...user, avatar: `http://localhost:32807${data.fileUrl}` };
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
      const res = await fetch('http://localhost:32807/api/users/users/delete-account', {
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

    setAvatar(url || '');

    try {

      const res = await fetch('http://localhost:32807/api/users/avatar', {
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
          <button
            onClick={() => handleTabChange('profile')}
            className={activeTab === 'profile' ? 'active' : ''}
          >
            Profil Bilgileri
          </button>
          <button
            onClick={() => handleTabChange('avatar')}
            className={activeTab === 'avatar' ? 'active' : ''}
          >
            Profil Fotoğrafı
          </button>
          <button
            onClick={() => handleTabChange('hesapsilme')}
            className={activeTab === 'hesapsilme' ? 'active' : ''}
          >
            Hesap İşlemleri
          </button>
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
            {user.next_plan && (
              <InfoRow>
                <Label>Gelecek Plan:</Label>
                <Value>{user.next_plan}</Value>
              </InfoRow>
            )}

            {user.plan_change_date && (
              <InfoRow>
                <Label>Plan Değişim Tarihi:</Label>
                <Value>{new Date(user.plan_change_date).toLocaleDateString()}</Value>
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
              data-testid="avatar-input"
            />

            <AvatarGrid>
              {avatarOptions.map((url, idx) => {
                if (url === null) {

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



        {activeTab === 'hesapsilme' && (
          <section>
            <h2>Hesap İşlemleri</h2>
            <DangerButton onClick={handleDeleteAccount}>
              Hesabı Sil
            </DangerButton>

          </section>
        )}

      </Content>
    </Wrapper>
  );
};


/* Sayfa layout */
export const Wrapper = styled.div`
  --line: rgba(148,163,184,.25);
  --muted: #64748b;
  --primary: #0055A4;
  --primary2: #00AEEF;
  --bg: #0b1220;

  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  padding: 16px;
  background:
    radial-gradient(1200px 600px at 20% -20%, #0b2345 0%, #0b1220 40%, #0b1220 100%);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

/* Sol menü */
export const Sidebar = styled.aside`
  position: sticky; top: 16px; align-self: start;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px;
  background: ${({ style }) =>
    style?.backgroundColor ? style.backgroundColor : "rgba(15,23,42,.72)"};
  backdrop-filter: blur(6px);
  box-shadow: 0 12px 40px rgba(0,0,0,.25);

  .user-card {
    display: grid; place-items: center; gap: 10px;
    padding: 10px 8px 14px; margin-bottom: 12px;
    border-bottom: 1px dashed var(--line);
    text-align: center;
  }

  .user-card img {
    width: 88px; height: 88px; border-radius: 999px; object-fit: cover;
    border: 2px solid rgba(255,255,255,.2);
    box-shadow: 0 6px 18px rgba(0,0,0,.25);
  }

  .user-card h4 { margin: 0; color: #fff; font-weight: 900; letter-spacing: .2px; }
  .user-card p { margin: 0; color: rgba(255,255,255,.8); font-size: 13px; }

  nav { display: grid; gap: 8px; margin-top: 12px; }

  nav button {
    all: unset;
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px;
    color: #e5f1ff; font-weight: 800; cursor: pointer;
    border: 1px solid transparent; transition: .2s ease;
  }
  nav button:hover { background: rgba(255,255,255,.06); border-color: var(--line);}
  nav button.active {
    background: rgba(0,174,239,.14);
    border: 1px solid rgba(0,174,239,.4);
    color: #e2f4ff;
  }
`;

/* Sağ içerik alanı */
export const Content = styled.main`
  display: grid; gap: 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px;
  background: rgba(15,23,42,.65);
  backdrop-filter: blur(6px);
  box-shadow: 0 12px 40px rgba(0,0,0,.25);

  /* başlık şeridi (isteğe bağlı) */
  &:before {
    content: "Profil";
    display: inline-block;
    align-self: start;
    padding: 6px 10px;
    margin-bottom: 2px;
    border-radius: 999px;
    font-size: 12px; font-weight: 900; letter-spacing: .3px;
    color: #cfefff;
    background: rgba(0,85,164,.22);
    border: 1px solid rgba(0,85,164,.35);
    width: fit-content;
  }

  h2 { margin: 6px 0 8px; color: #e7f5ff; }
`;

/* Profil kartı (bilgi listesi) */
export const ProfileCard = styled.section`
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(2,6,23,.55);
  padding: 14px;
  display: grid; gap: 8px;
  box-shadow: 0 8px 30px rgba(0,0,0,.1);
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px dashed var(--line);

  &:last-child { border-bottom: none; }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.span`
  color: #9fb3c8;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .2px;
`;

export const Value = styled.span`
  color: #e7f5ff;
  font-weight: 700;
  word-break: break-word;
`;

/* Avatar seçim ızgarası */
export const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(96px,1fr));
  gap: 12px;
  margin-top: 8px;

  img, label {
    width: 100%; aspect-ratio: 1/1; object-fit: cover;
    border-radius: 14px; cursor: pointer;
    border: 2px solid transparent; transition: .2s ease;
    background: rgba(255,255,255,.06);
    display: grid; place-items: center; color: #cfefff;
    box-shadow: 0 6px 18px rgba(0,0,0,.15);
  }

  img:hover, label:hover { transform: translateY(-2px); }
  img.active { border-color: rgba(0,174,239,.6); box-shadow: 0 0 0 3px rgba(0,174,239,.2); }
  label.active { border-color: rgba(0,174,239,.6); box-shadow: 0 0 0 3px rgba(0,174,239,.2); }
`;

/* Boş avatar (upload) */
export const EmptyAvatarLabel = styled.label`
  font-size: 34px; font-weight: 900;
  border: 2px dashed rgba(148,163,184,.4) !important;
  background: rgba(148,163,184,.08) !important;
`;

/* Hesap işlemleri alanı */
export const DangerButton = styled.button`
  border: 1px solid rgba(239,68,68,.35);
  background: rgba(239,68,68,.12);
  color: #fecaca;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: .2s ease;
  &:hover { background: rgba(239,68,68,.18); }
`;

/* Küçük yardımcılar */
export const Section = styled.section`
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(2,6,23,.55);
  padding: 14px;
  display: grid; gap: 8px;
`;



export default Profile;
