import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styled from 'styled-components';
import { Button as MuiButton, Box } from '@mui/material';

const UserTab = () => {
  const [selectedUser, setSelectedUser] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedUser"));
  });

  useEffect(() => {
    const onStorageChange = () => {
      setSelectedUser(JSON.parse(localStorage.getItem("selectedUser")));
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user?.role === "superadmin";
  const currentUserId = isSuperAdmin && selectedUser ? selectedUser.id : user?.id;
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState({});
  const [settings, setSettings] = useState({
    rt_urls: [],
    static_urls: [],
    autoRenew: false,
    notifications: false,
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    const url = isSuperAdmin && selectedUser
      ? `http://localhost:32807/api/user_tab?user_id=${selectedUser.id}`
      : "http://localhost:32807/api/user_tab";

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const initialValues = {};
        data.forEach(item => { initialValues[item.key_name] = item.value; });
        setValues(initialValues);
      })
      .catch(err => console.error("Kullanıcı değerleri çekilemedi:", err));
  }, [currentUserId]);



  const TooltipWrapper = styled.div`
        position: relative;
        display: inline-block;
        cursor: help;
    `;
  const TooltipText = styled.div`
        visibility: hidden;
        background-color: #0055A4; 
        color: white;
        text-align: left;
        border-radius: 6px;
        padding: 8px 12px;
        position: absolute;
        z-index: 100;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        min-width: 180px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        &::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: #0055A4 transparent transparent transparent;
        }
    `;
  const TooltipContainer = styled(TooltipWrapper)`
        &:hover ${TooltipText} {
            visibility: visible;
            opacity: 1;
        }
    `;
  function toDisplayName(key_name) {
    return key_name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchKeys = async () => {
      try {
        //
        const resSettings = await fetch(
          `http://localhost:32807/api/userSettings/settings/${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataSettings = await resSettings.json();

        const plan = dataSettings.plan || {};
        const customInputs = dataSettings.customInputs || {};


        const resKeys = await fetch(
          `http://localhost:32807/api/userSettings/full-keys/${currentUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const baseKeys = await resKeys.json();

        const keysWithValues = baseKeys.map(k => ({
          ...k,
          value: customInputs[k.key_name] || "",
          displayName: toDisplayName(k.key_name)
        }));

        setKeys(keysWithValues);


        setKeys(keysWithValues);

      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    };

    if (currentUserId) fetchKeys();
  }, [currentUserId]);









  const saveAll = async () => {
    const token = localStorage.getItem("token");

    // Zorunlu key-value alanlarını kontrol et
    const missingKeys = keys.filter(k => {
      const val = values[k.key_name];
      return k.required && (!val || val.trim() === "");
    });

    if (missingKeys.length > 0) {
      const missingKeyNames = missingKeys.map(k => k.key_name).join(", ");
      Swal.fire({
        title: "Zorunlu Alanlar Boş!",
        html: `Lütfen aşağıdaki zorunlu alanları doldurun:<br><b>${missingKeyNames}</b>`,
        icon: "warning",
        confirmButtonText: "Tamam"
      });
      return;
    }


    const kvPayload = Object.entries(values).map(([key_name, value]) => ({ key_name, value }));


    const entriesObj = Object.fromEntries(kvPayload.map(kv => [kv.key_name, kv.value]));

    const rt_urls = Object.entries(entriesObj)
      .filter(([k, v]) => k.toLowerCase().includes('rt url') && v)
      .map(([_, v]) => v);

    const static_urls = Object.entries(entriesObj)
      .filter(([k, v]) => k.toLowerCase().includes('static url') && v)
      .map(([_, v]) => v);

    const fullSettings = {
      ...entriesObj,
      rt_urls,
      static_urls,
    };


    try {
      // user_tab kaydı
      const res1 = await fetch("http://localhost:32807/api/user_tab", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: kvPayload, user_id: isSuperAdmin && selectedUser ? selectedUser.id : undefined }),
      });
      const result1 = await res1.json();
      if (!result1.success) throw new Error("User tab kaydı başarısız");

      // userSettings kaydı
      const res2 = await fetch(`http://localhost:32807/api/userSettings/settings/${currentUserId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: fullSettings }),
      });
      if (!res2.ok) throw new Error("UserSettings kaydı başarısız");

      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Tüm ayarlar ve URL’ler kaydedildi!',
        confirmButtonColor: '#3085d6',
      });

      const lsKey = `customInputValues${currentUserId}`;
      const existing = JSON.parse(localStorage.getItem(lsKey)) || {};
      const updated = { ...existing, ...values };
      localStorage.setItem(lsKey, JSON.stringify(updated));



    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: 'Kaydetme sırasında bir hata oluştu!',
        confirmButtonColor: '#d33',
      });
    }
  };



  return (
    <PageWrapper>
      {/* Sticky Action Bar */}
      <ActionBar>
        <div className="left">
          <h2>Kullanıcı Ayarları</h2>
          <div className="meta">
            <span className="pill role">
              {isSuperAdmin ? 'Superadmin' : 'User'}
            </span>
            {selectedUser && isSuperAdmin && (
              <span className="pill user">
                {selectedUser?.name || selectedUser?.email || `ID: ${selectedUser?.id}`}
              </span>
            )}
          </div>
        </div>

        <div className="right">
          <MuiButton
            onClick={saveAll}
            disabled={isSuperAdmin && selectedUser}
            sx={{
              background: "linear-gradient(135deg, #0055A4, #00AEEF)",
              color: "#fff",
              px: 2.2,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #004080, #0091CC)",
              }
            }}
            variant="contained"
          >
            Değerleri Kaydet
          </MuiButton>
        </div>
      </ActionBar>

      <ContentArea>

        <SummaryCard>
          <div className="row">
            <div className="item">
              <span className="label">Toplam Alan</span>
              <span className="value">{keys.length}</span>
            </div>
            <div className="item">
              <span className="label">Zorunlu</span>
              <span className="value">{keys.filter(k => k.required).length}</span>
            </div>
            <div className="item">
              <span className="label">Düzenlenebilir</span>
              <span className="value">
                {isSuperAdmin && selectedUser ? 0 : keys.length}
              </span>
            </div>
          </div>
        </SummaryCard>

        {/* Grid (Table yerine) */}
        {keys.length === 0 ? (
          <EmptyState>
            <div className="bubble">ℹ️</div>
            <h3>Henüz tanımlanmış ayar yok</h3>
            <p>Alanlar eklendiğinde burada görünecek.</p>
          </EmptyState>
        ) : (
          <SectionList>
            {Object.entries(
              keys.reduce((acc, k) => {
                // basit grup: key_name prefix (örn: api_key -> api)
                const group =
                  (k.group && String(k.group)) ||
                  (k.key_name?.includes('_') ? k.key_name.split('_')[0] : 'Genel');
                acc[group] = acc[group] || [];
                acc[group].push(k);
                return acc;
              }, {})
            ).map(([groupName, groupKeys]) => (
              <Section key={groupName}>
                <SectionHeader>
                  <details open>
                    <summary>
                      <span className="title">{groupName.toUpperCase()}</span>
                      <span className="count">{groupKeys.length}</span>
                    </summary>
                  </details>
                </SectionHeader>

                <Rows>
                  {groupKeys.map((k) => (
                    <Row key={k.key_name}>
                      <Cell className="left">
                        <TooltipContainer>
                          <span className="name">
                            {k.displayName}
                            {k.required && <span className="req"> *</span>}
                          </span>
                          {k.description && <TooltipText>{k.description}</TooltipText>}
                        </TooltipContainer>
                      </Cell>

                      <Cell className="mid">
                        <span className="chip">{k.type}</span>
                      </Cell>

                      <Cell className="right">
                        <input
                          type={k.type === "number" ? "number" : "text"}
                          value={values[k.key_name] || ""}
                          disabled={isSuperAdmin && selectedUser}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (k.type === "number" && isNaN(Number(val))) return;
                            setValues((prev) => ({ ...prev, [k.key_name]: val }));
                          }}
                          placeholder="Değer girin"
                          title={isSuperAdmin && selectedUser ? "Superadmin başka kullanıcı için değer giremez" : ""}
                        />
                      </Cell>
                    </Row>
                  ))}
                </Rows>
              </Section>
            ))}
          </SectionList>
        )}

      </ContentArea>
    </PageWrapper>
  );

};

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(280px, 1fr) );
  gap: 12px;
`;

const SettingCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.03);
  display: grid;
  gap: 10px;

  .header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      .name {
        font-weight: 700; 
        color: #0b2345;
      }
      .required { color: #d92d20; }
    }

    .chip {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 999px;
      background: #e6f4ff;
      color: #0055A4;
      border: 1px solid rgba(0,85,164,0.15);
      white-space: nowrap;
      align-self: start;
    }
  }

  .control input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #111827;
    font-weight: 600;
    outline: none;
    transition: box-shadow .2s ease, border-color .2s ease;

    &:hover { border-color: #9ca3af; }
    &:focus { 
      border-color: #0055A4;
      box-shadow: 0 0 0 3px rgba(0,85,164,0.15);
    }
    &:disabled {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const PageWrapper = styled.div`
  /* Tonu beğenene kadar şu 3 presetten birini seç */
  /* A) Slate (nötr ve yumuşak) */
  --surface: #15273a;
  --surface-2: #1b3550;

  /* B) Ink (bir tık koyu, daha kontrast) */
  /* --surface: #0f2133;
     --surface-2: #143049; */

  /* C) Glassy (hafif saydam, cam etkisi) */
  /* --surface: rgba(21, 39, 58, 0.85);
     --surface-2: rgba(27, 53, 80, 0.85);
     --border: rgba(148,163,184,0.22); */

  --page-bg: #0b1624;
  --border: rgba(148,163,184,0.18);
  --text: #e9f2ff;
  --muted: #9fb3c8;
  --accent: #38bdf8;

  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: clamp(12px, 2vw, 20px) clamp(12px, 3vw, 24px) 32px;
  padding-top: calc(var(--nav-offset, 64px) + 12px);
  background: var(--page-bg);
  color: var(--text);
`;



const ActionBar = styled.div`
  position: sticky;
  top: var(--nav-offset);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 18px rgba(0,0,0,0.04);
  margin-bottom: 16px;

  /* küçük ekranda kaymayı önle */
  flex-wrap: wrap;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    h2 {
      margin: 0;
      font-size: clamp(16px, 2.2vw, 20px);
      font-weight: 800;
      color: #0b2345;
      letter-spacing: .2px;
      white-space: nowrap;
    }

    .meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .pill {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        border: 1px solid rgba(0,0,0,0.06);
        &.role { background: #e8f3ff; color: #0055A4; }
        &.user { background: #f4f6f8; color: #333; }
      }
    }
  }

  .right {
    display: flex; 
    align-items: center; 
    gap: 10px;
    margin-left: auto;

    /* buton küçük ekranda taşmasın */
    & > * { white-space: nowrap; }
  }
`;

const ContentArea = styled.div`
  display: grid;
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
`;

const SummaryCard = styled.div`
 

   background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
  color:#fff;

  .row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px 12px;
  }
  .item {
    display: grid;
    gap: 2px;
    .label { font-size: 12px; color: #fff; }
    .value { font-size: 16px; font-weight: 800; color: #fff; }
  }
`;

const SectionList = styled.div`
  display: grid;
  gap: 14px;
`;

const Section = styled.section`
  
  

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  /* ÖNEMLİ: tooltip kırpılmasın */
  overflow: visible;
`;

const SectionHeader = styled.div`
  details { padding: 10px 14px; }
  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  summary::-webkit-details-marker { display: none; }

  .title {
    font-weight: 800;
    color: #0b2345;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: .4px;
  }
  .count {
    margin-left: auto;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 999px;
    background: #e6f4ff;
    color: #0055A4;
    border: 1px solid rgba(0,85,164,0.15);
  }
`;

/* Masaüstünde tablo düzeni, mobilde kart/stak düzeni */
const Rows = styled.div`
  display: grid;
  gap: 8px;
  padding: 8px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 90px 2fr;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background:#0d1b2a;
  color:#fff;
&:nth-child(2n){ background: var(--surface-2); }
  

  /* <=768px: tek sütuna düş, giriş alanı altta */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 12px;

    .mid { order: 3; }   /* type chip en sona */
    .right { order: 2; } /* input ortada */
    .left { order: 1; }
  }
`;

const Cell = styled.div`
  &.left .name { color: var(--text); }
  &.left .req { color: #f87171; }

  &.mid .chip{
    background: rgba(56,189,248,.12);
    color: var(--accent);
    border: 1px solid rgba(56,189,248,.35);
  }

  &.right input{
    width: 100%; min-width: 0;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #0f2740;
    color: var(--text);
    &::placeholder{ color: var(--muted); }
    &:hover{ border-color: var(--muted); }
    &:focus{ border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56,189,248,.25); }
    &:disabled{ background: #1e293b; color: var(--muted); }
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
  max-width: 100%;
`;
const TooltipText = styled.div`
  visibility: hidden;
  background-color: #0055A4; 
  color: white;
  text-align: left;
  border-radius: 8px;
  padding: 8px 12px;
  position: absolute;
  z-index: 100;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s ease;
  min-width: 180px;
  max-width: min(320px, 80vw);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  word-wrap: break-word;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: #0055A4 transparent transparent transparent;
  }

  @media (max-width: 480px){
    left: 50%;
    transform: translateX(-50%);
  }
`;
const TooltipContainer = styled(TooltipWrapper)`
  &:hover ${TooltipText} { visibility: visible; opacity: 1; }
`;

/* Boş durum */
const EmptyState = styled.div`
  border: 1px dashed rgba(0,0,0,0.15);
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  background: #0d1b2a;;

  .bubble {
    width: 44px; height: 44px; border-radius: 999px;
    margin: 0 auto 8px; display: grid; place-items: center;
    background: #0d1b2a; color: #0055A4;
    font-size: 22px; font-weight: 800;
  }
  h3 { margin: 6px 0 4px; color: #0b2345; font-size: clamp(16px, 2.4vw, 18px); }
  p { margin: 0; color: #6b7280; font-size: 14px; }
`;





export default UserTab;
