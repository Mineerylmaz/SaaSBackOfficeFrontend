import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

function Sonuc() {
    const methods = ['getclosestbusV3', 'getroutes', 'getrouteinfonew'];
    const token = localStorage.getItem('token');

    const [openIndex, setOpenIndex] = useState(null);
    const [params, setParams] = useState({
        stopid: '',
        systemid: '',
        lang: 'tr',
    });
    const [creditStatus, setCreditStatus] = useState({
        isLimited: false,
        usedCredits: 0,
        creditLimit: 0,
    });

    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        const checkCredits = async () => {
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:5000/api/credits/status', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data;
                setCreditStatus(data);

                if (data.isLimited) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Kredi Limiti Doldu',
                        text: `Kullanılan: ${data.usedCredits} / ${data.creditLimit} kredi.`,
                        confirmButtonText: 'Tamam',
                    });
                }
            } catch (err) {
                console.error('Kredi durumu alınamadı', err);
            }
        };

        checkCredits();
        const interval = setInterval(checkCredits, 10000);

        return () => clearInterval(interval);
    }, [token]);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        setApiResponse('');
        setApiError('');
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Kopyalandı!'))
            .catch(() => alert('Kopyalama başarısız!'));
    };

    const getClientUrl = (methodKey) => {
        const query = new URLSearchParams({
            func: methodKey,
            systemid: params.systemid,
            stopid: params.stopid,
            lang: params.lang,
        });
        return `http://localhost:5000/api/busService/PassengerInformationServices/Bus?${query.toString()}`;
    };

    const getCurlCommand = (methodKey) => {
        return `curl "${getClientUrl(methodKey)}" -H "Authorization: Bearer ${token}"`;
    };

    const handleQuery = async (methodKey) => {
        if (creditStatus.isLimited) {
            Swal.fire('Kredi Limiti Doldu', 'Yeni istek yapamazsınız.', 'warning');
            return;
        }

        try {
            setApiError('');
            setApiResponse('Yükleniyor...');

            const url = `http://localhost:5000/api/busService/PassengerInformationServices/Bus?func=${methodKey}&systemid=${params.systemid}&stopid=${params.stopid}&lang=${params.lang}`;

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

    // Stil objeleri (Swagger'a benzetildi)
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

    return (
        <div style={styles.container}>
            <hr style={{ margin: '2rem 0' }} />

            {methods.map((methodKey, index) => (
                <div key={methodKey}>
                    <h3 style={styles.methodHeader} onClick={() => handleToggle(index)}>
                        {methodKey}
                        <span style={{ fontSize: 20 }}>{openIndex === index ? '−' : '+'}</span>
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
                            <p><strong>Sizin Erişim URL’niz:</strong></p>
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
                                {getClientUrl(methodKey)}
                            </code>

                            <p style={{ marginTop: 20, marginBottom: 8, fontWeight: '600' }}>Parametreler:</p>
                            <ul style={styles.paramList}>
                                <li style={styles.paramItem}>
                                    <label htmlFor={`stopid-${methodKey}`} style={{ fontWeight: '600', fontSize: 13 }}>stopid</label>
                                    <input
                                        id={`stopid-${methodKey}`}
                                        type="text"
                                        placeholder="stopid"
                                        value={params.stopid}
                                        onChange={(e) => setParams({ ...params, stopid: e.target.value })}
                                        style={styles.input}
                                    />
                                </li>
                                <li style={styles.paramItem}>
                                    <label htmlFor={`systemid-${methodKey}`} style={{ fontWeight: '600', fontSize: 13 }}>systemid</label>
                                    <input
                                        id={`systemid-${methodKey}`}
                                        type="text"
                                        placeholder="systemid"
                                        value={params.systemid}
                                        onChange={(e) => setParams({ ...params, systemid: e.target.value })}
                                        style={styles.input}
                                    />
                                </li>
                                <li style={styles.paramItem}>
                                    <label htmlFor={`lang-${methodKey}`} style={{ fontWeight: '600', fontSize: 13 }}>lang</label>
                                    <input
                                        id={`lang-${methodKey}`}
                                        type="text"
                                        placeholder="lang"
                                        value={params.lang}
                                        onChange={(e) => setParams({ ...params, lang: e.target.value })}
                                        style={styles.input}
                                    />
                                </li>
                            </ul>

                            <div style={styles.buttonsRow}>
                                <button
                                    style={{ ...styles.button, ...styles.copyBtn }}
                                    onClick={() => handleCopy(getClientUrl(methodKey))}
                                    title="URL'yi kopyala"
                                >
                                    📎 Kopyala
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.curlBtn }}
                                    onClick={() => handleCopy(getCurlCommand(methodKey))}
                                    title="cURL komutunu kopyala"
                                >
                                    💻 Export cURL
                                </button>
                                <button
                                    style={{ ...styles.button, ...styles.queryBtn }}
                                    onClick={() => handleQuery(methodKey)}
                                    title="API sorgusu yap"
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
            ))}

            <div style={styles.creditInfo}>
                Kullanılan Kredi: {creditStatus.usedCredits} / {creditStatus.creditLimit}
            </div>
        </div>
    );
}

export default Sonuc;
