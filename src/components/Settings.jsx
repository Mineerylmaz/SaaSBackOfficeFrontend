import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';
import Swal from 'sweetalert2';
import Radio from './Radio';
import Profile from './Profile';
import Pricing from './Pricing';
import Silbuton from './Silbuton';

const Settings = ({ user }) => {
    const [plan, setPlan] = useState(null);
    const [settings, setSettings] = useState({
        rt_urls: [],
        static_urls: [],
        autoRenew: false,
        notifications: false,
    });
    const [loading, setLoading] = useState(true);


    const [selectedMenu, setSelectedMenu] = useState('rt');


    const [openRT, setOpenRT] = useState(true);
    const [openStatic, setOpenStatic] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        const savedPlanStr = localStorage.getItem('selectedPlan');
        let savedPlan = null;
        try {
            if (savedPlanStr && savedPlanStr !== "undefined") {
                savedPlan = JSON.parse(savedPlanStr);
            }
        } catch {
            savedPlan = null;
        }
        if (savedPlan) setPlan(savedPlan);

        fetch(`/api/userSettings/settings/${user.id}`)
            .then(res => res.json())
            .then(data => {
                console.log("API cevabı:", data);
                setSettings(data.settings || {
                    rt_urls: [],
                    static_urls: [],
                    autoRenew: false,
                    notifications: false,
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.id]);








    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };


    const handleRtUrlChange = (index, field, value) => {
        const newUrls = [...settings.rt_urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        handleSettingChange('rt_urls', newUrls);
    };
    const addRtUrl = () => {
        if (settings.rt_urls.length >= (plan?.rt_url_limit || 0)) {
            alert(`RT URL limiti: ${plan.rt_url_limit} adet ile sınırlıdır.`);
            return;
        }
        handleSettingChange('rt_urls', [...settings.rt_urls, { url: '', frequency: 1 }]);
    };
    const removeRtUrl = index => {
        const newUrls = [...settings.rt_urls];
        newUrls.splice(index, 1);
        handleSettingChange('rt_urls', newUrls);
    };

    const handleStaticUrlChange = (index, field, value) => {
        const newUrls = [...settings.static_urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        handleSettingChange('static_urls', newUrls);
    };
    const addStaticUrl = () => {
        if (settings.static_urls.length >= (plan?.static_url_limit || 0)) {
            alert(`Static URL limiti: ${plan.static_url_limit} adet ile sınırlıdır.`);
            return;
        }
        handleSettingChange('static_urls', [...settings.static_urls, { url: '', frequency: 1 }]);
    };
    const removeStaticUrl = index => {
        const newUrls = [...settings.static_urls];
        newUrls.splice(index, 1);
        handleSettingChange('static_urls', newUrls);
    };

    const [saving, setSaving] = useState(false);
    const saveSettings = () => {
        setSaving(true);
        fetch(`/api/userSettings/settings/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings }),
        })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Başarılı!',
                    text: 'Ayarlar kaydedildi!',
                    confirmButtonColor: '#3085d6',
                });
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Kaydetme sırasında bir hata oluştu!',
                    confirmButtonColor: '#d33',
                });
            })
            .finally(() => setSaving(false));
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (!plan) return <p>Ödenmiş plan bulunamadı.</p>;

    return (
        <Wrapper>
            <Radio selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

            {(selectedMenu === 'rt' || selectedMenu === 'static') && (
                <HorizontalWrapper>
                    <ContentWrapper>
                        {selectedMenu === 'rt' && (
                            <AccordionWrapper>
                                <AccordionHeader onClick={() => setOpenRT(!openRT)}>
                                    Real Time URL Listesi ({settings.rt_urls.length})
                                </AccordionHeader>
                                <AccordionContent open={openRT}>
                                    {settings.rt_urls.map((item, idx) => (
                                        <Row key={idx}>
                                            <Input
                                                type="text"
                                                placeholder="RT URL"
                                                value={item.url}
                                                onChange={e => handleRtUrlChange(idx, 'url', e.target.value)}
                                                style={{ flex: 3 }}
                                            />
                                            <Input
                                                type="number"
                                                min={1}
                                                placeholder="Çağrı Sıklığı (sn)"
                                                value={item.frequency}
                                                onChange={e => handleRtUrlChange(idx, 'frequency', Number(e.target.value))}
                                                style={{ flex: 1 }}
                                            />
                                            <Silbuton onClick={() => removeRtUrl(idx)}>Sil</Silbuton>
                                        </Row>
                                    ))}
                                    <Button onClick={addRtUrl} disabled={settings.rt_urls.length >= (plan?.rt_url_limit || 0)}>

                                    </Button>
                                </AccordionContent>
                                <SaveButton onClick={saveSettings} disabled={saving}>
                                    Ayarları Kaydet
                                </SaveButton>
                            </AccordionWrapper>
                        )}

                        {selectedMenu === 'static' && (
                            <AccordionWrapper>
                                <AccordionHeader onClick={() => setOpenStatic(!openStatic)}>
                                    Static URL Listesi ({settings.static_urls.length})
                                </AccordionHeader>
                                <AccordionContent open={openStatic}>
                                    {settings.static_urls.map((item, idx) => (
                                        <Row key={idx}>
                                            <Input
                                                type="text"
                                                placeholder="Static URL"
                                                value={item.url}
                                                onChange={e => handleStaticUrlChange(idx, 'url', e.target.value)}
                                                style={{ flex: 3 }}
                                            />
                                            <Input
                                                type="number"
                                                min={1}
                                                placeholder="Çağrı Sıklığı (sn)"
                                                value={item.frequency}
                                                onChange={e => handleStaticUrlChange(idx, 'frequency', Number(e.target.value))}
                                                style={{ flex: 1 }}
                                            />
                                            <Silbuton onClick={() => removeStaticUrl(idx)} />
                                        </Row>
                                    ))}
                                    <Button
                                        onClick={addStaticUrl}
                                        disabled={settings.static_urls.length >= (plan?.static_url_limit || 0)}
                                    >

                                    </Button>
                                </AccordionContent>
                                <SaveButton onClick={saveSettings} disabled={saving}>
                                    Ayarları Kaydet
                                </SaveButton>
                            </AccordionWrapper>
                        )}
                    </ContentWrapper>
                </HorizontalWrapper>
            )}

            {selectedMenu === 'profile' && (
                <>
                    {plan && (
                        <PlanCard>
                            <div className="card__heading">Plan</div>
                            <div className="card__price">{plan.name}</div>
                            <div className="card__bullets flow">
                                <div><strong>RT URL Limit:</strong> {plan.rt_url_limit}</div>
                                <div><strong>Static URL Limit:</strong> {plan.static_url_limit}</div>
                                <div><strong>Mevcut RT URL:</strong> {settings.rt_urls?.length || 0}</div>
                                <div><strong>Mevcut Static URL:</strong> {settings.static_urls?.length || 0}</div>
                            </div>
                        </PlanCard>
                    )}
                    <Profile />
                </>
            )}
        </Wrapper>
    );

};

export default Settings;
const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
`;

const PlanCard = styled.div`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 15px;
  width: 280px;  
  box-sizing: border-box;
  flex-shrink: 0;

`;







const MenuWrapper = styled.div`
  width: 200px;
  background: #1e293b;
  padding: 20px;
  border-radius: 10px;
  height: fit-content;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  
  font-weight: ${({ active }) => (active ? '600' : '400')};
  background: none;
  border: none;
  padding: 10px 8px;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;

  &:hover {
    color: #60a5fa;
    background-color: #334155;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 350px;
`;

const AccordionWrapper = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
`;

const AccordionHeader = styled.button`
  width: 100%;
  background: #446d92;
  color: white;
  padding: 10px 15px;
  border: none;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
`;

const AccordionContent = styled.div`
  background: #f1f5f9;
  max-height: ${({ open }) => (open ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: ${({ open }) => (open ? '15px' : '0 15px')};
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const SaveButton = styled.button`
  padding: 12px 25px;
  margin: 10px 0 0 0;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  background: #446d92;
  color: #fff;
  transition: background-color 0.3s ease;

  margin-left: auto;
  display: inline-block; /* ya da kaldır */

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

