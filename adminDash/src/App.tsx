import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { Homepage } from './pages/Homepage';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/orders" element={<Layout><Orders /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/homepage" element={<Layout><Homepage /></Layout>} />
        <Route path="/settings" element={<Layout><div className="text-white">Settings Page Coming Soon</div></Layout>} />
        <Route path="/" element={<Navigate to="/login\" replace />} />
      </Routes>
    </Router>
  );
}

export default App;