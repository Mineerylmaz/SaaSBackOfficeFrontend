import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Odeme from './components/Odeme';
import Pricing from './components/Pricing';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Navbars from './components/Navbars';
import { useState, useEffect } from 'react';
import Profil from './components/Profil';
import Settings from './components/Settings';
import TransitMap from './components/TransitMap';

import Editor from './components/Editor';


export default function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    return savedUser && savedToken
      ? { ...JSON.parse(savedUser), token: savedToken }
      : null;
  });

  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan");
    if (storedPlan) {
      const parsedPlan = JSON.parse(storedPlan);
      setSelectedPlan(parsedPlan);
    }
  }, []);




  return (

    <>


      <Router>
        <Navbars user={user} setUser={setUser} />

        <Routes>

          <Route path="/" element={<Home />} />



          <Route path="/about" element={<NotFound />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/transitmap" element={<TransitMap />} />
          <Route
            path="/login"
            element={
              user
                ? user?.plan?.name
                  ? user?.role === 'admin'
                    ? <Navigate to="/adminrol" />
                    : user?.role === 'editor'
                      ? <Navigate to="/editor" />
                      : <Navigate to="/" />
                  : <Navigate to="/odeme" />
                : <Login setUser={setUser} />
            }
          />


          <Route path="/profil" element={<Profil user={user} />} />

          <Route
            path="/ayarlar"
            element={user ? <Settings user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/odeme" element={user ? <Odeme /> : <Navigate to="/login" />} />



          <Route path="/register/:token" element={<Register setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />




          <Route path="/notfound" element={<NotFound />} />
          <Route
            path="/admin"
            element={user?.role === 'superadmin' ? <AdminPanel /> : <Navigate to="/login" />}
          />
          <Route
            path="/editor"
            element={user?.role === 'editor' ? <Editor /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>


    </>


  );
}
