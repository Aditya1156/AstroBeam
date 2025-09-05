
import React from 'react';

export const StarryBackground: React.FC = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    };
    return <div key={i} className="absolute rounded-full bg-starlight animate-starPulse" style={style}></div>;
  });

  const starSizes = [
    'w-[1px] h-[1px]',
    'w-[2px] h-[2px]',
    'w-[3px] h-[3px]',
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-space-dark via-space-mid to-space-dark -z-10 overflow-hidden">
      {stars.map((star, i) => React.cloneElement(star, {
          className: `${star.props.className} ${starSizes[i % 3]}`
      }))}
      <div className="absolute top-1/4 -left-1/4 w-full h-1 bg-white/30 rounded-full animate-meteor" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-1/2 -left-1/4 w-3/4 h-0.5 bg-white/20 rounded-full animate-meteor" style={{animationDelay: '2.5s', animationDuration: '6s'}}></div>
      <div className="absolute top-3/4 -left-1/4 w-1/2 h-0.5 bg-white/10 rounded-full animate-meteor" style={{animationDelay: '5s', animationDuration: '10s'}}></div>
    </div>
  );
};
