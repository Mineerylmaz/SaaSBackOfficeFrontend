import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

const Silbuton = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: "6px 12px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        }}
    >
        Sil
    </button>
);

export default function Roller() {
    const [userPlanRoles, setUserPlanRoles] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");
    const handleSil = (email) => {
        const filtered = invites.filter(i => i.email !== email);
        setInvites(filtered);
        localStorage.setItem("invites", JSON.stringify(filtered));
    };



    async function fetchUserPlan() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return null;

        try {
            const res = await fetch(`http://localhost:5000/api/userSettings/settings/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Plan alınamadı');

            const data = await res.json();
            const plan = data.plan;

            if (plan) {

                if (typeof plan.roles === "string") {
                    plan.roles = JSON.parse(plan.roles);
                }

                localStorage.setItem('selectedPlan', JSON.stringify(plan));
                return plan;
            }
            return null;

        } catch (error) {
            console.error(error);
            return null;
        }
    }




    useEffect(() => {
        const loadPlan = async () => {
            const planFromStorage = localStorage.getItem('selectedPlan');
            if (planFromStorage) {
                const plan = JSON.parse(planFromStorage);
                if (plan?.roles) {
                    setUserPlanRoles(plan.roles);
                    return;
                }
            }

            const freshPlan = await fetchUserPlan();
            if (freshPlan?.roles) {
                setUserPlanRoles(freshPlan.roles);
            }
        };

        loadPlan();
    }, []);

    const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "default";

    const [invites, setInvites] = useState(() => {
        const saved = localStorage.getItem(`invites-${userEmail}`);
        return saved ? JSON.parse(saved) : [];
    });





    useEffect(() => {
        const planStr = localStorage.getItem("selectedPlan");
        if (planStr) {
            const plan = JSON.parse(planStr);
            if (plan && plan.roles) {
                setUserPlanRoles(plan.roles);
            } else {
                console.warn("Plan roles eksik:", plan);

                setUserPlanRoles([]);
            }
        } else {

            setUserPlanRoles([]);
        }
    }, []);


    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);


    const handleInvite = async () => {
        if (!inviteEmail || !inviteRole) {
            return Swal.fire({
                icon: "error",
                title: "Hata!",
                text: "Email ve rol seçiniz!",
                confirmButtonColor: "#d33"
            });
        }

        if (!validateEmail(inviteEmail)) {
            return Swal.fire({
                icon: "error",
                title: "Geçersiz Email!",
                text: "Lütfen geçerli bir email adresi giriniz!",
                confirmButtonColor: "#d33"
            });
        }

        const planLimit = userPlanRoles.find(r => r.role === inviteRole)?.count || 0;
        const currentCount = invites.filter(i => i.role === inviteRole).length;

        if (currentCount >= planLimit) {
            return Swal.fire({
                icon: "error",
                title: "Limit Aşıldı!",
                text: `Bu plana göre maksimum ${planLimit} ${inviteRole} davet edebilirsin!`,
                confirmButtonColor: "#d33"
            });
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Kullanıcı token bulunamadı!');

            const response = await fetch('http://localhost:5000/api/invites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Davet oluşturulamadı');
            }

            const data = await response.json();


            const inviteLink = `${window.location.origin}/invite/${data.token}`;


            const newInvite = {
                id: data.token,
                email: inviteEmail,
                role: inviteRole,
                status: "pending"
            };

            const updatedInvites = [...invites, newInvite];
            setInvites(updatedInvites);
            localStorage.setItem(`invites-${userEmail}`, JSON.stringify(updatedInvites));

            Swal.fire({
                icon: "success",
                title: "Davet Linki Oluşturuldu",
                html: `Davet linki: <a href="${inviteLink}" target="_blank">${inviteLink}</a>`
            });

            setInviteEmail("");
            setInviteRole("");

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Hata!",
                text: error.message,
                confirmButtonColor: "#d33"
            });
        }
    };



    const groupedInvites = invites.reduce((acc, curr) => {
        if (!acc[curr.role]) acc[curr.role] = [];
        acc[curr.role].push(curr);
        return acc;
    }, {});

    const roleIcons = {
        viewer: "👁️",
        editor: "✏️",
        admin: "🛡️"
    };

    const roleColors = {
        viewer: "#E0F7FA",
        editor: "#FFF3E0",
        admin: "#E8F5E9"
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "40px" }}>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>

                <div style={{ flex: "1 1 300px", minWidth: "250px" }}>
                    <h2>Plan Rolleri</h2>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                        {userPlanRoles.map((r, i) => (
                            <li key={i} style={{
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                padding: "10px 14px",
                                background: roleColors[r.role] || "#f9f9f9",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span style={{ fontWeight: "600" }}>
                                    {roleIcons[r.role]} {r.role}
                                </span>
                                <span style={{
                                    background: "#fff",
                                    borderRadius: "999px",
                                    padding: "4px 10px",
                                    fontSize: "0.85rem",
                                    border: "1px solid #ccc"
                                }}>
                                    {r.count} kişi
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>


                <div style={{
                    flex: "1 1 300px",
                    minWidth: "250px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    background: "#fafafa"
                }}>
                    <h3>Kullanıcı Davet Et</h3>
                    <input
                        type="email"
                        placeholder="E-posta"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    />

                    <select
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc"
                        }}
                    >
                        <option value="">Rol Seç</option>
                        {userPlanRoles.map((r, i) => (
                            <option key={i} value={r.role}>{r.role}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleInvite}
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "none",
                            background: "#007bff",
                            color: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        Davet Et
                    </button>
                </div>
            </div>


            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {["viewer", "editor", "admin"].map(role => (
                    <div key={role} style={{
                        flex: "1 1 300px",
                        minWidth: "250px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px"
                    }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{roleIcons[role]}</span> {role.toUpperCase()}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {(groupedInvites[role] || []).map((invite, i) => (
                                <div key={i} style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    padding: "8px 12px",
                                    background: "#f9f9f9",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    justifyContent: "space-between"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span>{roleIcons[invite.role]}</span>
                                        <div>
                                            <strong>{invite.email}</strong>
                                            <p style={{ margin: 0 }}>
                                                {invite.status === "pending" ? (
                                                    <span style={{ color: "orange" }}>🕒 Bekleniyor</span>
                                                ) : (
                                                    <span style={{ color: "green" }}>✅ Kabul Edildi</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <Silbuton onClick={() => handleSil(invite.email)} />
                                </div>
                            ))}
                            {(groupedInvites[role] || []).length === 0 && (
                                <p style={{ color: "#111" }}>Henüz davet yok.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
