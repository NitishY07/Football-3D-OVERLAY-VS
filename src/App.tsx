import React, { useEffect, useState } from 'react'

const App = () => {
  const [showStreaks, setShowStreaks] = useState(false);

  useEffect(() => {
    // Trigger particle streaks after entrance animation
    const timer = setTimeout(() => {
      setShowStreaks(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="broadcast-container">
      {/* Background Environment */}
      <img src="/stadium_bg.jpg" alt="Stadium" className="stadium-bg" />
      <div className="fog-overlay"></div>
      <div className="volumetric-light"></div>
      
      {/* Particles/Streaks */}
      {showStreaks && (
        <div className="particles">
          <div className="streak" style={{ top: '30%', left: '20%', animation: 'flash 3s linear infinite' }}></div>
          <div className="streak" style={{ top: '70%', right: '20%', animation: 'flash 2.5s linear infinite 1s' }}></div>
        </div>
      )}

      {/* 3D Scene */}
      <div className="scene-3d">
        
        {/* Home Team Panel */}
        <div className="team-panel home-panel">
          <div className="team-subtitle">Home</div>
          <div className="team-logo-container">
            <img src="/home_logo.jpg" alt="Home Logo" className="team-logo" style={{ borderRadius: '50%', boxShadow: '0 0 30px rgba(0,0,0,0.8)' }} />
          </div>
          <div className="team-name">Red Devils</div>
          <div className="form-container">
            <div className="form-dot form-w">W</div>
            <div className="form-dot form-w">W</div>
            <div className="form-dot form-d">D</div>
            <div className="form-dot form-l">L</div>
            <div className="form-dot form-w">W</div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="center-panel">
          <div className="match-info-glass">
            <div className="league-name">Premier Championship</div>
            <div className="match-day">Matchday 24</div>
          </div>
          
          <div className="vs-badge">VS</div>
          
          <div className="match-info-glass" style={{ padding: '10px 20px' }}>
            <div className="league-name" style={{ fontSize: '0.8rem' }}>Kick-off</div>
            <div className="match-day" style={{ fontSize: '1.2rem' }}>20:45 CET</div>
          </div>
        </div>

        {/* Away Team Panel */}
        <div className="team-panel away-panel">
          <div className="team-subtitle">Away</div>
          <div className="team-logo-container">
            <img src="/away_logo.jpg" alt="Away Logo" className="team-logo" style={{ borderRadius: '50%', boxShadow: '0 0 30px rgba(0,0,0,0.8)' }} />
          </div>
          <div className="team-name">Blue Eagles</div>
          <div className="form-container">
            <div className="form-dot form-w">W</div>
            <div className="form-dot form-l">L</div>
            <div className="form-dot form-w">W</div>
            <div className="form-dot form-w">W</div>
            <div className="form-dot form-d">D</div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes flash {
          0% { transform: translateX(-100vw); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default App
