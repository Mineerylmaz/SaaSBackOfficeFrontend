import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Forgotp from './components/Forgotp';
import Odeme from './components/Odeme';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Navbars from './components/Navbars';
import { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });



  return (
    <Router>
      <Navbars user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/home" element={<Home />} />

        <Route path="/about" element={<NotFound />} />

        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/odeme" /> : <Login setUser={setUser} />}
        />

        <Route path="/odeme" element={user ? <Odeme /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotp" element={<Forgotp />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
