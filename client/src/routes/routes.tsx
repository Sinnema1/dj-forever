import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import AppLayout from './components/layout/AppLayout';

// Public pages
import Home from './pages/Home';
import ErrorPage from './pages/Error';

// Features
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './features/users/Profile';
import RSVP from './features/rsvp/RSVP';

// Dashboard
import Dashboard from './pages/Dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';

/**
 * AppRoutes defines all routes and applies layout via AppLayout.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* All routes wrapped in AppLayout */}
      <Route path="/" element={<AppLayout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="rsvp"
          element={
            <PrivateRoute>
              <RSVP />
            </PrivateRoute>
          }
        />

        {/* Catch-all error route */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
