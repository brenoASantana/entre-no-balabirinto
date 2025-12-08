export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;

// Player
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 40;
export const PLAYER_SPEED = 250; // pixels per second
export const PLAYER_MAX_HEALTH = 100;

// Bullets
export const BULLET_SPEED = 400; // pixels per second
export const BULLET_RADIUS = 4;
export const BULLET_LIFETIME = 5; // seconds
export const FIRE_RATE = 0.1; // seconds between shots

// Enemies
export const ENEMY_WIDTH = 30;
export const ENEMY_HEIGHT = 30;
export const ENEMY_SPEED = 100; // pixels per second
export const ENEMY_MAX_HEALTH = 20;
export const ENEMY_DAMAGE = 10;
export const ENEMY_KNOCKBACK_RESISTANCE = 0.3;

// Wave System
export const INITIAL_ENEMIES_PER_WAVE = 3;
export const ENEMIES_INCREASE_PER_WAVE = 2;
export const WAVE_DELAY = 3; // seconds between waves
