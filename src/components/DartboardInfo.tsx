'use client';

import { motion, AnimatePresence } from 'framer-motion';
import FocusLock from 'react-focus-lock';
import { BsXCircle } from 'react-icons/bs';

interface DartboardInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const stack = ['React', 'TypeScript', 'Canvas API', 'Tailwind CSS', 'Framer Motion'];

export function DartboardInfo({ isOpen, onClose }: DartboardInfoProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <FocusLock>
            <motion.div
              initial={{ opacity: 0, x: 0, y: -400 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 0, y: -400 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.5,
              }}
              className="fixed xl:absolute top-0 right-0 w-full sm:w-[500px] xl:right-[calc((100vw-1280px)/2)] h-screen xl:min-h-screen bg-[#232329] border-l-4 border-(--border) z-50 shadow-2xl overflow-y-auto"
            >
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-6 right-4 sm:top-11 sm:right-10 z-60 p-1 rounded-full bg-blue-500 transition-all duration-50 shadow-lg hover:cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close info panel"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <BsXCircle className="text-3xl text-white" /> {/* Close icon */}
                </motion.div>
              </motion.button>

              {/* Content */}
              <div className="p-8 pt-16">
                <h2 className="font-heading text-3xl font-bold text-white mb-6">
                  About the <span className="text-blue-400">Dartboard</span>
                </h2>

                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    This is a single-player dartboard game with two modes:{' '}
                    <span className="font-semibold text-cyan-500">Practice</span> (default mode) for
                    unlimited darts with cumulative scoring, and{' '}
                    <span className="font-semibold text-violet-400">501 Game</span> with proper
                    rules – finish on a double, bust protection, and 3-dart turns. Toggle the{' '}
                    <span className="font-semibold text-slate-400">Dimensions</span> button to see
                    the debug overlay and the board's dimensions.
                  </p>

                  <p>
                    I wanted to explore{' '}
                    <a
                      href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                    >
                      Canvas API
                    </a>{' '}
                    geometry and game state management by building something complete - not just a
                    dartboard graphic, but a working game.
                  </p>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-heading text-xl font-semibold text-white mb-3 tracking-wide">
                      Built with
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {stack.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1 text-sm rounded-full bg-black/30 border-2 border-(--border)"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-heading text-xl font-semibold text-white mb-3 tracking-wide">
                      Features
                    </h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Geometry-accurate hit detection</li>
                      <li>Animated dart placement</li>
                      <li>Accurate dart scoring with multipliers (double/triple)</li>
                      <li>Score tracking with animated popups</li>
                      <li>Recent throws history</li>
                      <li>Responsive design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </FocusLock>
        </>
      )}
    </AnimatePresence>
  );
}
