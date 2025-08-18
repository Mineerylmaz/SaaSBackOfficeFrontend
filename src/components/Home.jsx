
import React from 'react';
import { Link } from 'react-router-dom';
import Navbars from './Navbars';
import styled from 'styled-components';
import SplashCursor from './Cursor';

export default function Home() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  return (
    <StyledWrapper >



      <div className='home' >


        <HeroSection >
          <HeroTitle  >Akıllı Transit Çözümleriyle Yolunuzu Kolaylaştırın</HeroTitle>
          <HeroSubtitle >
            Global açık veri platformu ile otobüs, tren ve diğer toplu taşıma hatlarınızı yönetin.
          </HeroSubtitle>
          {!isLoggedIn && (
            <Link to="/pricing">
              <HeroButton>Planları İncele</HeroButton>
            </Link>

          )}
        </HeroSection>
        <div className="scene" >


          <div className='road'>
            <div className='cloud1'></div>
            <div className='cloud2'></div>
            <div className='cloud3'></div>
            <div className='cloud4'></div>
            <div className='line'></div>
            <div className='tree'></div>
            <div className='bus'>
              <div className='up1'></div>
              <div className='up2'></div>
              <div className='up3'></div>
              <div className='win1'></div>
              <div className='win2'></div>
              <div className='win3'></div>
              <div className='win4'></div>
              <div className='whell1'></div>
              <div className='whell2'></div>
              <div className='whell3'></div>
              <div className='whell4'></div>
              <div className='fuel'></div>
              <div className='light'></div>
              <div className='foggy'></div>



            </div>
          </div>

        </div>



      </div>
    </StyledWrapper>
  );
}



const HeroSection = styled.section`
  padding: 7rem 3rem 2rem;        
  background: transparent;        
  color:#ffff;
  text-align: center;

  
 

  @media (max-width: 768px) { padding: 5rem 2rem 1.5rem; }
  @media (max-width: 480px) { padding: 3rem 1rem 1.25rem; }
`;



