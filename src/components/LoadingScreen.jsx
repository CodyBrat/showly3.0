import { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = ({ finishLoading }) => {
  const [counter, setCounter] = useState(0);
  const [dustParticles, setDustParticles] = useState([]);
  const [countdownNumber, setCountdownNumber] = useState(5);
  
  // Generate random dust particles for film effect
  useEffect(() => {
    const newDustParticles = [];
    for (let i = 0; i < 30; i++) {
      newDustParticles.push({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        size: Math.random() * 2 + 1 + 'px',
        driftX: (Math.random() - 0.5) * 200 + 'px',
        driftY: (Math.random() - 0.5) * 200 + 'px',
        animationDuration: Math.random() * 5 + 5 + 's',
        animationDelay: Math.random() * 5 + 's'
      });
    }
    setDustParticles(newDustParticles);
  }, []);

  // Create perforations around film reel
  const createPerforations = () => {
    const perforations = [];
    const count = 16; // Number of perforations
    const radius = 50; // Radius of the reel
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      perforations.push(
        <div 
          key={i} 
          className="perforation" 
          style={{ 
            left: `calc(50% + ${x}px - 6px)`, 
            top: `calc(50% + ${y}px - 6px)` 
          }}
        />
      );
    }
    
    return perforations;
  };

  // Countdown effect
  useEffect(() => {
    if (counter > 0 && counter % 20 === 0 && countdownNumber > 1) {
      setCountdownNumber(prev => prev - 1);
    }
  }, [counter]);
  
  // Progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        if (newCounter >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (finishLoading) finishLoading();
          }, 500); // Wait a bit after reaching 100% before hiding
          return 100;
        }
        return newCounter;
      });
    }, 40); // Adjust speed of counter here
    
    return () => clearInterval(interval);
  }, [finishLoading]);
  
  return (
    <div className="loading-screen">
      {/* Projector beam */}
      <div className="projector-beam"></div>
      
      {/* Film scratches effect */}
      <div className="film-scratches"></div>
      
      {/* Film strip at bottom */}
      <div className="film-strip"></div>
      
      {/* Countdown effect */}
      <div className="countdown-numbers">{countdownNumber}</div>
      
      {/* Old film dust particles */}
      {dustParticles.map(particle => (
        <div 
          key={particle.id}
          className="dust"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDuration: particle.animationDuration,
            animationDelay: particle.animationDelay,
            '--drift-x': particle.driftX,
            '--drift-y': particle.driftY
          }}
        />
      ))}
      
      <div className="loading-content">
        <div className="film-reel">
          {/* Render perforations around the reel */}
          {createPerforations()}
        </div>
        
        <div className="loading-text">Showly</div>
        
        <div className="loading-progress-container">
          <div className="loading-progress-bar" style={{ width: `${counter}%` }}></div>
        </div>
        
        <div className="loading-percentage">{counter}%</div>
        
        <div className="loading-message">
          {counter < 30 ? "Rolling the film..." : 
           counter < 60 ? "Preparing your show..." : 
           counter < 90 ? "Almost ready..." : 
           "Action!"}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 