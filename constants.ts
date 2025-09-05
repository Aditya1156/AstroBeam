
import { ZodiacSign, ZodiacName } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈' },
  { name: 'Taurus', symbol: '♉' },
  { name: 'Gemini', symbol: '♊' },
  { name: 'Cancer', symbol: '♋' },
  { name: 'Leo', symbol: '♌' },
  { name: 'Virgo', symbol: '♍' },
  { name: 'Libra', symbol: '♎' },
  { name: 'Scorpio', symbol: '♏' },
  { name: 'Sagittarius', symbol: '♐' },
  { name: 'Capricorn', symbol: '♑' },
  { name: 'Aquarius', symbol: '♒' },
  { name: 'Pisces', symbol: '♓' },
];

export const HOROSCOPES: Record<ZodiacName, string[]> = {
    Aries: ["A bold transfer is written in the stars for you.", "Your file will arrive with fiery speed."],
    Taurus: ["Patience ensures a successful data journey.", "A stable connection brings forth your files."],
    Gemini: ["A twin connection is imminent. Prepare for data doubling.", "Curiosity leads to a swift download."],
    Cancer: ["Nurture this connection, and your files will find their home.", "A secure and comforting transfer awaits."],
    Leo: ["A royally large file approaches your digital kingdom.", "Shine brightly, your transfer is the star of the show."],
    Virgo: ["Meticulous data packets align for a perfect transfer.", "An organized and efficient delivery is your destiny."],
    Libra: ["Balance is key. A harmonious connection will be achieved.", "A just and fair exchange of data is on the horizon."],
    Scorpio: ["A mysterious file from a powerful source will soon be yours.", "A deep and transformative data stream is flowing."],
    Sagittarius: ["Your files are on a grand adventure across the digital cosmos.", "An optimistic and expansive transfer is coming."],
    Capricorn: ["A disciplined and successful file transfer is guaranteed.", "Your ambition will be rewarded with a completed download."],
    Aquarius: ["An innovative connection method brings revolutionary data.", "Your files are riding on the waves of the future."],
    Pisces: ["Go with the flow; your data is swimming towards you.", "A dreamy and seamless transfer is about to manifest."],
};


export const CHUNK_SIZE = 65536; // 64 KB
