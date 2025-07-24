import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';

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
      fetch(`http://localhost:5000/api/invites/${token}`)
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
    console.log('🟡 handleSubmit tetiklendi');

    try {
      const bodyData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        inviteToken: token || null,
        role: inviteInfo?.role || 'user',
        selectedPlan: plan,
      };



      const res = await fetch('http://localhost:5000/api/register/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });




      if (res.ok) {
        const data = await res.json();
        console.log("Register dönüşü:", data);
        setUser({
          id: data.user.id,
          role: data.user.role,
          plan: data.user.plan,  // tam plan objesi
          token: data.token,
        });

        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          role: data.user.role,
          plan: plan,
        }));
        localStorage.setItem('token', data.token);

        setFormData({ firstname: '', lastname: '', email: '', password: '' });

        if (plan) {
          navigate('/odeme');
        } else {
          navigate('/');
        }
      }

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
                color: '#003366',
                fontWeight: '600',
                textAlign: 'center',

                maxHeight: '120px',   // max yükseklik ekledik
                marginBottom: '20px', // form ile arasına boşluk
              }}
            >
              <p>Davet Edilerek Kayıt Oluyorsunuz!</p>

              <p>Atanan Rol: <i>{inviteInfo.role}</i></p>

            </div>
          )}


          <form className="form" onSubmit={handleSubmit}>
            <p className="title">Register </p>
            <p className="message">Signup now and get full access to our app. </p>
            <div className="flex">
              <label>
                <input
                  name='firstname'
                  className="input"
                  type="text"
                  placeholder="Firstname"
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
                  placeholder="Lastname"
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
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <button className="submit" type="submit">Submit</button>
            <p className="signin">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .card {
      background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
      border-radius: 22px;
      transition: all .3s;
      margin: 0 15px;
    }

    .card2 {
      border-radius: 0;
      transition: all .2s;
    }

    .card2:hover {
      transform: scale(0.98);
      border-radius: 20px;
    }
    .input{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      border-radius: 25px;
      margin:10px;
      border: none;
      outline: none;
      color: white;
      background-color: #171717;
      box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    }

    .card:hover {
      box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 18px; 
      max-width: 400px;
     padding: 30px 20px; 
      border-radius: 20px;
      position: relative;
      background-color: #171717;
      color: #fff;
      border: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
      border-radius: 2px;
      transition: all .3s;
      
    }

    .title {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -1px;
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 30px;
      color: rgb(0, 255, 200);
    }

    .title::before {
      width: 18px;
      height: 18px;
    }

    .title::after {
      width: 18px;
      height: 18px;
      animation: pulse 1s linear infinite;
    }

    .title::before,
    .title::after {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      border-radius: 50%;
      left: 0px;
      background-color: #00bfff;
    }

    .message, 
    .signin {
      font-size: 14.5px;
      color: rgba(255, 255, 255, 0.7);
    }

    .signin {
      text-align: center;
    }

    .signin a:hover {
      text-decoration: underline royalblue;
    }

    .signin a {
      color: #00bfff;
    }

    .flex {
      display: flex;
      width: 100%;
      gap: 66px; 
    }
      
    .flex label {
      flex: 1;  
    }

    .form label {
      position: relative;
    }

    .form label .input {
      background-color: #333;
      color: #fff;
      width: 100%;
      padding: 25px 0px 10px 2px;
      font-size: 16px; 
      outline: 0;
      border: 1px solid rgba(105, 105, 105, 0.397);
      border-radius: 12px; 
      width:100%;
    }

    .form label .input + span {
      color: rgba(255, 255, 255, 0.5);
      position: absolute;
      left: 10px;
      top: 0px;
      font-size: 0.9em;
      cursor: text;
      transition: 0.3s ease;
    }

    .form label .input:placeholder-shown + span {
      top: 12.5px;
      font-size: 0.9em;
    }

    .form label .input:focus + span,
    .form label .input:valid + span {
      color: #00bfff;
      top: 0px;
      font-weight: 600;
    }

    .submit {
      border: none;
      outline: none;
      padding: 14px;
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      transition: .3s ease;
      background-image: linear-gradient(163deg, #446d92 0%, #13034b 100%);
      cursor: pointer;
    }

    .submit:hover {
      background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
      color: rgb(0, 255, 200);
    }

    @keyframes pulse {
      from {
        transform: scale(0.9);
        opacity: 1;
      }
      to {
        transform: scale(1.8);
        opacity: 0;
      }
    }
  `;

export default Register;
