import React, { useEffect, useState } from 'react';
import { FaUsers, FaDollarSign, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa';
import AddUserModal from './AddUserModal';
import Swal from 'sweetalert2';
import UserDataGrid from './UserDataGrid';
import Silbuton from './Silbuton';


const AdminPanel = () => {


    const [showAddRoleForm, setShowAddRoleForm] = useState({}); // planIndex: bool
    const [newRolePerPlan, setNewRolePerPlan] = useState({});
    const [newRoleCountPerPlan, setNewRoleCountPerPlan] = useState({});
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedPlanForRoleAdd, setSelectedPlanForRoleAdd] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [newRoleCount, setNewRoleCount] = useState(0);


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
    const [newPlanRTLimit, setNewPlanRTLimit] = useState(0);
    const [newPlanStaticLimit, setNewPlanStaticLimit] = useState(0);


    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanPrice, setNewPlanPrice] = useState('');
    const [newPlanFeaturesText, setNewPlanFeaturesText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [showNewPlanForm, setShowNewPlanForm] = React.useState(false);

    const [newPlanMaxFileSize, setNewPlanMaxFileSize] = useState(0);

    const admin = {
        name: 'Admin User',
        role: 'Super Admin',
        avatar: 'https://i.pravatar.cc/100'
    };

    const toggleAddRoleForm = (index) => {
        setShowAddRoleForm(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };


    const handleRoleCountChange = (planIndex, roleIndex, count) => {
        setPricing(prev => {
            // Kopya oluştur
            const updated = prev.map((plan, i) => {
                if (i === planIndex) {
                    // Rol listesinin kopyasını oluştur
                    const newRoles = plan.roles ? [...plan.roles] : [];
                    newRoles[roleIndex] = {
                        ...newRoles[roleIndex],
                        count: count,
                    };
                    return { ...plan, roles: newRoles };
                }
                return plan;
            });
            return updated;
        });
    };

    const removeRole = (planIndex, roleIndex) => {
        setPricing(prev => {
            const updated = prev.map((plan, i) => {
                if (i === planIndex) {
                    const newRoles = [...(plan.roles || [])];
                    newRoles.splice(roleIndex, 1);
                    return { ...plan, roles: newRoles };
                }
                return plan;
            });
            return updated;
        });
    };




    const deletePlan = (planIndex) => {
        Swal.fire({
            title: 'Planı silmek istediğinize emin misiniz?',
            text: "Bu işlem geri alınamaz!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Evet, sil!',
            cancelButtonText: 'İptal'
        }).then((result) => {
            if (result.isConfirmed) {
                const newPricing = [...pricing];
                newPricing.splice(planIndex, 1);
                setPricing(newPricing);

                Swal.fire(
                    'Silindi!',
                    'Plan başarıyla silindi.',
                    'success'
                );
            }
        });
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




    const fetchUsers = () => {
        setLoadingUsers(true);
        fetch('http://localhost:5000/api/adminpanel/list-users')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched users after delete:", data);
                setUsers(data);
                setLoadingUsers(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingUsers(false);
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
        if (field === 'rt_url_limit' || field === 'static_url_limit') {
            newPricing[planIndex][field] = Number(value);
        }

        else if (field === 'features_bulk') {
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
            rt_url_limit: Number(newPlanRTLimit),
            static_url_limit: Number(newPlanStaticLimit),
            max_file_size: Number(newPlanMaxFileSize) || 0,
            roles: []
        };


        setPricing(prev => [...prev, newPlan]);

        setNewPlanName('');
        setNewPlanPrice('');
        setNewPlanFeaturesText('');
    };
    function addRoleToPlan(planIndex, role, count) {
        if (!role || count <= 0) return;

        setPricing(prev => {
            const newPricing = prev.map((plan, i) => {
                if (i !== planIndex) return plan;

                const roles = plan.roles ? [...plan.roles] : [];
                const roleIndex = roles.findIndex(r => r.role === role);

                if (roleIndex >= 0) {
                    const updatedRole = {
                        ...roles[roleIndex],
                        count: roles[roleIndex].count + count,
                    };
                    const updatedRoles = [...roles];
                    updatedRoles[roleIndex] = updatedRole;
                    return { ...plan, roles: updatedRoles };
                } else {
                    return { ...plan, roles: [...roles, { role, count }] };
                }
            });
            return newPricing;
        });

        setShowRoleModal(false);
        setNewRole('');
        setNewRoleCount(0);
    }

    const updateUserRoles = async (userId, roles) => {
        try {
            const response = await fetch(`/api/users/update-user-roles/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roles }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Güncelleme başarısız');
            alert('Roller başarıyla güncellendi');
        } catch (error) {
            alert('Hata: ' + error.message);
        }
    };


    const savePricing = () => {
        console.log('SAVE PRICING GÖNDERİLEN:', pricing);

        fetch('http://localhost:5000/api/pricing', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pricing),
        })
            .then(res => {
                if (!res.ok) throw new Error('Fiyatlar kaydedilemedi');
                return res.json();
            })
            .then(data => {
                console.log('BACKENDTEN DÖNEN:', data);
                setPricing(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı!',
                    text: 'Fiyatlar başarıyla güncellendi!',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Tamam'
                });

            })
            .catch(err => alert(err.message));
    };






    return (
        <div
            className="admin"
            style={{
                display: "flex",
                height: "100vh",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <nav style={sidebarStyle}>
                <div style={adminCardStyle}>
                    <img src={admin.avatar} alt="avatar" style={avatarStyle} />
                    <div>
                        <h3 style={{ margin: "0", color: "#d1eaff" }}>{admin.name}</h3>
                        <p style={{ margin: "0", color: "#227BBF" }}>{admin.role}</p>
                    </div>
                </div>

                <MenuItem
                    icon={<FaUsers />}
                    text="Dashboard"
                    active={activeTab === "dashboard"}
                    onClick={() => setActiveTab("dashboard")}
                />
                <MenuItem
                    icon={<FaUsers />}
                    text="Kullanıcılar"
                    active={activeTab === "users"}
                    onClick={() => setActiveTab("users")}
                />
                <MenuItem
                    icon={<FaFileInvoiceDollar />}
                    text="Fiyatları Kontrol Et"
                    active={activeTab === "pricing"}
                    onClick={() => setActiveTab("pricing")}
                />
                <MenuItem
                    icon={<FaCogs />}
                    text="Ayarlar"
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                />
            </nav>

            <main style={{ flexGrow: 1, padding: "2rem", overflowY: "auto" }}>
                {(loadingUsers || loadingPricing) ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <>
                        {activeTab === "dashboard" && (
                            <>
                                <h1 style={{ color: "#071f35" }}>Dashboard</h1>
                                <div style={cardsContainerStyle}>
                                    <DashboardCard
                                        icon={<FaUsers color="#227BBF" />}
                                        title="Toplam Kullanıcı"
                                        value={totalUsers}
                                    />
                                    <DashboardCard
                                        icon={<FaDollarSign color="#227BBF" />}
                                        title="Toplam Kredi"
                                        value={totalCredits}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === "users" && (
                            <>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    style={{
                                        fontSize: "18px",
                                        padding: "8px 16px",
                                        marginBottom: "1rem",
                                        backgroundColor: "#446d92",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    + Kullanıcı Ekle
                                </button>

                                <AddUserModal
                                    visible={modalOpen}
                                    onClose={() => setModalOpen(false)}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    credits={credits}
                                    setCredits={setCredits}
                                    role={role}
                                    setRole={setRole}
                                    handleAddUser={handleAddUser}
                                />

                                <h1 style={{ color: "#071f35" }}>Kullanıcı Listesi</h1>
                                {loadingUsers ? (
                                    <p>Yükleniyor...</p>
                                ) : (
                                    <UserDataGrid users={users} fetchUsers={fetchUsers} />
                                )}
                            </>
                        )}

                        {activeTab === "pricing" && (
                            <div>
                                <button
                                    onClick={() => setShowNewPlanForm(true)}
                                    style={{
                                        fontSize: "18px",
                                        padding: "8px 16px",
                                        marginBottom: "1rem",
                                        backgroundColor: "#446d92",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    + Yeni Plan Ekle
                                </button>

                                <h1 style={{ color: "#071f35", marginBottom: "1.5rem" }}>
                                    Fiyatları Kontrol Et
                                </h1>

                                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                    {pricing.map((plan, index) => (
                                        <div
                                            key={plan.id}
                                            style={{
                                                backgroundColor: "#446d92",
                                                padding: "1.5rem 2rem",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                border: "1px solid #cce4ff",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "1.5rem",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <label
                                                    style={{
                                                        flex: "1 1 200px",
                                                        color: "#071f35",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Plan Adı:
                                                    <input
                                                        type="text"
                                                        value={plan.name}
                                                        onChange={(e) =>
                                                            handlePricingChange(index, "name", e.target.value)
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginTop: "0.25rem",
                                                        }}
                                                    />
                                                </label>

                                                <label
                                                    style={{
                                                        flex: "0 0 120px",
                                                        color: "#071f35",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Fiyat:
                                                    <input
                                                        type="number"
                                                        value={plan.price}
                                                        onChange={(e) =>
                                                            handlePricingChange(index, "price", e.target.value)
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginTop: "0.25rem",
                                                        }}
                                                    />
                                                </label>

                                                <label
                                                    style={{
                                                        flex: "0 0 120px",
                                                        color: "#071f35",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    RT Limit:
                                                    <input
                                                        type="number"
                                                        value={plan.rt_url_limit || 0}
                                                        onChange={(e) =>
                                                            handlePricingChange(index, "rt_url_limit", Number(e.target.value))
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginTop: "0.25rem",
                                                        }}
                                                    />
                                                </label>

                                                <label
                                                    style={{
                                                        flex: "0 0 120px",
                                                        color: "#071f35",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Static Limit:
                                                    <input
                                                        type="number"
                                                        value={plan.static_url_limit || 0}
                                                        onChange={(e) =>
                                                            handlePricingChange(index, "static_url_limit", Number(e.target.value))
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginTop: "0.25rem",
                                                        }}
                                                    />
                                                </label>
                                                <label
                                                    style={{
                                                        flex: "0 0 120px",
                                                        color: "#071f35",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Dosya Boyutu:
                                                    <input
                                                        type="number"
                                                        value={plan.max_file_size || 0}
                                                        onChange={(e) =>
                                                            handlePricingChange(index, "max_file_size", Number(e.target.value))
                                                        }
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginTop: "0.25rem",
                                                        }}
                                                        placeholder="MB"
                                                    />
                                                </label>
                                                {plan.roles && plan.roles.map((r, i) => (
                                                    <div
                                                        key={i}
                                                        style={roleRowStyle}

                                                    >
                                                        <span style={roleNameStyle}>{r.role}</span>
                                                        <input
                                                            type="number"
                                                            value={r.count}
                                                            min={0}
                                                            onChange={e => handleRoleCountChange(index, i, Number(e.target.value))}
                                                            style={roleCountInputStyle}
                                                        />
                                                        <Silbuton onClick={() => removeRole(index, i)}>Sil</Silbuton>
                                                    </div>
                                                ))}

                                                <button
                                                    onClick={() => {
                                                        setSelectedPlanForRoleAdd(index);
                                                        setShowRoleModal(true);
                                                        setNewRole('');
                                                        setNewRoleCount(0);
                                                    }}
                                                    style={addRoleButtonStyle}
                                                >
                                                    Rol Ekle
                                                </button>



                                                <Silbuton
                                                    onClick={() => deletePlan(index)}
                                                    style={{
                                                        marginLeft: "auto",
                                                        backgroundColor: "#d33",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontWeight: "600",
                                                        marginTop: '10px'
                                                    }}
                                                >
                                                    Sil
                                                </Silbuton>
                                            </div>
                                        </div>
                                    ))}
                                    {showRoleModal && (
                                        <div style={{
                                            position: 'fixed',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 9999,
                                        }}>
                                            <div style={textareaStyle} >
                                                <h3>Rol Ekle</h3>
                                                <select value={newRole} onChange={e => setNewRole(e.target.value)} style={selectStyle}>
                                                    <option value="">Rol Seç</option>
                                                    <option value="viewer">Viewer</option>
                                                    <option value="editor">Editor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={newRoleCount}
                                                    onChange={e => setNewRoleCount(Number(e.target.value))}
                                                    placeholder="Kişi Sayısı"
                                                    style={inputStyle}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    <button onClick={() => setShowRoleModal(false)}>İptal</button>
                                                    <button onClick={() => {
                                                        if (selectedPlanForRoleAdd !== null) {
                                                            addRoleToPlan(selectedPlanForRoleAdd, newRole, newRoleCount);

                                                        }
                                                    }}>Ekle</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {showNewPlanForm && (
                                        <div
                                            style={{
                                                backgroundColor: "#446d92",
                                                padding: "1.5rem 2rem",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                border: "1px solid #cce4ff",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            <h2 style={{ marginBottom: "1rem", color: "#071f35" }}>Yeni Plan Ekle</h2>


                                            <label
                                                style={{
                                                    flex: "1 1 200px",
                                                    color: "#071f35",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Plan Adı:
                                                <input
                                                    type="text"
                                                    value={newPlanName}
                                                    onChange={(e) => setNewPlanName(e.target.value)}
                                                    style={{
                                                        ...inputStyle,
                                                        width: "100%",
                                                        marginTop: "0.25rem",
                                                    }}
                                                />
                                            </label>

                                            <label
                                                style={{
                                                    flex: "0 0 120px",
                                                    color: "#071f35",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Fiyat:
                                                <input
                                                    type="number"
                                                    value={newPlanPrice}
                                                    onChange={(e) => setNewPlanPrice(e.target.value)}
                                                    style={{ ...inputStyle, width: "100%", marginTop: "0.25rem" }}
                                                />
                                            </label>

                                            <label
                                                style={{
                                                    flex: "0 0 120px",
                                                    color: "#071f35",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                RT Limit:
                                                <input
                                                    type="number"
                                                    value={newPlanRTLimit}
                                                    onChange={(e) => setNewPlanRTLimit(e.target.value)}
                                                    style={{ ...inputStyle, width: "100%", marginTop: "0.25rem" }}
                                                />
                                            </label>

                                            <label
                                                style={{
                                                    flex: "0 0 120px",
                                                    color: "#071f35",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Static Limit:
                                                <input
                                                    type="number"
                                                    value={newPlanStaticLimit}
                                                    onChange={(e) => setNewPlanStaticLimit(e.target.value)}
                                                    style={{ ...inputStyle, width: "100%", marginTop: "0.25rem" }}
                                                    placeholder="0"
                                                />
                                            </label>
                                            <label
                                                style={{
                                                    flex: "0 0 120px",
                                                    color: "#071f35",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Maks. Dosya Boyutu:
                                                <input
                                                    type="number"
                                                    value={newPlanMaxFileSize}
                                                    onChange={(e) => setNewPlanMaxFileSize(e.target.value)}
                                                    style={{
                                                        ...inputStyle,
                                                        width: "100%",
                                                        marginTop: "0.25rem",
                                                    }}
                                                    placeholder="MB"
                                                />
                                            </label>


                                            <button
                                                onClick={() => {
                                                    addNewPlan();
                                                    setShowNewPlanForm(false);
                                                }}
                                                style={{
                                                    ...saveButtonStyle,
                                                    marginTop: "1rem",
                                                    backgroundColor: "#446d92",
                                                    color: "#fff",
                                                }}
                                            >
                                                Yeni Plan Ekle
                                            </button>

                                            <button
                                                onClick={() => setShowNewPlanForm(false)}
                                                style={{
                                                    marginTop: "1rem",
                                                    marginLeft: "1rem",
                                                    backgroundColor: "#999",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    )}


                                    <button
                                        onClick={savePricing}
                                        style={{
                                            ...saveButtonStyle,
                                            backgroundColor: "#446d92",
                                            color: "#fff",
                                            maxWidth: "200px",
                                            alignSelf: "flex-start",
                                            marginTop: "2rem",
                                        }}
                                    >
                                        Fiyatları Kaydet
                                    </button>
                                </div>
                            </div>
                        )}


                        {activeTab === "settings" && (
                            <div>
                                <h1 style={{ color: "#071f35" }}>Ayarlar</h1>
                                <p style={{ color: "#071f35" }}>Admin panel ayarları burada olabilir.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div >
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
                    <div>
                        <b>Roller:</b>
                        {user.roles && user.roles.length > 0 ? (
                            user.roles.map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span>{r.role}</span>
                                    <span>(Adet: {r.count})</span>
                                </div>
                            ))
                        ) : (
                            <span>Rol yok</span>
                        )}
                    </div>
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
    backgroundColor: '#d9e8ff',
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
    backgroundColor: 'white',
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
const roleRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d9e8ff",
    padding: "8px 12px",
    borderRadius: "8px",
    marginTop: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    fontWeight: "600",
    color: "#034078",
};

const roleNameStyle = {
    flex: 1,
    fontWeight: "700",
    fontSize: "14px",
};

const roleCountInputStyle = {
    width: "60px",
    borderRadius: "6px",
    border: "1px solid #7baaf7",
    padding: "4px 8px",
    fontWeight: "500",
    color: "#034078",
    backgroundColor: "#f0f7ff",
    outline: "none",
    transition: "border-color 0.3s",
};

const roleCountInputFocus = {
    borderColor: "#1e40af",
};


const addRoleFormStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginTop: "16px",
    backgroundColor: "#f0f7ff",
    padding: "12px 16px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const selectStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #7baaf7",
    backgroundColor: "white",
    color: "#034078",
    fontWeight: "600",
    minWidth: "120px",
    cursor: "pointer",
    transition: "border-color 0.3s",
};



const addRoleButtonStyle = {
    backgroundColor: "#446d92",
    color: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(68,109,146,0.7)",
    transition: "background-color 0.3s",
};

const addRoleButtonHover = {
    backgroundColor: "#35577d",
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