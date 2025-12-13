import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Celebration180Props {
  onComplete: () => void;
}

export function Celebration180({ onComplete }: Celebration180Props) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Auto-remove after 3 seconds
    const timer = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
      }}
      animate={{
        opacity: 1,
        scale: 1.3,
        y: -100,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 2.2,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)', // Center on dartboard
        pointerEvents: 'none', // Don't block dartboard clicks
        fontSize: 'clamp(3rem, 7vw, 5rem)', // Responsive: mobile (3rem) to desktop (5rem)
        fontWeight: 900,
        zIndex: 150, // Show above score popups (which are z-index 100)
        willChange: 'transform, opacity', // Performance hint for smooth animation
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.08, 1], // Gentle pulse effect
        }}
        transition={{
          duration: 0.6,
          repeat: 3,
          ease: 'easeInOut',
        }}
        style={{
          background: 'rgba(251, 191, 36, 0.85)', // Semi-transparent gold
          padding: 'clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)', // Fluid padding too
          borderRadius: '16px',
          border: '4px solid rgba(251, 191, 36, 0.8)',
          boxShadow: ` 
            0 0 40px rgba(251, 191, 36, 0.8),
            0 8px 30px rgba(0, 0, 0, 0.8)
          `, // Gold glow + depth shadow
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1em',
              lineHeight: 1,
              color: '#ffffff',
              textShadow: `
                0 0 25px rgba(251, 191, 36, 1),
                0 4px 15px rgba(0, 0, 0, 1),
                -3px -3px 0 #000,
                3px -3px 0 #000,
                -3px 3px 0 #000,
                3px 3px 0 #000
              `,
            }}
          >
           180! 🎯
          </div>
          <div
            style={{
              fontSize: '0.3em', // Relative to parent font size
              marginTop: '0.8rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.1em',
              textShadow: `
                0 0 15px rgba(255, 255, 255, 0.9),
                -2px -2px 0 #000,
                2px 2px 0 #000
              `, // Minimal stroke for subtitle
            }}
          >
            MAXIMUM!
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
