
import React from 'react';
import styled from 'styled-components';

const Input = ({ placeholder, type = "text", value, onChange }) => {
  return (
    <StyledWrapper>
      <div className="input-container">
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
        />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .inputbox {
    position: relative;
    width: 196px;
  }

  .inputbox input {
    position: relative;
    width: 100%;
    padding: 20px 10px 10px;
    background: transparent;
    outline: none;
    box-shadow: none;
    border: none;
    color: #23242a;
    font-size: 1em;
    letter-spacing: 0.05em;
    transition: 0.5s;
    z-index: 10;
  }

  .inputbox span {
    position: absolute;
    left: 0;
    padding: 20px 10px 10px;
    font-size: 1em;
    color: #8f8f8f;
    letter-spacing: 00.05em;
    transition: 0.5s;
    pointer-events: none;
  }

  .inputbox input:valid ~span,
  .inputbox input:focus ~span {
    color: #45f3ff;
    transform: translateX(-10px) translateY(-34px);
    font-size: 0,75em;
  }

  .inputbox i {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: #45f3ff;
    border-radius: 4px;
    transition: 0.5s;
    pointer-events: none;
    z-index: 9;
  }

  .inputbox input:valid ~i,
  .inputbox input:focus ~i {
    height: 44px;
  }`;

export default Input;
