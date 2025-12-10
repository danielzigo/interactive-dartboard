import { DimensionsTable } from '~/components/DartboardDebug';

interface DimensionsPanelProps {
  scale: number;
}

export function DimensionsPanel({ scale }: DimensionsPanelProps) {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
      <DimensionsTable scale={scale} />
    </div>
  );
}
