"use client";
import { useEffect, useRef } from "react";

const COLORS = [
  [237, 236, 225],  // off-white
  [237, 236, 225],  // off-white (more common)
  [142, 160, 255],  // periwinkle blue
  [111, 134, 245],  // service blue
  [199, 154, 224],  // lilac
];

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  baseAlpha: number; alpha: number;
  phase: number; phaseSpeed: number;
  color: number[];
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = -9999, my = -9999;
    const section = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);

    const dots: Dot[] = Array.from({ length: 65 }, (_, i) => {
      const isStar = i < 6;
      const baseAlpha = isStar ? 0.55 + Math.random() * 0.3 : 0.15 + Math.random() * 0.3;
      return {
        x: Math.random() * (W || 1400),
        y: Math.random() * (H || 900),
        vx: (Math.random() - 0.5) * (isStar ? 0.18 : 0.32),
        vy: (Math.random() - 0.5) * (isStar ? 0.18 : 0.32),
        r: isStar ? 2.5 + Math.random() * 1.5 : 0.8 + Math.random() * 2,
        baseAlpha,
        alpha: baseAlpha,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.004 + Math.random() * 0.008,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });

    let frame = 0;
    let raf: number;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      for (const p of dots) {
        // twinkle
        p.phase += p.phaseSpeed;
        p.alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(p.phase));

        // mouse repel
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 220 && d > 0) {
          const f = ((220 - d) / 220) * 1.0;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2.5) { p.vx = (p.vx / spd) * 2.5; p.vy = (p.vy / spd) * 2.5; }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -40) p.x = W + 40;
        else if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        else if (p.y > H + 40) p.y = -40;
      }

      // connection lines
      const [r0, g0, b0] = [142, 160, 255];
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const lineAlpha = (1 - d / 120) * 0.14;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${r0},${g0},${b0},${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // dots
      for (const p of dots) {
        const [r, g, b] = p.color;
        const glow = p.r * 5;
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        gr.addColorStop(0, `rgba(${r},${g},${b},${p.alpha})`);
        gr.addColorStop(0.35, `rgba(${r},${g},${b},${p.alpha * 0.45})`);
        gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />;
}
