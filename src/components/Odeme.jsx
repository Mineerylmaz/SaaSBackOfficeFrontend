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
    const currentPlan = user.plan?.name || user.plan;
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
      if (data.message.includes('Planınız yükseltildi ve hemen aktif oldu.')) {
        infoMsg = `Planınız yükseltildi.`;

        user.plan = plan;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('selectedPlan', JSON.stringify(plan));

      } else if (data.message.includes('sonraki ay')) {
        const formattedDate = data.planChangeDate
          ? new Date(data.planChangeDate).toLocaleDateString('tr-TR')
          : 'önümüzdeki ay';

        infoMsg = `Plan değişikliği ${formattedDate} tarihinde geçerli olacaktır.`;

      } else if (data.message.includes('Aynı plandasınız')) {
        infoMsg = 'Ödemeniz alındı.';
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
                <h2 className='cards__heading'>Seçilen Plan: {plan.name}</h2>
                <p className='cards__price'>Fiyat: ${plan.price}</p>

                <button className='btn' onClick={handlePayment}>
                  Öde
                </button>
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

  .cardsitem {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }

  .cards {
    flex: 1;
  }

  .cardss {
    background-color: #eceff133;
    padding: 1rem;
    border-radius: 8px;
  }

  .cards__bullets {
    line-height: 1.4;
  }

  .cards__heading {
    font-size: 1.05em;
    font-weight: 600;
  }

  .cards__price {
    font-size: 1.75em;
    font-weight: 700;
  }

  .flow > * + * {
    margin-top: var(--flow-space, 1.25em);
  }

  .cards:hover {
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
