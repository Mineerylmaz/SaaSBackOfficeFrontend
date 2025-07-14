import React from 'react';
import styled from 'styled-components';

import { DataGrid } from '@mui/x-data-grid';

const Profile = ({ user, settings }) => {
  const rtColumns = [
    {
      field: 'url',
      headerName: 'URL',
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'frequency',
      headerName: 'Çağrı Sıklığı (sn)',
      width: 150,
    },
  ];

  const staticColumns = [...rtColumns];
  const formatRows = (urls) => urls.map((item, idx) => ({ id: idx, ...item }));

  return (
    <StyledWrapper>
      <div className="profile-page">
        <div className="profile-card">
          <div className="cards__img"></div>
          <div className="cards__avatar"></div>
          <div className="cards__title">{user?.email}</div>
        </div>

        <div className="rt-url-list">
          <h2>Real Time (RT) URL Listesi</h2>
          {settings?.rt_urls && settings.rt_urls.length > 0 ? (
            <DataGrid
              rows={formatRows(settings.rt_urls)}
              columns={rtColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight={false}
              style={{ height: '350px' }}
            />
          ) : (
            <div className="empty-msg">Henüz RT URL eklenmemiş.</div>
          )}
        </div>

        <div className="static-url-list">
          <h2>Static URL Listesi</h2>
          {settings?.static_urls && settings.static_urls.length > 0 ? (
            <DataGrid
              rows={formatRows(settings.static_urls)}
              columns={staticColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              autoHeight={false}
              style={{ height: '350px' }}
            />
          ) : (
            <div className="empty-msg">Henüz Static URL eklenmemiş.</div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};


const StyledWrapper = styled.div`
  .profile-page {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: 768px) {
      flex-direction: column;
      max-width: 100%;
      padding: 0 10px;
      gap: 15px;
    }
  }

  .profile-card {
    flex: 0 0 200px;
    background: #000;
    color: #fff;
    border-radius: 20px;
    padding: 20px;
    position: relative;
    height: 400px;

    @media (max-width: 768px) {
      flex: none;
      width: 100%;
      height: auto;
      padding-bottom: 40px; /* Avatar ve başlık alanı için biraz boşluk */
    }
  }

  .cards__img {
    height: 140px;
    width: 100%;
    background: #333;
    border-radius: 20px 20px 0 0;

    @media (max-width: 768px) {
      height: 120px;
    }
  }

  .cards__avatar {
    position: absolute;
    top: 110px;
    left: calc(50% - 45px);
    width: 90px;
    height: 90px;
    background: #000;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
      position: relative;
      top: auto;
      left: auto;
      margin: -45px auto 10px auto; /* Üstten biraz yukarı çek ve ortala */
      width: 70px;
      height: 70px;
    }
  }

  .cards__avatar svg {
    width: 80px;
    height: 80px;

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }

  .cards__title {
    margin-top: 70px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;

    @media (max-width: 768px) {
      margin-top: 0;
      font-size: 18px;
    }
  }

  .rt-url-list, .static-url-list {
    flex: 1;
    background: linear-gradient(
      135deg,
      var(--e-global-color-primary),
      var(--e-global-color-secondary),
      var(--e-global-color-65fcc69)
    );
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-height: 400px;
    overflow-y: auto;

    @media (max-width: 768px) {
      max-height: none;
      width: 100%;
    }
  }

  h2 {
    margin-bottom: 1rem;
    color: var(--e-global-color-text);
  }

  .empty-msg {
    color: #071f35;
    font-style: italic;
    padding: 10px 0;
    text-align: center;
  }
`;


export default Profile;
