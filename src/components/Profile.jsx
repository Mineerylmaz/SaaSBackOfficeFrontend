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
  }

  .profile-card {
    flex: 0 0 200px;
    background: #000;
    color: #fff;
    border-radius: 20px;
    padding: 20px;
    position: relative;
    height: 400px;
  }

  .cards__img {
    height: 140px;
    width: 100%;
    background: #333;
    border-radius: 20px 20px 0 0;
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
  }

  .cards__avatar svg {
    width: 80px;
    height: 80px;
  }

  .cards__title {
    margin-top: 70px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  .rt-url-list {
    flex: 1;
    background: linear-gradient(135deg,
      var(--e-global-color-primary),
      var(--e-global-color-secondary),
      var(--e-global-color-65fcc69));
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-height: 400px;
    overflow-y: auto;
  }

  .static-url-list {
   flex: 1;
    background: linear-gradient(135deg,
      var(--e-global-color-primary),
      var(--e-global-color-secondary),
      var(--e-global-color-65fcc69));
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-height: 400px;
    overflow-y: auto;
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
