import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Pricing = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetStarted = (plan) => {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('selectedPlan', JSON.stringify(plan));


    if (user) {
      navigate('/odeme');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/pricing')
      .then(res => {
        if (!res.ok) throw new Error('Fiyatlar alınamadı');
        return res.json();
      })
      .then(data => {
        setPlans(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setPlans([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (!plans || plans.length === 0) return <p>Fiyat planı bulunamadı.</p>;

  return (
    <StyledWrapper>

      <h2 className="main__heading">Pricing & Plans</h2>
      <div className="cards">
        {plans.map((plan, index) => (
          <div key={plan.id || index} className="card" style={{ '--hue': 165 + index * 20 }}>
            <p className="card__heading">{plan.name}</p>
            <p className="card__price">${plan.price}/month</p>
            <ul className="card__bullets flow" role="list">
              {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            <a
              className="card__cta cta"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleGetStarted(plan);
              }}
            >
              Get Started
            </a>


          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  
  .main__heading {
    font-weight: 600;
    font-size: 2.25em;
    margin-bottom: 0.75em;
    text-align: center;
    color:#071f35;
  }
  .cards {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 1rem;
    
  }
  .card {
    --flow-space: 0.5em;
    --hsl: var(--hue), 82.26%, 51.37%;
    flex: 1 1 14rem;
    padding: 1.5em 2em;
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    align-items: start;
    gap: 1.25em;
    color: #071f35;
    background-color: #eceff133;
    border: 1px solid #eceff133;
    border-radius: 15px;
    transition: all 0.3s ease;
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
  .cta {
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
    color: rgb(0, 0, 0);
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
  .card:hover > .cta {
    outline: none;
    background-color: ##6EC1E4;
  }
`;

export default Pricing;
