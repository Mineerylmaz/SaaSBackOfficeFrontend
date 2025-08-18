import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import styled from 'styled-components';
const UrlResultsGrid = ({ userId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const fetchUrlResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/disservis/success/urlkontrol`);
            if (!res.ok) throw new Error('Mock server hatası');

            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error('Mock sonuçları çekilirken hata:', error);
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Mock sonuçları çekilirken hata oluştu.',
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


    const displayRows = results;

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
    const truncate = (str, max = 50) => (str.length > max ? str.slice(0, max) + '...' : str);

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
            renderCell: (params) => {
                const isSuccess = params.value === 'success';
                return (
                    <span style={{ color: isSuccess ? 'green' : 'red', fontWeight: '600' }}>
                        {isSuccess ? '✅ Başarılı' : '❌ Hata'}
                    </span>
                );
            },
        }
        ,
        {
            field: 'errorMessage',
            headerName: 'Hata Detayı',
            width: 150,
            renderCell: (params) => {
                if (params.row.status !== 'error') return '-';
                return (
                    <span style={{ color: 'red', fontWeight: '500' }}>
                        {params.value || '-'}
                    </span>
                );
            },
        }
        ,
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
        <StyledWrapper>

            <div className="filter-section">

                <label>
                    <input
                        style={{
                            backgroundColor: loading || results.length === 0 ? '#ccc' : '#0055A4',
                            color: 'white',
                            boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        max={endDateTime || undefined}
                    />
                </label>
                <label >
                    <input
                        style={{
                            backgroundColor: loading || results.length === 0 ? '#ccc' : '#0055A4',
                            color: 'white',
                            boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
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
                        backgroundColor: loading || results.length === 0 ? '#ccc' : '#0055A4',
                        color: 'white',
                        boxShadow: loading || results.length === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    Filtrele
                </button>





            </div>
            {results.length > 0 && (
                <div className="result-summary">
                    <strong>Son Çağrılan URL:</strong> {truncate(results[0].url, 80)} <br />
                    <strong>Durum:</strong> {results[0].status === 'success' ? '✅ Başarılı' : `❌ Hata: ${results[0].errorMessage || '-'}`} <br />
                    <strong>Kontrol Zamanı:</strong> {new Date(results[0].checkedAt).toLocaleString()}
                </div>
            )}

            <div className="data-grid-container">
                <DataGrid
                    columns={columns}
                    rows={results}
                    getRowId={(row) => row.id}
                    getRowClassName={(params) => (params.row.isSummary ? 'summary-row' : '')}
                    disableRowSelectionOnClick
                    rowHeight={42}
                    disableColumnMenu
                    hideFooterSelectedRowCount
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    sx={{ minWidth: 'fit-content' }}
                />


            </div>

        </StyledWrapper>
    );
};




export const StyledWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0 16px;

  .filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 12px;
  }

  .filter-section label {
    flex: 1 1 200px;
    min-width: 150px;
    display: flex;
    flex-direction: column;
  }

  .filter-section input,
  .filter-section button {
    
    margin-top: 4px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    box-sizing: border-box;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .filter-section button {
    min-width: 120px;
  }

  .result-summary {
  margin-bottom: 12px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 8px;
  color: black;
  word-break: break-all;
  overflow-wrap: break-word;
}


  .data-grid-container {
    width: 100%;
    min-height: 300px;
    overflow-x: auto;
  }

  @media (max-width: 600px) {
    .filter-section {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-section label,
    .filter-section button {
      flex: 1 1 auto;
      width: 100%;
    }
  }
`;

export default UrlResultsGrid;
