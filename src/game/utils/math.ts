export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const normalizeVector = (
  x: number,
  y: number
): { x: number; y: number } => {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
};

export const getAngle = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number => {
  return Math.atan2(toY - fromY, toX - fromX);
};
