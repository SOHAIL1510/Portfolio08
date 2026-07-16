/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";

class Particle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // 3D coordinates simulation
    this.z = Math.random() * 500 + 100; // Depth (100 to 600)
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.vz = (Math.random() - 0.5) * 0.2;
    this.baseRadius = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? "rgba(59, 130, 246, " : "rgba(147, 51, 234, "; // Blue or Purple
    this.projX = 0;
    this.projY = 0;
    this.projOpacity = 0;
    this.scale = 1;
  }

  update(width, height, mouse) {
    // Apply velocity
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // Bounce depth boundaries
    if (this.z < 100 || this.z > 600) {
      this.vz = -this.vz;
    }

    // Wrap around screen coordinates
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Subtle mouse influence
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }
    }
  }

  draw(ctx, width, height) {
    // Perspective projection
    const fov = 400; // Field of view
    const scale = fov / (fov + this.z);
    const projX = (this.x - width / 2) * scale + width / 2;
    const projY = (this.y - height / 2) * scale + height / 2;
    const radius = this.baseRadius * scale * 1.5;

    // Opacity based on depth
    const opacity = (1 - (this.z - 100) / 500) * 0.8;

    ctx.beginPath();
    ctx.arc(projX, projY, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color + opacity + ")";
    ctx.fill();

    // Save projected coords for drawing connections
    this.projX = projX;
    this.projY = projY;
    this.projOpacity = opacity;
    this.scale = scale;
  }
}

export default function ThreeDBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(80, Math.floor((width * height) / 15000));
    const connectionDistance = 120;
    
    const mouse = { x: null, y: null, targetX: 0, targetY: 0, radius: 150 };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = null;
      mouse.targetY = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.targetX !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // Draw background gradient grid overlay (subtle futuristic touch)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update(width, height, mouse);
        p.draw(ctx, width, height);
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const avgOpacity = (p1.projOpacity + p2.projOpacity) / 2;
            const distRatio = 1 - dist / connectionDistance;
            const opacity = distRatio * avgOpacity * 0.15;

            // Draw line
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            
            // Gradient line for high tech feel
            const grad = ctx.createLinearGradient(p1.projX, p1.projY, p2.projX, p2.projY);
            grad.addColorStop(0, p1.color + opacity + ")");
            grad.addColorStop(1, p2.color + opacity + ")");
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = distRatio * 1.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-radial-gradient"
      style={{
        background: "radial-gradient(circle at 50% 50%, #030014 0%, #000000 100%)",
      }}
    />
  );
}
