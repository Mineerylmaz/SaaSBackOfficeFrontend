import React, { useEffect, useState } from 'react';
import { FaUsers, FaDollarSign, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [pricing, setPricing] = useState([]);
    const [loadingPricing, setLoadingPricing] = useState(true);

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

    const handlePricingChange = (index, field, value) => {
        const newPricing = [...pricing];
        if (field === 'price') {
            newPricing[index][field] = Number(value);
        } else {
            newPricing[index][field] = value;
        }
        setPricing(newPricing);
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

    return (
        <div className='admin' style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}>
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
                                <h1 style={{ color: '#a9d1ff' }}>Dashboard</h1>
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
                                <h1 style={{ color: '#a9d1ff' }}>Kullanıcı Listesi</h1>
                                <UserTable users={users} />
                            </>
                        )}

                        {activeTab === 'pricing' && (
                            <div>
                                <h1 style={{ color: '#a9d1ff' }}>Fiyatları Kontrol Et</h1>
                                {pricing.map((plan, index) => (
                                    <div key={plan.id} style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#cde6ff' }}>
                                            Plan Adı:{' '}
                                            <input
                                                type="text"
                                                value={plan.name}
                                                onChange={e => handlePricingChange(index, 'name', e.target.value)}
                                                style={{
                                                    marginLeft: '10px',
                                                    backgroundColor: '#227BBF',
                                                    border: '1px solid #3ec6ff',
                                                    color: '#cde6ff',
                                                    borderRadius: '5px',
                                                    padding: '5px 10px'
                                                }}
                                            />

                                        </label>
                                        <label style={{ marginLeft: '20px', color: '#cde6ff' }}>
                                            Fiyat:{' '}
                                            <input
                                                type="number"
                                                value={plan.price}
                                                onChange={e => handlePricingChange(index, 'price', e.target.value)}
                                                style={{
                                                    marginLeft: '10px',
                                                    width: '80px',
                                                    backgroundColor: '#227BBF',
                                                    border: '1px solid #3ec6ff',
                                                    color: '#cde6ff',
                                                    borderRadius: '5px',
                                                    padding: '5px 10px'
                                                }}
                                            />
                                        </label>
                                        <label style={{ marginLeft: '20px', color: '#cde6ff' }}>
                                            Özellikler:{' '}
                                            <input
                                                type="text"
                                                value={plan.features}
                                                onChange={e => handlePricingChange(index, 'features', e.target.value)}
                                                style={{
                                                    marginLeft: '10px',
                                                    width: '200px',
                                                    backgroundColor: '#227BBF',
                                                    border: '1px solid #3ec6ff',
                                                    color: '#cde6ff',
                                                    borderRadius: '5px',
                                                    padding: '5px 10px'
                                                }}
                                            />
                                        </label>

                                    </div>
                                ))}

                                <button
                                    onClick={savePricing}
                                    style={{
                                        marginTop: '20px',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        backgroundColor: '#1db4ff',
                                        border: 'none',
                                        color: '#0a1f44',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#3ec6ff')}
                                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1db4ff')}
                                >
                                    Fiyatları Kaydet
                                </button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h1 style={{ color: '#a9d1ff' }}>Ayarlar</h1>
                                <p style={{ color: '#cde6ff' }}>Admin panel ayarları burada olabilir.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
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
            color: '#cde6ff',
        }}
    >
        <div>{icon}</div>
        <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>{value}</p>
        </div>
    </div>
);

const UserTable = ({ users }) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#cde6ff' }}>
        <thead>
            <tr style={{ borderBottom: '2px solid #1db4ff' }}>
                <th style={tableHeaderCell}>ID</th>
                <th style={tableHeaderCell}>Email</th>
                <th style={tableHeaderCell}>Plan</th>
                <th style={tableHeaderCell}>last_login</th>
                <th style={tableHeaderCell}>created-at</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #227BBF' }}>
                    <td style={tableCell}>{user.id}</td>
                    <td style={tableCell}>{user.email}</td>
                    <td style={tableCell}>{user.plan}</td>
                    <td style={tableCell}>{user.last_login}</td>
                    <td style={tableCell}>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
            ))}
        </tbody>
    </table>
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
    color: '#a9d1ff',
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
