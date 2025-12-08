import { Bullet, Enemy, GameState, KeysPressed, PlayerState, Vector2 } from "../types/game";
import {
  BULLET_LIFETIME,
  BULLET_RADIUS,
  BULLET_SPEED,
  ENEMIES_INCREASE_PER_WAVE,
  ENEMY_DAMAGE,
  ENEMY_HEIGHT,
  ENEMY_MAX_HEALTH,
  ENEMY_SPEED,
  ENEMY_WIDTH,
  FIRE_RATE,
  GAME_HEIGHT,
  GAME_WIDTH,
  INITIAL_ENEMIES_PER_WAVE,
  PLAYER_HEIGHT,
  PLAYER_MAX_HEALTH,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  WAVE_DELAY,
} from "./constants";
import { clamp, getAngle, normalizeVector } from "./math";

/**
 * Singleton Game Engine
 * Gerencia todo o estado do jogo SEM usar React State
 *
 * Responsabilidades:
 * - Estado do jogo (posição, velocidade, entidades)
 * - Lógica de atualização (update)
 * - Sistema de tiro e colisões
 * - Sistema de inimigos e waves
 * - Sistema de vida e dano
 */
export class GameEngine {
  private static instance: GameEngine;

  private gameState: GameState = {
    player: {
      position: {
        x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
      },
      velocity: { x: 0, y: 0 },
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: PLAYER_SPEED,
      angle: 0,
      health: PLAYER_MAX_HEALTH,
      maxHealth: PLAYER_MAX_HEALTH,
    },
    mousePosition: { x: 0, y: 0 },
    isRunning: true,
    bullets: [],
    enemies: [],
    score: 0,
    wave: 1,
    timeAlive: 0,
  };

