import React, { useState } from 'react';

function Sonuc() {
    const methods = ['getclosestbus', 'getroutes', 'getrouteinfonew'];

    const [openIndex, setOpenIndex] = useState(null);
    const [params, setParams] = useState({
        id: '',
        date: '',
    });

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Kopyalandı!'))
            .catch(() => alert('Kopyalama başarısız!'));
    };
    const getClientUrl = (methodKey) => {
        return `${window.location.origin}/api/${methodKey}?id=${params.id}&date=${params.date}`;
    };


    const getCurlCommand = (methodKey) => {
        return `curl "${getClientUrl(methodKey)}"`;
    };




    return (
        <div style={{ padding: '1rem' }}>
            <hr style={{ margin: '2rem 0' }} />
            <div style={{ marginTop: '2rem' }}>
                {methods.map((methodKey, index) => (
                    <div key={methodKey} style={{ marginBottom: 30 }}>
                        <h3
                            onClick={() => handleToggle(index)}
                            style={{
                                textTransform: 'uppercase',
                                borderBottom: '2px solid #446d92',
                                paddingBottom: 8,
                                color: '#446d92',
                                cursor: 'pointer',
                                userSelect: 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {methodKey}
                            <span style={{ fontSize: 18 }}>{openIndex === index ? '▲' : '▼'}</span>
                        </h3>

                        {openIndex === index && (
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    marginTop: 10,
                                    padding: 16,
                                    borderRadius: 6,
                                    background: '#fafafa',
                                    transition: 'all 0.3s ease',
                                    color: 'black'
                                }}
                            >
                                <p>
                                    <strong>Sizin Erişim URL’niz:</strong>{' '}
                                    <code><code>{getClientUrl(methodKey)}</code>
                                    </code>
                                </p>
                                <p>
                                    <strong>Parametreler:</strong>
                                </p>
                                <ul style={{ marginLeft: 20 }}>
                                    <li>
                                        <input
                                            type="text"
                                            placeholder="id"
                                            value={params.id}
                                            onChange={(e) => setParams({ ...params, id: e.target.value })}
                                        />

                                    </li>
                                    <li>
                                        <input
                                            type="text"
                                            placeholder="date"
                                            value={params.date}
                                            onChange={(e) => setParams({ ...params, date: e.target.value })}
                                        />
                                    </li>
                                </ul>

                                <div style={{ display: 'flex', gap: '10px', marginTop: 10 }}>
                                    <button
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            handleCopy(`https://app.myapp.com/api/${methodKey}?id=123&date=2025-07-31`)
                                        }
                                    >
                                        📎 Kopyala
                                    </button>
                                    <button
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleCopy(getCurlCommand(methodKey))}
                                    >
                                        💻 Export cURL
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sonuc;
