
import React from 'react';

const AddUserModal = ({ visible, onClose, email, setEmail, password, setPassword, credits, setCredits, role, setRole, handleAddUser }) => {
    if (!visible) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>Kullanıcı Ekle</h2>
                <form onSubmit={handleAddUser} aria-label="add-user-form">
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Kredi"
                        value={credits}
                        onChange={e => setCredits(Number(e.target.value))}
                        style={inputStyle}
                    />
                    <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                        <button type="submit" style={buttonStyle}>Ekle</button>
                        <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#ccc' }}>İptal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;


const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};
const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
};
const inputStyle = {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '8px',
    fontSize: '14px',
};
const buttonStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#227BBF',
    color: 'white',
};
