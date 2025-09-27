import { FC, useEffect, useState, useCallback } from 'react';
import { ConfettiParticle, createConfettiParticle, updateConfettiParticle } from './achievementAnimations';

interface ConfettiProps {
  isActive: boolean;
  centerX: number;
  centerY: number;
  particleCount?: number;
  duration?: number;
  onComplete?: () => void;
}

const Confetti: FC<ConfettiProps> = ({ 
  isActive, 
  centerX, 
  centerY, 
  particleCount = 30, 
  duration = 3000,
  onComplete 
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const initializeParticles = useCallback(() => {
    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createConfettiParticle(i, centerX, centerY));
    }
    setParticles(newParticles);
    setStartTime(Date.now());
  }, [centerX, centerY, particleCount]);

  useEffect(() => {
    if (isActive) {
      initializeParticles();
    } else {
      setParticles([]);
      setStartTime(null);
    }
  }, [isActive, initializeParticles]);

  useEffect(() => {
    if (!isActive || !startTime) return;

    let animationId: number;
    let lastTime = startTime;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      const elapsed = currentTime - startTime;

      if (elapsed >= duration) {
        setParticles([]);
        onComplete?.();
        return;
      }

      setParticles(prevParticles => 
        prevParticles
          .map(particle => updateConfettiParticle(particle, deltaTime))
          .filter(particle => particle.life > 0)
      );

      lastTime = currentTime;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, startTime, duration, onComplete]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 10000,
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '2px',
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.life,
            transition: 'opacity 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;