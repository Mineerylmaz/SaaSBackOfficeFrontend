import React, { useEffect, useState } from 'react';

const RemainingCredits = ({ userId, role, darkMode }) => {
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const endpoint =
                    role === 'superadmin'
                        ? `http://localhost:32807/api/credits/admin/status/${userId}`
                        : `http://localhost:32807/api/credits/status`;

                const response = await fetch(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) throw new Error('Kredi bilgisi alınamadı.');

                const data = await response.json();
                setCredits(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCredits();
    }, [userId, role]);

    if (loading) return <p>Kredi bilgisi yükleniyor...</p>;

    if (!credits) return <p>Kredi bilgisi alınamadı.</p>;

    return (
        <div
            style={{
                padding: '0.5rem',
                border: '1px solid',
                borderColor: darkMode ? '#444' : '#ddd',
                borderRadius: '8px',

                color: '#ffff'
            }}
        >
            <p><strong>Kredi Limiti:</strong> {credits.creditLimit}</p>
            <p><strong>Kullanılan Kredi:</strong> {credits.usedCredits}</p>
            <p><strong>Kalan Kredi:</strong> {credits.remainingCredits}</p>
        </div>
    );

};

export default RemainingCredits;
