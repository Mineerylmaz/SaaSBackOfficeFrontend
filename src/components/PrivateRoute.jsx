import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromCookie } from './utils/cookie';


const PrivateRoute = ({ children }) => {
    const user = getUserFromCookie();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
