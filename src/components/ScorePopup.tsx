import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ScorePopupProps {
  score: number;
  description: string;
  region: string;
  onComplete: () => void; // Callback when animation finishes
}

export function ScorePopup({ score, description, region, onComplete }: ScorePopupProps) {
  const [mounted, setMounted] = useState(true);

  // Auto-remove after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 1500); // 1.5 seconds total

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  // Colour based on throw type
  const getColor = () => {
    if (region === 'bull') return '#fbbf24'; // Amber
    if (region === 'outer-bull') return '#10b981'; // Green
    if (region === 'triple') return '#8b5cf6'; // Purple
    if (region === 'double') return '#ec4899'; // Pink
    if (region === 'miss') return '#ef4444'; // Red
    return '#3b82f6'; // Blue (default)
  };

  // Size based on score importance (increased significantly for maximum visibility)
  const getSize = () => {
    if (region === 'bull') return '5.5rem'; // HUGE
    if (region === 'triple' && score >= 40) return '4.5rem'; // Very big
    if (score >= 20) return '3.8rem'; // Big
    return '3rem'; // Still noticeable
  };

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 0.3,
      }}
      animate={{
        opacity: 0,
        scale: 1.3,
        y: - 100, // Float up more (100px instead of 80px)
      }}
      transition={{
        duration: 1.8, // Slightly longer to be seen
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        fontSize: getSize(),
        fontWeight: 900,
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.15, 1] }} // Quick attention pulse
        transition={{ duration: 0.4 }}
        style={{
          background: 'rgba(0, 0, 0, 0.9)', // Solid dark background
          padding: '0.5rem 1rem',
          borderRadius: '12px',
          border: `3px solid ${getColor()}`, // Coloured border
          boxShadow: `
            0 0 30px ${getColor()}80,
            0 8px 24px rgba(0, 0, 0, 0.9),
            inset 0 0 20px rgba(0, 0, 0, 0.5)
          `, // Glowing border effect
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1em',
              lineHeight: 1.1,
              color: getColor(),
              textShadow: `
                0 0 20px ${getColor()},
                0 0 40px ${getColor()}80,
                0 4px 12px rgba(0, 0, 0, 1),
                -3px -3px 0 #000,
                3px -3px 0 #000,
                -3px 3px 0 #000,
                3px 3px 0 #000,
                -3px 0 0 #000,
                3px 0 0 #000,
                0 -3px 0 #000,
                0 3px 0 #000
              `, // Thick stroke + glow
            }}
          >
            {score > 0 ? `+${score}` : score === 0 && region === 'miss' ? 'Miss!' : score}
          </div>
          {description && score > 0 && (
            <div
              style={{
                fontSize: '0.45em',
                marginTop: '0.4rem',
                fontWeight: 800,
                color: '#ffffff',
                textShadow: `
                  0 0 10px rgba(255, 255, 255, 0.8),
                  -2px -2px 0 #000,
                  2px -2px 0 #000,
                  -2px 2px 0 #000,
                  2px 2px 0 #000
                `,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
