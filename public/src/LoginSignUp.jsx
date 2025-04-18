// App.js
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './App.css'; // Custom styles for card-container and flip effects

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const toggleCard = () => setIsFlipped(prev => !prev);

  useEffect(() => {
    gsap.to(frontRef.current, {
      rotateY: isFlipped ? -180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'center center',
    });

    gsap.to(backRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'center center',
    });
  }, [isFlipped]);

  return (
    <div className="h-screen flex bg-gray-100 justify-center">
      <div className="card-container relative mt-10">
        {/* Back - Sign Up */}
        <div ref={frontRef} className="card absolute bg-white p-8 rounded-lg shadow-md w-96 h-150 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email/Username</label>
              <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Email/Username" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Password" />
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

        {/* Front - Login */}
        <div ref={backRef} className="card absolute bg-white p-8 rounded-lg shadow-md w-96 h-150 flex flex-col justify-center rotate-y-180">
          <h2 className="text-2xl font-bold mb-6 text-center ">SignUp</h2>
          <form>
            <div className="mb-6">
              <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">UserName</label>
              <input type="password" id="signup-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your UserName" />
            </div>
            <div className="mb-6">
              <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="password" id="signup-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter your Email" />
            </div>
            <div className="mb-6">
              <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input type="password" id="signup-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="password" />
            </div>
            <div className="mb-6">
              <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input type="password" id="signup-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" placeholder="Confirm Password" />
            </div>
            
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">Sign Up</button>
          </form>
          <button onClick={toggleCard} className="mt-4 text-center text-blue-500 hover:underline">
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
