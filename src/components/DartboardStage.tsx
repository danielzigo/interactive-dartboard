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
  isGameOver: boolean;
  children?: React.ReactNode;
}

export function DartboardStage({ width, height, scale, debug, onThrow, isGameOver, children }: DartboardStageProps) {
  return (
    <div className="dartboard-container" style={{ position: 'relative' }}>
      <Dartboard width={width} height={height} onDartThrow={onThrow} isGameOver={isGameOver} />
      {debug && <DartboardDebug width={width} height={height} scale={scale} />}
      {children}
    </div>
  );
}
