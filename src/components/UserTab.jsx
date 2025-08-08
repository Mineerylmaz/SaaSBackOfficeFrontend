import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styled from 'styled-components';
const UserTab = () => {
    const [selectedUser, setSelectedUser] = useState(() => {
        return JSON.parse(localStorage.getItem("selectedUser"));
    });

    useEffect(() => {

        const onStorageChange = () => {
            setSelectedUser(JSON.parse(localStorage.getItem("selectedUser")));
        };
        window.addEventListener("storage", onStorageChange);
        return () => window.removeEventListener("storage", onStorageChange);
    }, []);
    const user = JSON.parse(localStorage.getItem("user"));

    const isSuperAdmin = user?.role === "superadmin";

    const currentUserId = isSuperAdmin && selectedUser ? selectedUser.id : user?.id;
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentKey, setCurrentKey] = useState(null);
    const [newValue, setNewValue] = useState("");



    useEffect(() => {
        fetch("http://localhost:32807/api/setting-key")
            .then((res) => res.json())
            .then((data) => setKeys(data))
            .catch((err) => console.error("Keyler çekilemedi:", err));
    }, []);
    useEffect(() => {
        const token = localStorage.getItem("token");

        const url = isSuperAdmin && selectedUser
            ? `http://localhost:32807/api/user_tab?user_id=${selectedUser.id}`
            : "http://localhost:32807/api/user_tab";

        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                const initialValues = {};
                data.forEach(item => {
                    initialValues[item.key_name] = item.value;
                });
                setValues(initialValues);
            })
            .catch(err => console.error("Kullanıcı değerleri çekilemedi:", err));

    }, [currentUserId]);



    const openModal = (key) => {
        if (isSuperAdmin && selectedUser) {
            Swal.fire("İzin Yok", "Superadmin başka kullanıcı adına değer giremez.", "error");
            return;
        }

        setCurrentKey(key);
        setNewValue(values[key] || "");
        setShowModal(true);
    };

    const saveValue = () => {
        const keyType = keys.find(k => k.key_name === currentKey)?.type;
        if (keyType === "number" && isNaN(Number(newValue))) {
            alert("Lütfen geçerli bir sayı girin.");
            return;
        }

        setValues(prev => ({
            ...prev,
            [currentKey]: newValue,
        }));
        setShowModal(false);
    };
    const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
`;

    const TooltipText = styled.div`
  visibility: hidden;
  background-color: #2f81f7;
  color: white;
  text-align: left;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 100;
  bottom: 125%; 
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);

  &::after {
    content: "";
    position: absolute;
    top: 100%; /* ok altta */
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: #2f81f7 transparent transparent transparent;
  }
`;
    const TooltipContainer = styled(TooltipWrapper)`
  &:hover ${TooltipText} {
    visibility: visible;
    opacity: 1;
  }
`;

    const saveToServer = async () => {
        const token = localStorage.getItem("token");


        const missingKeys = keys.filter(k => {
            const val = values[k.key_name];
            return k.required && (!val || val.trim() === "");
        });


        if (missingKeys.length > 0) {
            const missingKeyNames = missingKeys.map(k => k.key_name).join(", ");
            Swal.fire({
                title: "Zorunlu Alanlar Boş!",
                html: `Lütfen aşağıdaki zorunlu alanları doldurun:<br><b>${missingKeyNames}</b>`,
                icon: "warning",
                confirmButtonText: "Tamam",
            });
            return;
        }

        const payload = Object.entries(values).map(([key_name, value]) => ({
            key_name,
            value,
        }));

        try {
            const res = await fetch("http://localhost:32807/api/user_tab", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    settings: payload,
                    user_id: isSuperAdmin && selectedUser ? selectedUser.id : undefined,
                }),
            });

            const result = await res.json();
            if (result.success) {
                Swal.fire("Kaydedildi!", "Ayarlar başarıyla kaydedildi.", "success");


                const existingcustomInputValues = JSON.parse(localStorage.getItem("customInputValues")) || {};

                const updatedcustomInputValues = {
                    ...existingcustomInputValues,
                    ...values,
                };


                localStorage.setItem("customInputValues", JSON.stringify(updatedcustomInputValues));
            }

            else {
                Swal.fire("Hata!", "Kaydetme başarısız.", "error");
            }
        } catch (error) {
            Swal.fire("Sunucu Hatası", "Sunucuya bağlanırken bir hata oluştu.", "error");
            console.error(error);
        }
    };



    return (
        <div style={{ padding: 20 }}>
            <h2>Key İnput Sayfası</h2>

            {keys.length === 0 && <p>Henüz tanımlanmış ayar yok.</p>}

            <table
                style={{
                    width: "100%",
                    borderCollapse: "separate",

                    marginBottom: 20,
                    borderSpacing: 0,
                    borderRadius: "12px",

                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#446d92", color: "white" }}>
                        <th style={{ padding: 8, border: "1px solid #ddd" }}>Key</th>
                        <th style={{ padding: 8, border: "1px solid #ddd" }}>Tip</th>
                        <th style={{ padding: 8, border: "1px solid #ddd" }}>Değer</th>
                    </tr>
                </thead>
                <tbody>
                    {keys.map((k) => (
                        <tr key={k.key_name}>
                            <td style={{ padding: 8, border: "1px solid #ddd" }}>
                                <TooltipContainer>
                                    <span>
                                        {k.key_name}{k.required && <span style={{ color: 'red' }}> *</span>}
                                    </span>

                                    {k.description && (
                                        <TooltipText>{k.description}</TooltipText>
                                    )}
                                </TooltipContainer>
                            </td>
                            <td style={{ padding: 8, border: "1px solid #ddd" }}>{k.type}</td>
                            <td style={{ padding: 8, border: "1px solid #ddd" }}>
                                <input
                                    type={k.type === "number" ? "number" : "text"}
                                    value={values[k.key_name] || ""}
                                    disabled={isSuperAdmin && selectedUser}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Sadece sayıya izin ver (number tipinde)
                                        if (k.type === "number" && isNaN(Number(val))) return;
                                        setValues((prev) => ({
                                            ...prev,
                                            [k.key_name]: val,
                                        }));
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "6px 8px",
                                        borderRadius: 4,
                                        border: "1px solid #ccc",
                                        backgroundColor: "transparent",

                                        color: "inherit",

                                        padding: "6px 8px",

                                    }}


                                    placeholder="Değer girin"
                                    title={isSuperAdmin && selectedUser ? "Superadmin başka kullanıcı için değer giremez" : ""}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <button
                onClick={saveToServer}
                disabled={isSuperAdmin && selectedUser}
                style={{
                    backgroundColor: isSuperAdmin && selectedUser ? "#ccc" : "#446d92",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 5,
                    cursor: isSuperAdmin && selectedUser ? "not-allowed" : "pointer",
                }}
            >
                Kaydet
            </button>


            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: "fixed",
                        top: "60%",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        transform: "translateY(-50%)",
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: "white",
                            padding: 20,
                            borderRadius: 6,
                            width: 300,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}
                    >
                        <h3 color="#000">{currentKey} için Değer Gir</h3>
                        <input
                            type={
                                keys.find(k => k.key_name === currentKey)?.type === "number"
                                    ? "number"
                                    : "text"
                            }
                            value={newValue}
                            onChange={e => setNewValue(e.target.value)}
                            style={{ width: "100%", padding: 8, marginBottom: 15 }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    marginRight: 10,
                                    padding: "6px 12px",
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    backgroundColor: "white",
                                    cursor: "pointer",
                                }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={saveValue}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 4,
                                    border: "none",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTab;