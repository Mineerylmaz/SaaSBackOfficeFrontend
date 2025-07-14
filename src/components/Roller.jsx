import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Roller() {
    const [userPlanRoles, setUserPlanRoles] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");
    const [invites, setInvites] = useState([
        // Test verisi, backendden çekince burayı API'ya bağla
        { email: "ornek1@example.com", role: "viewer", status: "pending" },
        { email: "ornek2@example.com", role: "editor", status: "accepted" }
    ]);

    useEffect(() => {
        const plan = JSON.parse(localStorage.getItem("selectedPlan"));
        if (plan && plan.roles) {
            setUserPlanRoles(plan.roles);
        }
    }, []);

    const handleInvite = () => {
        if (!inviteEmail || !inviteRole) {
            return Swal.fire({
                icon: "error",
                title: "Hata!",
                text: "Email ve rol seçiniz!",
                confirmButtonColor: "#d33",
            });
        }

        // Gerçek API'ya bağlarken burayı düzenle
        setInvites([
            ...invites,
            { email: inviteEmail, role: inviteRole, status: "pending" }
        ]);

        Swal.fire({
            icon: "success",
            title: "Davet gönderildi!",
            text: `${inviteEmail} (${inviteRole}) davet edildi!`,
        });

        setInviteEmail("");
        setInviteRole("");
    };

    return (
        <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
            {/* SOL KISIM */}
            <div style={{ flex: 1 }}>
                <h2>Plan Rolleri</h2>
                <ul>
                    {userPlanRoles.map((r, i) => (
                        <li key={i}>
                            <strong>{r.role}</strong>: {r.count} kişi
                        </li>
                    ))}
                </ul>

                <h3 style={{ marginTop: "20px" }}>Kullanıcı Davet Et</h3>
                <input
                    type="email"
                    placeholder="E-posta"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                >
                    <option value="">Rol Seç</option>
                    {userPlanRoles.map((r, i) => (
                        <option key={i} value={r.role}>{r.role}</option>
                    ))}
                </select>
                <button onClick={handleInvite}>Davet Et</button>
            </div>

            {/* SAĞ KISIM */}
            <div style={{ flex: 1 }}>
                <h2>Davet Edilenler</h2>
                {invites.length === 0 && <p>Henüz davet yok.</p>}
                <ul>
                    {invites.map((invite, i) => (
                        <li key={i} style={{ marginBottom: "10px" }}>
                            <strong>{invite.email}</strong> ({invite.role}) {" "}
                            {invite.status === "pending" ? (
                                <span style={{ color: "orange" }}>🕒 Bekleniyor</span>
                            ) : (
                                <span style={{ color: "green" }}>✅ Kabul Edildi</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
