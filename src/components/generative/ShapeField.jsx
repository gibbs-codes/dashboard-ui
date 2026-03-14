/**
 * ShapeField Component
 * Bold geometric shapes for projector - more visible than particle trails
 * Uses p5.js in instance mode for React compatibility
 */

import { useEffect, useRef } from 'react';
import p5 from 'p5';

// Color palettes for different moods
const EVENING_PALETTE = ['#4c1d95', '#7c3aed', '#a78bfa', '#c4b5fd'];
const NIGHT_PALETTE = ['#1e3a5f', '#3b82f6', '#60a5fa', '#93c5fd'];
const WARM_PALETTE = ['#78350f', '#b45309', '#d97706', '#fbbf24'];

/**
 * ShapeField Component
 * Floating geometric shapes with smooth motion
 *
 * @param {Object} props
 * @param {number} props.width - Canvas width in pixels
 * @param {number} props.height - Canvas height in pixels
 * @param {number} props.speed - Speed multiplier (0.1-2.0, default 1.0)
 * @param {string} props.mood - Color mood: 'evening', 'night', 'warm'
 * @param {boolean} props.lowPower - Low power mode for weak devices
 */
export const ShapeField = ({
  width = 800,
  height = 600,
  speed = 1.0,
  mood = 'evening',
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
      const SHAPE_COUNT = lowPower ? 8 : 15;
      const FRAME_RATE = lowPower ? 30 : 60;

      let shapes = [];
      let palette = [];

      // Select palette based on mood
      const selectPalette = () => {
        switch (mood) {
          case 'warm':
            return WARM_PALETTE;
          case 'night':
            return NIGHT_PALETTE;
          case 'evening':
          default:
            return EVENING_PALETTE;
        }
      };

      class Shape {
        constructor() {
          this.x = p.random(width);
          this.y = p.random(height);
          this.size = p.random(80, 200);
          this.targetSize = this.size;
          this.rotation = p.random(p.TWO_PI);
          this.rotationSpeed = p.random(-0.005, 0.005) * speed;
          this.type = p.floor(p.random(4)); // 0: circle, 1: square, 2: triangle, 3: hexagon
          this.colorIndex = p.floor(p.random(palette.length));
          this.alpha = p.random(40, 80);

          // Smooth movement
          this.vx = p.random(-0.3, 0.3) * speed;
          this.vy = p.random(-0.3, 0.3) * speed;

          // Breathing effect
          this.breathPhase = p.random(p.TWO_PI);
          this.breathSpeed = p.random(0.01, 0.02);
        }

        update() {
          // Move
          this.x += this.vx;
          this.y += this.vy;

          // Rotate
          this.rotation += this.rotationSpeed;

          // Breathing size
          this.breathPhase += this.breathSpeed;
          const breathScale = 1 + p.sin(this.breathPhase) * 0.1;
          this.size = this.targetSize * breathScale;

          // Wrap at edges with padding
          const pad = this.size;
          if (this.x < -pad) this.x = width + pad;
          if (this.x > width + pad) this.x = -pad;
          if (this.y < -pad) this.y = height + pad;
          if (this.y > height + pad) this.y = -pad;
        }

        show() {
          const color = p.color(palette[this.colorIndex]);
          color.setAlpha(this.alpha);

          p.push();
          p.translate(this.x, this.y);
          p.rotate(this.rotation);
          p.noFill();
          p.stroke(color);
          p.strokeWeight(3);

          const s = this.size;

          switch (this.type) {
            case 0: // Circle
              p.ellipse(0, 0, s, s);
              break;
            case 1: // Square
              p.rectMode(p.CENTER);
              p.rect(0, 0, s * 0.8, s * 0.8);
              break;
            case 2: // Triangle
              p.beginShape();
              for (let i = 0; i < 3; i++) {
                const angle = (p.TWO_PI / 3) * i - p.HALF_PI;
                p.vertex(p.cos(angle) * s * 0.5, p.sin(angle) * s * 0.5);
              }
              p.endShape(p.CLOSE);
              break;
            case 3: // Hexagon
              p.beginShape();
              for (let i = 0; i < 6; i++) {
                const angle = (p.TWO_PI / 6) * i;
                p.vertex(p.cos(angle) * s * 0.45, p.sin(angle) * s * 0.45);
              }
              p.endShape(p.CLOSE);
              break;
          }

          p.pop();
        }
      }

      p.setup = () => {
        p.createCanvas(width, height);
        p.frameRate(FRAME_RATE);
        p.background(0);

        palette = selectPalette();

        // Initialize shapes
        for (let i = 0; i < SHAPE_COUNT; i++) {
          shapes.push(new Shape());
        }
      };

      p.draw = () => {
        // Fade effect for trails
        p.fill(0, 0, 0, 25);
        p.noStroke();
        p.rect(0, 0, width, height);

        // Update and draw shapes
        for (const shape of shapes) {
          shape.update();
          shape.show();
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
  }, [width, height, speed, mood, lowPower]);

  return <div ref={containerRef} className="overflow-hidden" />;
};

export default ShapeField;