  private keysPressed: KeysPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
  };

  private mousePressed = false;
  private lastShotTime = 0;
  private lastWaveTime = 0;
  private nextBulletId = 0;
  private nextEnemyId = 0;

  /**
   * Padrão Singleton: garante uma única instância
   */
  static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  /**
   * Retorna cópia do estado atual (imutável)
   */
  getGameState(): Readonly<GameState> {
    return Object.freeze({
      ...this.gameState,
      bullets: [...this.gameState.bullets],
      enemies: [...this.gameState.enemies],
    });
  }

  /**
   * Retorna cópia do player (imutável)
   */
  getPlayerState(): Readonly<PlayerState> {
    return Object.freeze({ ...this.gameState.player });
  }

  /**
   * Atualiza posição do mouse no game state
   */
  updateMousePosition(position: Vector2): void {
    this.gameState.mousePosition = position;
  }

  /**
   * Marca uma tecla como pressionada ou solta
   */
  setKeyPressed(key: "w" | "a" | "s" | "d", pressed: boolean): void {
    this.keysPressed[key] = pressed;
  }

  /**
   * Controla o estado do clique do mouse (tiro automático)
   */
  setMousePressed(pressed: boolean): void {
    this.mousePressed = pressed;
  }

  /**
   * Dispara uma bala
   */
  private shoot(): void {
    const playerCenterX = this.gameState.player.position.x + this.gameState.player.width / 2;
    const playerCenterY = this.gameState.player.position.y + this.gameState.player.height / 2;

    const angle = this.gameState.player.angle;
    const bullet: Bullet = {
      id: `bullet-${this.nextBulletId++}`,
      position: { x: playerCenterX, y: playerCenterY },
      velocity: {
        x: Math.cos(angle) * BULLET_SPEED,
        y: Math.sin(angle) * BULLET_SPEED,
      },
      angle,
      speed: BULLET_SPEED,
      lifetime: 0,
      maxLifetime: BULLET_LIFETIME,
      radius: BULLET_RADIUS,
    };

    this.gameState.bullets.push(bullet);
  }

  /**
   * Spawn inimigos baseado em wave
   */
  private spawnWave(): void {
    const enemiesToSpawn =
      INITIAL_ENEMIES_PER_WAVE + (this.gameState.wave - 1) * ENEMIES_INCREASE_PER_WAVE;

    for (let i = 0; i < enemiesToSpawn; i++) {
      // Spawn em posições aleatórias nas bordas
      const side = Math.floor(Math.random() * 4);
      let x = 0,
        y = 0;

      switch (side) {
        case 0: // top
          x = Math.random() * GAME_WIDTH;
          y = -ENEMY_HEIGHT;
          break;
        case 1: // right
          x = GAME_WIDTH;
          y = Math.random() * GAME_HEIGHT;
          break;
        case 2: // bottom
          x = Math.random() * GAME_WIDTH;
          y = GAME_HEIGHT;
          break;
        case 3: // left
          x = -ENEMY_WIDTH;
          y = Math.random() * GAME_HEIGHT;
          break;
      }

      const enemy: Enemy = {
        id: `enemy-${this.nextEnemyId++}`,
        position: { x, y },
        velocity: { x: 0, y: 0 },
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
        health: ENEMY_MAX_HEALTH,
        maxHealth: ENEMY_MAX_HEALTH,
        speed: ENEMY_SPEED,
        damage: ENEMY_DAMAGE,
        knockbackResistance: 0.3,
      };

      this.gameState.enemies.push(enemy);
    }
  }

  /**
   * Lógica de atualização do jogo (chamado a cada frame)
   *
   * @param deltaTime tempo decorrido desde o último frame em segundos
   */
  update(deltaTime: number): void {
    if (!this.gameState.isRunning) return;

    this.gameState.timeAlive += deltaTime;

    // ==================== PLAYER MOVEMENT ====================
    let velocityX = 0;
    let velocityY = 0;

    if (this.keysPressed.w) velocityY -= 1;
    if (this.keysPressed.s) velocityY += 1;
    if (this.keysPressed.a) velocityX -= 1;
    if (this.keysPressed.d) velocityX += 1;

    const normalized = normalizeVector(velocityX, velocityY);
    const speed = this.gameState.player.speed;

    this.gameState.player.velocity = {
      x: normalized.x * speed,
      y: normalized.y * speed,
    };

    this.gameState.player.position.x += this.gameState.player.velocity.x * deltaTime;
    this.gameState.player.position.y += this.gameState.player.velocity.y * deltaTime;

    this.gameState.player.position.x = clamp(
      this.gameState.player.position.x,
      0,
      GAME_WIDTH - this.gameState.player.width,
    );
    this.gameState.player.position.y = clamp(
      this.gameState.player.position.y,
      0,
      GAME_HEIGHT - this.gameState.player.height,
    );

    // ==================== PLAYER ROTATION ====================
    const playerCenterX = this.gameState.player.position.x + this.gameState.player.width / 2;
    const playerCenterY = this.gameState.player.position.y + this.gameState.player.height / 2;

    this.gameState.player.angle = getAngle(
      playerCenterX,
      playerCenterY,
      this.gameState.mousePosition.x,
      this.gameState.mousePosition.y,
    );

    // ==================== SHOOTING ====================
    if (this.mousePressed && this.lastShotTime >= FIRE_RATE) {
      this.shoot();
      this.lastShotTime = 0;
    }
    this.lastShotTime += deltaTime;

    // ==================== UPDATE BULLETS ====================
    for (let i = this.gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = this.gameState.bullets[i];
      bullet.lifetime += deltaTime;
      bullet.position.x += bullet.velocity.x * deltaTime;
      bullet.position.y += bullet.velocity.y * deltaTime;

      // Remove se sair da tela ou expirou
      if (
        bullet.lifetime > bullet.maxLifetime ||
        bullet.position.x < 0 ||
        bullet.position.x > GAME_WIDTH ||
        bullet.position.y < 0 ||
        bullet.position.y > GAME_HEIGHT
      ) {
        this.gameState.bullets.splice(i, 1);
      }
    }

    // ==================== SPAWN WAVES ====================
    if (this.gameState.enemies.length === 0) {
      this.lastWaveTime += deltaTime;
      if (this.lastWaveTime >= WAVE_DELAY) {
        this.gameState.wave++;
        this.spawnWave();
        this.lastWaveTime = 0;
      }
    }

    // ==================== UPDATE ENEMIES ====================
    for (let i = this.gameState.enemies.length - 1; i >= 0; i--) {
      const enemy = this.gameState.enemies[i];

      // Movimento em direção ao player
      const dirX = playerCenterX - (enemy.position.x + enemy.width / 2);
      const dirY = playerCenterY - (enemy.position.y + enemy.height / 2);
      const dirNormalized = normalizeVector(dirX, dirY);

      enemy.velocity = {
        x: dirNormalized.x * enemy.speed,
        y: dirNormalized.y * enemy.speed,
      };

      enemy.position.x += enemy.velocity.x * deltaTime;
      enemy.position.y += enemy.velocity.y * deltaTime;

      // Remove se sair muito da tela
      if (
        enemy.position.x < -100 ||
        enemy.position.x > GAME_WIDTH + 100 ||
        enemy.position.y < -100 ||
        enemy.position.y > GAME_HEIGHT + 100
      ) {
        this.gameState.enemies.splice(i, 1);
        continue;
      }

      // Checar colisão com player
      if (this.checkCircleRectCollision(playerCenterX, playerCenterY, 20, enemy)) {
        this.damagePlayer(enemy.damage);
      }
    }

    // ==================== BULLET-ENEMY COLLISIONS ====================
    for (let i = this.gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = this.gameState.bullets[i];

      for (let j = this.gameState.enemies.length - 1; j >= 0; j--) {
        const enemy = this.gameState.enemies[j];

        if (
          this.checkCircleRectCollision(bullet.position.x, bullet.position.y, bullet.radius, enemy)
        ) {
          // Damage do enemy
          enemy.health -= 10; // Default 10 dano por tiro
          this.gameState.bullets.splice(i, 1);

          if (enemy.health <= 0) {
            this.gameState.enemies.splice(j, 1);
            this.gameState.score += 10 * this.gameState.wave;
          }
          break;
        }
      }
    }

    // ==================== CHECK GAME OVER ====================
    if (this.gameState.player.health <= 0) {
      this.gameState.isRunning = false;
    }
  }

  /**
   * Verifica colisão entre círculo (bala) e retângulo (inimigo)
   */
  private checkCircleRectCollision(
    circleX: number,
    circleY: number,
    radius: number,
    rect: { position: Vector2; width: number; height: number },
  ): boolean {
    const closestX = clamp(circleX, rect.position.x, rect.position.x + rect.width);
    const closestY = clamp(circleY, rect.position.y, rect.position.y + rect.height);

    const distX = circleX - closestX;
    const distY = circleY - closestY;

    return distX * distX + distY * distY < radius * radius;
  }

  /**
   * Causa dano ao player
   */
  private damagePlayer(damage: number): void {
    this.gameState.player.health = Math.max(0, this.gameState.player.health - damage);
  }

  /**
   * Reseta o engine
   */
  reset(): void {
    this.gameState = {
      player: {
        position: {
          x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
          y: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
        },
        velocity: { x: 0, y: 0 },
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: PLAYER_SPEED,
        angle: 0,
        health: PLAYER_MAX_HEALTH,
        maxHealth: PLAYER_MAX_HEALTH,
      },
      mousePosition: { x: 0, y: 0 },
      isRunning: true,
      bullets: [],
      enemies: [],
      score: 0,
      wave: 1,
      timeAlive: 0,
    };
    this.keysPressed = { w: false, a: false, s: false, d: false };
    this.mousePressed = false;
    this.lastShotTime = 0;
    this.lastWaveTime = 0;
    this.nextBulletId = 0;
    this.nextEnemyId = 0;
  }
}
