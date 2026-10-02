import React, { useState, useEffect } from 'react';
import { ChevronRight, Compass } from 'lucide-react';
import { ThreeParticleSphere } from './ThreeParticleSphere';
import './TitleIntroAnimation.css';

interface TitleIntroAnimationProps {
  onComplete: (action?: 'enterprise' | 'verify-now') => void;
  durationSeconds?: number;
}

export const TitleIntroAnimation: React.FC<TitleIntroAnimationProps> = ({
  onComplete,
  durationSeconds = 5
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExit = (action?: 'enterprise' | 'verify-now') => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete(action);
    }, 700);
  };

  // Automatic 5-second intro timer
  useEffect(() => {
    const totalMs = durationSeconds * 1000;
    const intervalMs = 40;
    const step = (intervalMs / totalMs) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    // Trigger warp transition slightly before 5s for cinematic exit
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, Math.max(0, totalMs - 750));

    // Complete at exactly 5 seconds
    const completeTimer = setTimeout(() => {
      onComplete('enterprise');
    }, totalMs);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [durationSeconds, onComplete]);

  return (
    <div className={`title-intro-overlay ${isExiting ? 'intro-exiting' : ''}`}>
      {/* Background Atmosphere */}
      <div className="intro-cosmic-bg" />
      <div className="intro-grid-subtle" />

      {/* Top Right Skip Action */}
      <nav className="intro-top-nav-bar">
        <button 
          className="intro-skip-btn"
          onClick={() => handleExit('enterprise')}
          title="Skip intro to platform"
        >
          <span>SKIP</span>
          <ChevronRight size={13} />
        </button>
      </nav>

      {/* Centered Structured Showcase */}
      <main className="intro-center-showcase">
        {/* Top Title & Branding */}
        <div className="intro-title-block">
          <div className="intro-badge-pill">
            <span className="intro-badge-dot" />
            <span>AI-ERA ADVERTISING INTEGRITY</span>
          </div>

          <h1 className="intro-hero-title">
            <span className="hero-word-ad">AD</span>
            <span className="hero-word-dash">-</span>
            <span className="hero-word-evidence">EVIDENCE</span>
          </h1>

          <p className="intro-hero-tagline">
            <span>SEE THE CLAIM. </span>
            <span className="tagline-accent">VERIFY THE EVIDENCE.</span>
          </p>
        </div>

        {/* 3D Particle Sphere Hero Centerpiece */}
        <div className="intro-sphere-stage">
          <div className="sphere-back-glow" />
          <ThreeParticleSphere 
            isWarping={isExiting}
            onSphereClick={() => handleExit('enterprise')}
          />
        </div>

        {/* Bottom Minimalist Progress & Interactive Indicator (No click needed) */}
        <div className="intro-bottom-action-block">
          <div className="intro-timer-line-container">
            <div 
              className="intro-timer-line-fill" 
              style={{ width: `${Math.min(100, progress)}%` }} 
            />
          </div>

          <div className="intro-hint-text">
            <Compass size={13} color="#00E5FF" />
            <span>DRAG SPHERE TO ROTATE IN 3D <span className="hint-dot">•</span> LAUNCHING IN {Math.max(1, Math.ceil(durationSeconds * (1 - progress / 100)))}S</span>
          </div>
        </div>
      </main>
    </div>
  );
};
