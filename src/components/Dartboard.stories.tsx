import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dartboard } from './Dartboard';

const meta = {
  title: 'Components/Dartboard',
  component: Dartboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Width of the dartboard canvas',
    },
    height: {
      control: { type: 'range', min: 200, max: 800, step: 50 },
      description: 'Height of the dartboard canvas',
    },
    onDartThrow: {
      action: 'dart thrown',
      description: 'Callback fired when a dart is thrown',
    },
  },
} satisfies Meta<typeof Dartboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default dartboard
export const Default: Story = {
  args: {
    width: 600,
    height: 600,
  },
};

// Small dartboard
export const Small: Story = {
  args: {
    width: 300,
    height: 300,
  },
};

// Large dartboard
export const Large: Story = {
  args: {
    width: 800,
    height: 800,
  },
};

// Interactive with score display
export const InteractiveWithScore: Story = {
  render: function InteractiveStory() {
    const [lastThrow, setLastThrow] = useState<{
      score: number;
      multiplier: 1 | 2 | 3;
      segmentNumber: number;
      region: string;
      description: string;
    } | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [throwCount, setThrowCount] = useState(0);

    const handleThrow = (result: {
      score: number;
      multiplier: 1 | 2 | 3;
      segmentNumber: number;
      region: string;
      description: string;
    }) => {
      setLastThrow(result);
      setTotalScore((prev) => prev + result.score);
      setThrowCount((prev) => prev + 1);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div
          style={{
            background: '#1e293b',
            padding: '1.5rem',
            borderRadius: '12px',
            minWidth: '300px',
            textAlign: 'center',
            border: '2px solid #475569',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>Score</h3>
          <div
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '0.5rem',
            }}
          >
            {totalScore}
          </div>
          <div style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Throws: {throwCount}</div>

          {lastThrow && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#334155',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc' }}>
                {lastThrow.score}
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{lastThrow.description}</div>
            </div>
          )}
        </div>

        <Dartboard width={500} height={500} onDartThrow={handleThrow} />

        <button
          onClick={() => {
            setTotalScore(0);
            setThrowCount(0);
            setLastThrow(null);
            window.location.reload(); // Reset darts on board
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Reset Game
        </button>
      </div>
    );
  },
};

// Detailed throw information
export const WithThrowDetails: Story = {
  render: function DetailedStory() {
    const [throws, setThrows] = useState<
      Array<{
        score: number;
        multiplier: 1 | 2 | 3;
        segmentNumber: number;
        region: string;
        description: string;
      }>
    >([]);

    const handleThrow = (result: {
      score: number;
      multiplier: 1 | 2 | 3;
      segmentNumber: number;
      region: string;
      description: string;
    }) => {
      setThrows((prev) => [...prev, result]);
    };

    const totalScore = throws.reduce((sum, t) => sum + t.score, 0);

    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <Dartboard width={500} height={500} onDartThrow={handleThrow} />

        <div
          style={{
            background: '#1e293b',
            padding: '1.5rem',
            borderRadius: '12px',
            width: '300px',
            maxHeight: '500px',
            overflow: 'auto',
            border: '2px solid #475569',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', color: '#cbd5e1' }}>Throw History</h3>
          <div
            style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1rem' }}
          >
            Total: {totalScore}
          </div>

          {throws.length === 0 ? (
            <p style={{ color: '#cbd5e1', fontStyle: 'italic', textAlign: 'center' }}>
              Click the dartboard to throw!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {throws
                .slice()
                .reverse()
                .map((throw_, index) => (
                  <div
                    key={throws.length - index}
                    style={{
                      padding: '0.75rem',
                      background: '#334155',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${
                        throw_.region === 'bull'
                          ? '#fbbf24'
                          : throw_.region === 'outer-bull'
                            ? '#10b981'
                            : throw_.region === 'triple'
                              ? '#8b5cf6'
                              : throw_.region === 'double'
                                ? '#ec4899'
                                : throw_.region === 'miss'
                                  ? '#ef4444'
                                  : '#3b82f6'
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc' }}>
                        {throw_.score}
                      </span>
                      <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                        {throw_.multiplier > 1 && `${throw_.multiplier}x `}
                        {throw_.segmentNumber > 0 ? `#${throw_.segmentNumber}` : ''}
                      </span>
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {throw_.description}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <button
            onClick={() => {
              setThrows([]);
              window.location.reload();
            }}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Clear History
          </button>
        </div>
      </div>
    );
  },
};

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>Small (300x300)</h4>
        <Dartboard width={300} height={300} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>Medium (500x500)</h4>
        <Dartboard width={500} height={500} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>Large (700x700)</h4>
        <Dartboard width={700} height={700} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Non-square dartboard
export const NonSquare: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>Wide (800x500)</h4>
        <Dartboard width={800} height={500} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#cbd5e1' }}>Tall (500x800)</h4>
        <Dartboard width={500} height={800} />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Playground for testing
export const Playground: Story = {
  args: {
    width: 600,
    height: 600,
  },
  render: (args) => {
    const [throwInfo, setThrowInfo] = useState<string>('Click the dartboard to throw a dart!');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <div
          style={{
            padding: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            minWidth: '400px',
            textAlign: 'center',
            border: '2px solid #475569',
          }}
        >
          <code style={{ color: '#10b981', fontSize: '0.9rem' }}>{throwInfo}</code>
        </div>
        <Dartboard
          {...args}
          onDartThrow={(result) => {
            setThrowInfo(
              `Score: ${result.score} | Multiplier: ${result.multiplier}x | Region: ${result.region} | Segment: ${result.segmentNumber}`
            );
            args.onDartThrow?.(result);
          }}
        />
      </div>
    );
  },
};
