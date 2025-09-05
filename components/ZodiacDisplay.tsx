
import React from 'react';
import { ZodiacIcon } from './icons/ZodiacIcons';
import { ZodiacSign, ZodiacName } from '../types';

interface ZodiacDisplayProps {
  zodiac: ZodiacSign | null;
  small?: boolean;
}

export const ZodiacDisplay: React.FC<ZodiacDisplayProps> = ({ zodiac, small = false }) => {
  if (!zodiac) return null;

  return (
    <div className={`flex items-center gap-2 ${small ? '' : 'flex-col'}`}>
      <div className={`${small ? 'text-comet' : 'text-comet'}`}>
        <ZodiacIcon sign={zodiac.name} className={small ? 'w-6 h-6' : 'w-12 h-12'} />
      </div>
      <p className={`font-semibold ${small ? 'text-base text-moonbeam' : 'text-lg text-starlight'}`}>
        {zodiac.name}
      </p>
    </div>
  );
};
