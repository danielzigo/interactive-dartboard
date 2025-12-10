import { Dartboard } from '~/components/Dartboard';
import { DartboardDebug } from '~/components/DartboardDebug';

export interface DartThrow {
  score: number;
  multiplier: 1 | 2 | 3;
  segmentNumber: number;
  region: string;
  description: string;
}

interface DartboardStageProps {
  width: number;
  height: number;
  scale: number;
  debug: boolean;
  onThrow: (t: DartThrow) => void;
  children?: React.ReactNode;
}

export function DartboardStage({ width, height, scale, debug, onThrow, children }: DartboardStageProps) {
  return (
    <div className="dartboard-container" style={{ position: 'relative' }}>
      <Dartboard width={width} height={height} onDartThrow={onThrow} />
      {debug && <DartboardDebug width={width} height={height} scale={scale} />}
      {children}
    </div>
  );
}
