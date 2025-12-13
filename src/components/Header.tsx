import { motion } from 'framer-motion';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { Tooltip } from 'react-tooltip';

interface HeaderProps {
  icon?: string | React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onInfoToggle?: () => void;
  isInfoOpen?: boolean;
}

export function Header({ icon, title, subtitle, actions, onInfoToggle, isInfoOpen }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1 className="mb-2 md:mb-0 font-heading text-4xl md:text-6xl">
          {' '}
          {icon} <span>{title}</span>
        </h1>
        
        {!isInfoOpen && (
          <motion.button
            data-tooltip-id="info-tooltip"
            data-tooltip-content="About"
            onClick={onInfoToggle}
            className="absolute top-6 right-4 sm:top-11 sm:right-10 xl:right-30 z-60 p-1 rounded-full bg-blue-500 transition-all duration-50 shadow-lg hover:cursor-pointer 
            group focus-visible:outline-2 focus-visible:outline-gray-300 focus-visible:outline-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Show interactive dartboard information"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <FaRegCircleQuestion className="text-3xl text-(--bg-secondary) group-hover:text-white/80 transition-colors duration-300" />
            </motion.div>
          </motion.button>
        )}
      </div>
      {subtitle && <p>{subtitle}</p>}

      {/* ✅ Buttons stay inside the header */}
      {actions && (
        <div className="header-buttons mt-6 flex flex-wrap justify-center gap-2">{actions}</div>
      )}

      <Tooltip
        id="info-tooltip"
        style={{
          zIndex: 9999,
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '14px',
          borderRadius: '6px',
          padding: '6px 12px',
        }}
        place="left"
      />
    </header>
  );
}
