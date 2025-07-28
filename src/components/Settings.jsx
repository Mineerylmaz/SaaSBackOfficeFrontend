import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from './Input';
import Button from './Button';
import Swal from 'sweetalert2';
import Radio from './Radio';
import Profile from './Profile';
import Silbuton from './Silbuton';
import UrlResultsGrid from './UrlResultsGrid';
import DateFilter from './DateFilter';
import DragDropFileUpload from './DragDropFileUpload';
import Roller from './Roller';

import { jwtDecode } from "jwt-decode";
import UserTab from './UserTab';
const Settings = ({ user }) => {
    const [keys, setKeys] = useState([
        { key: 'durak', type: 'number' },
        { key: 'planAdi', type: 'string' }
    ]);


    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.role || "viewer";


    const [plan, setPlan] = useState(null);
    const [settings, setSettings] = useState({
        rt_urls: [],
        static_urls: [],
        autoRenew: false,
        notifications: false,
    });
    const [loading, setLoading] = useState(true);
    const [fakeFileSize, setFakeFileSize] = useState(0);

    const [selectedMenu, setSelectedMenu] = useState('rt');
    const [openRT, setOpenRT] = useState(true);
    const [openStatic, setOpenStatic] = useState(true);

    const [results, setResults] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deletedUrls, setDeletedUrls] = useState([]);



    const filteredRtUrls = settings.rt_urls.filter(item =>
        !deletedUrls.some(d => d.url === item.url && d.type === 'rt')
    );

    const filteredStaticUrls = settings.static_urls.filter(item =>
        !deletedUrls.some(d => d.url === item.url && d.type === 'static')
    );


    const fetchDeletedUrls = async () => {
        const res = await fetch(`http://localhost:5000/api/userSettings/settings/deleted-urls/${user.token}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        setDeletedUrls(data);
    };



    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/userSettings/settings/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Settings API response:', data);
                const defaultSettings = {
                    rt_urls: [],
                    static_urls: [],
                    autoRenew: false,
                    notifications: false,
                };

                const newSettings = {
                    ...defaultSettings,
                    ...data.settings,
                    rt_urls: Array.isArray(data.settings?.rt_urls) ? data.settings.rt_urls : [],
                    static_urls: Array.isArray(data.settings?.static_urls) ? data.settings.static_urls : [],
                };

                setSettings(newSettings);

                if (data.plan) {
                    setPlan(data.plan);
                } else {
                    setPlan(null);
                }

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.id]);


    const fetchResults = () => {
        if (!user?.id) return;

        let url = `http://localhost:5000/api/userSettings/urlResults/${user.id}`;
        const params = [];
        if (startDate) params.push(`start=${encodeURIComponent(new Date(startDate).toISOString())}`);
        if (endDate) params.push(`end=${encodeURIComponent(new Date(endDate).toISOString())}`);
        if (params.length) url += '?' + params.join('&');

        fetch(url)
            .then(res => res.json())
            .then(data => setResults(data))
            .catch(err => console.error('URL sonuçları çekilirken hata:', err));
    };

    useEffect(() => {
        if (selectedMenu === 'urlresults') {
            fetchResults();
        }
    }, [selectedMenu, user?.id]);
    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        if (!token) {
            console.error("Token yok, giriş yapmalısınız.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5000/api/userSettings/settings/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    throw new Error("Geçersiz token, lütfen tekrar giriş yapın.");
                }
                return res.json();
            })
            .then(data => {
                // mevcut kodun
            })
            .catch(err => {
                console.error(err.message);
                setLoading(false);
            });
    }, [user?.id, token]);


    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    /*useEffect(() => {
        if (!user?.id) return;

        fetch(`http://localhost:5000/api/userSettings/settings/deleted-urls/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setDeletedUrls(data))
            .catch(err => console.error(err));
    }, [user?.id]);*/


    const handleRtUrlChange = (index, field, value) => {
        const newUrls = [...settings.rt_urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        handleSettingChange('rt_urls', newUrls);
    };

    const addRtUrl = () => {
        if (settings.rt_urls.length >= (plan?.rt_url_limit || 0)) {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Aşıldı',
                text: `Static URL limiti ${plan.rt_url_limit} adet ile sınırlıdır.`,
            });
            return;
        }
        handleSettingChange('rt_urls', [...settings.rt_urls, { url: '', frequency: '' }]);
    };

    const removeRtUrl = (index) => {
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
            Swal.fire({
                icon: 'warning',
                title: 'Limit Aşıldı',
                text: `Static URL limiti ${plan.static_url_limit} adet ile sınırlıdır.`,
            });
            return;
        }
        handleSettingChange('static_urls', [...settings.static_urls, { url: '', frequency: '' }]);
    };

    const removeStaticUrl = (index) => {
        const newUrls = [...settings.static_urls];
        newUrls.splice(index, 1);
        handleSettingChange('static_urls', newUrls);
    };



    const [saving, setSaving] = useState(false);
    const saveSettings = () => {
        setSaving(true);
        fetch(`http://localhost:5000/api/userSettings/settings/${user.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            ,
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
            <Sidebar>

                <Radio selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} role={userRole} />


            </Sidebar>
            <ContentArea>
                {(selectedMenu === 'rt' || selectedMenu === 'static' || selectedMenu === 'urlresults') && (
                    <HorizontalWrapper>
                        <ContentWrapper fullWidth>
                            {selectedMenu === 'rt' && (
                                <AccordionWrapper>
                                    <AccordionHeader onClick={() => setOpenRT(!openRT)}>
                                        Real Time URL Listesi ({filteredRtUrls.length})
                                    </AccordionHeader>
                                    <AccordionContent open={openRT}>
                                        {filteredRtUrls.map((item, idx) => (
                                            <Row key={idx}>
                                                <Input
                                                    type="text"
                                                    placeholder="Başlık"
                                                    value={item.name || ''}
                                                    onChange={e => handleRtUrlChange(idx, 'name', e.target.value)}
                                                    style={{ flex: 2 }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="RT URL"
                                                    value={item.url}
                                                    onChange={e => handleRtUrlChange(idx, 'url', e.target.value)}
                                                    style={{ flex: 3 }}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Çağrı Sıklığı (sn)"
                                                    value={item.frequency}
                                                    onChange={e => handleRtUrlChange(idx, 'frequency', Number(e.target.value))}
                                                    style={{ flex: 1 }}
                                                />
                                                <Silbuton onClick={() => removeRtUrl(idx)}>Sil</Silbuton>
                                            </Row>

                                        ))}
                                        <Button onClick={addRtUrl} isabled={filteredRtUrls.length >= (plan?.rt_url_limit || 0)}>
                                            URL Ekle
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
                                        Static URL Listesi ({filteredStaticUrls.length})
                                    </AccordionHeader>
                                    <AccordionContent open={openStatic}>
                                        {filteredStaticUrls.map((item, idx) => (
                                            <Row key={idx}>
                                                <Input
                                                    type="text"
                                                    placeholder="Başlık"
                                                    value={item.name || ''}
                                                    onChange={e => handleStaticUrlChange(idx, 'name', e.target.value)}
                                                    style={{ flex: 2 }}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Static URL"
                                                    value={item.url}
                                                    onChange={e => handleStaticUrlChange(idx, 'url', e.target.value)}
                                                    style={{ flex: 3 }}
                                                />

                                                <Input
                                                    type="number"
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
                                            disabled={filteredStaticUrls.length >= (plan?.static_url_limit || 0)}
                                        >
                                            URL Ekle
                                        </Button>
                                    </AccordionContent>
                                    <SaveButton onClick={saveSettings} disabled={saving}>
                                        Ayarları Kaydet
                                    </SaveButton>
                                </AccordionWrapper>
                            )}

                            {selectedMenu === 'urlresults' && (
                                <div style={{ flex: '1 1 100%', width: '100%' }}>

                                    <UrlResultsGrid userId={user.id} />
                                </div>

                            )}
                        </ContentWrapper>

                        {selectedMenu !== 'urlresults' && plan && (
                            <PlanCard>
                                <div className="card__heading">Plan</div>
                                <div className="card__price">{plan.name}</div>
                                <div className="card__bullets flow">
                                    <div>
                                        <strong>RT URL Limit:</strong> {plan.rt_url_limit}
                                    </div>
                                    <div>
                                        <strong>Static URL Limit:</strong> {plan.static_url_limit}
                                    </div>
                                    <div>
                                        <strong>Mevcut RT URL:</strong> {settings.rt_urls?.length || 0}
                                    </div>
                                    <div>
                                        <strong>Mevcut Static URL:</strong> {settings.static_urls?.length || 0}
                                    </div>
                                </div>
                            </PlanCard>
                        )}
                    </HorizontalWrapper>
                )
                }

                {
                    selectedMenu === 'upload' && (

                        <div>
                            <DragDropFileUpload></DragDropFileUpload>
                        </div>
                    )
                }
                {
                    selectedMenu === 'roller' && (
                        <div>
                            <Roller></Roller>
                        </div>

                    )
                }
                {selectedMenu === 'userTab' && (
                    <UserTab />
                )}




                {selectedMenu === 'profile' && <Profile user={user} settings={settings} />}
            </ContentArea>
        </Wrapper >
    );

};





export default Settings;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
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
  
  align-items: center;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
`;
const Sidebar = styled.div`
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
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
  display: inline-block;

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;
const Wrapper = styled.div`
  width:100%;
  margin: 0 auto;

  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  box-sizing: border-box;
padding: 20px 50px 20px 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
    padding: 10px;
  }
`;

const HorizontalWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
   
justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    justify-content: normal;
  }
`;
const ContentWrapper = styled.div`
  min-width: ${({ fullWidth }) => (fullWidth ? 'auto' : '350px')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  flex: 1 1 auto;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;



const PlanCard = styled.div`
  position: relative;
  width: 300px;
  padding: 20px;
  background-color: #446d92;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: linear-gradient(
      135deg,
      var(--e-global-color-secondary),
      var(--e-global-color-65fcc69)
    );
    z-index: -2;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &:hover::before {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      var(--e-global-color-secondary),
      var(--e-global-color-65fcc69)
    );
    transform: scale(0.98);
    filter: blur(20px);
    z-index: -2;
    transition: filter 0.3s ease;
  }

  &:hover::after {
    filter: blur(30px);
  }

  .cards__heading {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .cards__price {
    font-size: 1.2rem;
    color: #e81cff;
    font-weight: 600;
  }

  .cards__bullets {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* Profil kısmı için container */
const ProfileWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  @media (max-width: 768px) {
    /* Mobilde tam genişlik */
    width: 100%;
  }
`;

/* URL sonuçları container */
const UrlResultsContainer = styled.div`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 600px;

  @media (max-width: 768px) {
    max-height: none;
    overflow-y: visible;
  }
`;
