import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const SettingTab = () => {
    const [keys, setKeys] = useState([]);
    const [newKey, setNewKey] = useState('');
    const [newType, setNewType] = useState('number');
    const [newDescription, setNewDescription] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:5000/api/setting-key';

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Liste alınamadı');
            const data = await res.json();
            setKeys(data);
        } catch (error) {
            console.error('Keyler çekilirken hata:', error);
            alert('Keyler çekilirken hata oluştu');
        }
        setLoading(false);
    };

    const addKey = async () => {
        const trimmedKey = newKey.trim();

        if (!trimmedKey) {
            return alert('Key boş olamaz!');
        }

        if (keys.some(k => k.key_name === trimmedKey)) {
            return Swal.fire({
                title: 'Bu key zaten var!',
                text: 'Lütfen farklı bir key adı girin.',
                icon: 'warning',
                confirmButtonText: 'Tamam',
            });
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key_name: trimmedKey,
                    type: newType,
                    description: newDescription.trim(),
                }),
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.error || 'Key eklenemedi!');
                return;
            }

            Swal.fire('Başarılı!', 'Key başarıyla eklendi.', 'success');
            setNewKey('');
            setNewType('number');
            setNewDescription('');
            setShowModal(false);
            fetchKeys();
        } catch (error) {
            console.error('Key eklenirken hata:', error);
            alert('Key eklenirken sunucu hatası oluştu.');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Silmek istediğinize emin misiniz?',
            text: 'Bu işlem geri alınamaz!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal',
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Silme başarısız');
                await fetchKeys();
                Swal.fire('Silindi!', 'Key başarıyla silindi.', 'success');
            } catch (err) {
                console.error('Silme hatası:', err);
                Swal.fire('Hata!', 'Silme işlemi başarısız oldu.', 'error');
            }
        }
    };

    const thStyle = { padding: '8px', border: '1px solid #ddd' };
    const tdStyle = { padding: '8px', border: '1px solid #ddd' };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Admin - Key ve Tip Ekle</h2>

            <button
                onClick={() => setShowModal(true)}
                style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#28a745',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '15px',
                }}
                title="Yeni Key Ekle"
            >
                +
            </button>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '10px',
                    }}
                >
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <th style={thStyle}>Key</th>
                            <th style={thStyle}>Tip</th>
                            <th style={thStyle}>Açıklama</th>
                            <th style={thStyle}>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '10px' }}>
                                    Tanımlı key yok.
                                </td>
                            </tr>
                        ) : (
                            keys.map(({ id, key_name, type, description }) => (
                                <tr key={id}>
                                    <td style={tdStyle}>{key_name}</td>
                                    <td style={tdStyle}>{type}</td>
                                    <td style={tdStyle}>{description || '-'}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleDelete(id)}
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '6px',
                            width: '320px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                    >
                        <h3>Yeni Key Ekle</h3>

                        <input
                            type="text"
                            placeholder="Key adı"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />

                        <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        >
                            <option value="number">Number</option>
                            <option value="string">String</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Açıklama (description)"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    marginRight: '10px',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={addKey}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingTab;
