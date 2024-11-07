// src/components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Anfield Properties</h4>
          <p className="text-gray-400">Thank You So Much Guys For Your Valuable Time</p>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-600">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        {/* Contact Info Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Contact Info</h4>
          <p className="text-gray-400"><i className="fas fa-phone-alt"></i> +070 000000</p>
          <p className="text-gray-400"><i className="fas fa-phone-alt"></i> +070 000000</p>
          <p className="text-gray-400"><i className="fas fa-envelope"></i> Anfield@gmail.com</p>
          <p className="text-gray-400"><i className="fas fa-map-marker-alt"></i> Liverpool, Mersyside - #123</p>
        </div>
        
        {/* Explore Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Explore</h4>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Service</a></li>
            <li><a href="#" className="hover:underline">Rooms</a></li>
            <li><a href="#" className="hover:underline">Customer Review</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        
        {/* Subscribe Us Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Subscribe Us</h4>
          <p className="text-gray-400">Subscribe For Latest Updates</p>
          <form className="space-y-2">
            <input 
              type="email" 
              placeholder="Enter Your Email" 
              className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              type="submit" 
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-purple-700 transition duration-200"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
