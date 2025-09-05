
import React from 'react';

interface TransferProgressProps {
  progress: number;
}

const constellationPoints = [
  { cx: "10%", cy: "50%" }, { cx: "25%", cy: "30%" }, { cx: "30%", cy: "70%" },
  { cx: "50%", cy: "50%" }, { cx: "65%", cy: "80%" }, { cx: "75%", cy: "20%" },
  { cx: "90%", cy: "50%" }
];

const constellationLines = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]
];

export const TransferProgress: React.FC<TransferProgressProps> = ({ progress }) => {
  const filledPoints = Math.round(constellationPoints.length * (progress / 100));
  const progressWidth = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <div className="w-full">
      <div className="relative h-20 w-full">
        <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none">
          {constellationLines.map(([p1, p2], i) => {
            const point1 = constellationPoints[p1];
            const point2 = constellationPoints[p2];
            const isActive = i < Math.round(constellationLines.length * (progress / 100));
            return (
              <line 
                key={i}
                x1={point1.cx} y1={point1.cy} 
                x2={point2.cx} y2={point2.cy} 
                stroke="rgba(189, 195, 199, 0.3)"
                strokeWidth="1"
                className={`transition-all duration-500 ${isActive ? 'stroke-comet/50' : ''}`}
              />
            )
          })}
          {constellationPoints.map((point, i) => (
            <circle 
              key={i}
              cx={point.cx} cy={point.cy} r="3" 
              fill="rgba(189, 195, 199, 0.5)"
              className={`transition-all duration-500 ${i < filledPoints ? 'fill-comet animate-starPulse' : ''}`}
              style={{animationDelay: `${i * 100}ms`}}
            />
          ))}
        </svg>
      </div>
      <div className="h-2 w-full bg-space-mid/50 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-comet rounded-full transition-all duration-500 ease-out"
          style={{ width: progressWidth }}
        ></div>
      </div>
      <p className="text-center mt-2 text-moonbeam">{Math.round(progress)}%</p>
    </div>
  );
};
