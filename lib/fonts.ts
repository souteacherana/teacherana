import { Cinzel, DM_Sans, Instrument_Serif, Inter } from 'next/font/google';

// Usada na home (/) para os detalhes em dourado.
export const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  axes: ['opsz'],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});
