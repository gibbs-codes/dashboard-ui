/**
 * OrbitalParticles Component
 * Particles orbiting drifting attractor points
 * Uses p5.js in instance mode for React compatibility
 */

import { useEffect, useRef } from 'react';
import p5 from 'p5';

// Color palettes
const DEFAULT_PALETTE = ['#065f46', '#0d9488', '#f0fdf4'];
const MUTED_PALETTE = ['#374151', '#4b5563', '#6b7280'];

/**
 * OrbitalParticles Component
 * Particles orbiting slowly drifting attractors
 *
 * @param {Object} props
 * @param {number} props.width - Canvas width in pixels
 * @param {number} props.height - Canvas height in pixels
 * @param {number} props.speed - Speed multiplier (0.1-2.0, default 1.0)
 * @param {boolean} props.muted - Muted mode for focus backgrounds
 * @param {boolean} props.lowPower - Low power mode for weak devices (Pi, etc)
 */
export const OrbitalParticles = ({
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
      // Low power mode: 2 attractors with 25 particles each at 20fps
      const ATTRACTOR_COUNT = lowPower ? 2 : 4;
      const PARTICLES_PER_ATTRACTOR = lowPower ? 25 : 150;
      const FRAME_RATE = lowPower ? 20 : 60;

      let attractors = [];
      let particles = [];
      let palette = [];

      class Attractor {
        constructor(index) {
          this.index = index;
          this.baseX = width * (0.25 + (index % 2) * 0.5);
          this.baseY = height * (0.25 + Math.floor(index / 2) * 0.5);
          this.freqX = p.random(0.0003, 0.0006);
          this.freqY = p.random(0.0003, 0.0006);
          this.ampX = width * p.random(0.1, 0.2);
          this.ampY = height * p.random(0.1, 0.2);
          this.phaseX = p.random(p.TWO_PI);
          this.phaseY = p.random(p.TWO_PI);
        }

        getPosition(t) {
          const effectiveSpeed = muted ? 0.4 : speed;
          return {
            x: this.baseX + Math.sin(t * this.freqX * effectiveSpeed + this.phaseX) * this.ampX,
            y: this.baseY + Math.sin(t * this.freqY * effectiveSpeed + this.phaseY) * this.ampY,
          };
        }
      }

      class Particle {
        constructor(attractorIndex) {
          this.attractorIndex = attractorIndex;
          this.orbitRadius = p.random(30, 100);
          this.orbitRadiusVariation = p.random(-20, 20);
          this.angle = p.random(p.TWO_PI);
          this.angularVelocity = p.random(0.005, 0.02) * (p.random() > 0.5 ? 1 : -1);
          this.colorIndex = Math.floor(p.random(palette.length));
          this.alpha = muted
            ? p.random(60, 100)
            : p.random(120, 200);
        }

        update(t) {
          const effectiveSpeed = muted ? 0.4 : speed;
          this.angle += this.angularVelocity * effectiveSpeed;

          // Subtle radius variation over time
          const radiusNoise = Math.sin(t * 0.001 + this.angle) * this.orbitRadiusVariation;
          this.currentRadius = this.orbitRadius + radiusNoise;
        }

        getPosition(attractorPos) {
          return {
            x: attractorPos.x + Math.cos(this.angle) * this.currentRadius,
            y: attractorPos.y + Math.sin(this.angle) * this.currentRadius,
          };
        }

        show(pos) {
          const color = p.color(palette[this.colorIndex]);
          color.setAlpha(this.alpha);
          p.stroke(color);
          p.strokeWeight(1.5);
          p.point(pos.x, pos.y);
        }
      }

      p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(FRAME_RATE);
        p.background('#0a1a0f');

        // Select palette
        palette = muted ? MUTED_PALETTE : DEFAULT_PALETTE;

        // Initialize attractors
        for (let i = 0; i < ATTRACTOR_COUNT; i++) {
          attractors.push(new Attractor(i));
        }

        // Initialize particles
        for (let i = 0; i < ATTRACTOR_COUNT; i++) {
          for (let j = 0; j < PARTICLES_PER_ATTRACTOR; j++) {
            particles.push(new Particle(i));
          }
        }
      };

      p.draw = () => {
        const t = p.millis();

        // Trail effect - semi-transparent background
        p.fill(10, 26, 15, 15);
        p.noStroke();
        p.rect(0, 0, width, height);

        // Get attractor positions
        const attractorPositions = attractors.map(a => a.getPosition(t));

        // Update and draw particles
        for (const particle of particles) {
          particle.update(t);
          const attractorPos = attractorPositions[particle.attractorIndex];
          const pos = particle.getPosition(attractorPos);
          particle.show(pos);
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

export default OrbitalParticles;
