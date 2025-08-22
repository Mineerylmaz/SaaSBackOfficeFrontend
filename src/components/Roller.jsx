import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { color } from "@chakra-ui/react";
import { FiEye, FiEdit, FiShield } from "react-icons/fi";
const Silbuton = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: "6px 12px",
            background: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        }}
    >
        Sil
    </button>
);



function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
}

export default function Roller() {
    const [userPlanRoles, setUserPlanRoles] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");


    const width = useWindowWidth();

    const [darkMode, setDarkMode] = useState(() => {
        const localDark = localStorage.getItem("darkMode");
        if (localDark === "true") return true;
        if (localDark === "false") return false;
        return false;
    });


    const user = JSON.parse(localStorage.getItem("user"));
    const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));
    const isSuperAdmin = user?.role === "superadmin";

    const currentUserId = isSuperAdmin && selectedUser ? selectedUser.id : user?.id;
    const currentUserEmail = isSuperAdmin && selectedUser ? selectedUser.email : user?.email;

    const handleSil = async (email) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ icon: "error", title: "Hata!", text: "Kullanıcı token bulunamadı!" });
            return;
        }

        try {
            const response = await fetch(`http://localhost:32807/api/invites/${encodeURIComponent(email)}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = "Silme başarısız";
                try {
                    const responseText = await response.text();
                    const err = JSON.parse(responseText);
                    errorMessage = err.error || errorMessage;
                } catch {

                    console.error("Beklenmeyen yanıt:", await response.text());
                }
                throw new Error(errorMessage);
            }


            const filtered = invites.filter(i => i.email !== email);
            setInvites(filtered);
            localStorage.setItem(`invites-${userEmail}`, JSON.stringify(filtered));

            Swal.fire({ icon: "success", title: "Davet Silindi!" });

        } catch (error) {
            console.error("Silme hatası:", error);
            Swal.fire({ icon: "error", title: "Hata!", text: error.message });
        }
    };




    async function fetchUserPlan() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return null;

        try {
            const res = await fetch(`http://localhost:32807/api/userSettings/settings/${currentUserId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


            if (!res.ok) throw new Error('Plan alınamadı');

            const data = await res.json();
            const plan = data.plan;

            if (plan) {
                if (typeof plan.roles === "string") {
                    plan.roles = JSON.parse(plan.roles);
                }
                localStorage.setItem('selectedPlan', JSON.stringify(plan));
                return plan;
            }
            return null;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    useEffect(() => {
        const loadPlan = async () => {
            const planFromStorage = localStorage.getItem('selectedPlan');
            if (planFromStorage) {
                const plan = JSON.parse(planFromStorage);
                if (plan?.roles) {
                    setUserPlanRoles(plan.roles);
                    return;
                }
            }
            const freshPlan = await fetchUserPlan();
            if (freshPlan?.roles) {
                setUserPlanRoles(freshPlan.roles);
            }
        };
        loadPlan();
    }, []);
    const [inviterInvites, setInviterInvites] = useState([]);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.invitedBy) return;

        const fetchInviterInvites = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`http://localhost:32807/api/invites/by-inviter/${encodeURIComponent(user.invitedBy)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error("Davet listesi alınamadı");
                const data = await res.json();
                setInviterInvites(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInviterInvites();
    }, []);

    const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "default";
    const [invites, setInvites] = useState(() => {
        const saved = localStorage.getItem(`invites-${currentUserEmail}`);
        return saved ? JSON.parse(saved) : [];
    });


    useEffect(() => {
        const planStr = localStorage.getItem("selectedPlan");
        if (planStr) {
            const plan = JSON.parse(planStr);
            if (plan && plan.roles) {
                setUserPlanRoles(plan.roles);
            } else {
                setUserPlanRoles([]);
            }
        } else {
            setUserPlanRoles([]);
        }
    }, []);

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const handleReject = async (inviteToken) => {
        try {
            const res = await fetch("http://localhost:32807/api/invites/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: inviteToken })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Davet reddedilemedi");
            }
            setInvites(prev =>
                prev.map(inv =>
                    inv.id === inviteToken ? { ...inv, status: "rejected" } : inv
                )
            );

            Swal.fire({
                icon: "info",
                title: "Davet reddedildi",
                text: "Bu davete katılmadınız."
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Hata!",
                text: err.message
            });
        }
    };


    const handleInvite = async () => {
        if (isSuperAdmin && selectedUser) {
            Swal.fire({
                icon: "error",
                title: "İzin Yok",
                text: "Superadmin başka kullanıcı adına davet gönderemez.",
                confirmButtonColor: "#d33"
            });
            return;
        }
        if (!inviteEmail || !inviteRole) {
            return Swal.fire({ icon: "error", title: "Hata!", text: "Email ve rol seçiniz!", confirmButtonColor: "#d33" });
        }

        const alreadyInvited = invites.some(
            i => i.email.toLowerCase() === inviteEmail.toLowerCase() &&
                ["pending", "accepted", "rejected"].includes(i.status)
        );

        if (alreadyInvited) {
            return Swal.fire({
                icon: "info",
                title: "Davet Gönderilemez",
                text: "Bu kullanıcıya daha önce davet gönderilmiş.",
                confirmButtonColor: "#d33"
            });
        }

        if (!validateEmail(inviteEmail)) {
            return Swal.fire({ icon: "error", title: "Geçersiz Email!", text: "Lütfen geçerli bir email adresi giriniz!", confirmButtonColor: "#d33" });
        }

        const planLimit = userPlanRoles.find(r => r.role === inviteRole)?.count || 0;
        const currentCount = invites.filter(i => i.role === inviteRole && i.status === "accepted").length;



        if (currentCount >= planLimit) {
            return Swal.fire({
                icon: "error",
                title: "Limit Aşıldı!",
                text: `Bu plana göre maksimum ${planLimit} ${inviteRole} davet edebilirsin!`,
                confirmButtonColor: "#d33"
            });
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Kullanıcı token bulunamadı!');

            const response = await fetch(`http://localhost:32807/api/invites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole, inviterEmail: currentUserEmail })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Davet oluşturulamadı');
            }

            const data = await response.json();
            const inviteLink = `${window.location.origin}/register/${data.token}`;

            const newInvite = {
                id: data.token,
                email: inviteEmail,
                role: inviteRole,
                status: "pending"
            };

            const updatedInvites = [...invites, newInvite];
            setInvites(updatedInvites);
            localStorage.setItem(`invites-${userEmail}`, JSON.stringify(updatedInvites));

            Swal.fire({
                icon: "success",
                title: "Davet Linki Oluşturuldu",
                html: `
    <p>Davet linki: <a href="${inviteLink}" target="_blank">${inviteLink}</a></p>
    <button id="rejectBtn" style="
      margin-top: 10px;
      padding: 5px 15px;
      background-color: #d33;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    ">Reddet</button>
  `,
                showConfirmButton: true,
                didOpen: () => {
                    const rejectBtn = document.getElementById("rejectBtn");
                    if (rejectBtn) {
                        rejectBtn.addEventListener("click", () => {
                            handleReject(newInvite.id); // doğru token gönderiliyor
                            Swal.close();
                        });
                    }
                }
            });


            setInviteEmail("");
            setInviteRole("");

        } catch (error) {
            console.error(error);
            Swal.fire({ icon: "error", title: "Hata!", text: error.message, confirmButtonColor: "#d33" });
        }
    };
    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const token = localStorage.getItem("token");

                let url;
                if (isSuperAdmin && selectedUser) {
                    // superadmin ise, seçilen kullanıcının davetlerini getir
                    url = `http://localhost:32807/api/invites/by-inviter/${encodeURIComponent(selectedUser.email)}`;
                } else {
                    // normal kullanıcı kendi davetlerini görsün
                    url = "http://localhost:32807/api/invites/";
                }

                const res = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Davetler getirilemedi");

                const data = await res.json();
                setInvites(data);

                // cache de superadmin için farklı key ile tutulmalı
                const cacheKey = isSuperAdmin && selectedUser
                    ? `invites-${selectedUser.email}`
                    : `invites-${userEmail}`;

                localStorage.setItem(cacheKey, JSON.stringify(data));
            } catch (err) {
                console.error("Davetiye fetch hatası:", err);
            }
        };

        fetchInvites();
    }, [userEmail, isSuperAdmin, selectedUser]);


    const groupedInvites = invites.reduce((acc, curr) => {
        if (!acc[curr.role]) acc[curr.role] = [];
        acc[curr.role].push(curr);
        return acc;
    }, {});


    const roleIcons = {
        viewer: <FiEye />,
        editor: <FiEdit />,
        admin: <FiShield />
    };
    const roleColors = { viewer: darkMode ? "#1a1a1a" : "#E0F7FA", editor: darkMode ? "#2a1a00" : "#FFF3E0", admin: darkMode ? "#142a14" : "#E8F5E9" };

    return (
        <Page>
            {/* Üst bar */}
            <TopBar>
                <div className="left" >
                    <h2>Takım Erişimleri</h2>
                    <span className="sub">Davet gönder, rolleri yönet</span>
                </div>


            </TopBar>

            {/* Davet kartı */}
            <InviteCard $dark={darkMode}>
                <div className="head">
                    <div className="title">Kullanıcı Davet Et</div>
                    <div className="hint">Planında tanımlı roller kadar davet edebilirsin.</div>
                </div>

                <FormRow>
                    <Field>
                        <label>E‑posta</label>
                        <Input
                            type="email"
                            placeholder="ornek@domain.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            $dark={darkMode}
                        />
                    </Field>

                    <Field>
                        <label>Rol</label>
                        <Select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            $dark={darkMode}
                        >
                            <option value="">Rol Seç</option>
                            {userPlanRoles.map((r, i) => (
                                <option key={i} value={r.role}>{r.role}</option>
                            ))}
                        </Select>
                    </Field>

                    <Actions>
                        <PrimaryBtn
                            onClick={handleInvite}
                            disabled={isSuperAdmin && selectedUser}
                            title={isSuperAdmin && selectedUser ? "Superadmin başka kullanıcı adına davet gönderemez" : "Davet Et"}
                        >
                            {isSuperAdmin && selectedUser ? "Davet Devre Dışı" : "Davet Et"}
                        </PrimaryBtn>
                    </Actions>
                </FormRow>


                <QuotaRow>
                    {userPlanRoles.length === 0 ? (
                        <QuotaEmpty>Bu plan için rol kotası tanımlı değil.</QuotaEmpty>
                    ) : (
                        userPlanRoles.map((r) => {

                            const acceptedCount = invites.filter(
                                (i) => i.role === r.role && i.status === "accepted"
                            ).length;

                            const totalLimit = r.count || 0;
                            const left = Math.max(totalLimit - acceptedCount, 0);

                            return (
                                <QuotaPill key={r.role}>
                                    <span className="name">{r.role}</span>
                                    <span className="bar">
                                        <span
                                            className="fill"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    (acceptedCount / Math.max(totalLimit, 1)) * 100
                                                )}%`,
                                            }}
                                        />
                                    </span>
                                    <span className="count">
                                        {acceptedCount}/{totalLimit}
                                    </span>
                                    {left === 0 && <span className="limit">Limit dolu</span>}
                                </QuotaPill>
                            );
                        })
                    )}
                </QuotaRow>

            </InviteCard>

            {/* Davet listesi */}
            <Section>
                <SectionHead>
                    <h3>Gönderilen Davetler</h3>
                    <span className="badge">{invites.length}</span>
                </SectionHead>

                {invites.length === 0 ? (
                    <EmptyList>Henüz davet yok.</EmptyList>
                ) : (
                    <InviteList>
                        {invites.map((invite) => (
                            <InviteItem key={invite.id} $dark={darkMode}>
                                <div className="role">
                                    <span className="icon">{roleIcons[invite.role]}</span>
                                    <span className="name">{invite.role}</span>
                                </div>

                                <div className="email">{invite.email}</div>
                                <div className="status">{invite.status}</div>



                                <div className="actions">
                                    <DeleteBtn
                                        onClick={() => handleSil(invite.email)}
                                        disabled={invite.status === "rejected"}
                                        style={{
                                            backgroundColor: invite.status === "rejected" ? "#ccc" : "#f44336", // gri veya kırmızı
                                            color: invite.status === "rejected" ? "#666" : "#fff",
                                            cursor: invite.status === "rejected" ? "not-allowed" : "pointer",
                                            borderRadius: "6px",
                                            padding: "6px 12px",
                                            border: "none",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease",
                                            opacity: invite.status === "rejected" ? 0.7 : 1,
                                            boxShadow: invite.status === "rejected" ? "none" : "0 2px 6px rgba(0,0,0,0.2)"
                                        }}
                                        onMouseEnter={(e) => {
                                            if (invite.status !== "rejected") e.target.style.backgroundColor = "#d32f2f";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (invite.status !== "rejected") e.target.style.backgroundColor = "#f44336";
                                        }}
                                    >
                                        Sil
                                    </DeleteBtn>

                                </div>

                            </InviteItem>
                        ))}
                    </InviteList>
                )}
            </Section>
        </Page>
    );

}


const Page = styled.div`
  --page-bg: #0b1624;        /* arka plan (bir tık koyu) */
  --surface: #12263b;        /* kart zemini (page’den belirgin açık) */
  --surface-2: #17324d;      /* ikincil yüzey */
  --border: rgba(148,163,184,0.18);
  --text: #e9f2ff;
  --muted: #9fb3c8;
  --accent: #38bdf8;
  --danger: #ef4444;

  min-height: 100vh;
  background: var(--page-bg);
  color: var(--text);
`;

const TopBar = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding: 16px 0 8px;
  .left h2 { margin:0; color: var(--text); }
  .left .sub { color: var(--muted); font-size: 0.9rem; }
`;

const InviteCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  color: var(--text);

  .head .title { font-weight: 700; }
  .head .hint { color: var(--muted); font-size: .9rem; }
`;

const ModeToggle = styled.button`
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 800;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px 160px;
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  display: grid; gap: 6px;
  label { font-size: 12px; color: var(--muted); font-weight: 700; }
`;

const Actions = styled.div`
  display: flex; align-items: end; justify-content: flex-end;
`;


/* Kota göstergeleri */
const QuotaRow = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;
const QuotaPill = styled.div`
  display: flex; align-items: center; gap: 8px;
  border: 1px solid var(--line);
  background: rgba(0,85,164,.04);
  padding: 6px 10px; border-radius: 999px;

  .name { font-weight: 800; }
  .bar {
    width: 90px; height: 6px; border-radius: 999px; background: #e5e7eb; position: relative; overflow: hidden;
  }
  .fill { position: absolute; inset: 0; background: linear-gradient(90deg, var(--primary-2), var(--primary)); }
  .count { font-size: 12px; color: var(--muted); }
  .limit { font-size: 11px; color: #ef4444; font-weight: 800; margin-left: 2px; }
`;
const QuotaEmpty = styled.div`
  color: var(--muted); font-size: 13px;
`;



const EmptyList = styled.div`
  border: 1px dashed var(--line);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  color: var(--muted);
`;
const InviteList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const sharedFieldCSS = `
  color-scheme: dark;                 /* native kontroller için */
  background: #0f2740;                /* koyu zemin */
  color: var(--text);                 /* metin beyaz-mavi */
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  width: 100%;
  transition: border-color .2s, box-shadow .2s;

  &::placeholder { color: ${'var(--muted)'}; opacity: .9; }
  &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(56,189,248,.2); }
  &:disabled { opacity: .6; cursor: not-allowed; }

  /* Chrome autofill fix */
  &:-webkit-autofill {
    -webkit-text-fill-color: var(--text);
    box-shadow: 0 0 0px 1000px #0f2740 inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const Input = styled.input`
  ${sharedFieldCSS}
`;

const Select = styled.select`
  ${sharedFieldCSS}
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%),
                    linear-gradient(135deg, var(--muted) 50%, transparent 50%),
                    linear-gradient(to right, transparent, transparent);
  background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%, 0 0;
  background-size: 6px 6px, 6px 6px, 100% 100%;
  background-repeat: no-repeat;

  option {
    background: #0f2740;
    color: var(--text);
  }
`;

const PrimaryBtn = styled.button`
  background: var(--accent);
  color: #001627;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .05s ease, filter .2s ease;

  &:hover { filter: brightness(1.05); }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: .5; cursor: not-allowed; }
`;
const Section = styled.section`
  margin-top: 20px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
`;

const SectionHead = styled.div`
  display:flex;align-items:center;gap:8px;margin-bottom:8px;
  h3 { margin:0; color: var(--text); }
  .badge {
    padding: 2px 8px; border-radius: 999px;
    background: rgba(56,189,248,.12);
    border: 1px solid rgba(56,189,248,.35);
    color: var(--accent);
    font-size: .85rem;
  }
`;

const InviteItem = styled.div`
  display:grid; grid-template-columns: 380px 1.5fr 0.5fr 100px; gap:12px;
  align-items:center;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  color: var(--text);

  .email { color: var(--text); }
  .role .name { color: var(--text); }
  .status .text { color: var(--muted); }
  .dot { width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px; }
  .dot.pending { background:#f59e0b; }
  .dot.accepted { background:#10b981; }
  .dot.rejected { background:#ef4444; }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    row-gap: 6px;
  }
`;

const DeleteBtn = styled.button`
  background: transparent;
  color: #ffb4b4;
  border: 1px solid rgba(239,68,68,.35);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: rgba(239,68,68,.12); }
`;
