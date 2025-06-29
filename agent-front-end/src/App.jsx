// src/App.jsx
import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

// Simple SVG for the logo
const SbiLogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


function App() {
  return (
    <div className="sbi-website">
      <header className="site-header">
        <div className="logo">
          <SbiLogoIcon />
          <span>SBI Life</span>
        </div>
        <nav className="site-nav">
          <a href="#plans">Insurance Plans</a>
          <a href="#services">Our Services</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <h1>Secure Your Future, Today.</h1>
          <p>With SBI Life, protect what matters most with plans tailored for you and your family's needs.</p>
        </section>

        <section className="content-section">
          <h2>Our Popular Plans</h2>
          <div className="card-container">
            <div className="card">
              <h3>Term Insurance</h3>
              <p>Provide a financial safety net for your loved ones at an affordable premium. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="card">
              <h3>ULIPs</h3>
              <p>A perfect blend of investment and life insurance to help you achieve your long-term financial goals. Sed do eiusmod tempor incididunt.</p>
            </div>
            <div className="card">
              <h3>Retirement Plans</h3>
              <p>Plan for a financially independent retired life. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2023 SBI Life Insurance Company Ltd. All rights reserved.</p>
        <p>This is a fictional demonstration website.</p>
      </footer>

      {/* The Chat Widget is rendered here, but it will float on its own */}
      <ChatWidget />
    </div>
  );
}

export default App;