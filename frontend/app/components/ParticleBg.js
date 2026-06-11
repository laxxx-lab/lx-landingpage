"use client";

import { useEffect, useRef } from "react";

// Tokyo Night default configurations
export const TOKYO_NIGHT_GRADIENT = [
  "#0f172a",
  "#1e1b4b",
  "#0f0c29",
  "#302b63",
  "#0f172a",
];

export const TOKYO_NIGHT_COLORS = [
  "#c084fc", // purple
  "#e879f9", // pink
  "#22d3ee", // cyan
  "#a78bfa", // lavender
  "#f472b6", // hot pink
  "#67e8f9", // light cyan
];

export const DEFAULT_ORBS = [
  {
    color: "#e879f9",
    opacity: 0.35,
    blur: 80,
    size: "24rem",
    position: { top: "10%", left: "10%" },
  },
  {
    color: "#22d3ee",
    opacity: 0.3,
    blur: 80,
    size: "24rem",
    position: { bottom: "20%", right: "10%" },
  },
  {
    color: "#c084fc",
    opacity: 0.3,
    blur: 80,
    size: "20rem",
    position: { top: "40%", left: "40%" },
  },
];

export const DEFAULT_OPTIONS = {
  gradientColors: TOKYO_NIGHT_GRADIENT,
  gradientAngle: 135,
  orbs: DEFAULT_ORBS,
  particleCount: 130,
  particleMinRadius: 0.5,
  particleMaxRadius: 3,
  particleColors: TOKYO_NIGHT_COLORS,
  connectionDistance: 160,
  connectionColor: "rgba(187,154,247,ALPHA)",
  connectionWidth: 0.65,
  mouseRadius: 320,
  friction: 0.98, // Smooth drift without accelerating frantically
};

class ParticleBgEngine {
  constructor(parent, options = {}) {
    this.opts = { ...DEFAULT_OPTIONS, ...options };
    this.particles = [];
    this.animId = 0;
    this.mouseX = -2000;
    this.mouseY = -2000;

    // Root container
    this.container = document.createElement("div");
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
    `;

    // CSS gradient layer
    const gradientLayer = document.createElement("div");
    const gc = this.opts.gradientColors;
    const angle = this.opts.gradientAngle;
    gradientLayer.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(${angle}deg, ${gc.join(", ")});
      z-index: 1;
    `;
    this.container.appendChild(gradientLayer);

    // Orbs layer
    for (const orb of this.opts.orbs) {
      const div = document.createElement("div");
      div.style.cssText = `
        position: absolute;
        width: ${orb.size};
        height: ${orb.size};
        border-radius: 50%;
        background: radial-gradient(circle, ${orb.color}, transparent 70%);
        filter: blur(${orb.blur}px);
        opacity: ${orb.opacity};
        ${orb.position.top !== undefined ? `top: ${orb.position.top};` : ""}
        ${orb.position.left !== undefined ? `left: ${orb.position.left};` : ""}
        ${orb.position.right !== undefined ? `right: ${orb.position.right};` : ""}
        ${orb.position.bottom !== undefined ? `bottom: ${orb.position.bottom};` : ""}
        z-index: 2;
      `;
      this.container.appendChild(div);
    }

    // Canvas layer
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    `;
    const cx = this.canvas.getContext("2d");
    if (!cx) throw new Error("Canvas 2D context not available");
    this.ctx = cx;
    this.container.appendChild(this.canvas);

    parent.appendChild(this.container);

    this.resizeHandler = () => this.handleResize();
    this.mouseMoveHandler = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
    this.mouseLeaveHandler = () => {
      this.mouseX = -2000;
      this.mouseY = -2000;
    };

    window.addEventListener("resize", this.resizeHandler);
    window.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseleave", this.mouseLeaveHandler);

    this.handleResize();
    this.initParticles();
    this.animate();
  }

  handleResize() {
    const { width, height } = this.container.getBoundingClientRect();
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initParticles() {
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    const colors = this.opts.particleColors;
    const minR = this.opts.particleMinRadius;
    const maxR = this.opts.particleMaxRadius;

    this.particles = [];
    for (let i = 0; i < this.opts.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.25; // slow speed: 0.15 to 0.4 pixels/frame
      const baseVx = Math.cos(angle) * speed;
      const baseVy = Math.sin(angle) * speed;

      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: baseVx,
        vy: baseVy,
        baseVx: baseVx,
        baseVy: baseVy,
        radius: minR + Math.random() * (maxR - minR),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  updateParticles() {
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    const friction = this.opts.friction;
    const mouseRadius = this.opts.mouseRadius;
    const minDist = 130; // Wide equilibrium distance for a spacious orbit

    for (const p of this.particles) {
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        // 1. Radial force (gentle attraction when far, soft repulsion when close)
        let radialForce = 0;
        if (dist > minDist) {
          // Slow, gentle pull in
          radialForce = ((dist - minDist) / (mouseRadius - minDist)) * 0.05;
        } else {
          // Soft push out to prevent cluster stacking
          radialForce = ((dist - minDist) / minDist) * 0.12;
        }

        // 2. Tangential force (slow, galaxy-like spin)
        const tangentForce = (1 - dist / mouseRadius) * 0.08;

        // Apply radial component
        p.vx += (dx / dist) * radialForce;
        p.vy += (dy / dist) * radialForce;

        // Apply tangential component (gentle orbital vortex)
        p.vx += (-dy / dist) * tangentForce;
        p.vy += (dx / dist) * tangentForce;

        // Soft Brownian wiggle noise
        p.vx += (Math.random() - 0.5) * 0.03;
        p.vy += (Math.random() - 0.5) * 0.03;
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Apply slide friction towards base drift velocity
      p.vx = p.vx * friction + p.baseVx * (1 - friction);
      p.vy = p.vy * friction + p.baseVy * (1 - friction);

      // Boundaries bouncing with dampening
      if (p.x < 0) { p.x = 0; p.vx *= -0.8; p.baseVx *= -1; }
      if (p.x > w) { p.x = w; p.vx *= -0.8; p.baseVx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.8; p.baseVy *= -1; }
      if (p.y > h) { p.y = h; p.vy *= -0.8; p.baseVy *= -1; }
    }
  }

  drawParticles() {
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    this.ctx.clearRect(0, 0, w, h);

    // Connection lines
    const connDist = this.opts.connectionDistance;
    const connColor = this.opts.connectionColor;
    const connWidth = this.opts.connectionWidth;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connDist) {
          const alpha = (1 - dist / connDist) * 0.65;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = connColor.replace("ALPHA", String(alpha.toFixed(3)));
          this.ctx.lineWidth = connWidth;
          this.ctx.stroke();
        }
      }
    }

    // Particle dots
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
  }

  animate = () => {
    this.updateParticles();
    this.drawParticles();
    this.animId = requestAnimationFrame(this.animate);
  };

  destroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseleave", this.mouseLeaveHandler);
    this.container.remove();
  }
}

export function ParticleBg({ options = {} }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const engine = new ParticleBgEngine(mountRef.current, options);
    return () => {
      engine.destroy();
    };
  }, [options]);

  return <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }} />;
}
