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



function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
}

export default function Roller() {
    const [userPlanRoles, setUserPlanRoles] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");

    const [darkMode, setDarkMode] = useState(window.matchMedia("(prefers-color-scheme: dark)").matches);
    const width = useWindowWidth();




    const handleSil = async (email) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ icon: "error", title: "Hata!", text: "Kullanıcı token bulunamadı!" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/invites/${encodeURIComponent(email)}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = "Silme başarısız";
                try {
                    const responseText = await response.text();
                    const err = JSON.parse(responseText);
                    errorMessage = err.error || errorMessage;
                } catch {

                    console.error("Beklenmeyen yanıt:", await response.text());
                }
                throw new Error(errorMessage);
            }


            const filtered = invites.filter(i => i.email !== email);
            setInvites(filtered);
            localStorage.setItem(`invites-${userEmail}`, JSON.stringify(filtered));

            Swal.fire({ icon: "success", title: "Davet Silindi!" });

        } catch (error) {
            console.error("Silme hatası:", error);
            Swal.fire({ icon: "error", title: "Hata!", text: error.message });
        }
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
    const [inviterInvites, setInviterInvites] = useState([]);

    useEffect(() => {
        // Kullanıcının kim tarafından davet edildiğini al (register sırasında backend’den set edilmiş olmalı)
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.invitedBy) return;

        const fetchInviterInvites = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:5000/api/invites/by-inviter/${encodeURIComponent(user.invitedBy)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Davet listesi alınamadı");
                const data = await res.json();
                setInviterInvites(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInviterInvites();
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
                setUserPlanRoles([]);
            }
        } else {
            setUserPlanRoles([]);
        }
    }, []);

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleInvite = async () => {
        if (!inviteEmail || !inviteRole) {
            return Swal.fire({ icon: "error", title: "Hata!", text: "Email ve rol seçiniz!", confirmButtonColor: "#d33" });
        }

        if (!validateEmail(inviteEmail)) {
            return Swal.fire({ icon: "error", title: "Geçersiz Email!", text: "Lütfen geçerli bir email adresi giriniz!", confirmButtonColor: "#d33" });
        }

        const planLimit = userPlanRoles.find(r => r.role === inviteRole)?.count || 0;
        const currentCount = invites.filter(i => i.role === inviteRole).length;

        if (currentCount >= planLimit) {
            return Swal.fire({ icon: "error", title: "Limit Aşıldı!", text: `Bu plana göre maksimum ${planLimit} ${inviteRole} davet edebilirsin!`, confirmButtonColor: "#d33" });
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Kullanıcı token bulunamadı!');

            const response = await fetch(`http://localhost:5000/api/invites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole, inviterEmail: userEmail })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Davet oluşturulamadı');
            }

            const data = await response.json();
            const inviteLink = `${window.location.origin}/register/${data.token}`;

            const newInvite = {
                id: data.token,
                email: inviteEmail,
                role: inviteRole,
                status: "pending"
            };

            const updatedInvites = [...invites, newInvite];
            setInvites(updatedInvites);
            localStorage.setItem(`invites-${userEmail}`, JSON.stringify(updatedInvites));

            Swal.fire({ icon: "success", title: "Davet Linki Oluşturuldu", html: `Davet linki: <a href="${inviteLink}" target="_blank">${inviteLink}</a>` });
            setInviteEmail("");
            setInviteRole("");

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "Hata!", text: error.message, confirmButtonColor: "#d33" });
        }
    };

    const groupedInvites = invites.reduce((acc, curr) => {
        if (!acc[curr.role]) acc[curr.role] = [];
        acc[curr.role].push(curr);
        return acc;
    }, {});

    const roleIcons = { viewer: "👁️", editor: "✏️", admin: "🛡️" };
    const roleColors = { viewer: darkMode ? "#1a1a1a" : "#E0F7FA", editor: darkMode ? "#2a1a00" : "#FFF3E0", admin: darkMode ? "#142a14" : "#E8F5E9" };

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>


            <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: darkMode ? "#fff" : "#000" }}>Kullanıcı Davet Et</h3>
                <input type="email" placeholder="E-posta" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }} />

                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#000" }}>
                    <option value="">Rol Seç</option>
                    {userPlanRoles.map((r, i) => (
                        <option key={i} value={r.role}>{r.role}</option>
                    ))}
                </select>

                <button onClick={handleInvite} style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "none", background: "#007bff", color: "#fff", cursor: "pointer" }}>Davet Et</button>
            </div>
            <h2 style={{ color: darkMode ? "#fff" : "#000" }}>Plan Rolleri</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", background: darkMode ? "#1e1e1e" : "#fff", color: darkMode ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
                <thead style={{ background: darkMode ? "#333" : "#f0f0f0" }}>
                    <tr>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Rol</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Email</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Durum</th>
                        <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {invites.map((invite) => (
                        <tr key={invite.id} style={{ background: darkMode ? "#2a2a2a" : "inherit" }}>
                            <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{roleIcons[invite.role]} {invite.role}</td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{invite.email}</td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{invite.status === "pending" ? "🕒 Bekliyor" : "✅ Onaylı"}</td>
                            <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}><Silbuton onClick={() => handleSil(invite.email)} /></td>
                        </tr>
                    ))}
                    {invites.length === 0 && (
                        <tr><td colSpan="4" style={{ padding: "10px", textAlign: "center" }}>Hiç davet yok.</td></tr>
                    )}
                </tbody>
            </table>

        </div>
    );
}
