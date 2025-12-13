import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface PracticeScoreCardProps {
  total: number;
  throwsCount: number;
}

interface Game501ScoreCardProps {
  score: number;
  dartsThisTurn: number;
  isBust: boolean;
  isGameOver: boolean;
  isWinner: boolean;
  checkoutSuggestion?: string | null;
}

export function PracticeScoreCard({ total, throwsCount }: PracticeScoreCardProps) {
  return (
    <div className="score-card">
      <h2 className="font-heading text-3xl">Total Score</h2>
      <div className="total-score font-mono">{total}</div>
      <div className="throws-count">Throws: {throwsCount}</div>
    </div>
  );
}

export function Game501ScoreCard({
  score,
  dartsThisTurn,
  isBust,
  isGameOver,
  isWinner,
  checkoutSuggestion,
}: Game501ScoreCardProps) {
  const scoreColor = score <= 100 ? '#fbbf24' : score <= 170 ? '#10b981' : '#3b82f6';

  // Check for problematic scores
  const isImpossible = score === 1; // Score = 1, impossible to finish. Game over.
  const needsSetup = score > 1 && score < 40 && score % 2 !== 0 && !isGameOver; // Odd numbers below 40... needs careful setup but not impossible

  // Animate score changes with counting effect
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    // Count down to new score
    const diff = score - displayScore;
    if (diff === 0) return;

    const steps = Math.min(Math.abs(diff), 20); // Max 20 steps for smooth animation
    const increment = diff / steps;
    const duration = 300; // Total animation time in ms
    const stepTime = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore((prev) => Math.round(prev + increment));
      }
    }, stepTime);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="score-card flex flex-col gap-2 md:gap-0">
      <h2 className="font-heading text-3xl">501 Game</h2>

      {/* Animated Score Display */}
      <motion.div
        key={score} // Re-trigger animation on score change
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.1, 1], // Quick pulse on change
          color: scoreColor,
        }}
        transition={{ duration: 0.3 }}
        className="total-score font-mono"
        style={{ color: scoreColor }}
      >
        {displayScore}
      </motion.div>

      <div className="throws-count">Darts thrown this turn: {dartsThisTurn}/3</div>

      {/* BUST Animation - Compact Version */}
      <AnimatePresence>
        {isBust && (
          <motion.div
            initial={{ scale: 0, rotate: -5 }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [-5, 5, -5, 5, 0],
              x: [0, -5, 5, -5, 5, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 1rem',
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              💥 BUST! 💥
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WINNER Animation - Compact Version */}
      <AnimatePresence>
        {isGameOver && isWinner && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{
              scale: [1, 1.08, 1],
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            style={{
              marginTop: '0.75rem',
              padding: '0.8rem 1rem',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              border: '2px solid #10b981',
              borderRadius: '8px',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle pulsing background glow */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Winner Text */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              🎉 WINNER! 🎉
            </motion.div>

            {/* Smaller confetti particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + Math.cos((i * Math.PI) / 3) * 80}%`,
                  y: `${50 + Math.sin((i * Math.PI) / 3) * 80}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.08,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  background: ['#fbbf24', '#ec4899', '#3b82f6'][i % 3],
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over on score = 1 */}
      <AnimatePresence>
        {isGameOver && !isWinner && score === 1 && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: [1, 1.05, 1], y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              marginTop: '0.75rem',
              padding: '0.8rem 1rem',
              background: 'rgba(0, 0, 0, 0.9)', // Dark background
              border: '2px solid #ef4444', // Red border
              borderRadius: '8px',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.5)', // Red glow
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '1.15rem',
              textAlign: 'center',
            }}
          >
            ❌ Game Over! <span style={{ color: '#94a3b8' }}>Score is 1.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Odd number warning - Orange */}
      <AnimatePresence>
        {!isGameOver && !isImpossible && needsSetup && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '1rem',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              padding: '0.6rem',
              background: 'rgba(251, 146, 60, 0.25)', // Orange
              borderRadius: '6px',
              border: '1px solid rgba(251, 146, 60, 0.6)',
              textAlign: 'center',
            }}
          >
            ⚠️ Odd number - Set up your double!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Suggestion with subtle slide-in */}
      <AnimatePresence>
        {checkoutSuggestion && !isGameOver && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '1rem',
              color: '#fbbf24',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              padding: '0.5rem',
              background: 'rgba(251, 191, 36, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            💡 {checkoutSuggestion}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
