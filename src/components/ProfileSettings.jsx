
import React, { useState } from 'react';
import styled from 'styled-components';


const ProfileSettings = ({ user }) => {
    const [email, setEmail] = useState(user?.email || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [notifications, setNotifications] = useState(user?.notifications || false);

    const [saving, setSaving] = useState(false);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/userSettings/profile/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, notifications }),
            });
            if (res.ok) {
                alert('Profil bilgileri güncellendi!');
            } else {
                alert('Bir hata oluştu.');
            }
        } catch {
            alert('Sunucu hatası.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            alert('Lütfen eski ve yeni şifreyi girin.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/userSettings/password/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            if (res.ok) {
                alert('Şifre değiştirildi!');
                setOldPassword('');
                setNewPassword('');
            } else {
                alert('Şifre değiştirilemedi. Eski şifreyi kontrol edin.');
            }
        } catch {
            alert('Sunucu hatası.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Wrapper>
            <Section>
                <h3>📧 Email Güncelle</h3>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <Label>
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={e => setNotifications(e.target.checked)}
                    />
                    Bildirimleri Aç
                </Label>
                <button onClick={handleSaveProfile} disabled={saving}>Kaydet</button>
            </Section>

            <Section>
                <h3>🔒 Şifre Değiştir</h3>
                <Input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="Eski Şifre"
                />
                <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Yeni Şifre"
                />
                <button onClick={handleChangePassword} disabled={saving}>Şifreyi Değiştir</button>
            </Section>
        </Wrapper>
    );
};

export default ProfileSettings;

const Wrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 400px;
`;

const Section = styled.div`
  background: #f1f5f9;
  padding: 20px;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px 12px;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 10px;
`;
