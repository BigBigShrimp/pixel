export type GridSize = number;

export interface PixelData {
  id: number;
  value: 0 | 1; // 0 for white/off, 1 for black/on
}

export enum AppMode {
  EXPLORE = 'explore',
  CHALLENGE = 'challenge',
  PRACTICE = 'practice',
  RESPONSIBILITY = 'responsibility',
  TUTOR = 'tutor'
}

export interface Challenge {
  name: string;
  description: string;
  targetGrid: number[]; // Flattened array of 0s and 1s
  size: GridSize;
}