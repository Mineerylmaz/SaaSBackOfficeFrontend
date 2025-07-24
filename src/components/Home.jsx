
import React from 'react';
import { Link } from 'react-router-dom';
import Navbars from './Navbars';
import styled from 'styled-components';


export default function Home({ darkMode }) {
  return (
    <StyledWrapper darkMode={darkMode}>


      <div className='home' darkMode={darkMode}>


        <HeroSection darkMode={darkMode}>
          <HeroTitle  >Akıllı Transit Çözümleriyle Yolunuzu Kolaylaştırın</HeroTitle>
          <HeroSubtitle darkMode={darkMode}>
            Global açık veri platformu ile otobüs, tren ve diğer toplu taşıma hatlarınızı yönetin.
          </HeroSubtitle>
          <Link to="/pricing">
            <HeroButton>Planları İncele</HeroButton>
          </Link>
        </HeroSection>
        <div style={{ textAlign: 'center', marginTop: '12rem' }} darkMode={darkMode}>

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
  padding: 8rem 3rem 5rem;

  background-color: ${({ darkMode }) => (darkMode ? "#0b1d3a" : "transparent")};
  color: #ffff 
  text-align: center;
  @media (max-width: 768px) {
    padding: 5rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;


const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
 
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
 @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
 
`;


const HeroButton = styled.a`
  background: white;
  color: #071f35;
  padding: 0.8rem 2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #071f35;
    color: white;
        text-decoration: none;
  }
        &:visited {
  text-decoration: none;
}

`;



const StyledWrapper = styled.div`
 background-color: ${({ darkMode }) => (darkMode ? "#0b1d3a" : "#f7f9fc")};
  height: 50vh;
display: flex;
flex-direction: column;
justify-content: space-between;


  .road {
    position: relative;
    width: 100%;
    height: 110px;
    background-color: gray;
    margin-top: 1rem;
    z-index: 10;
     overflow-x: hidden;
  min-width: 100%;
  }



/*.tree{
	
  z-index:1;
  position:absolute;
  width:150px;
  height:150px;
  background: url(http://th07.deviantart.net/fs71/150/f/2012/176/f/4/tree_yay_by_rhubarb_leaf-d54swby.png);
  background-repeat: no-repeat;
  margin:-50px 0 0 500px ;
 }*/

.bus {

  display: block;
  


   
    width: 90px;
    height: 45px;
    clear:both;
   
 	background-color:red;
    border-radius:17px 10px 2px 2px;  
    background: red;
    position :relative;
  animation: mymove 7s infinite normal ease-in-out;
  -webkit-animation: mymove 7s infinite normal ease-in-out;
}
@keyframes mymove {
  0% { left: -100px; } 
  70% { left: 70vw; }  
}



@-webkit-keyframes mymove {
    0% { left: -300px;}
    50% {left: 550px;}
    100% {left: 1400px;}
 }

.whell1 {
  position: absolute;
  width: 14px;
  height: 14px;
  background: black;
  border-radius: 50%;
  top: 37px;
  left: 65px; 
}



.whell2{
  position:absolute;
  display: inline-block;
  width:14px;
  height:14px;
  background-color:black;
  border-radius:80px;
  
  top:37px;
  left:10px;
  background-position: center center;
  }

.whell3{
  position:absolute;
  display: inline-block;
  width:8px;
  height:8px;
  background-color:transparent;
  border:1.5px dotted white;
  border-radius:80px;
  
  top:39px;
  left:67.1px;
  background-position: center center;
  }


.whell4{
  position:absolute;
  display: inline-block;
  width:8px;
  height:8px;
  background-color:transparent;
  border:1.5px dotted white;
  border-radius:80px;
  
  top:39px;
  left:11.9px;
  background-position: center center;
  }


.win1 {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 4px 0 0 0;
  top: 5px;
  left: 8px;
}

.win2 {
  position: absolute;
  width: 18px;
  height: 12px;
  background-color: white;
  border-radius: 3px 3px 0 0;
  top: 5px;   
  left: 24px;  
}

.win3 {
  position: absolute;
  width: 18px;
  height: 12px;
  background-color: white;
  border-radius: 3px 3px 0 0;
  top: 5px;
  left: 48px;
}

.win4 {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 0 4px 0 0;
  top: 5px;
  left: 72px;
}

.line {
  position: relative; 
  width: 100%;         
  height: 1px;
  top: 60px;          
  border: 1px dashed white;
  margin: 0 auto;
}

.fuel{
  position:absolute;
  display: inline-block;
  width:5px;
  height:1.5px;
  background-color:#1D1F20;
  border-radius:0px;
  margin:42px -5px;
  background-position: center center;
  transform:rotate(-18deg);  
}

.light{
  z-index:1;
  position:absolute;
  display: inline-block;
  width:4px;
  height:7.8px;
  background-color:black;
  border-radius:80px;
  margin:27px 90px;
  border-radius: 0 90px 90px 0;
  background:#f93100;
 
}

.up1{
  position:absolute;
  display: inline-block;
  width:50px;
  height:2px;
  background-color:white;
  border-radius:4px 4px 0 0;
  margin:-5px 0px 0px 19px;
  background-position: center center;
  }

.up2{
  position:absolute;
  display: inline-block;
  width:2px;
  height:5px;
  background-color:white;
  margin:-5px 0px 0px 26px;
  background-position: center center;
  }

.up3{
  position:absolute;
  display: inline-block;
  width:2px;
  height:5px;
  background-color:white;
  margin:-5px 0px 0px 60px;
  background-position: center center;
  }

.foggy{
  width:4px;
  height:7.8px;
  border-right:200px solid #f7f771;
  border-top:20px solid transparent;
  border-left:20px solid transparent;
  border-bottom:20px solid transparent;
  border-radius:100px;
  margin:90px 60px;
  position:absolute;
  margin:7px 68px;


}
  

`