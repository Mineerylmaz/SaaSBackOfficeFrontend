import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const Pricing = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')); // Kullanıcıyı dışarıda al, render sırasında

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
      <h2 className="main__heading"></h2>
      <div className="cards">
        {plans.map((plan, index) => {
          const isCurrentPlan = user?.plan?.id === plan.id;

          return (
            <div
              key={plan.id || index}
              className={`card ${isCurrentPlan ? 'active' : ''}`}
              style={{ '--hue': 165 + index * 20 }}
            >

              <p className="card__heading">{plan.name}</p>
              <p className="card__price">${plan.price}/month</p>
              <ul className="card__bullets flow" role="list">
                {Array.isArray(plan.features) && plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}

                {/* Limit key-value çiftlerini döndür */}
                {plan.plan_limit && Object.entries(plan.plan_limit).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}

                <li>Max File Size: {plan.max_file_size || 0} MB</li>
                <li>Kredi sayısı: {plan.credits || 0}</li>
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


              <button
                className="card__cta cta"
                disabled={isCurrentPlan}
                onClick={() => handleGetStarted(plan)}
              >
                {isCurrentPlan ? "Aktif Plan" : "Planı Seç"}
              </button>
            </div>
          );
        })}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* --------- Theme --------- */
  --bg1: #0b1220;
  --bg2: #0d1b2a;
  --line: rgba(148,163,184,.25);
  --text: #e9f2ff;
  --muted: #9fb3c8;

  min-height: 100vh;
  padding: 32px 16px;
  color: var(--text);
  background:
    radial-gradient(1200px 600px at 20% -20%, #0b2345 0%, var(--bg1) 40%, var(--bg1) 100%),
    linear-gradient(180deg, var(--bg1), var(--bg2));

  .main__heading{
    margin: 0 0 18px 0;
    font-weight: 900;
    letter-spacing: .3px;
    color: #e7f5ff;
  }

  /* --------- Grid --------- */
  .cards{
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  /* --------- Card --------- */
  .card{
    /* accent renklerini inline --hue’dan üret */
    --accent: hsl(var(--hue, 200) 85% 55%);
    --accent2: hsl(var(--hue, 200) 85% 45%);
    --glow: color-mix(in oklab, var(--accent) 35%, white);
    position: relative;
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 18px 16px 14px 16px;
    background: rgba(15,23,42,.70);
    backdrop-filter: blur(8px);
    box-shadow: 0 14px 40px rgba(0,0,0,.25);
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;

    /* ince iç ışık */
    outline: 1px solid rgba(255,255,255,.04);
  }

  .card:hover{
    transform: translateY(-4px);
    border-color: color-mix(in oklab, var(--accent) 22%, var(--line));
    box-shadow: 0 20px 60px rgba(0,0,0,.35), 0 0 0 2px rgba(255,255,255,.02);
  }

  /* aktif plan rozeti ve glow */
  .card.active{
    border-color: color-mix(in oklab, var(--accent) 45%, var(--line));
    box-shadow:
      0 24px 70px rgba(0,0,0,.4),
      0 0 0 2px color-mix(in oklab, var(--accent) 30%, transparent),
      0 0 40px -8px color-mix(in oklab, var(--accent) 35%, transparent);
  }
  .card.active::after{
    content: "Aktif";
    position: absolute; top: 12px; right: 12px;
    font-size: 11px; font-weight: 900; letter-spacing: .3px;
    color: #01314f;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    padding: 4px 8px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.3);
  }

  .card__heading{
    margin: 2px 0 6px 0;
    font-weight: 900;
    letter-spacing: .2px;
    color: #e7f5ff;
  }

  .card__price{
    margin: 0 0 12px 0;
    font-weight: 800;
    font-size: 22px;
    color: var(--glow);
    text-shadow: 0 0 12px color-mix(in oklab, var(--accent) 25%, transparent);
  }

  /* --------- Bullets --------- */
  .card__bullets{
    margin: 0 0 14px 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }

  .card__bullets li{
    position: relative;
    padding: 8px 10px 8px 28px;
    border: 1px solid rgba(148,163,184,.18);
    background: rgba(2,6,23,.5);
    color: #d7e8ff;
    border-radius: 10px;
    font-weight: 600;
    line-height: 1.35;
  }

  .card__bullets li::before{
    content: "✓";
    position: absolute; left: 8px; top: 50%; translate: 0 -50%;
    font-weight: 900; font-size: 12px;
    color: var(--accent);
    filter: drop-shadow(0 0 6px color-mix(in oklab, var(--accent) 40%, transparent));
  }

  /* --------- CTA --------- */
  .card__cta{
    width: 100%;
    border: none;
    border-radius: 12px;
    padding: 12px 14px;
    font-weight: 900;
    cursor: pointer;
    color: #01263a;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    transition: transform .12s ease, filter .2s ease, box-shadow .2s ease;
    box-shadow: 0 8px 24px color-mix(in oklab, var(--accent) 30%, transparent);
  }
  .card__cta:hover{
    filter: brightness(.98);
    transform: translateY(-1px);
  }
  .card__cta:active{
    transform: translateY(0);
  }
  .card__cta:disabled{
    cursor: not-allowed;
    filter: grayscale(.15) saturate(.9) brightness(.9) opacity(.9);
    color: #eaf7ff;
    background: linear-gradient(135deg,
      color-mix(in oklab, var(--accent) 25%, #6b7280),
      color-mix(in oklab, var(--accent2) 25%, #4b5563)
    );
    box-shadow: none;
  }

  /* --------- Responsive küçük dokunuş --------- */
  @media (max-width: 520px){
    .card__price{ font-size: 20px; }
  }
`;


export default Pricing;
