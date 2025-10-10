/**
 * CanvasPositionAdjuster Component
 * Interactive tool to adjust canvas positions in real-time
 * 
 * Usage: Replace CanvasDebugOverlay temporarily
 * 
 * Controls:
 * - Click canvas name to select
 * - Arrow keys: Move 1px
 * - Shift + Arrow: Move 10px
 * - [ / ]: Adjust width
 * - - / +: Adjust height
 * - C: Copy current values to console
 */

import React, { useState, useEffect } from 'react';

export const CanvasPositionAdjuster = () => {
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState('left');
  
  // Current positions - initialize from computed styles
  const [positions, setPositions] = useState({
    left: { left: 39, top: 65, width: 370, height: 930 },
    center: { left: 560, top: 215, width: 470, height: 722 },
    right: { right: 41, top: 54, width: 705, height: 491 },
  });

  // Apply positions to canvases in real-time
  useEffect(() => {
    Object.entries(positions).forEach(([name, pos]) => {
      const el = document.querySelector(`.projector-canvas-${name}`);
      if (el) {
        if (pos.left !== undefined) el.style.left = `${pos.left}px`;
        if (pos.right !== undefined) el.style.right = `${pos.right}px`;
        el.style.top = `${pos.top}px`;
        el.style.width = `${pos.width}px`;
        el.style.height = `${pos.height}px`;
      }
    });
  }, [positions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      const shift = e.shiftKey ? 10 : 1;
      const sel = selected;
      
      setPositions(prev => {
        const newPos = { ...prev };
        const current = { ...prev[sel] };

        switch(e.key) {
          case 'ArrowUp':
            e.preventDefault();
            current.top -= shift;
            break;
          case 'ArrowDown':
            e.preventDefault();
            current.top += shift;
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (current.left !== undefined) current.left -= shift;
            if (current.right !== undefined) current.right += shift;
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (current.left !== undefined) current.left += shift;
            if (current.right !== undefined) current.right -= shift;
            break;
          case '[':
            e.preventDefault();
            current.width -= shift;
            break;
          case ']':
            e.preventDefault();
            current.width += shift;
            break;
          case '-':
            e.preventDefault();
            current.height -= shift;
            break;
          case '=':
          case '+':
            e.preventDefault();
            current.height += shift;
            break;
          case 'c':
          case 'C':
            // Copy to console
            console.log('=== CANVAS POSITIONS ===');
            console.log(JSON.stringify(prev, null, 2));
            console.log('\n=== CSS FORMAT ===');
            Object.entries(prev).forEach(([name, pos]) => {
              console.log(`\n.projector-canvas-${name} {`);
              if (pos.left !== undefined) console.log(`  left: ${pos.left}px;`);
              if (pos.right !== undefined) console.log(`  right: ${pos.right}px;`);
              console.log(`  top: ${pos.top}px;`);
              console.log(`  width: ${pos.width}px;`);
              console.log(`  height: ${pos.height}px;`);
              console.log('}');
            });
            alert('Canvas positions copied to console! (F12 to view)');
            break;
          case 'd':
          case 'D':
            setVisible(prev => !prev);
            break;
        }

        newPos[sel] = current;
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selected]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.95)',
        color: 'white',
        padding: '20px',
        fontSize: '13px',
        fontFamily: 'monospace',
        borderRadius: '8px',
        zIndex: 9999,
        minWidth: '320px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '2px solid #4ade80',
      }}
    >
      {/* Header */}
      <div style={{ 
        marginBottom: '16px', 
        fontSize: '16px', 
        fontWeight: 'bold',
        color: '#4ade80',
      }}>
        🎯 Canvas Position Adjuster
      </div>

      {/* Canvas selector */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '11px', 
          color: '#94a3b8', 
          marginBottom: '8px' 
        }}>
          SELECT CANVAS:
        </div>
        {['left', 'center', 'right'].map(name => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            style={{
              background: selected === name ? '#4ade80' : 'transparent',
              color: selected === name ? 'black' : 'white',
              border: '1px solid #4ade80',
              padding: '6px 12px',
              marginRight: '8px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Current values */}
      <div style={{ 
        background: 'rgba(74, 222, 128, 0.1)',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
      }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#4ade80',
        }}>
          {selected.toUpperCase()} Canvas:
        </div>
        
        {Object.entries(positions[selected]).map(([key, value]) => (
          <div key={key} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '4px 0',
          }}>
            <span style={{ textTransform: 'capitalize' }}>{key}:</span>
            <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>
              {value}px
            </span>
          </div>
        ))}
      </div>

      {/* Controls guide */}
      <div style={{ 
        fontSize: '11px', 
        color: '#cbd5e1',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '12px',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          KEYBOARD CONTROLS:
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '2px 0' }}>↑↓←→</td>
              <td>Move 1px</td>
            </tr>
            <tr>
              <td>Shift + ↑↓←→</td>
              <td>Move 10px</td>
            </tr>
            <tr>
              <td>[ / ]</td>
              <td>Width -/+</td>
            </tr>
            <tr>
              <td>- / +</td>
              <td>Height -/+</td>
            </tr>
            <tr>
              <td style={{ color: '#4ade80' }}>C</td>
              <td style={{ color: '#4ade80' }}>Copy to console</td>
            </tr>
            <tr>
              <td>D</td>
              <td>Toggle visibility</td>
            </tr>
          </tbody>
        </table>

        <div style={{ 
          marginTop: '12px',
          padding: '8px',
          background: 'rgba(251, 191, 36, 0.2)',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#fbbf24',
        }}>
          💡 Adjust positions, then press <strong>C</strong> to copy CSS to console
        </div>
      </div>

      {/* Visual indicators on canvases */}
      <style>{`
        .projector-canvas-left,
        .projector-canvas-center,
        .projector-canvas-right {
          outline: ${selected === 'left' ? '3px solid #4ade80' : 
                     selected === 'center' ? '3px solid #4ade80' : 
                     selected === 'right' ? '3px solid #4ade80' : 'none'} !important;
          outline-offset: -3px;
        }
        
        .projector-canvas-${selected} {
          outline: 3px solid #4ade80 !important;
          outline-offset: -3px;
        }
      `}</style>
    </div>
  );
};

export default CanvasPositionAdjuster;