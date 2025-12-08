export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// Player
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 400; // pixels per second (aumentado de 250)
export const PLAYER_MAX_HEALTH = 80; // diminuído de 100

// Bullets
export const BULLET_SPEED = 600; // pixels per second (aumentado de 400)
export const BULLET_RADIUS = 4;
export const BULLET_LIFETIME = 5; // seconds
export const FIRE_RATE = 0.08; // seconds between shots (diminuído de 0.1)

// Enemies
export const ENEMY_WIDTH = 30;
export const ENEMY_HEIGHT = 30;
export const ENEMY_SPEED = 180; // pixels per second (aumentado de 100)
export const ENEMY_MAX_HEALTH = 15; // diminuído de 20
export const ENEMY_DAMAGE = 15; // aumentado de 10
export const ENEMY_KNOCKBACK_RESISTANCE = 0.3;
export const CONTACT_DAMAGE = 10; // Dano ao colidir com inimigo (sem morte instantânea)
export const CONTACT_COOLDOWN = 0.5; // segundos entre danos de contato

// Wave System
export const INITIAL_ENEMIES_PER_WAVE = 6; // aumentado de 3
export const ENEMIES_INCREASE_PER_WAVE = 3; // aumentado de 2
export const WAVE_DELAY = 2; // seconds between waves (diminuído de 3)

// Weapons
export const WEAPON_SIZE = 24;
export const WEAPON_LIFETIME = 12; // seconds antes de desaparecer
export const WEAPON_SPAWN_CHANCE = 0.15; // 15% de chance quando inimigo morre
export const WEAPON_DURATION = 8; // segundos de duração quando coletada

// Weapon Types Config
export const WEAPON_CONFIGS = {
  rapid_fire: {
    name: "Tiro Rápido",
    color: "#FF6B00",
    fireRate: 0.03, // 3x mais rápido
    bulletSpread: 0,
  },
  spread_shot: {
    name: "Tiro em Leque",
    color: "#00D4FF",
    fireRate: 0.12,
    bulletCount: 5, // 5 projéteis por tiro
    bulletSpread: Math.PI / 3, // 60 graus
  },
  piercing: {
    name: "Penetrante",
    color: "#FFD700",
    fireRate: 0.1,
    bulletDamage: 3, // múltiplos inimigos
  },
  explosion: {
    name: "Explosão",
    color: "#FF0080",
    fireRate: 0.15,
    explosionRadius: 80,
    explosionDamage: 25,
  },
} as const;
