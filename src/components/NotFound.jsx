import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Page404 from './Page404';

const NotFound = () => {
  return (
    <Wrapper>

      <Page404></Page404>

      <Link to="/">Ana Sayfaya Dön</Link>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  ;



  a {
    text-decoration: none;
    color: #3700ff;
    font-weight: bold;
    font-size: 1.2rem;
    border: 2px solid #3700ff;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #3700ff;
      color: white;
    }
  }
`;

export default NotFound;
