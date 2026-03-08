/**
 * FlowField Component
 * Perlin noise flow field with particle trails
 * Uses p5.js in instance mode for React compatibility
 */

import { useEffect, useRef } from 'react';
import p5 from 'p5';

// Color palettes
const NIGHT_PALETTE = ['#1e3a8a', '#7c3aed', '#06b6d4'];
const WARM_PALETTE = ['#92400e', '#d97706', '#fbbf24'];
const MUTED_PALETTE = ['#475569', '#64748b', '#94a3b8'];

/**
 * FlowField Component
 * Perlin noise flow field with trailing particles
 *
 * @param {Object} props
 * @param {number} props.width - Canvas width in pixels
 * @param {number} props.height - Canvas height in pixels
 * @param {number} props.speed - Speed multiplier (0.1-2.0, default 1.0)
 * @param {boolean} props.muted - Muted mode for focus backgrounds
 * @param {boolean} props.lowPower - Low power mode for weak devices (Pi, etc)
 */
export const FlowField = ({
  width = 800,
  height = 600,
  speed = 1.0,
  muted = false,
  lowPower = true,
}) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous instance
    if (instanceRef.current) {
      instanceRef.current.remove();
    }

    const sketch = (p) => {
      // Low power mode: ~150 particles at 20fps vs 800 at 60fps
      const PARTICLE_COUNT = lowPower ? 150 : 800;
      const FRAME_RATE = lowPower ? 20 : 60;
      const NOISE_SCALE = 0.003;
      const BASE_SPEED = 1.5;

      let particles = [];
      let palette = [];

      class Particle {
        constructor() {
          this.pos = p.createVector(p.random(width), p.random(height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = BASE_SPEED * (muted ? 0.4 : speed);
          this.colorIndex = Math.floor(p.random(palette.length));
          this.alpha = muted
            ? p.random(60, 100)
            : p.random(150, 220);
        }

        follow() {
          const angle = p.noise(
            this.pos.x * NOISE_SCALE,
            this.pos.y * NOISE_SCALE,
            p.frameCount * 0.002
          ) * p.TWO_PI * 2;

          const force = p5.Vector.fromAngle(angle);
          force.setMag(0.1);
          this.acc.add(force);
        }

        update() {
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
          this.acc.mult(0);

          // Wrap at edges
          if (this.pos.x > width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = width;
          if (this.pos.y > height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = height;
        }

        show() {
          const color = p.color(palette[this.colorIndex]);
          color.setAlpha(this.alpha);
          p.stroke(color);
          p.strokeWeight(1);
          p.point(this.pos.x, this.pos.y);
        }
      }

      p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(FRAME_RATE);
        p.background('#0a0a1a');

        // Select palette based on time of day
        const hour = new Date().getHours();
        const isNightTime = hour >= 20 || hour < 6;

        if (muted) {
          palette = MUTED_PALETTE;
        } else if (isNightTime) {
          palette = WARM_PALETTE;
        } else {
          palette = NIGHT_PALETTE;
        }

        // Initialize particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        // Trail effect - semi-transparent background
        p.fill(10, 10, 26, 15);
        p.noStroke();
        p.rect(0, 0, width, height);

        // Update and draw particles
        for (const particle of particles) {
          particle.follow();
          particle.update();
          particle.show();
        }
      };
    };

    instanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [width, height, speed, muted, lowPower]);

  return <div ref={containerRef} className="overflow-hidden" />;
};

export default FlowField;
