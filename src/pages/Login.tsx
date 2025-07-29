import React from "react";

// Import images
import instagram from "../img/instagram.png";
import twitter from "../img/twitter.png";
import facebook from "../img/Facebook.png";
import linkedin from "../img/linkedin.png";
import phone from "../img/phone_interface.png";
import "./login.css";
import Dashboard from "./Dashboard";

// Custom styles for the login page


const Login = () => {
  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };
  
  return (
    <div className="login-bg-main overflow-hidden pb-32">
      {/* Header */}
      <div className="login-header">
        <div className="login-header-left">  
          <span className="login-header-logo text-black">SocialScheduler</span>
          <img src="/logo.svg" alt="Logo" style={{ height: '42px', marginRight: '8px' }} />
        </div>
        <div className="login-header-right">
          <button className="login-header-btn text-black" onClick={goToDashboard}>Sigin</button>
          <button className="login-header-btn text-black" onClick={goToDashboard}>Get Start</button>
        </div>
      </div>
      {/* Hero Section */}
      <div className="login-hero">
        <div className="login-hero-title text-black">
          Lets you plan, manage, and <span className="purple">automate</span> your social
        </div>
        <div className="login-hero-sub">
          Ready to automate your social media posts? Sign up now and take control of your content calendar.
        </div>
      </div>
      {/* Email Signup */}
      <div className="login-email-box">
        <input className="login-email-input" placeholder="enter you gmail" />
        <button className="login-email-btn">Get Start</button>
      </div>
      {/* Visual Section */}
      <div className="login-visual-section">
        <div className="login-ellipse"></div>
        <img src={phone} alt="Phone interface" className="login-phone" />
        <img src={instagram} alt="Instagram" className="login-social instagram" />
        <img src={twitter} alt="Twitter" className="login-social twitter" />
        <img src={facebook} alt="Facebook" className="login-social facebook" />
        <img src={linkedin} alt="LinkedIn" className="login-social linkedin" />
      </div>
      
      {/* Footer Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-40">
        <div className="container mx-auto px-4 py-3">
          {/* Main Footer Content */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            
            {/* Left Side - Legal Links */}
            <div className="flex flex-wrap items-center space-x-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Terms and Conditions'); }}>
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Privacy Policy'); }}>
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Cookie Policy'); }}>
                Cookie Policy
              </a>
              <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Accessibility Statement'); }}>
                Accessibility
              </a>
            </div>

            {/* Center - Copyright */}
            <div className="text-xs text-gray-600">
              © 2025 SocialScheduler. All rights reserved.
            </div>

            {/* Right Side - Social & Support */}
            <div className="flex items-center space-x-4">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 mr-2">Follow us:</span>
                <a href="#" className="hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); alert('Twitter'); }}>
                  <img src={twitter} alt="Twitter" className="w-5 h-5" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); alert('Facebook'); }}>
                  <img src={facebook} alt="Facebook" className="w-5 h-5" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); alert('LinkedIn'); }}>
                  <img src={linkedin} alt="LinkedIn" className="w-5 h-5" />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" onClick={(e) => { e.preventDefault(); alert('Instagram'); }}>
                  <img src={instagram} alt="Instagram" className="w-5 h-5" />
                </a>
              </div>

              {/* Language Selector */}
              <select className="text-xs text-gray-600 bg-transparent border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-gray-500">
                <option value="en">🇺🇸 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="de">🇩🇪 DE</option>
              </select>
            </div>
          </div>

          {/* Bottom Row - Support Links */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center space-x-4 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Contact Us'); }}>
              Contact Us
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); alert('Help & FAQ'); }}>
              Help & FAQ
            </a>
            <a href="mailto:support@socialscheduler.com" className="hover:text-gray-800 transition-colors">
              support@socialscheduler.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;