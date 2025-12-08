export interface Vector2 {
  x: number;
  y: number;
}

export interface PlayerState {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  speed: number;
  angle: number;
  health: number;
  maxHealth: number;
}

export interface Bullet {
  id: string;
  position: Vector2;
  velocity: Vector2;
  angle: number;
  speed: number;
  lifetime: number;
  maxLifetime: number;
  radius: number;
}

export interface Enemy {
  id: string;
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  knockbackResistance: number;
}

export interface GameState {
  player: PlayerState;
  mousePosition: Vector2;
  isRunning: boolean;
  bullets: Bullet[];
  enemies: Enemy[];
  score: number;
  wave: number;
  timeAlive: number;
}

export interface KeysPressed {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}
