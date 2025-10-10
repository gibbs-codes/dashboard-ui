/**
 * CanvasDebugOverlay Component
 * Visual debugging tool for projector canvas positioning
 * 
 * Usage: Add to ProjectorLayout temporarily for development
 * <CanvasDebugOverlay />
 * 
 * Press 'D' key to toggle overlay visibility
 */

import React, { useState, useEffect } from 'react';

export const CanvasDebugOverlay = () => {
  const [visible, setVisible] = useState(false);
  const [measurements, setMeasurements] = useState({});

  // Toggle visibility with 'D' key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'd' || e.key === 'D') {
        setVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Measure actual canvas positions
  useEffect(() => {
    if (!visible) return;

    const measure = () => {
      const canvases = {
        left: document.querySelector('.projector-canvas-left'),
        center: document.querySelector('.projector-canvas-center'),
        right: document.querySelector('.projector-canvas-right'),
      };

      const newMeasurements = {};
      Object.entries(canvases).forEach(([name, el]) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          newMeasurements[name] = {
            // Position
            left: styles.left,
            top: styles.top,
            right: styles.right,
            // Dimensions
            width: styles.width,
            height: styles.height,
            // Computed position
            computedLeft: Math.round(rect.left),
            computedTop: Math.round(rect.top),
            computedWidth: Math.round(rect.width),
            computedHeight: Math.round(rect.height),
          };
        }
      });

      setMeasurements(newMeasurements);
    };

    measure();
    
    // Re-measure on window resize
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [visible]);

  if (!visible) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          zIndex: 9999,
          borderRadius: '4px',
          fontFamily: 'monospace',
        }}
      >
        Press 'D' to show canvas debug overlay
      </div>
    );
  }

  // Target dimensions from original ProjectorUI
  const targets = {
    left: { left: 39, top: 65, width: 370, height: 930 },
    center: { left: 560, top: 215, width: 470, height: 722 },
    right: { right: 41, top: 54, width: 705, height: 491 },
  };

  // Check if measurements match targets
  const checkMatch = (canvas, prop, tolerance = 2) => {
    const actual = measurements[canvas]?.[`computed${prop.charAt(0).toUpperCase() + prop.slice(1)}`];
    const target = targets[canvas]?.[prop];
    if (!actual || !target) return null;
    
    const diff = Math.abs(actual - target);
    return diff <= tolerance;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        fontFamily: 'monospace',
      }}
    >
      {/* Canvas outlines */}
      {Object.entries(targets).map(([name, pos]) => (
        <div
          key={name}
          style={{
            position: 'absolute',
            left: pos.left ? `${pos.left}px` : 'auto',
            right: pos.right ? `${pos.right}px` : 'auto',
            top: `${pos.top}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            border: '2px dashed rgba(0, 255, 0, 0.5)',
            boxSizing: 'border-box',
          }}
        >
          {/* Label */}
          <div
            style={{
              position: 'absolute',
              top: '-25px',
              left: '0',
              background: 'rgba(0, 255, 0, 0.8)',
              color: 'black',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: 'bold',
              borderRadius: '3px',
            }}
          >
            TARGET: {name.toUpperCase()}
          </div>
        </div>
      ))}

      {/* Measurements panel */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '16px',
          fontSize: '12px',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: '8px',
          pointerEvents: 'auto',
        }}
      >
        <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>
          Canvas Position Debug
          <button
            onClick={() => setVisible(false)}
            style={{
              float: 'right',
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '2px 8px',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Close (D)
          </button>
        </div>

        {Object.entries(measurements).map(([name, data]) => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              marginBottom: '6px',
              color: '#4ade80',
            }}>
              {name.toUpperCase()} Canvas
            </div>
            
            <table style={{ width: '100%', fontSize: '11px' }}>
              <tbody>
                <tr>
                  <td>Left:</td>
                  <td style={{ 
                    color: checkMatch(name, 'left') === true ? '#4ade80' : 
                           checkMatch(name, 'left') === false ? '#f87171' : 'white'
                  }}>
                    {data.computedLeft}px 
                    {name !== 'right' && ` (target: ${targets[name].left}px)`}
                  </td>
                </tr>
                <tr>
                  <td>Top:</td>
                  <td style={{ 
                    color: checkMatch(name, 'top') === true ? '#4ade80' : 
                           checkMatch(name, 'top') === false ? '#f87171' : 'white'
                  }}>
                    {data.computedTop}px (target: {targets[name].top}px)
                  </td>
                </tr>
                <tr>
                  <td>Width:</td>
                  <td style={{ 
                    color: checkMatch(name, 'width') === true ? '#4ade80' : 
                           checkMatch(name, 'width') === false ? '#f87171' : 'white'
                  }}>
                    {data.computedWidth}px (target: {targets[name].width}px)
                  </td>
                </tr>
                <tr>
                  <td>Height:</td>
                  <td style={{ 
                    color: checkMatch(name, 'height') === true ? '#4ade80' : 
                           checkMatch(name, 'height') === false ? '#f87171' : 'white'
                  }}>
                    {data.computedHeight}px (target: {targets[name].height}px)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ 
          marginTop: '16px', 
          paddingTop: '12px', 
          borderTop: '1px solid rgba(255,255,255,0.2)',
          fontSize: '11px',
          color: '#94a3b8'
        }}>
          <div>✓ Green = Match (±2px tolerance)</div>
          <div>✗ Red = Mismatch</div>
          <div style={{ marginTop: '8px' }}>
            Window: {window.innerWidth} × {window.innerHeight}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDebugOverlay;