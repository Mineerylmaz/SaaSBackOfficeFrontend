import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
        }



    ];

    return (
        <div>
            <div style={{ marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
                <label>
                    Başlangıç:
                    <input
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        max={endDateTime || undefined}
                    />
                </label>
                <label>
                    Bitiş:
                    <input
                        type="datetime-local"
                        value={endDateTime}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        min={startDateTime || undefined}
                    />
                </label>
                <button onClick={fetchUrlResults}>Filtrele</button>
            </div>
            <div style={{ width: '100%', height: 400, overflowX: 'auto', position: 'relative' }}>
                <DataGrid
                    rows={results}
                    columns={columns}
                    pageSize={5}
                    getRowId={(row) => row.id}
                    disableSelectionOnClick
                    autoHeight={false}
                    style={{
                        width: '100%',
                        height: '100%',
                        minWidth: 900,
                        opacity: loading ? 0.6 : 1,
                        transition: 'opacity 0.3s ease',
                    }}
                />
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.2em',
                        color: '#444',
                    }}>

                    </div>
                )}
            </div>



        </div>
    );
};


export default UrlResultsGrid;
