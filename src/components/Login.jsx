import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';


const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/login/login', {
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
      token: data.token
    }));

    setUser({
      id: data.id,
      email: data.email,
      role: data.role,
      plan: data.plan,
      token: data.token
    });
  };




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        const { token, id, email, role, plan } = data;


        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({ id, email, role }));
          localStorage.setItem('userId', id);

          localStorage.setItem('selectedPlan', JSON.stringify(plan));

          setUser({ id, email, role, plan });





          const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));

          if (selectedPlan) {
            navigate('/odeme');
          } else {
            navigate('/');
          }

        } else {
          alert('Sunucudan geçerli bir token gelmedi!');
        }
      } else {
        const data = await res.json();
        alert('Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Sunucu hatası: ' + error.message);
    }
  }



  return (
    <StyledWrapper>
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleSubmit}>
            <p id="heading">Login</p>
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
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>
            <div className="btn">
              <button type="submit" className="button1">
                Login
              </button>
              <Link to="/register" className="button2">
                Register
              </Link>
            </div>
            <Link to="/forgotp" className="button3">
              Forgot Password
            </Link>
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

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    background-color: #171717;
    border-radius: 20px;
     gap: 15px;
  padding-left: 3em;
  padding-right: 3em;
  padding-bottom: 1em;
  width: 350px;

  }

  #heading {
    text-align: center;
    margin: 2em;
    color: rgb(68, 109, 146);
    font-size: 1.2em;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: none;
    outline: none;
    color: white;
    background-color: #171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
  }

  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: rgb(68, 109, 146);
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color:rgb(68, 109, 146);
    padding: 12px 10px;
  font-size: 1.1rem;
  border-radius: 10px;
  }

  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 2.5em;
  }

  .button1 {
 
    text-decoration: none; 
  text-align:center;
  display: inline-block;
    padding: 0.5em;
    padding-left: 2.3em;
    padding-right: 2.3em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button1:hover {
       background-image: linear-gradient(163deg, #446d92 0%, #13034b 100%);
    color: rgb(68, 109, 146);
  }

  .button2 {
  text-decoration: none; 
  text-align:center;
  display: inline-block;
    padding: 0.5em;
    padding-left: 2.3em;
    padding-right: 2.3em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button2:hover {
    background-image: linear-gradient(163deg, #446d92 0%, #13034b 100%);
    color: rgb(68, 109, 146);
  }

  .button3 {
  text-align:center;
  text-decoration: none; 
  display: inline-block;
    margin-bottom: 3em;
    padding: 0.5em;
    border-radius: 5px;
    border: none;
    outline: none;
    transition: .4s ease-in-out;
    background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button3:hover {
    background-image: linear-gradient(163deg, #a00000fa 0%, #d10050 100%);
    color: rgb(255, 255, 255);
  }

  .card {
    background-image: linear-gradient(163deg, #98b1c8 0%, #3700ff 100%);
    border-radius: 22px;
    transition: all .3s;
  }

  .card2 {
    border-radius: 0;
    transition: all .2s;
  }

  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }
    .button1, .button2 {
  padding: 0.7em 3em;
  margin:8px;
  font-size: 1.1rem;
  border-radius: 8px;
}
  input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #cce7ff inset; 
  -webkit-text-fill-color: #000; 
  transition: background-color 5000s ease-in-out 0s; 
}


  .card:hover {
    box-shadow: 0px 0px 30px 1px rgb(68, 109, 146);
  }`;


export default Login;
