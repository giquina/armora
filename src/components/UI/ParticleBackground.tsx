import styles from './ParticleBackground.module.css';

interface ParticleBackgroundProps {
  particleCount?: number;
}

export function ParticleBackground({ particleCount = 25 }: ParticleBackgroundProps) {
  const particles = Array.from({ length: particleCount }, (_, index) => (
    <div
      key={index}
      className={styles.particle}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${15 + Math.random() * 10}s`,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
        opacity: 0.1 + Math.random() * 0.4,
      }}
    />
  ));

  return (
    <div className={styles.particleBackground}>
      {particles}
      <div className={styles.gradientOverlay}></div>
      <div className={styles.radialPulse}></div>
    </div>
  );
}