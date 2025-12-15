export interface DartThrow {
  score: number;
  multiplier: 1 | 2 | 3;
  segmentNumber: number;
  region: string;
  description: string;
}

interface RecentThrowsProps {
  throws: DartThrow[];
}

export function RecentThrows({ throws }: RecentThrowsProps) {
  return (
    <div className="recent-throws">
      <h3 className="font-heading text-2xl">Last 10 Throws</h3>
      {throws.length === 0 ? (
        <p className="no-throws">No throws yet. Click the dartboard!</p>
      ) : (
        <ul className="throws-list">
          {throws
            .slice()
            .reverse()
            .slice(0, 10)
            .map((throw_, index) => (
              <li key={throws.length - index} className={`throw-item ${throw_.region}`}>
                <span className="throw-score">{throw_.score}</span>
                <span className="throw-description">{throw_.description}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
