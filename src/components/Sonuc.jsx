import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { jwtDecode } from "jwt-decode";
import styled from 'styled-components';
import RemainingCredits from './RemainingCredits';
import { FiCopy, FiTerminal, FiSearch } from "react-icons/fi"; // Feather icons
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Grid,
    TextField,
    Button,
    IconButton,
    Typography,
    Collapse
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
function Sonuc() {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    const userRole = decoded?.role || 'viewer';
    const userId = localStorage.getItem('userId');

    const selectedUserStr = localStorage.getItem('selectedUser');
    const selectedUser = selectedUserStr ? JSON.parse(selectedUserStr) : null;
    const selectedUserId = selectedUser?.id;

    const effectiveUserId = (userRole === 'superadmin' && selectedUserId) ? selectedUserId : userId;







    const [settings, setSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [inputValues, setInputValues] = useState(true);

    const navigate = useNavigate();
    const plan = JSON.parse(localStorage.getItem('selectedPlan'));
    const methods = Array.isArray(plan?.metotlar) ? plan.metotlar : [];
    const [paramSchema, setParamSchema] = useState({});
    const [paramSchemaMap, setParamSchemaMap] = useState({});
    const [loadingParams, setLoadingParams] = useState(false);


    const userIdFromToken = decoded?.id;

    const customInputValues =
        JSON.parse(localStorage.getItem(`customInputValues${effectiveUserId}`) || 'null') ??
        JSON.parse(localStorage.getItem('customInputValues') || '{}');


    const [openIndex, setOpenIndex] = useState(null);

    const [creditStatus, setCreditStatus] = useState({
        isLimited: false,
        usedCredits: 0,
        creditLimit: 0,
    });

    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');

    const [params, setParams] = useState({});


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!effectiveUserId || !token) return;

        setLoadingSettings(true);

        fetch(`http://localhost:32807/api/userSettings/settings/${effectiveUserId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem(`userSettings_${effectiveUserId}`, JSON.stringify(data));
                setSettings({ ...data });
            })
            .catch(err => {
                console.error("Ayarlar alınırken hata:", err);
                setSettings({});
            })
            .finally(() => {
                setLoadingSettings(false);
            });
    }, [effectiveUserId]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!effectiveUserId || !token) return;

        setLoadingSettings(true);

        fetch(`http://localhost:32807/api/user_tab/${effectiveUserId}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem(`customInputValues${effectiveUserId}`, JSON.stringify(data));
                setInputValues({ ...data });
            })
            .catch(err => {
                console.error("Ayarlar alınırken hata:", err);
                setInputValues({});
            })
            .finally(() => {
                setLoadingSettings(false);
            });
    }, [effectiveUserId]);











    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        setApiResponse('');
        setApiError('');
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => Swal.fire({ icon: "success", title: "Kopyalandı" }))
            .catch(() => Swal.fire({ icon: "success", title: "Kopyalanamadı" }))
    };
    const getDisplayUrl = (methodKey) => {
        return `http://localhost:32807/api/busService/PassengerInformationServices/Bus?func=${methodKey}`;
    };


    const getFullUrl = (methodKey) => {
        const query = new URLSearchParams({ func: methodKey });
        const paramList = paramSchemaMap[methodKey]?.params;

        if (Array.isArray(paramList)) {
            paramList.forEach(({ field }) => {
                const value = params[methodKey]?.[field];
                if (value) {
                    query.append(field, value);
                }
            });
        }

        return `http://localhost:32807/api/busService/PassengerInformationServices/Bus?${query.toString()}`;
    };







    const handleQuery = async (methodKey) => {
        if (!token) {

            window.location.href = '/login';
            return;
        }

        if (creditStatus.isLimited) {
            Swal.fire('Kredi Limiti Doldu', 'Yeni istek yapamazsınız.', 'warning');
            return;
        }

        setApiError('');
        setApiResponse('Yükleniyor...');

        let creditUsed = false;

        try {

            let url = `http://localhost:32807/api/busService/PassengerInformationServices/Bus?func=${methodKey}`;

            paramSchemaMap[methodKey]?.params?.forEach(({ field }) => {
                const value = params[methodKey]?.[field];
                if (value) {
                    url += `&${field}=${encodeURIComponent(value)}`;
                }
            });

            const res = await fetch(url, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Bilinmeyen hata');
            }

            const data = await res.json();
            setApiResponse(data);


            const creditRes = await fetch('http://localhost:32807/api/credits/use', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!creditRes.ok) {
                const err = await creditRes.json();
                throw new Error(err.message || 'Kredi düşürme başarısız.');
            }

            creditUsed = true;

        } catch (error) {
            setApiResponse('');
            setApiError(error.message || 'Bir hata oluştu');
        } finally {

            if (!creditUsed && token) {
                try {
                    await fetch('http://localhost:32807/api/credits/use', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (e) {
                    console.error('Kredi düşme işlemi başarısız:', e.message);
                }
            }
        }
    };




    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch(`http://localhost:32807/api/credits/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Kredi durumu alınamadı');

                const data = await res.json();
                console.log('Credit status:', data);

                if (data.isLimited) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Kredi sınırına ulaşıldı',
                        text: `Kullanılan: ${data.usedCredits} / ${data.creditLimit}. Daha fazla işlem yapılamaz.`,
                    });
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error('Kredi kontrolü başarısız:', err);
            }
        }, 30000,);

        return () => clearInterval(intervalId);


    }, []);


    const styles = {
        container: {
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            maxWidth: 900,
            margin: 'auto',
            padding: '1rem',
            color: '#222',
        },
        methodHeader: {
            textTransform: 'uppercase',
            borderBottom: '3px solid #61affe',
            paddingBottom: 8,
            color: '#446d92',
            cursor: 'pointer',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: '600',
            fontSize: 16,
            backgroundColor: '#f7f7f7',
            marginTop: 15,
            borderRadius: '6px 6px 0 0',
        },
        paramList: {
            marginLeft: 0,
            paddingLeft: 0,
            listStyle: 'none',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
        },
        paramItem: {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 150px',
        },
        input: {
            padding: '6px 8px',
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 14,
            marginTop: 4,
        },
        buttonsRow: {
            marginTop: 12,
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            disabled: {
                cursor: 'not-allowed',
                opacity: 0.6,
            },

        },
        button: {
            padding: '6px 16px',
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: 14,
            transition: 'background-color 0.2s ease',
        },
        copyBtn: {
            backgroundColor: '#61affe',
            color: 'white',
        },
        curlBtn: {
            backgroundColor: '#49cc90',
            color: 'white',
        },
        queryBtn: {
            backgroundColor: '#f0ad4e',
            color: 'white',
        },
        responseBox: {
            marginTop: 15,
            backgroundColor: '#f6f8fa',
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 15,
            maxHeight: 300,
            overflowY: 'auto',
            fontSize: 13,
            fontFamily: 'Consolas, monospace',
            whiteSpace: 'pre-wrap',
            color: '#24292e',
            boxShadow: '0 2px 8px rgb(149 157 165 / 20%)',
        },
        errorBox: {
            marginTop: 15,
            color: '#d73a49',
            fontWeight: '700',
        },
        creditInfo: {
            marginTop: 25,
            fontWeight: '600',
            fontSize: 15,
            color: '#586069',
            borderTop: '1px solid #e1e4e8',
            paddingTop: 15,
        },
    };




    useEffect(() => {
        const fetchParamSchema = async () => {
            try {
                setLoadingParams(true);
                const res = await fetch('http://localhost:4000/api/params/api/params');
                if (!res.ok) throw new Error('Parametre şeması alınamadı');
                const data = await res.json();
                setParamSchemaMap(data);
            } catch (err) {
                console.error('Parametreler alınamadı:', err);
            } finally {
                setLoadingParams(false);
            }
        };

        fetchParamSchema();
    }, []);


    const EmptyStateWrapper = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#333")};


`;


    const [loading, setLoading] = useState(true);
    const [canAccess, setCanAccess] = useState(false);


    const hasRt = (settings?.settings?.rt_urls?.length ?? 0) > 0;
    const hasStatic = (settings?.settings?.static_urls?.length ?? 0) > 0;
    const hasInputs =
        (inputValues && Object.keys(inputValues).length > 0) ||
        (customInputValues && Object.keys(customInputValues).length > 0);

    if (!hasRt || !hasStatic || !hasInputs) {
        const darkMode = localStorage.getItem("theme") === "dark";

        return (
            <EmptyStateWrapper darkMode={darkMode}>
                <div
                    style={{
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        backgroundColor: "transparent",
                        color: darkMode ? "#fff" : "#333",
                    }}
                >
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>
                        Bu sayfa için gerekli ayarlar yapılmamış!
                    </h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', color: 'white' }}>
                        Devam edebilmek için önce gerekli ayarları tamamlamalısınız.
                    </p>
                    <button
                        onClick={() => navigate('/ayarlar?menu=ayarlar')}
                        style={{
                            backgroundColor: darkMode ? '#2563eb' : '#1e40af',
                            color: 'white',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = darkMode ? '#1e3a8a' : '#1a37a0';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = darkMode ? '#2563eb' : '#1e40af';
                        }}
                    >
                        Ayarları Tamamla
                    </button>
                </div>
            </EmptyStateWrapper>
        );
    }

    if (!plan || !plan.name || !plan.price) {



        if (loadingSettings) {
            return (
                <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem' }}>
                    Ayarlar yükleniyor...
                </div>
            );
        }
    }


    return (
        <StudioWrapper>
            {/* Header */}
            <TopBar>
                <div className="left">
                    <h2>API Studio</h2>

                </div>
                <div className="right">
                    <RemainingCredits userId={userId} role={userRole} />
                </div>
            </TopBar>

            {/* Layout */}
            <MainLayout>
                {/* Sidebar: Methods */}
                <Sidebar>
                    <SidebarHeader>
                        <span>Metotlar</span>
                        <span className="count">{methods.length}</span>
                    </SidebarHeader>

                    <MethodList>
                        {methods.map((mKey, i) => {
                            const active = openIndex === i;
                            return (
                                <MethodItem
                                    key={mKey}
                                    className={active ? 'active' : ''}
                                    onClick={() => handleToggle(i)}
                                    title={mKey}
                                >
                                    <span className="bullet" />
                                    <span className="name">{mKey}</span>
                                </MethodItem>
                            );
                        })}
                    </MethodList>
                </Sidebar>

                {/* Right: Builder + Response */}
                <WorkPane>
                    {methods.length === 0 ? (
                        <EmptyBlock>
                            Metot bulunamadı. Plan/metot ayarlarınızı kontrol edin.
                        </EmptyBlock>
                    ) : (
                        <>
                            {/* Üst URL bar (sticky) */}
                            <UrlBar>
                                <div className="method">{methods[openIndex ?? 0]}</div>
                                <div className="url">
                                    <code>{getDisplayUrl(methods[openIndex ?? 0])}</code>
                                </div>
                                <div className="actions">
                                    <button
                                        className="ghost"
                                        onClick={() => handleCopy(getFullUrl(methods[openIndex ?? 0]))}
                                    >
                                        <FiCopy style={{ marginRight: "6px" }} /> Kopyala
                                    </button>
                                    <button
                                        className="ghost"
                                        onClick={() =>
                                            handleCopy(
                                                `curl "${getFullUrl(methods[openIndex ?? 0])}" -H "Authorization: Bearer ${token}"`
                                            )
                                        }
                                    >
                                        <FiTerminal style={{ marginRight: "6px" }} /> cURL
                                    </button>
                                    <button
                                        className="primary"
                                        onClick={() => handleQuery(methods[openIndex ?? 0])}
                                    >
                                        <FiSearch style={{ marginRight: "6px" }} /> Sorgula
                                    </button>
                                </div>
                            </UrlBar>

                            {/* Params + Response paneli */}
                            <Panels>
                                <Panel>
                                    <PanelHeader>Parametreler</PanelHeader>
                                    <ParamsGrid>
                                        {paramSchemaMap[methods[openIndex ?? 0]]?.params?.length ? (
                                            paramSchemaMap[methods[openIndex ?? 0]].params.map(({ field, req }) => (
                                                <div key={field} className="field">
                                                    <label htmlFor={`${field}-${methods[openIndex ?? 0]}`}>
                                                        {field} {req && <span className="req">*</span>}
                                                    </label>
                                                    <input
                                                        id={`${field}-${methods[openIndex ?? 0]}`}
                                                        type="text"
                                                        placeholder={field}
                                                        value={params[methods[openIndex ?? 0]]?.[field] || ''}
                                                        onChange={(e) =>
                                                            setParams(prev => ({
                                                                ...prev,
                                                                [methods[openIndex ?? 0]]: {
                                                                    ...(prev[methods[openIndex ?? 0]] || {}),
                                                                    [field]: e.target.value
                                                                }
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <EmptyInline>Bu metoda ait parametre bulunmuyor.</EmptyInline>
                                        )}
                                    </ParamsGrid>
                                </Panel>

                                <Panel>
                                    <PanelHeader>Yanıt</PanelHeader>

                                    {apiError ? (
                                        <ErrorBox>{apiError}</ErrorBox>
                                    ) : apiResponse ? (
                                        <ResponseBox>
                                            {typeof apiResponse === 'string'
                                                ? apiResponse
                                                : JSON.stringify(apiResponse, null, 2)}
                                        </ResponseBox>
                                    ) : (
                                        <EmptyInline>Henüz yanıt yok. “Sorgula” ile deneyin.</EmptyInline>
                                    )}

                                    <FooterHint>
                                        <span>Tam URL:</span>
                                        <code>{getFullUrl(methods[openIndex ?? 0])}</code>
                                    </FooterHint>
                                </Panel>
                            </Panels>
                        </>
                    )}
                </WorkPane>
            </MainLayout>
        </StudioWrapper>
    );


}
;
const StudioWrapper = styled.div`
  --bg: #0b1220;
  --card: #0f172a;
  --muted: #94a3b8;
  --line: rgba(148, 163, 184, 0.2);
  --primary: #00aeef;
  --primary-dark: #007bbf;
  --accent: #0055a4;
  --success: #10b981;
  --danger: #ef4444;

  color: #e5e7eb;
  background: radial-gradient(1200px 600px at 20% -20%, #0b2345 0%, #0b1220 40%, #0b1220 100%);
  min-height: 100vh;
  padding: 16px;
`;

const TopBar = styled.div`
  position: sticky; top: 8px; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; 
  gap: 8px;
  background: linear-gradient(180deg, rgba(15,23,42,.9), rgba(15,23,42,.75));
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,.25);

  h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: .3px; }
  .hint { color: var(--muted); font-size: 12px; margin-left: 10px; }

  @media (max-width: 600px) {
    flex-direction: column; 
    align-items: flex-start; 
  }
`;


const MainLayout = styled.div`
  display: grid;
 grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  gap: 16px;
  margin-top: 14px;
  min-width: 0; 

  @media (max-width: 980px) {
   grid-template-columns: minmax(0, 1fr);
  }
`;

const Sidebar = styled.aside`
  background: rgba(15,23,42,.7);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  height: fit-content;
`;

const SidebarHeader = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
  span:first-child { font-weight: 800; letter-spacing: .3px; }
  .count {
    margin-left: auto;
    font-size: 11px; font-weight: 800;
    padding: 2px 8px; border-radius: 999px;
    background: rgba(0,174,239,.12);
    color: var(--primary);
    border: 1px solid rgba(0,174,239,.3);
  }
`;

const MethodList = styled.div`
  display: grid; gap: 6px;
`;

const MethodItem = styled.button`
  all: unset;
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px; cursor: pointer;
  border: 1px solid transparent;
  transition: .2s ease;
  color: #cbd5e1;

  .bullet { width: 8px; height: 8px; border-radius: 999px; background: #64748b; }
  .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  &:hover { background: rgba(148,163,184,.08); border-color: var(--line); }
  &.active { background: rgba(0,174,239,.12); border-color: rgba(0,174,239,.35); color: #e2f4ff; }
  &.active .bullet { background: var(--primary); }
`;

const WorkPane = styled.section`
  background: rgba(15,23,42,.7);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  min-width: 0;   
  max-width: 100%;
`;

const UrlBar = styled.div`
  position: sticky; 
  top: 60px; 
  z-index: 5;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  background: rgba(2,6,23,.6);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 12px;
  backdrop-filter: blur(6px);

  .method {
    font-weight: 900; 
    color: #e2f4ff; 
    background: rgba(0,85,164,.3);
    border: 1px solid rgba(0,85,164,.5);
    padding: 6px 10px; 
    border-radius: 999px; 
    font-size: 12px; 
    white-space: nowrap;
  }

  .url code {
    display: block; 
    font-family: Consolas, monospace; 
    font-size: 12px;
    color: #e2f4ff; 
    white-space: nowrap; 
    overflow-x: auto;
    max-width: 100%;
  }

  .actions {
    display: flex; 
    gap: 8px; 
    flex-wrap: wrap; 
    justify-content: flex-end;
    
  }
  

.actions .ghost {
    background-color: rgba(255, 255, 255, 0.2); /* Hafif şeffaf beyaz */
    color: #fff;/* Üstteki arka planla kontrast */
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    backdrop-filter: blur(5px); /* Şeffaflık altında hafif bulanıklık */
}

.actions .ghost:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px);
}

.actions .primary {
   background-color: rgba(255, 255, 255, 0.2); /* Modern degrade renk */
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    cursor: pointer;
}

.actions .primary:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    transform: translateY(-2px); /* Hafif yükselme efekti */
}


  button {
    border: 1px solid var(--line); 
    border-radius: 10px; 
    padding: 8px 12px;
    font-weight: 800; 
    cursor: pointer; 
    transition: .2s ease;
  }

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 8px;

    .url code {
      white-space: normal;  /* taşmayı önler */
      word-break: break-all; /* çok uzun url’leri kırar */
    }

    .actions {
      justify-content: flex-start;
      width: 100%;
    }
  }
`;

const Panels = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 12px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); /* içerik taşmasını engelle */

  @media (max-width: 980px) {
    grid-template-columns: 1fr; /* mobilde tek kolon */
  }
`;

const Panel = styled.div`
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(2,6,23,.5);
  padding: 12px;
  min-width: 0; /* bu olmazsa grid çocukları taşar */
  max-width: 100%; /* ekranı aşmasını önle */

  /* İçerik wrap ayarları */
  pre, code {
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 100%;
  }

  input, textarea {
    min-width: 0; /* grid içinde küçülebilmesi için */
    width: 100%;
  }
`;


const PanelHeader = styled.div`
  font-size: 12px; font-weight: 900; letter-spacing: .4px;
  color: #94d5ff; margin-bottom: 10px;
`;

const ParamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;

  .field { display: grid; gap: 6px; }
  label { font-size: 12px; color: #cbd5e1; }
  .req { color: #f87171; }

  input {
    width: 100%; padding: 10px 12px; border-radius: 10px;
    border: 1px solid var(--line); background: rgba(15,23,42,.8);
    color: #e5e7eb; font-weight: 600; outline: none;
    transition: .2s ease;
  }
  input:focus { border-color: rgba(0,174,239,.45); box-shadow: 0 0 0 3px rgba(0,174,239,.15); }
`;

const ResponseBox = styled.pre`
  margin: 0;
  background: rgba(0, 174, 239, .08);
  border: 1px solid rgba(0,174,239,.35);
  color: #e2f4ff;
  border-radius: 10px;
  padding: 12px;
 max-height: 360px;
  overflow: auto;
  font-size: 12px;
  font-family: Consolas, monospace;
  white-space: pre-wrap; /* 👈 önemli */
  word-break: break-word; /* 👈 uzun stringleri kır */
  
`;

const ErrorBox = styled.div`
  background: rgba(239, 68, 68,.08);
  border: 1px solid rgba(239,68,68,.35);
  color: #fecaca;
  border-radius: 10px;
  padding: 12px;
  font-weight: 800;
`;

const FooterHint = styled.div`
  margin-top: 10px;
  display: grid; gap: 6px;
  color: var(--muted);
  code { font-family: Consolas, monospace; color: #e2f4ff; }
`;

const EmptyBlock = styled.div`
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #9fb3c8;
`;

const EmptyInline = styled.div`
  border: 1px dashed var(--line);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  color: #9fb3c8;
`;


export default Sonuc;
