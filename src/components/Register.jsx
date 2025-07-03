

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',

  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.placeholder.toLowerCase()]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/register/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password
        }),
      });

      if (res.ok) {
        alert('Kullanıcı başarıyla eklendi');
        setFormData({ firstname: '', lastname: '', email: '', password: '' });
      } else {
        const data = await res.json();
        alert('Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('Sunucu hatası: ' + error.message);
    }
  };


  return (
    <StyledWrapper>
      <div className='card'>
        <div className="card2">
          <form className="form" onSubmit={handleSubmit}>
            <p className="title">Register </p>
            <p className="message">Signup now and get full access to our app. </p>
            <div className="flex">
              <label>
                <input
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
                className="input"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </label>
            <label>
              <input
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
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 350px;
    padding: 20px;
    border-radius: 20px;
    position: relative;
    background-color: #171717;
    color: #fff;
    border: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    border-radius: 22px;
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
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #333;
    color: #fff;
    width: 100%;
    padding: 20px 05px 05px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
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
    font-size: 0.7em;
    font-weight: 600;
  }

 
  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
  }

  .submit:hover {
     background-image: linear-gradient(163deg, #00642f 0%, #13034b 100%);
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
  }`;

export default Register;
