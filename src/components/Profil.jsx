import React, { useState, useEffect } from 'react';

const Profile = ({ user }) => {
    const [plan, setPlan] = useState(null);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('planlar');

    useEffect(() => {
        const savedPlan = localStorage.getItem('selectedPlan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
        }

        if (user) {
            fetch(`/api/userSettings/settings/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setSettings(data.settings || {});
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <p>Yükleniyor...</p>;
    if (!plan) return <p>Seçilen plan bulunamadı.</p>;

    const handleSaveSettings = () => {
        fetch(`/api/userSettings/settings/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings }),
        }).then(() => alert('Ayarlar kaydedildi!'));
    };

    return (
        <div>
            <nav>
                <button onClick={() => setActiveTab('planlar')}>Planlar</button>
                <button onClick={() => setActiveTab('ayarlar')}>Ayarlar</button>
            </nav>

            {activeTab === 'planlar' && (
                <div>
                    <h2>Seçili Plan: {plan.name}</h2>
                    <p>Fiyat: ${plan.price}</p>
                    <ul>
                        {plan.features.map((f, i) => (
                            <li key={i}>{f}</li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'ayarlar' && (
                <div>
                    <h2>{plan.name} Ayarları</h2>
                    {plan.features.map((f, i) => (
                        <div key={i}>
                            <label>{f}</label>
                            <input
                                value={settings[f] || ''}
                                onChange={e =>
                                    setSettings(prev => ({ ...prev, [f]: e.target.value }))
                                }
                                placeholder={`Buraya ${f} ayarı`}
                            />
                        </div>
                    ))}
                    <button onClick={handleSaveSettings}>Ayarları Kaydet</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
