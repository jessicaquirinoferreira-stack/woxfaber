import React, { useEffect, useRef, useState } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
  logoUrl?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  logoUrl = 'https://i.postimg.cc/ZRhSxQjQ/Logotipo-WOX-com-icone-de-energia.png',
}) => {
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Exact 5 seconds intro duration as requested: "preciso que a entrada tenha 5 segundos apos abre o site"
  useEffect(() => {
    const startTime = performance.now();
    const duration = 5000; // 5 seconds

    const timer = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 650);
      }
    }, 25);

    // Allow ESC key to skip if needed
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearInterval(timer);
        setIsExiting(true);
        setTimeout(() => onComplete(), 400);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  // Subtle 3D perspective response to cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Background Acoustic Shockwave & Particle Resonance Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Shockwave {
      r: number;
      opacity: number;
      speed: number;
      color: string;
      lineWidth: number;
    }

    const shockwaves: Shockwave[] = [];
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];

    // Ambient floating acoustic particles
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.2,
      });
    }

    let lastShockwave = 0;

    const render = (time: number) => {
      ctx.fillStyle = 'rgba(8, 8, 8, 0.24)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Periodic Acoustic Wavefronts
      if (time - lastShockwave > 360) {
        lastShockwave = time;
        shockwaves.push({
          r: 25,
          opacity: 0.9,
          speed: 4.8 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#C7A66A' : '#E2C99A',
          lineWidth: Math.random() * 2 + 1,
        });
      }

      // Render Expanding Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += sw.speed;
        sw.opacity -= 0.011;

        if (sw.opacity <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.opacity);
        ctx.lineWidth = sw.lineWidth;
        ctx.shadowBlur = 18;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      }

      // Energy Core Concentric Rings
      for (let i = 1; i <= 3; i++) {
        const baseRadius = 150 * i + Math.sin(time * 0.003 + i) * 18;
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? 'rgba(199, 166, 106, 0.35)' : 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4 + i * 2, 8 + i * 2]);
        ctx.stroke();
        ctx.restore();
      }

      // Floating Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = '#C7A66A';
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[100] flex flex-col justify-center items-center bg-[#080808] text-[#F5F5F2] overflow-hidden select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Interactive Acoustic Shockwave Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Grid Pattern and Vignette */}
      <div className="absolute inset-0 bg-tech-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,8,0.75)_65%,#080808_100%)] pointer-events-none" />

      {/* Main Center Stage: ONLY the Grand Free Logo & Effects */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-4xl w-full">
        {/* Pulsing Concentric Aura Rings */}
        <div className="absolute w-[440px] h-[440px] sm:w-[600px] sm:h-[600px] rounded-full border border-[#C7A66A]/20 animate-pulse pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full border border-white/10 pointer-events-none" />

        {/* Ambient Backlight Glow in Champagne Gold */}
        <div
          className="absolute w-[360px] h-[360px] rounded-full bg-[#C7A66A]/20 blur-[100px] pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
          }}
        />

        {/* THE OFFICIAL GRAND LOGO (Transparent PNG, Large, Free, 3D Movement) */}
        <div
          className="relative transition-transform duration-300 ease-out py-6"
          style={{
            transform: `perspective(1000px) rotateX(${-mousePos.y * 12}deg) rotateY(${mousePos.x * 12}deg) scale(${
              1 + progress * 0.0006
            })`,
          }}
        >
          {/* Energy Core Flares */}
          <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-[#C7A66A]/30 to-transparent blur-2xl opacity-90 animate-pulse pointer-events-none" />

          <img
            src={logoUrl}
            alt="WOX FABER"
            className="relative z-10 w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] h-auto object-contain filter drop-shadow-[0_0_40px_rgba(199,166,106,0.5)] drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
          />

          {/* Golden Horizontal Light Ray */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#C7A66A] to-transparent opacity-90 shadow-[0_0_16px_#C7A66A]" />
        </div>

        {/* Elegant Loading Bar (No clutter text, purely the glowing bar filling up) */}
        <div className="mt-14 w-full max-w-md px-6">
          <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <div
              className="h-full bg-gradient-to-r from-[#C7A66A] via-[#E2C99A] to-[#F5F5F2] transition-all duration-75 ease-out shadow-[0_0_14px_#C7A66A]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
