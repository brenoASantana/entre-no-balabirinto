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

export type BossType = "titan" | "vortex" | "inferno" | "shadow";

export interface Boss extends Enemy {
  type: BossType;
  phase: number;
  maxPhase: number;
  chargeTime: number;
  maxChargeTime: number;
  specialAttackCooldown: number;
  maxSpecialAttackCooldown: number;
  isBoss: true;
}

export type WeaponType =
  | "rapid_fire"
  | "spread_shot"
  | "piercing"
  | "explosion";

export interface Weapon {
  id: string;
  type: WeaponType;
  position: Vector2;
  lifetime: number;
  maxLifetime: number;
  size: number;
}

export interface PlayerWeapon {
  type: WeaponType;
  duration: number;
  startTime: number;
}

export interface Particle {
  position: Vector2;
  velocity: Vector2;
  lifetime: number;
  maxLifetime: number;
  radius: number;
  color: string;
}

export interface GameState {
  player: PlayerState;
  mousePosition: Vector2;
  isRunning: boolean;
  bullets: Bullet[];
  enemies: Enemy[];
  bosses: Boss[];
  weapons: Weapon[];
  particles: Particle[];
  score: number;
  wave: number;
  timeAlive: number;
  activeWeapon: PlayerWeapon | null;
}

export interface KeysPressed {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}
