import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import CategoryNavigation from './components/CategoryNavigation';
import HomePage from './pages/HomePage';
import CategoryGameGrid from './components/CategoryGameGrid';
import GameDetailPage from './pages/GameDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-[#1E1E1E]">
          <Header />
          <CategoryNavigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:platform" element={<CategoryGameGrid />} />
            <Route path="/game/:gameId" element={<GameDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;