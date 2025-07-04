import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="BG">
          <svg viewBox="0 0 512 512" className="ionicon" xmlns="http://www.w3.org/2000/svg">
            <path d="M256 176a80 80 0 1080 80 80.24 80.24 0 00-80-80zm172.72 80a165.53 165.53 0 01-1.64 22.34l48.69 38.12a11.59 11.59 0 012.63 14.78l-46.06 79.52a11.64 11.64 0 01-14.14 4.93l-57.25-23a176.56 176.56 0 01-38.82 22.67l-8.56 60.78a11.93 11.93 0 01-11.51 9.86h-92.12a12 12 0 01-11.51-9.53l-8.56-60.78A169.3 169.3 0 01151.05 393L93.8 416a11.64 11.64 0 01-14.14-4.92L33.6 331.57a11.59 11.59 0 012.63-14.78l48.69-38.12A174.58 174.58 0 0183.28 256a165.53 165.53 0 011.64-22.34l-48.69-38.12a11.59 11.59 0 01-2.63-14.78l46.06-79.52a11.64 11.64 0 0114.14-4.93l57.25 23a176.56 176.56 0 0138.82-22.67l8.56-60.78A11.93 11.93 0 01209.94 26h92.12a12 12 0 0111.51 9.53l8.56 60.78A169.3 169.3 0 01361 119l57.2-23a11.64 11.64 0 0114.14 4.92l46.06 79.52a11.59 11.59 0 01-2.63 14.78l-48.69 38.12a174.58 174.58 0 011.64 22.66z" />
          </svg>
        </div>
        <div className="content">
          <p className="heading">Oops!</p>
          <p className="sub-heading">forgot password?</p>
          <p className="sub-sub-heading">Type your email to recover</p>
          <input className="email" placeholder="Email" type="text" />
          <button className="card-btn">Reset Password</button>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 230px;
    height: 230px;
    position: relative;
    background-color: rgb(255, 255, 255);
    border-bottom: 3px solid #4c6bff;
    overflow: hidden;
    -webkit-box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
    -moz-box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
    box-shadow: 0px 12px 65px -39px rgba(0, 0, 0, 1);
    border-radius: 5px;
  }
  .BG {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .BG svg {
    position: absolute;
    width: 50%;
    left: -20%;
    top: -20%;
    fill: rgb(244, 244, 244);
    transition: all 0.5s;
  }
  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 25px;
    color: rgb(30, 30, 30);
    gap: 3px;
  }
  .heading {
    font-size: 1.4em;
    font-weight: 700;
    color: rgb(30, 30, 30);
  }
  .sub-heading {
    margin-top: -7px;
    font-size: 0.9em;
    font-weight: 600;
    color: rgb(30, 30, 30);
  }
  .sub-sub-heading {
    font-size: 0.7em;
    color: rgb(128, 128, 128);
  }

  .email {
    width: 100%;
    height: 25px;
    margin-top: 20px;
    border: none;
    border-bottom: 1px solid #c0c7ec;
    outline: none;
    font-size: 0.7em;
    background-color: transparent;
  }
  .card-btn {
    margin-top: 20px;
    height: 30px;
    width: 100%;
    border: none;
    background: linear-gradient(60deg, #4c6bff, #8196ff);
    color: white;
    border-radius: 30px;
    cursor: pointer;
  }

  .card:hover .BG svg {
    left: 0%;
    top: 0%;
    transform: rotate(180deg) scale(9);
    fill: #c0c7ec;
  }`;

export default Card;
