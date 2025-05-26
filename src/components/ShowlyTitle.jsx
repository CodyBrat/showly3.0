import React, { useState, useEffect, useRef } from 'react';
import './ShowlyTitle.css';

function ShowlyTitle() {
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement for the proximity effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Calculate distortion effect for each letter
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    
    const letters = text.querySelectorAll('.letter');
    const sensitivity = 100; // Adjust sensitivity of the effect
    const maxDistortion = 50; // Max distortion amount
    
    letters.forEach((letter, index) => {
      const rect = letter.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;
      
      // Calculate distance between mouse and letter
      const distanceX = mousePosition.x - letterX;
      const distanceY = mousePosition.y - letterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Calculate distortion based on proximity
      const distortion = Math.max(0, 1 - distance / sensitivity);
      const letterDistortion = distortion * maxDistortion;
      
      // Apply the silver gradient directly in the component for better control
      letter.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(230,230,230,0.9) 40%, rgba(80, 79, 79, 0.85) 100%)';
      letter.style.backgroundClip = 'text';
      letter.style.webkitBackgroundClip = 'text';
      letter.style.webkitTextFillColor = 'transparent';
      letter.style.textFillColor = 'transparent';
      
      // Apply transformations
      letter.style.transform = `translate(${distortion * -distanceX * 0.1}px, ${distortion * -distanceY * 0.1}px) scale(${1 + distortion * 0.1})`;
      letter.style.filter = `blur(${letterDistortion * 0.05}px) drop-shadow(0 0 2px rgba(255,255,255,0.05))`;
      letter.style.opacity = 1 - (distortion * 0.1); // Reduced distortion effect on opacity
      letter.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out, opacity 0.1s ease-out';
    });
  }, [mousePosition]);
  
  return (
    <div className="brand-section">
      <h1 className="brand proximity-text" ref={textRef}>
        <span className="letter">S</span>
        <span className="letter">h</span>
        <span className="letter">o</span>
        <span className="letter">w</span>
        <span className="letter">l</span>
        <span className="letter">y</span>
      </h1>
      <p className="tagline">YOUR GATEWAY TO LIVE ENTERTAINMENT</p>
    </div>
  );
}

export default ShowlyTitle; 