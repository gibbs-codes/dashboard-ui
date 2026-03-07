/**
 * GenerativeCanvas Component
 * Wrapper component for selecting generative art algorithms
 */

import { FlowField } from './FlowField';
import { OrbitalParticles } from './OrbitalParticles';

/**
 * GenerativeCanvas Component
 * Renders the specified generative art algorithm
 *
 * @param {Object} props
 * @param {string} props.algorithm - Algorithm to render ('flow-field' | 'orbital-particles')
 * @param {number} props.width - Canvas width in pixels
 * @param {number} props.height - Canvas height in pixels
 * @param {number} props.speed - Speed multiplier (default 1.0)
 * @param {boolean} props.muted - Muted mode for focus backgrounds
 * @param {string} props.className - Additional CSS classes
 */
export const GenerativeCanvas = ({
  algorithm = 'flow-field',
  width = 800,
  height = 600,
  speed = 1.0,
  muted = false,
  className = '',
}) => {
  const commonProps = { width, height, speed, muted };

  switch (algorithm) {
    case 'flow-field':
      return (
        <div className={className}>
          <FlowField {...commonProps} />
        </div>
      );

    case 'orbital-particles':
      return (
        <div className={className}>
          <OrbitalParticles {...commonProps} />
        </div>
      );

    default:
      console.warn(`Unknown generative algorithm: ${algorithm}`);
      return null;
  }
};

export default GenerativeCanvas;
