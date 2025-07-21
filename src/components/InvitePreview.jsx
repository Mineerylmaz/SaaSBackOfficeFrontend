import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const InvitePreview = () => {
    const { id: token } = useParams();
    const [invite, setInvite] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/invites/${token}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Geçersiz davet");
                }
                setInvite(data);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Hata",
                    text: err.message,
                    confirmButtonColor: "#d33",
                    allowOutsideClick: false,
                }).then(() => {
                    navigate("/"); // Hata olursa anasayfaya veya istediğin başka sayfaya yönlendir
                });
            }
        };
        fetchInvite();
    }, [token, navigate]);

    const handleAccept = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/invites/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Hata oluştu");
            }


            await Swal.fire({
                icon: "success",
                title: "Davet kabul edildi",
                text: "Giriş sayfasına yönlendiriliyorsunuz...",
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                willClose: () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userId");

                    navigate('/login', { state: { invitedEmail: invite.email } });
                },
            });


        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: err.message,
                confirmButtonColor: "#d33",
            });
        }
    };

    if (!invite) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingText}>Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Davet Detayları</h2>
                <p style={styles.text}>
                    <strong>Email:</strong> {invite.email}
                </p>
                <p style={styles.text}>
                    <strong>Rol:</strong> {invite.role}
                </p>
                <p style={styles.text}>
                    <strong>Durum:</strong>{" "}
                    {invite.status === "accepted" ? (
                        <span style={{ ...styles.status, color: "green" }}>✅ Kabul Edilmiş</span>
                    ) : (
                        <span style={{ ...styles.status, color: "orange" }}>🕒 Bekliyor</span>
                    )}
                </p>
                {invite.status === "pending" && (
                    <button onClick={handleAccept} style={styles.button}>
                        Daveti Kabul Et
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,

    },
    card: {
        maxWidth: 400,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 32,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    text: {
        marginBottom: 16,
        fontSize: 16,
    },
    status: {
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "12px 24px",
        fontSize: 16,
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    loadingText: {
        fontSize: 20,
    },
};

export default InvitePreview;
