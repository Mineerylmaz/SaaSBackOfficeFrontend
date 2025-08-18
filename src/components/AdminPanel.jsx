import React, { useEffect, useState } from 'react';
import { FaUsers, FaDollarSign, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa';
import AddUserModal from './AddUserModal';
import Swal from 'sweetalert2';
import UserDataGrid from './UserDataGrid';
import Silbuton from './Silbuton';
import SettingTab from './SettingTab';
import '../styles/Panel.css'
import { useSearchParams } from "react-router-dom";
import styled from 'styled-components';
const AdminPanel = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get("tab") || "dashboard";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [totalRemainingCredits, setTotalRemainingCredits] = useState(0);
    const [newPlanplan_limitInputs, setNewPlanplan_limitInputs] = useState({});
    const [newplan_limitKey, setNewplan_limitKey] = useState(''); // Yeni plan_limit türü için input


    const [keys, setKeys] = useState([

        { key: 'durak', type: 'number' },
        { key: 'planAdi', type: 'string' },
    ]);

    const [showAddRoleForm, setShowAddRoleForm] = useState({});
    const [newRolePerPlan, setNewRolePerPlan] = useState({});

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedPlanForRoleAdd, setSelectedPlanForRoleAdd] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [newRoleCount, setNewRoleCount] = useState(0);
    const allMethods = [
        { name: "getroutes", label: "Get Routes" },
        { name: "getrouteinfonew", label: "Get Route Info New" },
        { name: "getclosestbusV3", label: "Get Closest Bus V3" },

    ];

    const [newPlanMethods, setNewPlanMethods] = useState([]);



    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [pricing, setPricing] = useState([]);
    const [loadingPricing, setLoadingPricing] = useState(true);
    const [newFeature, setNewFeature] = useState({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [credits, setCredits] = useState(0);
    const [role, setRole] = useState('user');



    const [newPlanCredits, setNewPlanCredits] = useState(0);

    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanPrice, setNewPlanPrice] = useState('');
    const [newPlanFeaturesText, setNewPlanFeaturesText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [showNewPlanForm, setShowNewPlanForm] = React.useState(false);

    const [newPlanMaxFileSize, setNewPlanMaxFileSize] = useState(0);
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setSearchParams({ tab: tabKey });
    };

    const admin = {
        name: 'Admin User',
        role: 'Super Admin',
        avatar: 'https://i.pravatar.cc/100'
    };



    const handleRoleCountChange = (planIndex, roleIndex, count) => {
        setPricing(prev => {

            const updated = prev.map((plan, i) => {
                if (i === planIndex) {

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
        fetch('http://localhost:32807/api/adminpanel/list-users')
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
        fetch('http://localhost:32807/api/pricing')
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
    useEffect(() => {
        const fetchUsersAndCalculateTotal = async () => {
            try {
                const response = await fetch('http://localhost:32807/api/adminpanel/list-users');
                const data = await response.json();
                setUsers(data);

                // Kalan kredilerin toplamı
                const totalCredits = data.reduce(
                    (sum, user) => sum + (user.remainingCredits ?? 0),
                    0
                );

                setTotalRemainingCredits(totalCredits);
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to fetch users', 'error');
            }
        };

        fetchUsersAndCalculateTotal();
    }, []);





    const fetchUsers = () => {
        setLoadingUsers(true);
        fetch('http://localhost:32807/api/adminpanel/list-users')
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
            const res = await fetch('http://localhost:32807/api/adminpanel/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, credits, role }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert('Hata: ' + (errorData.error || 'Kullanıcı eklenemedi'));
                return;
            }

            Swal.fire({
                title: 'Kullanıcı Başarıyla Eklendi',

                icon: 'success',
            });
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



    const handlePricingChange = (planIndex, field, value, subKey = null) => {
        const newPricing = [...pricing];

        if (field === 'plan_limit' && subKey) {

            if (!newPricing[planIndex].plan_limit) {
                newPricing[planIndex].plan_limit = {};
            }

            newPricing[planIndex].plan_limit[subKey] = Number(value);
        }
        else if (field === 'features_bulk') {
            newPricing[planIndex].features = value
                .split('\n')
                .map(f => f.trim())
                .filter(f => f.length > 0);
        }
        else if (field === 'credits') {
            newPricing[planIndex][field] = Number(value);
        }
        else {
            if (field === 'price') {
                newPricing[planIndex][field] = Number(value);
            } else {
                newPricing[planIndex][field] = value;
            }
        }

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

        // plan_limitInput, kullanıcıdan gelen JSON benzeri bir string olabilir: "rt:5, static:7, mine:10"
        // veya frontend inputlardan oluşturulabilir
        const plan_limitObj = {};
        if (newPlanplan_limitInputs) { // örnek olarak state: { rt: 5, static: 7, mine: 10 }
            Object.entries(newPlanplan_limitInputs).forEach(([key, value]) => {
                plan_limitObj[key] = Number(value) || 0;
            });
        }

        const newPlan = {
            id: Date.now(),
            name: newPlanName.trim(),
            price: Number(newPlanPrice) || 0,
            features: featuresArray,
            plan_limit: plan_limitObj,
            max_file_size: Number(newPlanMaxFileSize) || 0,
            credits: Number(newPlanCredits) || 0,
            roles: [],
            methods: newPlanMethods,
        };

        setPricing(prev => [...prev, newPlan]);

        setNewPlanName('');
        setNewPlanPrice('');
        setNewPlanFeaturesText('');
        setNewPlanMaxFileSize('');
        setNewPlanCredits('');
        setNewPlanplan_limitInputs({}); // reset
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
    const availableMethods = ["getroutes", "getclosestbusV3", "getrouteinfonew"];



    const savePricing = () => {
        console.log('SAVE PRICING GÖNDERİLEN:', pricing);

        fetch('http://localhost:32807/api/pricing', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },

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

    const [sidebarOpen, setSidebarOpen] = useState(false);


    const [addLimitKeyModal, setAddLimitKeyModal] = useState({ open: false, index: null, value: "" });


    return (
        <div
            className="admin"
            style={{
                display: "flex",
                height: "auto",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            <nav
                className={`sidebar ${sidebarOpen ? "open" : ""}`}
                style={{
                    width: "250px",
                    backgroundColor: "#1e3a5f",
                    padding: "20px",
                    color: "#fff",
                    top: 0,
                }}
            >
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
                    onClick={() => handleTabChange("dashboard")}
                />
                <MenuItem
                    icon={<FaUsers />}
                    text="Kullanıcılar"
                    active={activeTab === "users"}
                    onClick={() => handleTabChange("users")}
                />
                <MenuItem
                    icon={<FaFileInvoiceDollar />}
                    text="Fiyatları Kontrol Et"
                    active={activeTab === "pricing"}
                    onClick={() => handleTabChange("pricing")}
                />
                <MenuItem
                    icon={<FaCogs />}
                    text="Ayarlar"
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                />
            </nav>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    display: "none",
                    position: "absolute",
                    top: 0,
                    left: 20,
                    background: "transparent",
                    border: "none",
                    fontSize: 28,
                    zIndex: 1000,
                }}
                className="hamburger-button"
            >
                &#9776;
            </button>


            <main // ContentArea gibi üst kapsayıcıda
                style={{
                    flex: 1,
                    minHeight: 'calc(200vh - 64px)', // navbar yüksekliği kadar düş
                    padding: '24px 16px'
                }}
            >
                {(loadingUsers || loadingPricing) ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <>
                        {activeTab === "dashboard" && (
                            <>
                                <h1 style={{ color: "#ffffffff" }}>Dashboard</h1>
                                <div style={cardsContainerStyle}>
                                    <DashboardCard
                                        icon={<FaUsers color="#227BBF" />}
                                        title="Toplam Kullanıcı"
                                        value={totalUsers}
                                    />
                                    <DashboardCard
                                        icon={<FaDollarSign color="#227BBF" />}
                                        title="Toplam Kredi"
                                        value={totalRemainingCredits}
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

                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        background: 'linear-gradient(135deg, #00AEEF, #0055A4)',
                                        '&:hover': { filter: 'brightness(1.05)' },
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

                                <h1 style={{ color: "#ffffffff" }}>Kullanıcı Listesi</h1>
                                {loadingUsers ? (
                                    <p>Yükleniyor...</p>
                                ) : (
                                    <UserDataGrid users={users} fetchUsers={fetchUsers} />
                                )}
                            </>
                        )}

                        {activeTab === "pricing" && (
                            <div>
                                {/* Sticky Toolbar */}
                                <div style={toolbarStyle}>
                                    <div className="left">
                                        <h1>Planlar</h1>
                                        <span className="sub">Toplam {pricing.length} plan</span>
                                    </div>
                                    <div className="right">
                                        <button
                                            onClick={() => setShowNewPlanForm(true)}
                                            style={primaryBtn}
                                        >
                                            + Yeni Plan
                                        </button>
                                        <button
                                            onClick={savePricing}
                                            style={saveBtn}
                                        >
                                            Fiyatları Kaydet
                                        </button>
                                    </div>
                                </div>

                                {/* Plan Kartları Grid */}
                                <div style={planGridStyle}>
                                    {pricing.map((plan, index) => (
                                        <div key={plan.id} style={planCardStyle}>
                                            <div style={planCardHeader}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={planBadge}>{plan?.id ? `#${plan.id}` : 'Yeni'}</span>
                                                    <input
                                                        type="text"
                                                        value={plan.name}
                                                        onChange={(e) => handlePricingChange(index, "name", e.target.value)}
                                                        placeholder="Plan Adı"
                                                        style={planTitleInput}
                                                    />
                                                </div>

                                                <button
                                                    onClick={() => deletePlan(index)}
                                                    style={dangerGhostBtn}
                                                    title="Planı Sil"
                                                >
                                                    Sil
                                                </button>
                                            </div>

                                            <div style={planBodyGrid}>
                                                {/* Fiyat */}
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Fiyat</label>
                                                    <input
                                                        type="number"
                                                        value={plan.price}
                                                        onChange={(e) => handlePricingChange(index, "price", e.target.value)}
                                                        style={inputLg}
                                                    />
                                                </div>

                                                {/* Max Dosya Boyutu */}
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Maks. Dosya Boyutu (MB)</label>
                                                    <input
                                                        type="number"
                                                        value={plan.max_file_size || 0}
                                                        onChange={(e) => handlePricingChange(index, "max_file_size", Number(e.target.value))}
                                                        style={inputLg}
                                                    />
                                                </div>

                                                {/* Kredi */}
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Kredi</label>
                                                    <input
                                                        type="number"
                                                        value={plan.credits || 0}
                                                        onChange={(e) => handlePricingChange(index, "credits", Number(e.target.value))}
                                                        style={inputLg}
                                                    />
                                                </div>

                                                {/* Yetkili Metotlar */}
                                                <div style={{ ...fieldBlock, gridColumn: '1 / -1' }}>
                                                    <label style={labelSm}>Erişim Linkleri / Metotlar</label>
                                                    <div style={methodChipsWrap}>
                                                        {availableMethods.map((method) => {
                                                            const checked = plan.metotlar?.includes(method);
                                                            return (
                                                                <label
                                                                    key={method}
                                                                    style={chipCheck(checked)}
                                                                    title={method}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={(e) => {
                                                                            const updated = e.target.checked
                                                                                ? [...(plan.metotlar || []), method]
                                                                                : (plan.metotlar || []).filter((m) => m !== method);
                                                                            handlePricingChange(index, "metotlar", updated);
                                                                        }}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                    {method}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Plan Limitleri */}
                                                <div style={{ ...fieldBlock, gridColumn: '1 / -1' }}>
                                                    <div style={sectionHeader}>
                                                        <h4 style={{ margin: 0, color: 'black' }}>Plan Limitleri</h4>
                                                        <button
                                                            style={ghostBtn}
                                                            onClick={() => setAddLimitKeyModal({ open: true, index, value: "" })}
                                                        >
                                                            + Yeni Limit Key
                                                        </button>
                                                    </div>

                                                    {Object.entries(plan.plan_limit || {}).length === 0 ? (
                                                        <div style={emptyHint}>Henüz limit key tanımlanmadı.</div>
                                                    ) : (
                                                        <div style={limitsGrid}>
                                                            {Object.entries(plan.plan_limit || {}).map(([key, value]) => (
                                                                <div key={key} style={limitItem}>
                                                                    <div style={limitKey}>{key}</div>
                                                                    <input
                                                                        type="number"
                                                                        value={value}
                                                                        onChange={(e) => {
                                                                            const newPricing = [...pricing];
                                                                            newPricing[index].plan_limit[key] = Number(e.target.value);
                                                                            setPricing(newPricing);
                                                                        }}
                                                                        style={inputSm}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Roller */}
                                                <div style={{ ...fieldBlock, gridColumn: '1 / -1' }}>
                                                    <div style={sectionHeader}>
                                                        <h4 style={{ margin: 0, color: 'black' }}>Roller</h4>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPlanForRoleAdd(index);
                                                                setShowRoleModal(true);
                                                                setNewRole('');
                                                                setNewRoleCount(0);
                                                            }}
                                                            style={ghostBtn}
                                                        >
                                                            + Rol Ekle
                                                        </button>
                                                    </div>

                                                    {plan.roles && plan.roles.length > 0 ? (
                                                        <div style={rolesWrap}>
                                                            {plan.roles.map((r, i) => (
                                                                <div key={i} style={rolePill}>
                                                                    <span>{r.role}</span>
                                                                    <input
                                                                        type="number"
                                                                        value={r.count}
                                                                        min={0}
                                                                        onChange={e => handleRoleCountChange(index, i, Number(e.target.value))}
                                                                        style={roleCount}
                                                                    />
                                                                    <button
                                                                        onClick={() => removeRole(index, i)}
                                                                        style={pillRemoveBtn}
                                                                        title="Sil"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div style={emptyHint}>Bu plana ait rol tanımı yok.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ----------------- Küçük Modal: Yeni Limit Key ----------------- */}
                                {addLimitKeyModal.open && (
                                    <div style={modalOverlay}>
                                        <div style={smallModalCard}>
                                            <h3 style={{ marginTop: 0 }}>Yeni Limit Key</h3>
                                            <input
                                                type="text"
                                                placeholder="örn. mine"
                                                value={addLimitKeyModal.value}
                                                onChange={(e) => setAddLimitKeyModal(m => ({ ...m, value: e.target.value }))}
                                                style={inputLg}
                                            />
                                            <div style={modalActions}>
                                                <button
                                                    style={ghostBtn}
                                                    onClick={() => setAddLimitKeyModal({ open: false, index: null, value: "" })}
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    style={primaryBtn}
                                                    onClick={() => {
                                                        const keyName = (addLimitKeyModal.value || "").trim();
                                                        if (!keyName) return;
                                                        const idx = addLimitKeyModal.index;
                                                        const newPricing = [...pricing];
                                                        newPricing[idx].plan_limit = {
                                                            ...(newPricing[idx].plan_limit || {}),
                                                            [keyName]: 0
                                                        };
                                                        setPricing(newPricing);
                                                        setAddLimitKeyModal({ open: false, index: null, value: "" });
                                                    }}
                                                >
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ----------------- Yeni Plan Modal (showNewPlanForm) ----------------- */}
                                {showNewPlanForm && (
                                    <div style={modalOverlay}>
                                        <div style={modalCard}>
                                            <div style={modalHeader}>
                                                <h2 style={{ margin: 0 }}>Yeni Plan Ekle</h2>
                                                <button style={xBtn} onClick={() => setShowNewPlanForm(false)}>×</button>
                                            </div>

                                            <div style={modalGrid}>
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Plan Adı</label>
                                                    <input
                                                        type="text"
                                                        value={newPlanName}
                                                        onChange={(e) => setNewPlanName(e.target.value)}
                                                        style={inputLg}
                                                    />
                                                </div>
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Fiyat</label>
                                                    <input
                                                        type="number"
                                                        value={newPlanPrice}
                                                        onChange={(e) => setNewPlanPrice(e.target.value)}
                                                        style={inputLg}
                                                    />
                                                </div>
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Maks. Dosya Boyutu (MB)</label>
                                                    <input
                                                        type="number"
                                                        value={newPlanMaxFileSize}
                                                        onChange={(e) => setNewPlanMaxFileSize(e.target.value)}
                                                        style={inputLg}
                                                    />
                                                </div>
                                                <div style={fieldBlock}>
                                                    <label style={labelSm}>Kredi</label>
                                                    <input
                                                        type="number"
                                                        value={newPlanCredits}
                                                        onChange={(e) => setNewPlanCredits(Number(e.target.value))}
                                                        style={inputLg}
                                                    />
                                                </div>

                                                <div style={{ ...fieldBlock, gridColumn: '1 / -1' }}>
                                                    <label style={labelSm}>Yetkili Metotlar</label>
                                                    <div style={methodChipsWrap}>
                                                        {allMethods.map((method) => {
                                                            const isSelected = newPlanMethods.includes(method.name);
                                                            return (
                                                                <label
                                                                    key={method.name}
                                                                    style={chipCheck(isSelected)}
                                                                    title={method.label}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={(e) => {
                                                                            const selected = [...newPlanMethods];
                                                                            if (e.target.checked) selected.push(method.name);
                                                                            else selected.splice(selected.indexOf(method.name), 1);
                                                                            setNewPlanMethods(selected);
                                                                        }}
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                    {method.label}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={modalActions}>
                                                <button
                                                    style={ghostBtn}
                                                    onClick={() => setShowNewPlanForm(false)}
                                                >
                                                    İptal
                                                </button>
                                                <button
                                                    style={primaryBtn}
                                                    onClick={() => {
                                                        addNewPlan();
                                                        setShowNewPlanForm(false);
                                                    }}
                                                >
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Rol Ekle modalın SENDE zaten var – sadece görünüm olarak bu yeni tasarımla uyumlu dursun diye overlay/card stillerini aşağıdakiyle güncelliyorum */}
                                {showRoleModal && (
                                    <div style={modalOverlay}>
                                        <div style={smallModalCard}>
                                            <h3 style={{ marginTop: 0 }}>Rol Ekle</h3>
                                            <select value={newRole} onChange={e => setNewRole(e.target.value)} style={inputLg}>
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
                                                style={inputLg}
                                            />
                                            <div style={modalActions}>
                                                <button style={ghostBtn} onClick={() => setShowRoleModal(false)}>İptal</button>
                                                <button
                                                    style={primaryBtn}
                                                    onClick={() => {
                                                        if (selectedPlanForRoleAdd !== null) {
                                                            addRoleToPlan(selectedPlanForRoleAdd, newRole, newRoleCount);
                                                        }
                                                    }}
                                                >
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'settings' && (
                            <SettingTab keys={keys} setKeys={setKeys} />
                        )}



                    </>
                )}
            </main>
        </div >
    );

};
const toolbarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    marginBottom: 16,

    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
};
toolbarStyle.left = { display: 'flex', alignItems: 'baseline', gap: 10 };
toolbarStyle.right = { display: 'flex', gap: 10 };
toolbarStyle.left['h1'] = { margin: 0 };
const primaryBtn = {
    background: 'linear-gradient(135deg, #0055A4, #00AEEF)',
    color: '#fff', border: 'none',
    padding: '10px 14px',
    borderRadius: 10, fontWeight: 800, cursor: 'pointer',
};
const saveBtn = {
    ...primaryBtn,
    background: 'linear-gradient(135deg, #0B6B2B, #10B981)',
};
const ghostBtn = {
    background: '#f3f4f6', color: '#111827',
    border: '1px solid #e5e7eb',
    padding: '8px 12px', borderRadius: 10,
    cursor: 'pointer', fontWeight: 700,
};
const dangerGhostBtn = {
    ...ghostBtn,
    background: '#fff0f0',
    color: '#B91C1C',
    borderColor: '#fecaca'
};

const planGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16
};
const planCardStyle = {
    background: '#9fb3c8',
    borderRadius: 14,
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: 14,
    display: 'grid',
    gap: 12
};
const planCardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const planBadge = {
    padding: '4px 8px',
    borderRadius: 999,

    color: '#0055A4',
    fontWeight: 800,
    fontSize: 12,
    border: '1px solid rgba(0,85,164,0.15)'
};
const planTitleInput = {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '8px 10px',
    fontWeight: 800,
    minWidth: 140,
    outline: 'none'
};

const planBodyGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 12
};
const fieldBlock = { display: 'grid', gap: 6, gridColumn: 'span 4' }; // responsive grid
const labelSm = { fontSize: 12, color: '#ffff   ', fontWeight: 700 };
const inputLg = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: 10,
    padding: '10px 12px',
    fontWeight: 600,
    outline: 'none'
};
const inputSm = {
    ...inputLg,
    padding: '8px 10px'
};

const methodChipsWrap = { display: 'flex', flexWrap: 'wrap', gap: 8 };
const chipCheck = (active) => ({
    border: '1px solid ' + (active ? '#93c5fd' : '#e5e7eb'),
    background: active ? '#e8f3ff' : '#fff',
    color: active ? '#0055A4' : '#111827',
    padding: '8px 10px',
    borderRadius: 999,
    fontWeight: 700,
    cursor: 'pointer',
    userSelect: 'none'
});

const sectionHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 };
const emptyHint = {
    border: '1px dashed #e5e7eb',
    borderRadius: 10,
    padding: 12,
    color: '#6b7280'
};

const limitsGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 8
};
const limitItem = {
    display: 'grid',
    gap: 6,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 10
};
const limitKey = { fontWeight: 800, fontSize: 12, color: '#0b2345' };

const rolesWrap = {
    display: 'flex', flexWrap: 'wrap', gap: 8
};
const rolePill = {
    display: 'flex', alignItems: 'center', gap: 6,
    border: '1px solid #e5e7eb',

    padding: '6px 8px',
    borderRadius: 999
};
const roleCount = {
    width: 80,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '6px 8px',
    fontWeight: 600
};
const pillRemoveBtn = {
    background: 'transparent',
    border: 'none',
    color: '#B91C1C',
    fontSize: 16,
    cursor: 'pointer',
    padding: 0
};

/* MODALS */
const modalOverlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 16
};
const modalCard = {

    width: 'min(720px, 100%)',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: 16,
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
    padding: 16,
    display: 'grid',
    gap: 12
};
const smallModalCard = {
    ...modalCard,
    width: 'min(420px, 100%)'
};
const modalHeader = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
};
const xBtn = {
    ...dangerGhostBtn,
    borderRadius: 999,
    width: 36, height: 36, display: 'grid', placeItems: 'center'
};
const modalGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 12
};
const modalActions = {
    display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6
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
                        <b>Kullanıcılar:</b>
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





const MethodContainer = styled.div`
  margin-bottom: 1rem;

  label.title {
    color: #071f35;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
  }

  .method-item {
    display: block;
    color: #fff;
    margin-bottom: 0.25rem;

    @media (max-width: 768px) {
      font-size: 1rem;
      padding: 6px 0;
    }
  }
`;





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