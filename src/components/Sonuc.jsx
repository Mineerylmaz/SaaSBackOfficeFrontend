import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { jwtDecode } from "jwt-decode";
import styled from 'styled-components';
function Sonuc() {
    const userId = localStorage.getItem('userId');
    const [settings, setSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const navigate = useNavigate();
    const plan = JSON.parse(localStorage.getItem('selectedPlan'));
    const methods = Array.isArray(plan?.metotlar) ? plan.metotlar : [];
    const [paramSchema, setParamSchema] = useState({});
    const [paramSchemaMap, setParamSchemaMap] = useState({});
    const [loadingParams, setLoadingParams] = useState(false);

    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.role || 'viewer';
    const userIdFromToken = decoded?.id;
    const customInputValues = JSON.parse(localStorage.getItem('customInputValues')) || {};

    const [openIndex, setOpenIndex] = useState(null);

    const [creditStatus, setCreditStatus] = useState({
        isLimited: false,
        usedCredits: 0,
        creditLimit: 0,
    });

    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');

    const [params, setParams] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        setLoadingSettings(true);

        fetch(`http://localhost:32807/api/userSettings/settings/${userId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem(`userSettings_${userId}`, JSON.stringify(data));
                setSettings({ ...data });
            })
            .catch(err => {
                console.error("Ayarlar alınırken hata:", err);
                setSettings({});
            })
            .finally(() => {
                setLoadingSettings(false);
            });
    }, [userId]);











    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        setApiResponse('');
        setApiError('');
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => Swal.fire({ icon: "success", title: "Kopyalandı" }))
            .catch(() => Swal.fire({ icon: "success", title: "Kopyalanamadı" }))
    };
    const getDisplayUrl = (methodKey) => {
        return `http://localhost:32807/api/busService/PassengerInformationServices/Bus?func=${methodKey}`;
    };


    const getFullUrl = (methodKey) => {
        const query = new URLSearchParams({ func: methodKey });
        const paramList = paramSchemaMap[methodKey]?.params;

        if (Array.isArray(paramList)) {
            paramList.forEach(({ field }) => {
                const value = params[methodKey]?.[field];
                if (value) {
                    query.append(field, value);
                }
            });
        }

        return `http://localhost:32807/api/busService/PassengerInformationServices/Bus?${query.toString()}`;
    };







    const handleQuery = async (methodKey) => {
        if (creditStatus.isLimited) {
            Swal.fire('Kredi Limiti Doldu', 'Yeni istek yapamazsınız.', 'warning');
            return;
        }

        if (!token) {
            Swal.fire('Hata', 'Giriş yapmanız gerekiyor.', 'error');
            return;
        }

        try {
            setApiError('');
            setApiResponse('Yükleniyor...');

            const creditRes = await fetch('http://localhost:32807/api/credits/use', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!creditRes.ok) {
                const err = await creditRes.json();
                throw new Error(err.message || 'Kredi düşürme başarısız.');
            }

            let url = `http://localhost:32807/api/busService/PassengerInformationServices/Bus?func=${methodKey}`;

            paramSchemaMap[methodKey]?.params?.forEach(({ field }) => {
                const value = params[methodKey]?.[field];
                if (value) {
                    url += `&${field}=${encodeURIComponent(value)}`;
                }
            });


            const res = await fetch(url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Bilinmeyen hata');
            }

            const data = await res.json();
            setApiResponse(data);

        } catch (error) {
            setApiResponse('');
            setApiError(error.message || 'Bir hata oluştu');
        }
    };



    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(`http://localhost:32807/api/credits/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Kredi durumu alınamadı');

                const data = await res.json();
                console.log('Credit status:', data);

                if (data.isLimited) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Kredi sınırına ulaşıldı',
                        text: `Kullanılan: ${data.usedCredits} / ${data.creditLimit}. Daha fazla işlem yapılamaz.`,
                    });
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error('Kredi kontrolü başarısız:', err);
            }
        }, 30000,);

        return () => clearInterval(intervalId);


    }, []);


    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            maxWidth: 900,
            margin: 'auto',
            padding: '1rem',
            color: '#222',
        },
        methodHeader: {
            textTransform: 'uppercase',
            borderBottom: '3px solid #61affe',
            paddingBottom: 8,
            color: '#446d92',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '600',
            fontSize: 16,
            backgroundColor: '#f7f7f7',
            marginTop: 15,
            borderRadius: '6px 6px 0 0',
        },
        paramList: {
            marginLeft: 0,
            paddingLeft: 0,
            listStyle: 'none',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
        },
        paramItem: {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 150px',
        },
        input: {
            padding: '6px 8px',
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 14,
            marginTop: 4,
        },
        buttonsRow: {
            marginTop: 12,
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            disabled: {
                cursor: 'not-allowed',
                opacity: 0.6,
            },

        },
        button: {
            padding: '6px 16px',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: 14,
            transition: 'background-color 0.2s ease',
        },
        copyBtn: {
            backgroundColor: '#61affe',
            color: 'white',
        },
        curlBtn: {
            backgroundColor: '#49cc90',
            color: 'white',
        },
        queryBtn: {
            backgroundColor: '#f0ad4e',
            color: 'white',
        },
        responseBox: {
            marginTop: 15,
            backgroundColor: '#f6f8fa',
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 15,
            maxHeight: 300,
            overflowY: 'auto',
            fontSize: 13,
            fontFamily: 'Consolas, monospace',
            whiteSpace: 'pre-wrap',
            color: '#24292e',
            boxShadow: '0 2px 8px rgb(149 157 165 / 20%)',
        },
        errorBox: {
            marginTop: 15,
            color: '#d73a49',
            fontWeight: '700',
        },
        creditInfo: {
            marginTop: 25,
            fontWeight: '600',
            fontSize: 15,
            color: '#586069',
            borderTop: '1px solid #e1e4e8',
            paddingTop: 15,
        },
    };




    useEffect(() => {
        const fetchParamSchema = async () => {
            try {
                setLoadingParams(true);
                const res = await fetch('http://localhost:4000/api/params/api/params');
                if (!res.ok) throw new Error('Parametre şeması alınamadı');
                const data = await res.json();
                setParamSchemaMap(data);
            } catch (err) {
                console.error('Parametreler alınamadı:', err);
            } finally {
                setLoadingParams(false);
            }
        };

        fetchParamSchema();
    }, []);


    const EmptyStateWrapper = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#333")};


`;


    useEffect(() => {
        const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));
        const user = JSON.parse(localStorage.getItem("user"));
        const isSuperAdmin = user?.role === "superadmin";
        const userid = isSuperAdmin && selectedUser ? selectedUser.id : userId;

        fetch(`http://localhost:32807/api/user_tab?user_id=${userid}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                const emptyRequiredKeys = data.filter(item => item.required && (!item.value || item.value.trim() === ""));
                if (emptyRequiredKeys.length > 0) {
                    Swal.fire("Eksik alanlar var", "Zorunlu değerler girilmeden bu sayfaya geçemezsiniz.", "error")
                        .then(() => navigate("/user-tab"));
                }
            });
    }, []);


    if (
        !settings ||
        !settings.settings ||
        settings.settings.rt_urls?.length < 1 ||
        settings.settings.static_urls?.length < 1

    ) {
        const darkMode = localStorage.getItem("theme") === "dark";

        return (
            <EmptyStateWrapper darkMode={darkMode}>
                <div
                    style={{
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        backgroundColor: "transparent",
                        color: darkMode ? "#fff" : "#333",
                    }}
                >
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: darkMode ? '#fff' : '#333' }}>
                        Bu sayfa için gerekli ayarlar yapılmamış!
                    </h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', color: darkMode ? '#ccc' : '#666' }}>
                        Devam edebilmek için önce gerekli ayarları tamamlamalısınız.
                    </p>
                    <button
                        onClick={() => navigate('/ayarlar?menu=ayarlar')}
                        style={{
                            backgroundColor: darkMode ? '#2563eb' : '#1e40af',
                            color: 'white',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = darkMode ? '#1e3a8a' : '#1a37a0';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = darkMode ? '#2563eb' : '#1e40af';
                        }}
                    >
                        Ayarları Tamamla
                    </button>
                </div>
            </EmptyStateWrapper>
        );
    }

    if (!plan || !plan.name || !plan.price) {



        if (loadingSettings) {
            return (
                <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem' }}>
                    Ayarlar yükleniyor...
                </div>
            );
        }
    }


    return (
        <div style={styles.container}>
            <hr style={{ margin: '2rem 0' }} />



            {methods.map((methodKey, index) => {




                return (
                    <div key={methodKey}>
                        <h3 style={styles.methodHeader} onClick={() => handleToggle(index)}>
                            {methodKey}
                            <span style={{ fontSize: 20 }}>{openIndex === index ? '^' : 'v'}</span>
                        </h3>


                        {openIndex === index && (
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    borderTop: 'none',
                                    borderRadius: '0 0 6px 6px',
                                    background: '#fff',
                                    padding: 20,
                                    color: '#24292e',
                                    boxShadow: '0 2px 8px rgb(149 157 165 / 20%)',
                                }}
                            >

                                <p>
                                    <strong>Sizin Erişim URL’niz:</strong>
                                </p>
                                <code
                                    style={{
                                        wordBreak: 'break-all',
                                        overflowWrap: 'break-word',
                                        display: 'block',
                                        backgroundColor: '#f6f8fa',
                                        padding: '10px',
                                        borderRadius: 4,
                                        fontFamily: 'Consolas, monospace',
                                        border: '1px solid #e1e4e8',
                                    }}
                                >
                                    {getDisplayUrl(methodKey)}
                                </code>



                                <p style={{ marginTop: 20, marginBottom: 8, fontWeight: '600' }}>Parametreler:</p>

                                <ul style={styles.paramList}>
                                    {paramSchemaMap[methodKey]?.params?.map(({ field, req }) => (
                                        <li key={field} style={styles.paramItem}>
                                            <label htmlFor={`${field}-${methodKey}`}>
                                                {field} {req && '*'}
                                            </label>
                                            <input
                                                id={`${field}-${methodKey}`}

                                                type="text"
                                                placeholder={field}
                                                value={params[methodKey]?.[field] || ''}
                                                onChange={(e) => {
                                                    setParams({
                                                        ...params,
                                                        [methodKey]: {
                                                            ...params[methodKey],
                                                            [field]: e.target.value
                                                        }
                                                    });
                                                }}
                                                style={styles.input}
                                            />


                                        </li>
                                    ))}

                                </ul>






                                <div style={styles.buttonsRow}>
                                    <button
                                        disabled={loadingParams}
                                        style={{
                                            ...styles.button, ...styles.copyBtn, cursor: loadingParams ? 'not-allowed' : 'pointer',
                                            opacity: loadingParams ? 0.6 : 1,
                                            pointerEvents: loadingParams ? 'none' : 'auto',
                                        }}
                                        onClick={() => handleCopy(getFullUrl(methodKey))}
                                        title="URL'yi kopyala"

                                    >
                                        📎 Kopyala
                                    </button>
                                    <button
                                        style={{
                                            ...styles.button, ...styles.curlBtn, cursor: loadingParams ? 'not-allowed' : 'pointer',
                                            opacity: loadingParams ? 0.6 : 1,
                                            pointerEvents: loadingParams ? 'none' : 'auto',
                                        }}
                                        onClick={() => handleCopy(`curl "${getFullUrl(methodKey)}" -H "Authorization: Bearer ${token}"`)}
                                        title="cURL komutunu kopyala"
                                        disabled={loadingParams}


                                    >
                                        💻 Export cURL
                                    </button>
                                    <button
                                        style={{
                                            ...styles.button, ...styles.queryBtn, cursor: loadingParams ? 'not-allowed' : 'pointer',
                                            opacity: loadingParams ? 0.6 : 1,
                                            pointerEvents: loadingParams ? 'none' : 'auto',
                                        }}
                                        onClick={() => handleQuery(methodKey)}
                                        title="API sorgusu yap"
                                        disabled={loadingParams}


                                    >
                                        🔍 Sorgula
                                    </button>
                                </div>

                                {apiResponse && (
                                    <pre style={styles.responseBox}>
                                        {typeof apiResponse === 'string' ? apiResponse : JSON.stringify(apiResponse, null, 2)}
                                    </pre>
                                )}

                                {apiError && (
                                    <div style={styles.errorBox}>
                                        {apiError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    )
}
;

export default Sonuc;
