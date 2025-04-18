// components/SignUpCard.jsx
import React from 'react';

const SignUpCard = ({ toggleCard, backRef }) => (
  <div ref={backRef} className="card absolute bg-white p-8 rounded-lg shadow-md w-96 h-150 flex flex-col justify-center rotate-y-180">
    <h2 className="text-2xl font-bold mb-6 text-center">SignUp</h2>
    <form>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">UserName</label>
        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your UserName" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Email" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Password" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Confirm Password" />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">Sign Up</button>
    </form>
    <button onClick={toggleCard} className="mt-4 text-center text-blue-500 hover:underline">
      Already have an account? Login
    </button>
  </div>
);

export default SignUpCard;
