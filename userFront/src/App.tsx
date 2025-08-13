import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import GameDetailPage from './pages/GameDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-[#1E1E1E]">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:platform" element={<CategoryPage />} />
            <Route path="/game/:gameId" element={<GameDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failure" element={<PaymentFailurePage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;