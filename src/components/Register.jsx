import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = ({ setUser }) => {


  const [inviteInfo, setInviteInfo] = useState(null);

  const { token: routeToken } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const queryToken = query.get('inviteToken');

  const token = routeToken || queryToken;


  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("gerçekten tokenı sildin mi register??")
  }, []);


  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan");
    if (storedPlan) {
      try {
        setPlan(JSON.parse(storedPlan));
      } catch (err) {
        console.error("Plan parsing hatası:", err);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:32807/api/invites/${token}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setInviteInfo(data);
            setFormData(f => ({ ...f, email: data.email }));
          } else {
            setInviteInfo(null);
          }
        })
        .catch(() => setInviteInfo(null));
    }
  }, [token]);



  const handleChange = (e) => {
    if (inviteInfo && e.target.name === 'email') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1) Seçili planı oku
      const selectedPlanStr = localStorage.getItem("selectedPlan");
      let selectedPlan = null;
      if (selectedPlanStr) {
        try { selectedPlan = JSON.parse(selectedPlanStr); } catch { }
      }

      // 2) Davet olsa da olmasa da planı gönder (yoksa null)
      const planToSend = selectedPlan || null;

      const bodyData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        inviteToken: token,
        role: inviteInfo?.role || 'user',
        plan: planToSend,
      };

      const res = await fetch('http://localhost:32807/api/register/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const raw = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Kayıt Hatası',
          text: raw?.error || 'Bilinmeyen hata',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // 3) Response'u normalize et (register eski/yeni veya login formatı)
      const base = raw.user ? { ...raw.user, token: raw.token } : { ...raw };

      let userForStore = {
        id: base.id ?? null,
        email: base.email ?? formData.email,
        role: base.role ?? 'user',
        plan: base.plan ?? null,
        next_plan: base.next_plan ?? null,
        plan_change_date: base.plan_change_date ?? null,
        avatar: base.avatar ?? null,
        plan_start_date: base.plan_start_date ? new Date(base.plan_start_date).toISOString() : null,
        plan_end_date: base.plan_end_date ? new Date(base.plan_end_date).toISOString() : null,
        customInputValues: base.customInputValues ?? {},
        token: base.token, // aşağıda localStorage'a da yazacağız
      };

      // 4) Plan eksikse zenginleştir (price/max_file_size vs)
      if (userForStore.plan && (!userForStore.plan.price || !userForStore.plan.max_file_size)) {
        try {
          const resPlan = await fetch('http://localhost:32807/api/plans');
          if (resPlan.ok) {
            const plans = await resPlan.json();
            const full = userForStore.plan?.name
              ? plans.find(p => p.name === userForStore.plan.name)
              : plans.find(p => p.name === 'null');
            if (full) userForStore.plan = full;
          }
        } catch (e) {
          console.warn('Plan enrich failed:', e);
        }
      }

      // 5) Kaydet → sonra navigate
      setUser(userForStore);
      localStorage.setItem('user', JSON.stringify(userForStore));
      localStorage.setItem('token', userForStore.token || '');
      localStorage.setItem('userId', String(userForStore.id || ''));

      setFormData({ firstname: '', lastname: '', email: '', password: '' });

      navigate(!inviteInfo && localStorage.getItem('selectedPlan') ? '/odeme' : '/');

    } catch (error) {
      console.error('Sunucu hatası:', error);
      alert('Sunucu hatası: ' + error.message);
    }
  };




  return (
    <StyledWrapper>
      <div className='card'>
        <div className="card2">
          {inviteInfo && (
            <div
              style={{

                borderRadius: '5px',
                color: '#ffff',
                fontWeight: '600',
                textAlign: 'center',


                marginBottom: '20px',
              }}
            >
              <p>Davet Edilerek Kayıt Oluyorsunuz!</p>

              <p>Atanan Rol: <i>{inviteInfo.role}</i></p>

            </div>
          )}


          <form className="form" onSubmit={handleSubmit}>
            <p className="title">Kayıt Ol </p>

            <div className="flex">
              <label>
                <input
                  name='firstname'
                  className="input"
                  type="text"
                  placeholder="İsim"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <input
                  name='lastname'
                  className="input"
                  type="text"
                  placeholder="Soyisim"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <label>
              <input
                name='email'
                className="input"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={!!inviteInfo}
              />
            </label>
            <label>
              <input
                name='password'
                className="input"
                type="password"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <button className="submit" type="submit">Kayıt ol</button>
            <p className="signin">
              Zaten kayıtlı mısınız? <Link to="/login">Giriş yap</Link>
            </p>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0d1b2a;
  font-family: "Poppins", sans-serif;

  .card {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    padding: 2rem;
    width: 380px;
    animation: fadeIn 0.5s ease-in-out;
  }

  .card2 {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .flex {
    display: flex;
    gap: 10px;
  }

  .input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 8px;
    border: none;
    outline: none;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    transition: background 0.3s ease, transform 0.2s ease;
  }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .input:focus {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }

  .submit {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: none;
    background: #fff;
    color: #0d1b2a;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .submit:hover {
    background: #0d1b2a;
    color: #fff;
  }

  .signin {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.85);
  }

  .signin a {
    color: #fff;
    font-weight: 600;
    text-decoration: underline;
    transition: color 0.3s ease;
  }

  .signin a:hover {
    color: #ffd5b5;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
    /* mevcut StyledWrapper içine ekle/güncelle */
.card2 .form { 
  width: 100%;
  display: grid;
  gap: 12px;
}

.card2 .form label {
  display: block;        /* kritik: label artık tam satır */
  width: 100%;
}

.flex {
  display: grid;         /* ad/soyad yan yana */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* küçük ekranda alta düşsün */
@media (max-width: 480px) {
  .flex { grid-template-columns: 1fr; }
}

/* input zaten width:100%; kalsın */
.input {
  width: 100%;
}

`;


export default Register;
