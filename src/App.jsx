import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Forgotp from './components/Forgotp';
import AddUserForm from './components/Admin';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import { Navigate } from 'react-router-dom';
import { getUserFromCookie } from './components/utils/cookie';

const getUserFromStorage = () => {
  return localStorage.getItem('user');
};


export default function App() {
  return (
    <div>


      <Router>
        <Routes>
          <Route path="/admin" element={<AddUserForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgotp" element={<Forgotp />} />
          <Route
            path="/pricing"
            element={
              <PrivateRoute>
                <Pricing />
              </PrivateRoute>
            }
          />


          <Route
            path="/"
            element={
              getUserFromStorage() ? <Navigate to="/pricing" /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<AdminPanel />} />
          <Route
            path="/"
            element={
              getUserFromCookie() ? <Navigate to="/pricing" /> : <Navigate to="/login" />
            }
          />



        </Routes>
      </Router>
    </div>
  );
}
