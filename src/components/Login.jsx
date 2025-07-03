import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.placeholder.toLowerCase()]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();


        document.cookie = `user=${encodeURIComponent(JSON.stringify({ userId: data.userId, email: data.email }))}; path=/; max-age=86400`;

        alert('Giriş başarılı!');
        navigate('/pricing');
      }
      else {
        const data = await res.json();
        alert('Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Sunucu hatası: ' + error.message);
    }
  };


  return (
    <StyledWrapper>
      <div className="card">
        <div className="card2">
          <form className="form" onSubmit={handleSubmit}>
            <p id="heading">Login</p>
            <div className="field">

              <input
                type="email"
                className="input-field"
                placeholder="Email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">

              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="btn">
              <button type="submit" className="button1">Login</button>
              <Link to="/register" className="button2">Register</Link>
            </div>
            <Link to="/forgotp" className="button3">Forgot Password</Link>
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
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: #171717;
    border-radius: 20px;

  }

  #heading {
    text-align: center;
    margin: 2em;
    color: rgb(0, 255, 200);
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
    fill: rgb(0, 255, 200);
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: rgb(0, 255, 200);
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
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button1:hover {
       background-image: linear-gradient(163deg, #00642f 0%, #13034b 100%);
    color: rgb(0, 255, 200);
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
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button2:hover {
    background-image: linear-gradient(163deg, #00642f 0%, #13034b 100%);
    color: rgb(0, 255, 200);
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
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    color: rgb(0, 0, 0);
  }

  .button3:hover {
    background-image: linear-gradient(163deg, #a00000fa 0%, #d10050 100%);
    color: rgb(255, 255, 255);
  }

  .card {
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
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

  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.30);
  }`;

export default Login;
