import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './App.css';

import LoginCard from './components/LoginCard';
import SignUpCard from './components/SignUpCard';

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
        <LoginCard toggleCard={toggleCard} frontRef={frontRef} />
        <SignUpCard toggleCard={toggleCard} backRef={backRef} />
      </div>
    </div>
  );
};

export default App;
