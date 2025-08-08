import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Pricing = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleGetStarted = (plan) => {
    console.log("Planın boyutu:", plan.max_file_size);

    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('selectedPlan', JSON.stringify(plan));


    if (user) {
      navigate('/odeme');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetch('http://localhost:32807/api/pricing')
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

      <h2 className="main__heading">Planlar</h2>
      <div className="cards">
        {plans.map((plan, index) => (
          <div key={plan.id || index} className="card" style={{ '--hue': 165 + index * 20 }}>
            <p className="card__heading">{plan.name}</p>
            <p className="card__price">${plan.price}/month</p>
            <ul className="card__bullets flow" role="list">
              {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}

              <li>RT URL Limit: {plan.rt_url_limit || 0}</li>
              <li>Static URL Limit: {plan.static_url_limit || 0}</li>
              <li>Max File Size: {plan.max_file_size || 0} MB</li>
              <li>Kredi sayısı:{plan.credits || 0}</li>
              <li>
                Metotlar:{" "}
                {Array.isArray(plan.metotlar) && plan.metotlar.length > 0
                  ? plan.metotlar.map((m, i) => (
                    <span key={i}>
                      {m}{i < plan.metotlar.length - 1 ? ', ' : ''}
                    </span>
                  ))
                  : 'Yok'}

              </li>

              <li>
                Roller:{" "}
                {plan.roles && plan.roles.length > 0
                  ? plan.roles.map((r, i) => (
                    <span key={i}>
                      {r.role} ({r.count}){i < plan.roles.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Yok"}
              </li>

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
  background: #a0d8f7; /* Daha açık ve soft mavi */
  color: #000;
  outline: 1px solid rgba(110, 193, 228, 0.6); /* Daha yumuşak outline */
  box-shadow:
    inset 0 0 30px rgba(255, 255, 255, 0.6),
    0 0 15px rgba(110, 193, 228, 0.7);
  transition: all 0.3s ease;
}

`;

export default Pricing;
