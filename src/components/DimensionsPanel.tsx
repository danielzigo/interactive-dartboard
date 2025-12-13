import { DimensionsTable } from '~/components/DartboardDebug';

interface DimensionsPanelProps {
  scale: number;
}

export function DimensionsPanel({ scale }: DimensionsPanelProps) {
  return (
    <div className="dimensions-panel">
      <DimensionsTable scale={scale} />
    </div>
  );
}
