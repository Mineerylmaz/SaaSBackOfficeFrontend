import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const Odeme = () => {
    return (
        <StyledWrapper>
            <div className='container'>
                <div>
                    <Card></Card>
                </div>
                <div className="modal">
                    <form className="form">
                        <div className="credit-card-info--form">
                            <div className="input_container">
                                <label className="input_label" htmlFor="cardholder_name">Card holder full name</label>
                                <input
                                    placeholder="Enter your full name"
                                    title="Input title"
                                    name="cardholder_name"
                                    type="text"
                                    className="input_field"
                                    id="cardholder_name"
                                />
                            </div>
                            <div className="input_container">
                                <label className="input_label" htmlFor="card_number">Card Number</label>
                                <input
                                    placeholder="0000 0000 0000 0000"
                                    title="Card Number"
                                    name="card_number"
                                    type="text"
                                    maxLength={19}
                                    className="input_field"
                                    id="card_number"
                                />
                            </div>
                            <div className="input_container">
                                <label className="input_label" htmlFor="expiry_cvv">Expiry Date / CVV</label>
                                <div className="split">
                                    <input
                                        placeholder="MM/YY"
                                        title="Expiry Date"
                                        name="expiry_date"
                                        type="text"
                                        maxLength={5}
                                        className="input_field"
                                        id="expiry_date"
                                    />
                                    <input
                                        placeholder="CVV"
                                        title="CVV"
                                        name="cvv"
                                        type="password"
                                        maxLength={4}
                                        className="input_field"
                                        id="cvv"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="purchase--btn">Checkout</button>
                            <div className="separator">
                                <hr className="line" />

                                <hr className="line" />
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .modal {
    width: fit-content;
    height: fit-content;
    background: #ffffff;
    box-shadow:
      0px 187px 75px rgba(0, 0, 0, 0.01),
      0px 105px 63px rgba(0, 0, 0, 0.05),
      0px 47px 47px rgba(0, 0, 0, 0.09),
      0px 12px 26px rgba(0, 0, 0, 0.1),
      0px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 26px;
    max-width: 450px;
  }
    .container {
    margin:20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px; 
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .

  .separator {
    width: calc(100% - 20px);
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 10px;
    color: #8b8e98;
    margin: 0 10px;
  }

  .separator > p {
    word-break: keep-all;
    display: block;
    padding-top: 10px;
    text-align: center;
    font-weight: 600;
    font-size: 11px;
    margin: auto;
  }

  .separator .line {
    display: inline-block;
    width: 100%;
    height: 1px;
    border: 0;
    background-color: #e8e8e8;
    margin: auto;
  }

  .credit-card-info--form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .input_container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .split {
    display: grid;
    grid-template-columns: 4fr 2fr;
    gap: 15px;
  }

  .split input {
    width: 100%;
  }

  .input_label {
    font-size: 10px;
    color: #8b8e98;
    font-weight: 600;
  }

  .input_field {
    width: auto;
    height: 40px;
    padding: 0 0 0 16px;
    border-radius: 9px;
    outline: none;
    background-color: #f2f2f2;
    border: 1px solid #e5e5e500;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .input_field:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px #242424;
    background-color: transparent;
  }

  .purchase--btn {
    height: 55px;
    background: linear-gradient(180deg, #363636 0%, #1b1b1b 50%, #000000 100%);
    border-radius: 11px;
    border: 0;
    outline: none;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    box-shadow:
      0px 0px 0px 0px #ffffff,
      0px 0px 0px 0px #000000;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    cursor: pointer;
  }

  .purchase--btn:hover {
    box-shadow:
      0px 0px 0px 2px #ffffff,
      0px 0px 0px 4px #0000003a;
  }

  /* Reset input number styles */
  .input_field::-webkit-outer-spin-button,
  .input_field::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .input_field[type="number"] {
    -moz-appearance: textfield;
  }
`;

export default Odeme;
