export const animateCounter = (
  target: number, 
  setter: (value: number) => void,
  duration: number = 800
): void => {
  let current = 0;
  const startTime = Date.now();
  
  const animate = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    
    // Ease-out animation
    const easeOut = 1 - Math.pow(1 - progress, 3);
    current = Math.floor(target * easeOut);
    
    setter(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setter(target);
    }
  };
  
  animate();
};

export const typeWriter = (
  text: string,
  setter: (value: string) => void,
  speed: number = 50
): Promise<void> => {
  return new Promise((resolve) => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setter(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
};

export interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  gravity: number;
  life: number;
  maxLife: number;
}

export const createConfettiParticle = (id: number, centerX: number, centerY: number): ConfettiParticle => {
  const colors = ['#FFD700', '#FFA500', '#FFFF00', '#FFFFFF', '#FFE55C'];
  const angle = (Math.random() * Math.PI * 2);
  const velocity = Math.random() * 8 + 4;
  
  return {
    id,
    x: centerX + (Math.random() - 0.5) * 50,
    y: centerY + (Math.random() - 0.5) * 20,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity - Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    size: Math.random() * 6 + 4,
    gravity: 0.3 + Math.random() * 0.2,
    life: 1,
    maxLife: Math.random() * 2000 + 2000,
  };
};

export const updateConfettiParticle = (particle: ConfettiParticle, deltaTime: number): ConfettiParticle => {
  return {
    ...particle,
    x: particle.x + particle.vx * deltaTime,
    y: particle.y + particle.vy * deltaTime,
    vx: particle.vx * 0.98, // Air resistance
    vy: particle.vy + particle.gravity * deltaTime,
    rotation: particle.rotation + particle.rotationSpeed * deltaTime,
    life: Math.max(0, particle.life - deltaTime / particle.maxLife),
  };
};

export const animationSequence = {
  bannerSlide: { delay: 0, duration: 600 },
  trophyAppear: { delay: 300, duration: 400 },
  textTypewriter: { delay: 500, duration: 800 },
  counterAnimation: { delay: 800, duration: 600 },
  confettiBurst: { delay: 1200, duration: 3000 },
  buttonPulse: { delay: 1500, duration: Infinity },
  orbitalRing: { delay: 2000, duration: Infinity },
};