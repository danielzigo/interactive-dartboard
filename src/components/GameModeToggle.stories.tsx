import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { GameModeToggle } from './GameModeToggle';

const meta = {
  title: 'Components/GameModeToggle',
  component: GameModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['practice', '501'],
      description: 'Currently active game mode',
    },
    onChange: {
      action: 'mode changed',
      description: 'Callback fired when mode is toggled',
    },
  },
} satisfies Meta<typeof GameModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Practice mode active - Storybook injects the action function automatically
export const PracticeMode: Story = {
  args: {
    mode: 'practice',
  },
};

// 501 mode active - Storybook injects the action function automatically
export const Game501Mode: Story = {
  args: {
    mode: '501',
  },
};

// Interactive toggle (recommended)
export const Interactive: Story = {
  args: {
    mode: 'practice',
  },
  render: function InteractiveStory(args) {
    const [mode, setMode] = useState<'practice' | '501'>(args.mode);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '2px solid #475569',
          }}
        >
          <GameModeToggle
            mode={mode}
            onChange={(newMode) => {
              setMode(newMode);
              args.onChange?.(newMode); // Call the action to log it
            }}
          />
        </div>

        <div
          style={{
            padding: '1rem 2rem',
            background: '#334155',
            borderRadius: '8px',
            textAlign: 'center',
            minWidth: '250px',
          }}
        >
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Current Mode:
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: mode === 'practice' ? '#22d3ee' : '#c084fc',
            }}
          >
            {mode === 'practice' ? '🎯 Practice' : '🎮 501 Game'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {mode === 'practice'
              ? 'Free practice - accumulate score without rules'
              : 'Classic 501 game - finish on a double'}
          </div>
        </div>
      </div>
    );
  },
};

// In a header-like context
export const InHeader: Story = {
  args: {
    mode: 'practice',
  },
  render: function HeaderStory(args) {
    const [mode, setMode] = useState<'practice' | '501'>(args.mode);

    return (
      <div
        style={{
          background: '#1e293b',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid #475569',
          minWidth: '600px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              margin: '0 0 0.5rem 0',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🎯 Interactive Dartboard
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1rem' }}>
            Click anywhere on the dartboard to throw a dart
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'center',
          }}
        >
          <GameModeToggle
            mode={mode}
            onChange={(newMode) => {
              setMode(newMode);
              args.onChange?.(newMode);
            }}
          />
        </div>
      </div>
    );
  },
};

// Both states side by side (for documentation)
export const AllStates: Story = {
  args: {
    mode: 'practice',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', color: '#cbd5e1', fontSize: '1rem' }}>
          Practice Mode Active
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <GameModeToggle mode="practice" onChange={() => {}} />
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#cbd5e1', fontSize: '1rem' }}>
          501 Mode Active
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <GameModeToggle mode="501" onChange={() => {}} />
        </div>
      </div>
    </div>
  ),
};

// With mode persistence demo
export const WithPersistence: Story = {
  args: {
    mode: 'practice',
  },
  render: function PersistenceStory(args) {
    // Simulate localStorage (in real app, this would persist)
    const [mode, setMode] = useState<'practice' | '501'>(() => {
      const saved = localStorage.getItem('storybook-game-mode') as '501' | 'practice' | null;
      return saved || 'practice';
    });

    const handleModeChange = (newMode: 'practice' | '501') => {
      setMode(newMode);
      localStorage.setItem('storybook-game-mode', newMode);
      args.onChange?.(newMode); // Log to actions
    };

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '2px solid #475569',
          }}
        >
          <GameModeToggle mode={mode} onChange={handleModeChange} />
        </div>

        <div
          style={{
            padding: '1rem',
            background: '#334155',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              color: '#10b981',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            💾 Mode Persisted
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
            Try switching modes, then refresh this story. Your selection will be remembered.
          </div>
        </div>
      </div>
    );
  },
};

// Playground
export const Playground: Story = {
  args: {
    mode: 'practice',
  },
  render: (args) => {
    const [mode, setMode] = useState(args.mode);

    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <GameModeToggle
          mode={mode}
          onChange={(newMode) => {
            setMode(newMode);
            args.onChange?.(newMode); // Log to actions panel
          }}
        />
      </div>
    );
  },
};
