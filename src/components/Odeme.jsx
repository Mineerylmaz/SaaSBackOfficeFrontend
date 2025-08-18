import React, { useEffect, useState } from 'react';
import Card from './Card';
import styled from 'styled-components';
import Swal from 'sweetalert2';





const Odeme = () => {
  const [plan, setPlan] = useState(null);
  const [userId, setUserId] = useState(null);
  const calculateUpgradeCost = (currentPlan, newPlan, price) => {
    const today = new Date().getDate();
    const totalDays = 30;
    const remainingDays = totalDays - today;

    const currentPrice = price[currentPlan];
    const newPrice = price[newPlan];

    const priceDiff = newPrice - currentPrice;

    if (priceDiff <= 0) return 0;

    const dailyDiff = priceDiff / totalDays;
    const cost = dailyDiff * remainingDays;

    return Math.round(cost * 100) / 100;
  };

  const saveUserPlan = async (userId, planName) => {
    try {
      const res = await fetch(`http://localhost:32807/api/adminpanel/update-user-plan/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      });
      if (!res.ok) throw new Error('Plan kaydedilemedi');

    } catch (err) {
      console.error(err);

    }
  };
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    console.log("LocalStorage user verisi:", userStr);
    const savedPlan = localStorage.getItem('selectedPlan');
    console.log("LocalStorage plan verisi:", savedPlan);

    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("Parsed user:", user);
      setUserId(user.id);

      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
      } else if (user.plan) {
        setPlan(user.plan);
      }
    }
  }, []);





  const updateUserPlanBackend = async (userId, planName) => {
    console.log('API çağrısı yapılıyor:', userId, planName);

    try {
      const response = await fetch(`http://localhost:32807/api/adminpanel/update-user-plan/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      });





      console.log('API yanıt durumu:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Plan güncellenemedi');
      }

      console.log('Plan backendde güncellendi.');
    } catch (error) {
      console.error('Plan güncelleme hatası:', error);
    }
  };




  const handlePayment = async () => {
    if (!userId || !plan?.name) {
      Swal.fire('Hata', 'Kullanıcı veya plan bilgisi eksik.', 'error');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const user = JSON.parse(userStr);
    const currentPlan = user.plan?.name || (user.plan === null ? 'none' : user.plan);

    const newPlan = plan.name;

    const prices = { basic: 50, pro: 100, premium: 150 };
    const extraCost = calculateUpgradeCost(currentPlan, newPlan, prices);

    try {
      const response = await fetch(`http://localhost:32807/api/adminpanel/change-user-plan/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ newPlan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Plan güncellenemedi');
      }

      let infoMsg = '';

      if (currentPlan === newPlan && currentPlan !== 'none') {
        Swal.fire('Bilgi', 'Zaten aynı planda bulunuyorsunuz.', 'info');
        return;
      }

      if (data.message.includes('Planınız yükseltildi ve hemen aktif oldu.')) {
        infoMsg = `Planınız yükseltildi.`;


        user.plan = plan;
        localStorage.setItem('user', JSON.stringify(user));


      } else if (data.message.includes('sonraki ay')) {
        const formattedDate = data.planChangeDate
          ? new Date(data.planChangeDate).toLocaleDateString('tr-TR')
          : 'önümüzdeki ay';

        infoMsg = `Plan değişikliği ${formattedDate} tarihinde geçerli olacaktır.`;



      } else {
        infoMsg = data.message;
      }

      Swal.fire("İşlem sonucu", infoMsg, "success");

    } catch (error) {
      Swal.fire('Hata', error.message, 'error');
    }
  };




  return (
    <div>
      <StyledWrapper>
        <div className="content">
          <div className='cardsitem'>
            <Card />
          </div>
          <div className="cards">
            {plan ? (
              <div className="cardss">
                <div className="demo-badge">Demo ortamı — gerçek tahsilat yok</div>

                <h2 className='cards__heading'>Seçilen Plan: {plan.name}</h2>
                <p className='cards__price'>Fiyat: ${plan.price}</p>

               
                <div className="order">
                  <div className="row">
                    <span>Ürün Bedeli</span>
                    <span>${Number(plan.price || 0).toFixed(2)}</span>
                  </div>
                  <div className="row muted">
                    <span>KDV (%20)</span>
                    <span>${(Number(plan.price || 0) * 0.20).toFixed(2)}</span>
                  </div>
                  <div className="total">
                    <span>Toplam</span>
                    <strong>${(Number(plan.price || 0) * 1.20).toFixed(2)}</strong>
                  </div>
                </div>

                {/* Zaman çizgisi */}
                <ul className="timeline">
                  <li className="done"><span className="dot" /> Plan seçildi</li>
                  <li className="active"><span className="dot" /> Demo ödeme</li>
                  <li><span className="dot" /> Hesap aktifleştirme</li>
                </ul>

                <button className='btn' onClick={handlePayment}>Öde</button>

                <p className="note">
                  Devam ederek <a href="#">Kullanım Koşulları</a> ve <a href="#">Gizlilik</a>’i kabul etmiş olursun.
                </p>
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
  --page-bg: #0d1b2a;
  --surface: rgba(255,255,255,0.08);
  --border: rgba(148,163,184,0.18);
  --text: #e9f2ff;
  --muted: #9fb3c8;
  --accent: #38bdf8;

  background: var(--page-bg);
  min-height: 100vh; /* height yerine min-height */
  
  .content {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 2rem;
    padding: 2rem;
  }

  .cardsitem {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .cards { /* sağ kolon wrap’i */
    display: grid;
  }

  .cardss {
    background: var(--surface);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    padding: 1.1rem 1rem 1.2rem;
    color: var(--text);
  }

  .demo-badge{
    display: inline-block;
    margin-bottom: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    color: var(--accent);
    background: rgba(56,189,248,.12);
    border: 1px solid rgba(56,189,248,.35);
  }

  .cards__heading {
    font-size: 1.1em;
    font-weight: 800;
    margin: 4px 0 2px;
  }

  .cards__price {
    font-size: 1.75em;
    font-weight: 900;
    margin: 0 0 10px;
  }

  /* Sipariş özeti */
  .order{
    border-top: 1px dashed var(--border);
    border-bottom: 1px dashed var(--border);
    padding: 10px 0;
    margin: 10px 0 12px;
    display: grid;
    gap: 6px;
  }
  .row{
    display: flex; align-items: center; justify-content: space-between;
    font-weight: 600;
  }
  .row.muted{ color: var(--muted); font-weight: 500; }
  .total{
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 6px; margin-top: 4px; border-top: 1px dashed var(--border);
    font-size: 1.05rem;
  }

  /* Zaman çizgisi */
  .timeline{
    list-style: none; padding: 0; margin: 8px 0 12px;
    display: grid; gap: 6px; color: var(--muted);
  }
  .timeline .dot{
    width: 10px; height: 10px; border-radius: 999px; display: inline-block;
    background: rgba(255,255,255,.25); margin-right: 8px;
  }
  .timeline .done .dot{ background:#10b981; }
  .timeline .active .dot{ background: var(--accent); }

  /* Not */
  .note{
    color: var(--muted);
    font-size: .85rem;
    margin-top: 10px;
  }
  .note a{ color: var(--accent); }

  /* Buton (senin efektin kalsın) */
  .btn{
    text-decoration: none;
    text-align:center;
    display: inline-block;
    padding: 0.75em 2.3em;
    border-radius: 10px;        /* bir tık modern */
    border: none; outline: none;
    transition: .2s ease-in-out;
    background-image: linear-gradient(163deg, #6EC1E4 0%, #3700ff 100%);
    color: #000;
    font-weight: 900;
    box-shadow: 0 6px 16px rgba(0,0,0,.25);
  }


  .cards:hover {
  --accent: hsl(var(--hue, 200) 85% 55%);
  
    transform: translateY(-4px);
    border-color: color-mix(in oklab, var(--accent) 22%, var(--line));
    box-shadow: 0 20px 60px rgba(0,0,0,.35), 0 0 0 2px rgba(255,255,255,.02);
  }

  @media (max-width: 960px){
    .content{ grid-template-columns: 1fr; }
  }
`;



export default Odeme;
