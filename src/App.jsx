// File: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
import Faq from './components/Faq';
import Cta from './components/Cta';
import Footer from './components/Footer/Footer';
import FindDoctorPage from './components/FindDoctorPage/FindDoctorPage';
import Auth from './components/Login/Auth';
import Pharmacy from './components/Pharmacy/Pharmacy';
import Payment from './components/Payment/Payment';
import Price from './components/Price/Price';

function HomePage() {
  return (
    <div className="bg-black relative overflow-x-hidden">
      <main>
        <Hero />
        <Brands />
        <HowItWorks />
        <Services />
        <Faq />
        <Cta />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-black relative overflow-x-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/Doctor" element={<FindDoctorPage />} />
            <Route path="/Pharmacy" element={<Pharmacy />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/Price" element={<Price />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;