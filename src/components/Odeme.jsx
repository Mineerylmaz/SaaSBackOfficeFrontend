import React, { useEffect, useState } from 'react';
import Card from './Card';
import styled from 'styled-components';


const Odeme = () => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan));
    }
  }, []);

  return (
    <div>
      <StyledWrapper>

        <div className="content">
          <div className='carditem'>
            <Card />
          </div>
          <div className="cards">
            {plan ? (
              <div className="card">
                <h2 className='card__heading'>Seçilen Plan: {plan.name}</h2>
                <p className='card__price'>Fiyat: ${plan.price}</p>
                <ul className='card__bullets flow'>
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <button className='btn' onClick={() => alert(`Ödeme yapılacak: ${plan.name} - $${plan.price}`)}>Öde</button>
              </div>
            ) : (
              <p>Seçilen plan bulunamadı.</p>
            )}
          </div>
        </div>
      </StyledWrapper>

    </div>
  );
};

const StyledWrapper = styled.div`
  .content {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem;
  }
    .btn{
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
    background-image: linear-gradient(163deg, #6EC1E4 0%, #3700ff 100%);
    color: rgb(0, 0, 0);}

  .carditem {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: calc(100vh - 56px);  -> bunu kaldır, içerik taşabilir */
  }

  .cards {
    flex: 1;
  }

  .card {
    background-color: #eceff133;
    padding: 1rem;
    border-radius: 8px;
  }

  .card__bullets {
    line-height: 1.4;
  }

  .card__heading {
    font-size: 1.05em;
    font-weight: 600;
  }

  .card__price {
    font-size: 1.75em;
    font-weight: 700;
  }

  .flow > * + * {
    margin-top: var(--flow-space, 1.25em);
  }

  .card:hover {
    --lightness: 80%;
    background: #6EC1E4;
    color: #000;
    outline: 1px solid rgb(255, #6EC1E4, 255);
    box-shadow:
      inset 0 0 80px whitesmoke,
      inset 20px 0 80px #6EC1E4,
      inset -20px 0 80px #0ff,
      inset 20px 0 300px #f0f,
      inset -20px 0 300px #0ff,
      0 0 50px #fff,
      -10px 0 80px #f0f,
      10px 0 80px #0ff;
  }
`;


export default Odeme;
