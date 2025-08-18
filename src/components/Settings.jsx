import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Input from './Input';
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
import { Card, CardHeader, CardContent, Button, IconButton, TextField, Grid, Typography, Divider, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
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
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.5rem',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: '#333',
                backgroundColor: '#0d1b2a'
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

                <Radio role={user.role} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} navOffset={64} />


            </Sidebar>
            <ContentArea navOffset={64} sidebarWidth={220}>
                {isReadOnly && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                        }}
                    >
                        <span style={{ color: 'white' }}>
                            Şu an {selectedUser?.email || "kullanıcı"} ayarlarını görüntülüyorsunuz.
                        </span>



                    </div>
                )}


                {(selectedMenu === 'rt' || selectedMenu === 'static' || selectedMenu === 'urlresults' || selectedMenu === 'ayarlar') && (
                    <HorizontalWrapper style={{ display: 'flex', flexDirection: 'column' }}>









                        {selectedMenu === 'urlresults' && (
                            <div>
                                <UrlResultsGrid userId={currentUser.id} />
                            </div>
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



const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #0d1b2a;
  display: flex;
  /* ÖNEMLİ: sarmayı kapat */
  flex-wrap: nowrap;
  gap: 20px;
  box-sizing: border-box;
  padding: 20px 50px 20px 20px;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const Sidebar = styled.div`
  /* ÖNEMLİ: sabit genişlikli flex-basis */
  flex: 0 0 220px;
  width: 220px;
  flex-shrink: 0;

  /* İsteğe bağlı: sticky yap, navbar 64px ise */
  position: sticky;
  top: 64px;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    flex: 0 0 auto;
  }
`;

const ContentArea = styled.div`
  /* ÖNEMLİ: min-width:0 ve width:auto */
  flex: 1 1 auto;
  min-width: 0;
  width: auto;

  display: flex;
  flex-direction: column;
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






