import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-[#1E1E1E]">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:gameId" element={<GameDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;