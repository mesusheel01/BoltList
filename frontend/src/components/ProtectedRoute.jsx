import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Check if token exists
    if (!token) {
        return <Navigate to="/Signin" replace />;
    }

    try {
        // Decode and check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp < currentTime) {
            // Token is expired, remove it and redirect
            localStorage.removeItem('token');
            return <Navigate to="/Signin" replace />;
        }

        // Token is valid, render the protected component
        return children;
    } catch (error) {
        // Invalid token, remove it and redirect
        localStorage.removeItem('token');
        return <Navigate to="/Signin" replace />;
    }
};

export default ProtectedRoute;
