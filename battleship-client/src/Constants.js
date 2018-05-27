export const N = 8;

export const SHIPS = [
  [[1, 0], [1, 0], [1, 1]],   // L-shape
  [[1, 1], [1, 1]],           // Box
  [[1, 1, 1, 1]],             // H-Line
  [[1], [1], [1], [1]]        // V-Line
];

export const DX = [-1, 0, 1, 0];
export const DY = [0, -1, 0, 1];

export const WATER = 0;
export const SHIP = 1;
export const MISS = 2;
export const HIT = 3;
export const SUNK = 4;