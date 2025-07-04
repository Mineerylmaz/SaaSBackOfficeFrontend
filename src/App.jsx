import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Forgotp from './components/Forgotp';
import Odeme from './components/Odeme';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';

const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default function App() {
  const user = getUserFromStorage();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/pricing" element={<Pricing />} />
        <Route path="/odeme" element={user ? <Odeme /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={user ? <Navigate to="/pricing" /> : <Login />} />
        <Route path="/forgotp" element={<Forgotp />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
