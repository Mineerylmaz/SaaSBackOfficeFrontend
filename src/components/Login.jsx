import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';




const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const handleLogin = async () => {
    const res = await fetch('http://localhost:32807/api/login/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await res.json();

    console.log('Backendden gelen plan:', data.plan);

    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      email: data.email,
      role: data.role,
      plan: data.plan,
      token: data.token,
      plan_start_date: data.plan_start_date,
      plan_end_date: data.plan_end_date,
    }));

    setUser({
      id: data.id,
      email: data.email,
      role: data.role,
      plan: data.plan,
      token: data.token,
      plan_start_date: data.plan_start_date,
      plan_end_date: data.plan_end_date,
    });
  };




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:32807/api/login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const { token, id, email, role, plan, plan_start_date, plan_end_date, avatar, next_plan, plan_change_date, customInputValues } = data;
        if (!data.id) {
          alert("Girişte kullanıcı id'si bulunamadı!");
          return;
        }


        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', id);


          let fullPlan = plan || {};

          if (!fullPlan.price || !fullPlan.id) {
            const plansRes = await fetch('http://localhost:32807/api/plans');
            if (plansRes.ok) {
              const plansData = await plansRes.json();

              fullPlan = plansData.find(p => p.id === fullPlan.id || p.name === fullPlan.name) || fullPlan;
            }
          }

          localStorage.setItem('user', JSON.stringify({
            id, email, role, plan: fullPlan, token, plan_start_date,
            plan_end_date, next_plan, plan_change_date, avatar
          }));
          const customInputValuesData = customInputValues || {};
          localStorage.setItem('customInputValues', JSON.stringify(customInputValuesData));


          localStorage.setItem('selectedPlan', JSON.stringify(fullPlan));




          setUser({
            id, email, role, plan: fullPlan, token, plan_start_date,
            plan_end_date, next_plan, plan_change_date, avatar
          });

          if (!fullPlan || !fullPlan.name) {
            navigate('/odeme');
          } else {
            navigate('/');
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Sunucudan geçerli bir token gelmedi!',
          });
        }
      } else {
        const data = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Giriş Başarısız',
          text: data.error || 'Bilinmeyen bir hata oluştu!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sunucu Hatası',
        text: error.message,
      });
    }
  };




  return (
    <StyledWrapper>
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleSubmit}>
            <p id="heading">Giriş Yap</p>
            <div className="field">
              <input
                autoComplete="email"
                name="email"
                id="email"
                type="email"
                placeholder='Email'
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>
            <div className="field">
              <input
                name="password"
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-field"
                placeholder="Şifre"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>
            <div className="btn">
              <button type="submit" className="button1">
                Giriş Yap
              </button>
              <Link to="/register" className="button2">
                Kayıt Ol
              </Link>
            </div>
            <Link to="/notfound" className="button3">
              Şifremi Unuttum
            </Link>
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
  background:#0d1b2a;
  font-family: "Poppins", sans-serif;

  .card {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    padding: 2rem;
    width: 350px;
    animation: fadeIn 0.5s ease-in-out;
  }

  #heading {
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  .field {
    margin-bottom: 1.2rem;
  }

  .input-field {
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

  .input-field::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .input-field:focus {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }

  .btn {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .button1,
  .button2 {
    flex: 1;
    margin: 0 5px;
    padding: 10px 0;
    border-radius: 8px;
    border: none;
    background: #fff;
    color: #1a73e8;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;
  }

  .button1:hover,
  .button2:hover {
    background: #1a73e8;
    color: #fff;
  }

  .button3 {
    display: block;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .button3:hover {
    color: #fff;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;



export default Login;