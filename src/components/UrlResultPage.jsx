import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import UrlResultsGrid from './UrlResultsGrid'; // Senin verdiğin DataGrid bileşeni

const UrlResultsPage = ({ userId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // API’den sonuçları çek
    const fetchUrlResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/userSettings/urlResults/${userId}`);
            if (!res.ok) throw new Error('Sunucu hatası');
            const data = await res.json();
            setResults(data);

            // SweetAlert ile kullanıcıya bildirim göster
            data.forEach(item => {
                if (item.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Başarılı',
                        text: `${item.url} çağrıldı ve başarılı.`,
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hata',
                        text: `${item.url} çağrılırken hata oluştu.`,
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'URL sonuçları çekilirken bir hata oluştu!',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUrlResults();
        }
    }, [userId]);

    return (
        <div>



            <UrlResultsGrid results={results} />

        </div>
    );
};

export default UrlResultsPage;