const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 900;
  letter-spacing: .3px;
  background: linear-gradient(135deg, #00AEEF, #0055A4);
  -webkit-background-clip: text;
  background-clip: text;
  color: #ffff;

  @media (max-width: 768px) { font-size: 2.2rem; }
  @media (max-width: 480px) { font-size: 1.7rem; }
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  margin-bottom: 2rem;
  opacity: .9;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
color:#fff
  @media (max-width: 768px) { font-size: 1rem; }
  @media (max-width: 480px) { font-size: .95rem; }
`;

const HeroButton = styled.button`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #00AEEF, #0055A4);
  color: #fff;
  padding: 0.9rem 2.1rem;
  font-weight: 800;
  border-radius: 14px;
  cursor: pointer;
  border: none;
  box-shadow: 0 10px 26px rgba(0,85,164,.28);
  transition: transform .12s ease, filter .2s ease;

  &:hover { transform: translateY(-1px); filter: brightness(1.02); }
  &:active { transform: translateY(0); }

  /* parıltı */
  &::after{
    content:"";
    position:absolute; inset:0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
    transform: translateX(-100%);
    transition: transform .6s ease;
  }
  &:hover::after{ transform: translateX(100%); }
`;
const StyledWrapper = styled.div`
  /* Tema değişkenleri */
  --line: rgba(148,163,184,.25);
  --sky-light: #f7f9fc;
  --sky-dark: #0b1220;
  --accent: #00AEEF;
  --accent2: #0055A4;
  --road: #1f2937;
  --lane: #ffffff;

  background: #0f172a;

  min-height: 100vh;
  display: flex;
  flex-direction: column;

  /* HERO altında sahne */
  .home { flex: 1; display: flex; flex-direction: column; }

.scene {
  position: relative;
  width: 100%;
  height: 260px;
 
  display: grid;
  place-items: center;
}


 .road{
  --h: 120px;
  position: relative;
  width: 100%;
  height: var(--h);
  background: linear-gradient(180deg, #2a3648, #1f2937);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2);
  overflow-x: hidden;  
  overflow-y: visible;  
  z-index: 1;
}

.bus{
  --w: 140px;
  --h: 64px;
  position: relative;
  width: var(--w);
  top: 4px;     
  left: -120px;
  height: var(--h);
  background: linear-gradient(180deg, #06b6d4, #0ea5e9);
  border-radius: 16px 16px 10px 10px;
 
  z-index: 2;    
  box-shadow: inset 0 10px 18px rgba(255,255,255,.18), 0 10px 26px rgba(0,0,0,.25);
  animation: drive 6.5s ease-in-out infinite;
}


 
  .line {
    position: absolute;
    left: 0; top: 50%;
    translate: 0 -50%;
    width: 200%;
    height: 6px;
    background-image: repeating-linear-gradient(90deg, var(--lane) 0 40px, transparent 40px 80px);
    opacity: .9;
    animation: laneFlow 1.35s linear infinite;
  }
  @keyframes laneFlow {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Ağaç silüetleri (parallax) */
  .tree {
    position: absolute;
    bottom: calc(var(--h) - 20px);
    left: 0;
    width: 200%;
    height: 60px;
    background:
      radial-gradient(14px 16px at 20% 100%, #2b3d55 99%, transparent 100%) 0 0/140px 100% repeat-x,
      radial-gradient(12px 14px at 60% 100%, #243449 99%, transparent 100%) 60px 0/140px 100% repeat-x;
    opacity: .7;
    animation: parallax 6s linear infinite;
  }
  @keyframes parallax { from{ transform: translateX(0); } to { transform: translateX(-50%); } }

  

/* ekstra küçük baloncuk efekti kaldırıldı, sade */
.cloud1 { left: 10%; animation-duration: 28s; }
.cloud2 { left: 40%; animation-duration: 32s; }
.cloud3 { left: 70%; animation-duration: 30s; }
.cloud4 { left: 85%; animation-duration: 26s; }

@keyframes cloud {
  from { transform: translateX(0); }
  to { transform: translateX(-120vw); }
}

  @keyframes drive{
    0%   { left: -160px; transform: translateY(0); }
    50%  { left: 55vw; transform: translateY(-1px); }
    70%  { left: 72vw; transform: translateY(0); }
    100% { left: 110vw; transform: translateY(0); }
  }

  /* tavan/ayrımlar */
  .up1,.up2,.up3{
    position:absolute; left:0; right:0;
    height: 6px; background: rgba(255,255,255,.22);
    border-radius: 6px;
  }
  .up1{ top: 8px; } .up2{ top: 18px; } .up3{ top: 28px; }

  /* camlar */
  .win1,.win2,.win3,.win4{
    position: absolute; top: 10px;
    width: 24px; height: 16px; border-radius: 6px;
    background: linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.6));
    box-shadow: inset 0 1px 0 rgba(0,0,0,.05);
  }
  .win1{ left: 12px; } .win2{ left: 40px; width: 28px;}
  .win3{ left: 74px; width: 28px;} .win4{ left: 108px; width: 22px;}

  /* far */
  .light{
    position:absolute; right: -10px; top: 28px;
    width: 10px; height: 8px; border-radius: 2px;
    background: #ffd166;
    box-shadow: 0 0 16px 6px rgba(255,209,102,.45);
  }

  /* egzoz dumanı (foggy) */
  .foggy{
    position: absolute;
    left: -14px; top: 36px;
    width: 10px; height: 10px; border-radius: 999px;
    background: ${({ darkMode }) => (darkMode ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)")};
    filter: blur(2px);
    animation: smoke 1.6s ease-out infinite;
  }
  @keyframes smoke{
    0% { opacity: .5; transform: translate(-2px,0) scale(.6); }
    100% { opacity: 0; transform: translate(-16px,-8px) scale(1.4); }
  }

  /* yakıt kapağı (fuel) – ufak detay */
  .fuel{
    position:absolute; left: 46px; top: 38px;
    width: 8px; height: 6px; border-radius: 2px;
    background: rgba(0,0,0,.35);
  }

  /* tekerlekler */
  .whell1,.whell2{
    position: absolute; bottom: -6px;
    width: 18px; height: 18px; border-radius: 999px; background: #111;
    box-shadow: inset 0 0 0 4px #222, inset 0 0 0 6px #444;
    overflow: hidden;
  }
  .whell1{ left: 96px; }   /* arka */
  .whell2{ left: 18px; }   /* ön  */

  

  /* “eski” küçük teker kapsülleri görünmesin (kodu bozma, sadece gizle) */
  .whell1::after, .whell2::after { content:""; }

  /* Responsive */
  @media (max-width: 768px){
    .scene{ height: 240px; }
    .bus{ --w: 120px; --h: 56px; }
  }
  @media (max-width: 480px){
    .scene{ height: 220px; }
    .bus{ --w: 108px; --h: 52px; }
  }
`;
