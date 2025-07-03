import { useState } from 'react';

export default function AddUserForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credits, setCredits] = useState(0);
    const [role, setRole] = useState('user');

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch('http://localhost:5000/api/admin/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, credits, role }),
        });

        alert('kişi eklendi');
    };


    const handlerole = (e) => {
        const rol = e.target.value;
        setRole(rol);
        if (rol === 'admin') {
            alert('admin seçildi');
        }
        else {
            alert('kullanıcı seçildi')
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} type='email' required />
            <input placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} type="password" />
            <input placeholder="Kredi" type="number" value={credits} onChange={e => setCredits(e.target.value)} />
            <select value={role} onChange={handlerole}>
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit" >{role === 'admin' ? 'admin ekle' : 'kullanıcı ekle'}</button>
        </form>
    );
}

