import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
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
import { Button as MuiButton } from '@mui/material';
import RemainingCredits from './RemainingCredits';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { jwtDecode } from "jwt-decode";
import UserTab from './UserTab';
import Sonuc from './Sonuc';
const Settings = ({ user }) => {

    const localSelectedUser = localStorage.getItem("selectedUser");
    const selectedUser = localSelectedUser ? JSON.parse(localSelectedUser) : null;


    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const menuFromUrl = searchParams.get('menu') || 'ayarlar';
    const [selectedMenu, setSelectedMenu] = useState(menuFromUrl);

    const token = localStorage.getItem("token");
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.role || "viewer";
    const currentUser = (userRole === 'superadmin' && selectedUser) ? selectedUser : user;


    const isSuperAdmin = user?.role === "superadmin";
    const [keys, setKeys] = useState([]);
    const [values, setValues] = useState({});
    const [plan, setPlan] = useState(null);
    const [settings, setSettings] = useState({
        rt_urls: [],
        static_urls: [],
        autoRenew: false,
        notifications: false,
    });
    const [loading, setLoading] = useState(true);
    const [fakeFileSize, setFakeFileSize] = useState(0);

    useEffect(() => {
        setSelectedMenu(menuFromUrl);
    }, [menuFromUrl]);
    const handleMenuChange = (key) => {
        setSelectedMenu(key);
        setSearchParams({ menu: key });
    };

    const [openRT, setOpenRT] = useState(true);
    const [openStatic, setOpenStatic] = useState(true);

    const [results, setResults] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deletedUrls, setDeletedUrls] = useState([]);


    const isReadOnly = decoded?.id !== currentUser?.id;

    const filteredRtUrls = settings.rt_urls.filter(item =>
        !deletedUrls.some(d => d.url === item.url && d.type === 'sonuc')
    );

    const filteredStaticUrls = settings.static_urls.filter(item =>
        !deletedUrls.some(d => d.url === item.url && d.type === 'static')
    );


    const fetchDeletedUrls = async () => {
        const res = await fetch(`http://localhost:32807/api/userSettings/settings/deleted-urls/${currentUser.token}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        setDeletedUrls(data);
    };



    useEffect(() => {
        if (!currentUser?.id) {

            return;
        }

        fetch(`http://localhost:32807/api/userSettings/settings/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const defaultSettings = {
                    rt_urls: [],
                    static_urls: [],
                    autoRenew: false,
                    notifications: false,
                };

                const settingsData = data.settings || {};
                const newSettings = {
                    ...defaultSettings,
                    ...settingsData,
                    rt_urls: Array.isArray(settingsData.rt_urls) ? settingsData.rt_urls : [],
                    static_urls: Array.isArray(settingsData.static_urls) ? settingsData.static_urls : [],
                };


                setSettings(newSettings);

                if (data.plan) {
                    setPlan(data.plan);
                } else {
                    setPlan(null);
                }

                const existingUserSettings = JSON.parse(localStorage.getItem("userSettings")) || {};
                const customInputValues = JSON.parse(localStorage.getItem('customInputValues')) || {}
                const updatedUserSettings = {
                    ...existingUserSettings,
                    customInputValues: {
                        ...existingUserSettings.customInputValues,
                        ...customInputValues,
                    },
                    settings: {
                        ...existingUserSettings.settings,
                    },
                };

                localStorage.setItem("userSettings", JSON.stringify(updatedUserSettings));


                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [currentUser?.id]);



    const fetchResults = () => {
        if (!currentUser?.id) return;

        let url = `http://localhost:32807/api/userSettings/urlResults/${currentUser.id}`;
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
    }, [selectedMenu, currentUser?.id]);
    useEffect(() => {
        if (!currentUser?.id) {
            setLoading(false);
            return;
        }

        if (!token) {
            console.error("Token yok, giriş yapmalısınız.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:32807/api/userSettings/settings/${currentUser.id}`, {
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

            })
            .catch(err => {
                console.error(err.message);
                setLoading(false);
            });
    }, [currentUser?.id, token]);


    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    /*useEffect(() => {
        if (!user?.id) return;

        fetch(`http://localhost:32807/api/userSettings/settings/deleted-urls/${user.id}`, {
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
        if (isReadOnly) {
            Swal.fire({
                icon: 'error',
                title: 'Yetkisiz Erişim',
                text: 'Başka bir kullanıcının ayarlarını değiştiremezsiniz.',
            });
            return;
        }
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
        if (isReadOnly) {
            Swal.fire({
                icon: 'error',
                title: 'Yetkisiz Erişim',
                text: 'Başka bir kullanıcının ayarlarını değiştiremezsiniz.',
            });
            return;
        }
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
        if (isReadOnly) {
            Swal.fire({
                icon: 'error',
                title: 'Yetkisiz Erişim',
                text: 'Başka bir kullanıcının ayarlarını değiştiremezsiniz.',
            });
            return;
        }

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
        if (isReadOnly) {
            Swal.fire({
                icon: 'error',
                title: 'Yetkisiz Erişim',
                text: 'Başka bir kullanıcının ayarlarını değiştiremezsiniz.',
            });
            return;
        }
        const newUrls = [...settings.static_urls];
        newUrls.splice(index, 1);
        handleSettingChange('static_urls', newUrls);
    };



    const [saving, setSaving] = useState(false);
    const saveSettings = () => {
        setSaving(true);
        fetch(`http://localhost:32807/api/userSettings/settings/${currentUser.id}`, {
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




    function exportToCurl(item) {
        const params = new URLSearchParams(item.params || {}).toString();
        const fullUrl = `${item.accessUrl}?${params}`;
        const curl = `curl "${fullUrl}" -X GET`;
        navigator.clipboard.writeText(curl);
        alert('cURL komutu kopyalandı!');
    }

    if (loading) return <p>Yükleniyor...</p>;
    if (!plan) return <p>Ödenmiş plan bulunamadı.</p>;
    const countValidUrls = filteredStaticUrls.filter(item => item.url && item.url.trim() !== '').length;
    const countrtUrls = filteredRtUrls.filter(item => item.url && item.url.trim() !== '').length;

    if (plan.name === null) {
        return (
            <div style={{
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: '#333'
            }}>
                <p style={{ fontSize: '1.2rem', color: 'white' }}>
                    Ödeme yapılmadığı için bu sayfaya erişim yok.
                </p>
                <button
                    onClick={() => navigate('/pricing')}
                    style={{
                        backgroundColor: '#2563eb', // canlı mavi
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e40af'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    Plan satın alın!
                </button>
            </div>
        );
    }


    return (
        <Wrapper>
            <Sidebar>

                <Radio selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} role={userRole} />


            </Sidebar>
            <ContentArea>
                {isReadOnly && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <span style={{ color: 'gray' }}>
                            Şu an {selectedUser?.email || "kullanıcı"} ayarlarını görüntülüyorsunuz.
                        </span>

                        <MuiButton
                            variant="outlined"
                            color="secondary"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => {
                                localStorage.removeItem("selectedUser");
                                navigate('/admin');
                            }}
                        >
                            Admin Paneline Geri Dön
                        </MuiButton>

                    </div>
                )}


                {(selectedMenu === 'rt' || selectedMenu === 'static' || selectedMenu === 'urlresults' || selectedMenu === 'ayarlar') && (
                    <HorizontalWrapper>
                        <ContentWrapper fullWidth>
                            {selectedMenu === 'rt' || selectedMenu === 'ayarlar' && (
                                <AccordionWrapper>
                                    <AccordionHeader onClick={() => setOpenRT(!openRT)}>
                                        Real Time URL Listesi ({countrtUrls})
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


                                                <Silbuton onClick={() => removeRtUrl(idx)} disabled={isReadOnly} title={isReadOnly ? "Başka bir kullanıcının ayarlarını silemezsiniz." : "URL'yi sil"}  >
                                                    Sil
                                                </Silbuton>


                                            </Row>

                                        ))}
                                        <Button onClick={addRtUrl} disabled={isReadOnly || filteredRtUrls.length >= (plan?.rt_url_limit || 0)}
                                            title={
                                                isReadOnly
                                                    ? "Başka bir kullanıcının ayarlarına URL ekleyemezsiniz."
                                                    : filteredRtUrls.length >= (plan?.rt_url_limit || 0)
                                                        ? `URL sınırına ulaşıldı (${plan?.rt_url_limit || 0} adet)`
                                                        : "Yeni URL ekle"
                                            }

                                        >
                                            URL Ekle
                                        </Button>



                                    </AccordionContent>



                                </AccordionWrapper>


                            )}



                            {selectedMenu === 'static' || selectedMenu === 'ayarlar' && (
                                <AccordionWrapper >
                                    <AccordionHeader onClick={() => setOpenStatic(!openStatic)} >
                                        Static URL Listesi ({countValidUrls})

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
                                                <Silbuton onClick={() => removeStaticUrl(idx)} disabled={isReadOnly} title={isReadOnly ? "Başka bir kullanıcının ayarlarını silemezsiniz." : "URL'yi sil"}>
                                                    Sil
                                                </Silbuton>
                                            </Row>



                                        ))}

                                        <Button onClick={addStaticUrl}
                                            disabled={isReadOnly || filteredStaticUrls.length >= (plan?.static_url_limit || 0)}
                                            title={
                                                isReadOnly
                                                    ? "Başka bir kullanıcının ayarlarına static URL ekleyemezsiniz."
                                                    : filteredStaticUrls.length >= (plan?.static_url_limit || 0)
                                                        ? `Static URL sınırına ulaşıldı (${plan?.static_url_limit || 0} adet)`
                                                        : "Yeni static URL ekle"
                                            }
                                        >
                                            URL Ekle
                                        </Button>



                                    </AccordionContent>
                                    <SaveButton onClick={saveSettings} disabled={saving || isReadOnly} title={
                                        isReadOnly
                                            ? "Başka bir kullanıcının ayarlarını kaydedemezsiniz."
                                            : saving
                                                ? "Kaydediliyor..."
                                                : "Ayarları kaydet"
                                    }>
                                        Ayarları Kaydet
                                    </SaveButton>





                                </AccordionWrapper>
                            )}

                            {selectedMenu === 'urlresults' && (
                                <div >

                                    <UrlResultsGrid userId={currentUser.id} />
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
                                        <strong>Mevcut RT URL:</strong> {settings.rt_urls?.filter(item => item.url && item.url.trim() !== '').length || 0}
                                    </div>
                                    <div>
                                        <strong>Mevcut Static URL:</strong> {settings.static_urls?.filter(item => item.url && item.url.trim() !== '').length || 0}
                                    </div>
                                    <div>
                                        <storng>
                                            Kredi Durumu:
                                        </storng>
                                        <RemainingCredits
                                            userId={userRole === 'superadmin' ? selectedUser?.id : currentUser.id}
                                            role={userRole}
                                        />


                                    </div>
                                </div>
                            </PlanCard>
                        )}

                    </HorizontalWrapper>
                )
                }
                {selectedMenu === 'sonuc' && (
                    <div>
                        <Sonuc></Sonuc>
                    </div>
                )}

                {
                    selectedMenu === 'upload' && (

                        <div>
                            <DragDropFileUpload plan={plan} user={currentUser} />



                        </div>
                    )
                }
                {
                    selectedMenu === 'kullanıcılar' && (
                        <div>
                            <Roller></Roller>
                        </div>

                    )
                }
                {selectedMenu === 'userTab' || selectedMenu === 'ayarlar' && (


                    <UserTab />



                )}





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
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
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


const ProfileWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  @media (max-width: 768px) {
    /* Mobilde tam genişlik */
    width: 100%;
  }
`;


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
