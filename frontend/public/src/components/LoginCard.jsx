// components/LoginCard.jsx
import React from 'react';

const LoginCard = ({ toggleCard, frontRef }) => (
  <div ref={frontRef} className="card absolute bg-white p-8 rounded-lg shadow-md w-96 h-150 flex flex-col justify-center">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <form>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email/Username</label>
        <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Email/Username" />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Password" />
      </div>
      <div className="flex justify-between mb-6">
        <div></div>
        <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">Login</button>
    </form>
    <button onClick={toggleCard} className="mt-4 text-center text-blue-500 hover:underline">
      Don't have an account? Sign Up
    </button>
  </div>
);

export default LoginCard;
