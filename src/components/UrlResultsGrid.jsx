import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';

const UrlResultsGrid = ({ userId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const fetchUrlResults = async () => {
        setLoading(true);
        try {
            let url = `http://localhost:5000/api/userSettings/urlResults/${userId}`;
            const params = [];
            if (startDateTime) params.push(`start=${encodeURIComponent(startDateTime)}`);
            if (endDateTime) params.push(`end=${encodeURIComponent(endDateTime)}`);
            if (params.length) {
                url += `?${params.join('&')}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Sunucu hatası');
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('URL sonuçları çekilirken hata:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'URL sonuçları çekilirken hata oluştu.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        fetchUrlResults();

        const interval = setInterval(fetchUrlResults, 10000);
        return () => clearInterval(interval);
    }, [userId, startDateTime, endDateTime]);

    const summaryRow = results.length > 0 ? {
        id: 'summary',
        name: 'Son Çağırılan Url ',
        url: results[0].url,
        responseTime: results[0].responseTime,
        status: results[0].status,
        errorMessage: results[0].errorMessage,
        checkedAt: results[0].checkedAt,
        isSummary: true,
    } : null;

    const displayRows = summaryRow ? [summaryRow, ...results] : results;

    const showLastResultStatus = () => {
        if (results.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Bilgi',
                text: 'Gösterilecek sonuç yok.',
            });
            return;
        }
        const lastResult = results[0];
        if (lastResult.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Başarılı',
                text: `${lastResult.url} çağrıldı ve başarılı.`,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: `${lastResult.url} çağrılırken hata oluştu.\nDetay: ${lastResult.errorMessage || 'Yok'}`,
            });
        }
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Başlık',
            width: 200,
            renderCell: (params) => params.value || '(Başlık yok)',
        },
        {
            field: 'url',
            headerName: 'URL',
            width: 350,
            renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer">
                    {params.value}
                </a>
            ),
        },
        {
            field: 'responseTime',
            headerName: 'Çağrı Süresi (ms)',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 120,
            renderCell: (params) => (
                <span style={{ color: params.value === 'success' ? 'green' : 'red' }}>
                    {params.value === 'success' ? 'Başarılı' : 'Hata'}
                </span>
            ),
        },
        {
            field: 'errorMessage',
            headerName: 'Hata Detayı',
            width: 100,
            renderCell: (params) => (
                <span style={{ color: 'red' }}>
                    {params.row.status === 'error' ? params.value : ''}
                </span>
            ),
        },
        {
            field: 'checkedAt',
            headerName: 'Kontrol Zamanı',
            width: 200,
            renderCell: (params) => {
                if (!params.value) return '-';
                const date = new Date(params.value);
                if (isNaN(date.getTime())) return '-';
                return date.toLocaleString();
            },
        },
    ];

    return (
        <div style={{ width: '100%', maxWidth: '100%', padding: '0 16px', }}>
            <div
                style={{
                    marginBottom: 12,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    flexWrap: 'wrap',   // SARMA İZNİ VER
                    justifyContent: 'flex-start', // Butonlar sola yaslı olsun
                }}
            >
                <label style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px', minWidth: 150 }}>

                    Başlangıç:
                    <input
                        style={{
                            width: '100%',
                            marginTop: 4,
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: loading || results.length === 0 ? '#ccc' : '#24496b',
                            color: 'white',
                            border: 'none',
                            fontWeight: '600',
                            boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                            boxSizing: 'border-box',
                        }}
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        max={endDateTime || undefined}
                    />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', flex: '1 1 200px', minWidth: 150 }}>

                    Bitiş:
                    <input
                        style={{
                            width: '100%',
                            marginTop: 4,
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: loading || results.length === 0 ? '#ccc' : '#24496b',
                            color: 'white',
                            border: 'none',
                            fontWeight: '600',
                            boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                            boxSizing: 'border-box',
                        }}
                        type="datetime-local"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        min={startDateTime || undefined}
                    />
                </label>
                <button
                    onClick={fetchUrlResults}
                    disabled={loading}
                    style={{
                        flex: '1 1 150px',
                        minWidth: 120,
                        padding: '8px 16px',
                        borderRadius: '8px',
                        backgroundColor: loading || results.length === 0 ? '#ccc' : '#24496b',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                        boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxSizing: 'border-box',
                    }}
                >
                    Filtrele
                </button>



            </div>
            <div
                style={{
                    width: '100%',
                    height: 400,
                    overflowX: 'auto',   // YATAY SCROLL
                    overflowY: 'hidden',
                    position: 'relative',
                }}
            >
                <DataGrid
                    columns={columns}

                    getRowId={(row) => row.id}
                    getRowClassName={(params) =>
                        params.row.isSummary ? 'summary-row' : ''
                    }
                    disableRowSelectionOnClick
                    sx={{
                        minWidth: 'fit-content',
                        overflowX: 'auto',
                    }}
                    rows={displayRows}

                    pageSize={5}


                    autoHeight={false}
                    style={{
                        width: '100%',
                        height: '100%',

                        opacity: loading ? 0.6 : 1,
                        transition: 'opacity 0.3s ease',
                    }}
                />
                {loading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            pointerEvents: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.2em',
                            color: '#444',
                        }}
                    >
                        Yükleniyor...
                    </div>
                )}
            </div>
        </div>
    );
};

export default UrlResultsGrid;
