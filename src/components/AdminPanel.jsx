import React, { useEffect, useState } from 'react';
import { FaUsers, FaDollarSign, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [pricing, setPricing] = useState([]);
    const [loadingPricing, setLoadingPricing] = useState(true);
    const [newFeature, setNewFeature] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credits, setCredits] = useState(0);
    const [role, setRole] = useState('user');


    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanPrice, setNewPlanPrice] = useState('');
    const [newPlanFeaturesText, setNewPlanFeaturesText] = useState('');

    const admin = {
        name: 'Admin User',
        role: 'Super Admin',
        avatar: 'https://i.pravatar.cc/100'
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/register/list-users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingUsers(false);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/pricing')
            .then(res => res.json())
            .then(data => {
                setPricing(data);
                setLoadingPricing(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingPricing(false);
            });
    }, []);

    const totalUsers = users.length;
    const totalCredits = users.reduce((sum, user) => sum + (user.credits || 0), 0);

    const [deletedUsers, setDeletedUsers] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);

    const UserTable = ({ users, onDelete }) => (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#071f35' }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #071f35' }}>
                    <th style={tableHeaderCell}>ID</th>
                    <th style={tableHeaderCell}>Email</th>
                    <th style={tableHeaderCell}>Plan</th>
                    <th style={tableHeaderCell}>Last Login</th>
                    <th style={tableHeaderCell}>Created At</th>
                    <th style={tableHeaderCell}>Sil</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #071f35' }}>
                        <td style={tableCell}>{user.id}</td>
                        <td style={tableCell}>{user.email}</td>
                        <td style={tableCell}>{user.plan || '-'}</td>
                        <td style={tableCell}>{formatDate(user.last_login)}</td>
                        <td style={tableCell}>{formatDate(user.created_at)}</td>
                        <td style={tableCell}>
                            {onDelete ? (
                                <button
                                    onClick={() => onDelete(user.id)}
                                    style={{ cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px' }}
                                >
                                    ×
                                </button>
                            ) : (
                                '-'
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const fetchUsers = () => {
        setLoadingUsers(true);
        fetch('http://localhost:5000/api/adminpanel/list-users')
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingUsers(false);
            });
    };

    const fetchDeletedUsers = () => {
        fetch('http://localhost:5000/api/adminpanel/deleted-users')
            .then(res => res.json())
            .then(data => {
                setDeletedUsers(data);
                setShowDeleted(true);
            })
            .catch(err => {
                console.error(err);
                alert('Silinen kullanıcılar alınamadı');
            });
    };


    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/adminpanel/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, credits, role }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert('Hata: ' + (errorData.error || 'Kullanıcı eklenemedi'));
                return;
            }

            alert('Kullanıcı başarıyla eklendi');
            setEmail('');
            setPassword('');
            setCredits(0);
            setRole('user');
            fetchUsers();
        } catch (error) {
            alert('Bir hata oluştu');
            console.error(error);
        }
    };



    const handlePricingChange = (planIndex, field, value) => {
        const newPricing = [...pricing];
        if (field === 'features_bulk') {
            newPricing[planIndex].features = value
                .split('\n')
                .map(f => f.trim())
                .filter(f => f.length > 0);
        } else {
            if (field === 'price') {
                newPricing[planIndex][field] = Number(value);
            } else {
                newPricing[planIndex][field] = value;
            }
        }
        setPricing(newPricing);
    };

    const handleNewFeatureChange = (planIndex, value) => {
        setNewFeature(prev => ({ ...prev, [planIndex]: value }));
    };

    const addFeature = (planIndex) => {
        const featureToAdd = (newFeature[planIndex] || '').trim();
        if (!featureToAdd) return;

        const newPricing = [...pricing];
        newPricing[planIndex].features.push(featureToAdd);

        setPricing(newPricing);
        setNewFeature(prev => ({ ...prev, [planIndex]: '' }));
    };

    const removeFeature = (planIndex, featureIndex) => {
        const newPricing = [...pricing];
        newPricing[planIndex].features.splice(featureIndex, 1);
        setPricing(newPricing);
    };

    const addNewPlan = () => {
        if (!newPlanName.trim()) {
            alert('Plan adı boş olamaz');
            return;
        }
        const featuresArray = newPlanFeaturesText
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        const newPlan = {
            id: Date.now(),
            name: newPlanName.trim(),
            price: Number(newPlanPrice) || 0,
            features: featuresArray,
        };

        setPricing(prev => [...prev, newPlan]);

        setNewPlanName('');
        setNewPlanPrice('');
        setNewPlanFeaturesText('');
    };

    const savePricing = () => {
        fetch('http://localhost:5000/api/pricing', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pricing),
        })
            .then(res => {
                if (!res.ok) throw new Error('Fiyatlar kaydedilemedi');
                return res.json();
            })
            .then(data => {
                setPricing(data);
                alert('Fiyatlar başarıyla güncellendi!');
            })
            .catch(err => alert(err.message));
    };
    const deleteUser = (userId) => {
        fetch(`http://localhost:5000/api/adminpanel/delete-user/${userId}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (!res.ok) throw new Error('Silme işlemi başarısız');
                return res.json();
            })
            .then(data => {
                alert(data.message);

                fetchUsers();
            })
            .catch(err => alert(err.message));
    };




    return (
        <div className='admin' style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <nav style={sidebarStyle}>
                <div style={adminCardStyle}>
                    <img src={admin.avatar} alt="avatar" style={avatarStyle} />
                    <div>
                        <h3 style={{ margin: '0', color: '#d1eaff' }}>{admin.name}</h3>
                        <p style={{ margin: '0', color: '#227BBF' }}>{admin.role}</p>
                    </div>
                </div>

                <MenuItem icon={<FaUsers />} text="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <MenuItem icon={<FaUsers />} text="Kullanıcılar" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <MenuItem icon={<FaFileInvoiceDollar />} text="Fiyatları Kontrol Et" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
                <MenuItem icon={<FaCogs />} text="Ayarlar" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </nav>

            <main style={{ flexGrow: 1, padding: '2rem', overflowY: 'auto' }}>
                {(loadingUsers || loadingPricing) ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <>
                                <h1 style={{ color: '#071f35' }}>Dashboard</h1>
                                <div style={cardsContainerStyle}>
                                    <DashboardCard icon={<FaUsers color="#227BBF" />} title="Toplam Kullanıcı" value={totalUsers} />
                                    <DashboardCard icon={<FaDollarSign color="#227BBF" />} title="Toplam Kredi" value={totalCredits} />
                                    {pricing.map(plan => (
                                        <DashboardCard
                                            key={plan.id}
                                            icon={<FaDollarSign color="#227BBF" />}
                                            title={plan.name}
                                            value={`$${plan.price}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {activeTab === 'users' && (
                            <>
                                <h1 style={{ color: '#071f35' }}>Kullanıcı Ekle</h1>
                                <form onSubmit={handleAddUser} style={{ marginBottom: '2rem' }}>
                                    <input
                                        type="email"
                                        placeholder="E-posta"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        style={{ marginRight: '10px' }}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Şifre"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        style={{ marginRight: '10px' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Kredi"
                                        value={credits}
                                        onChange={e => setCredits(Number(e.target.value))}
                                        style={{ marginRight: '10px', width: '80px' }}
                                    />
                                    <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: '10px' }}>
                                        <option value="user">Kullanıcı</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button type="submit">Ekle</button>
                                </form>

                                <h1 style={{ color: '#071f35' }}>Kullanıcı Listesi</h1>
                                {loadingUsers ? (
                                    <p>Yükleniyor...</p>
                                ) : (
                                    <UserTable users={users} onDelete={deleteUser} />
                                )}

                                <button
                                    onClick={fetchDeletedUsers}
                                    style={{ marginTop: '1rem', padding: '8px 12px', cursor: 'pointer' }}
                                >
                                    Silinenleri Göster
                                </button>

                                {showDeleted && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h2 style={{ color: '#071f35' }}>Silinen Kullanıcılar</h2>
                                        <UserTable users={deletedUsers} />
                                    </div>
                                )}
                            </>
                        )}



                        {activeTab === 'pricing' && (
                            <div>
                                <h1 style={{ color: '#071f35' }}>Fiyatları Kontrol Et</h1>
                                {pricing.map((plan, index) => (
                                    <div key={plan.id} style={{ marginBottom: '25px', paddingBottom: '10px', borderBottom: '1px solid #3ec6ff' }}>
                                        <label style={{ color: '#071f35' }}>
                                            Plan Adı:{' '}
                                            <input
                                                type="text"
                                                value={plan.name}
                                                onChange={e => handlePricingChange(index, 'name', e.target.value)}
                                                style={inputStyle}
                                            />
                                        </label>
                                        <label style={{ marginLeft: '20px', color: '#071f35' }}>
                                            Fiyat:{' '}
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={e => handlePricingChange(index, 'price', e.target.value)}
                                                style={{ ...inputStyle, width: '80px' }}
                                            />
                                        </label>

                                        <div>
                                            <label style={{ marginTop: '10px', color: '#071f35', display: 'block' }}>
                                                Özellik Ekle:
                                            </label>
                                            <div style={{ display: 'flex', marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    value={newFeature[index] || ''}
                                                    onChange={e => handleNewFeatureChange(index, e.target.value)}
                                                    placeholder="Özellik gir"
                                                    style={inputStyle}
                                                />
                                                <button
                                                    onClick={() => addFeature(index)}
                                                    style={{ marginLeft: '10px', ...toggleButtonStyle }}
                                                >
                                                    Ekle
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {plan.features.map((feature, fIndex) => (
                                                    <div key={fIndex} style={chipStyle}>
                                                        {feature}
                                                        <span
                                                            onClick={() => removeFeature(index, fIndex)}
                                                            style={{ marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                                        >
                                                            ×
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div style={{ marginTop: '30px', padding: '10px', border: '1px solid #3ec6ff', borderRadius: '10px' }}>
                                    <h2 style={{ color: '#071f35' }}>Yeni Plan Ekle</h2>
                                    <label style={{ color: '#071f35' }}>
                                        Plan Adı:{' '}
                                        <input
                                            type="text"
                                            value={newPlanName}
                                            onChange={e => setNewPlanName(e.target.value)}
                                            style={inputStyle}
                                            placeholder="Yeni plan adı"
                                        />
                                    </label>
                                    <label style={{ marginLeft: '20px', color: '#071f35' }}>
                                        Fiyat:{' '}
                                        <input
                                            type="number"
                                            value={newPlanPrice}
                                            onChange={e => setNewPlanPrice(e.target.value)}
                                            style={{ ...inputStyle, width: '80px' }}
                                            placeholder="0"
                                        />
                                    </label>
                                    <label style={{ display: 'block', marginTop: '10px', color: '#071f35' }}>
                                        Özellikler (her satıra bir özellik):
                                    </label>
                                    <textarea
                                        value={newPlanFeaturesText}
                                        onChange={e => setNewPlanFeaturesText(e.target.value)}
                                        style={textareaStyle}
                                        placeholder="Özellikleri yazın..."
                                        rows={4}
                                    />

                                    <button
                                        onClick={addNewPlan}
                                        style={{ ...saveButtonStyle, marginTop: '10px' }}
                                    >
                                        Yeni Plan Ekle
                                    </button>
                                </div>

                                <button
                                    onClick={savePricing}
                                    style={{ ...saveButtonStyle, marginTop: '30px' }}
                                >
                                    Fiyatları Kaydet
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h1 style={{ color: '#071f35' }}>Ayarlar</h1>
                                <p style={{ color: '#071f35' }}>Admin panel ayarları burada olabilir.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return ` ${hours}.${minutes} ${day}.${month}.${year}`;
}

const UserTable = ({ users, onDelete }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#071f35' }}>
        <thead>
            <tr style={{ borderBottom: '2px solid #071f35' }}>
                <th style={tableHeaderCell}>ID</th>
                <th style={tableHeaderCell}>Email</th>
                <th style={tableHeaderCell}>Plan</th>
                <th style={tableHeaderCell}>Last Login</th>
                <th style={tableHeaderCell}>Created At</th>
                <th style={tableHeaderCell}>Sil</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #071f35' }}>
                    <td style={tableCell}>{user.id}</td>
                    <td style={tableCell}>{user.email}</td>
                    <td style={tableCell}>{user.plan}</td>
                    <td style={tableCell}>{formatDate(user.last_login)}</td>
                    <td style={tableCell}>{formatDate(user.created_at)}</td>
                    <td style={tableCell}>
                        <button onClick={() => onDelete(user.id)} style={{ cursor: 'pointer' }}>✖</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);


const inputStyle = {
    marginLeft: '10px',
    backgroundColor: '#227BBF',
    border: '1px solid #3ec6ff',
    color: '#071f35',
    borderRadius: '5px',
    padding: '5px 10px'
};

const textareaStyle = {
    marginTop: '10px',
    display: 'block',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#227BBF',
    border: '1px solid #3ec6ff',
    color: '#071f35',
    borderRadius: '5px',
    padding: '10px'
};

const chipStyle = {
    background: '#3ec6ff',
    color: '#0a1f44',
    padding: '5px 10px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center'
};

const toggleButtonStyle = {
    backgroundColor: '#3ec6ff',
    border: 'none',
    color: '#fff',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer'
};

const saveButtonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#1db4ff',
    border: 'none',
    color: '#0a1f44',
    fontWeight: '700',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease'
};

const MenuItem = ({ icon, text, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            backgroundColor: active ? '#1db4ff' : 'transparent',
            color: active ? '#0a1f44' : '#cde6ff',
            border: 'none',
            padding: '15px 20px',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: active ? '700' : '500',
            borderRadius: '8px',
            marginBottom: '10px',
            transition: 'background-color 0.3s ease',
        }}
    >
        {icon}
        <span>{text}</span>
    </button>
);

const DashboardCard = ({ icon, title, value }) => (
    <div
        style={{
            backgroundColor: '#227BBF',
            borderRadius: '15px',
            padding: '1.5rem',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 0 10px rgba(30,144,255,0.5)',
            minWidth: '200px',
            color: '#071f35',
        }}
    >
        <div>{icon}</div>
        <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>{value}</p>
        </div>
    </div>
);

const sidebarStyle = {
    width: '240px',
    backgroundColor: '#0f1f44',
    color: '#cde6ff',
    padding: '2rem 1rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
};

const adminCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '2rem',
};

const avatarStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
};

const tableHeaderCell = {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    color: '#071f35',
};

const tableCell = {
    padding: '12px',
};

const cardsContainerStyle = {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
};

export default AdminPanel;
