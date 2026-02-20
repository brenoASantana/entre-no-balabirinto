import {
    BOSS_CHARGE_TIME,
    BOSS_CONFIGS,
    BOSS_HEIGHT,
    BOSS_SPAWN_WAVE,
    BOSS_SPECIAL_COOLDOWN,
    BOSS_SPEED,
    BOSS_WIDTH,
    BULLET_LIFETIME,
    BULLET_RADIUS,
    BULLET_SPEED,
    CONTACT_COOLDOWN,
    CONTACT_DAMAGE,
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
    WEAPON_CONFIGS,
    WEAPON_DURATION,
    WEAPON_LIFETIME,
    WEAPON_SIZE,
    WEAPON_SPAWN_CHANCE,
} from "../game/constants";
import type {
    Boss,
    BossType,
    Bullet,
    Enemy,
    GameState,
    KeysPressed,
    Particle,
    PlayerState,
    Vector2,
    Weapon,
    WeaponType,
} from "../game/types";
import { clamp, getAngle, normalizeVector } from "../game/utils/math";
import { saveGameStats } from "../utils/storage";

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
    bosses: [],
    weapons: [],
    particles: [],
    score: 0,
    wave: 1,
    timeAlive: 0,
    activeWeapon: null,
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
  private nextWeaponId = 0;
  private lastContactDamageTime = 0; // Para evitar dano contínuo
  private bossSpawned = false; // Controla se o boss já foi spawned nesta wave
  private nextBossId = 0;

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
      bosses: [...this.gameState.bosses],
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
  /**
   * Cria uma bala na posição do player
   */
  private createBullet(
    x: number,
    y: number,
    angle: number,
    speed: number
  ): void {
    const bullet: Bullet = {
      id: `bullet-${this.nextBulletId++}`,
      position: { x, y },
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      angle,
      speed,
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
      INITIAL_ENEMIES_PER_WAVE +
      (this.gameState.wave - 1) * ENEMIES_INCREASE_PER_WAVE;

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

      // Adiciona variação de velocidade (80% a 130% da velocidade base)
      const speedVariation = 0.8 + Math.random() * 0.5;
      const enemySpeed = ENEMY_SPEED * speedVariation;
      // Inimigos mais rápidos têm mais vida
      const healthVariation = 1 + (speedVariation - 1) * 0.5;
      const enemyHealth = Math.ceil(ENEMY_MAX_HEALTH * healthVariation);

      const enemy: Enemy = {
        id: `enemy-${this.nextEnemyId++}`,
        position: { x, y },
        velocity: { x: 0, y: 0 },
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
        health: enemyHealth,
        maxHealth: enemyHealth,
        speed: enemySpeed,
        damage: ENEMY_DAMAGE,
        knockbackResistance: 0.3,
      };

      this.gameState.enemies.push(enemy);
    }
  }

  /**
   * Spawn de um boss quando certas condições são atingidas
   */
  private spawnBoss(): void {
    const bossTypes: BossType[] = ["titan", "vortex", "inferno", "shadow"];
    const randomType =
      bossTypes[Math.floor(Math.random() * bossTypes.length)];
    const config = BOSS_CONFIGS[randomType];

    // Spawn no centro do mapa
    const boss: Boss = {
      id: `boss-${this.nextBossId++}`,
      type: randomType,
      position: {
        x: GAME_WIDTH / 2 - BOSS_WIDTH / 2,
        y: BOSS_HEIGHT,
      },
      velocity: { x: 0, y: 0 },
      width: BOSS_WIDTH,
      height: BOSS_HEIGHT,
      health: config.health,
      maxHealth: config.health,
      speed: BOSS_SPEED,
      damage: config.damage,
      knockbackResistance: config.knockbackResistance,
      phase: 1,
      maxPhase: config.maxPhase,
      chargeTime: 0,
      maxChargeTime: BOSS_CHARGE_TIME,
      specialAttackCooldown: BOSS_SPECIAL_COOLDOWN,
      maxSpecialAttackCooldown: BOSS_SPECIAL_COOLDOWN,
      isBoss: true,
    };

    this.gameState.bosses.push(boss);
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

    this.gameState.player.position.x +=
      this.gameState.player.velocity.x * deltaTime;
    this.gameState.player.position.y +=
      this.gameState.player.velocity.y * deltaTime;

    this.gameState.player.position.x = clamp(
      this.gameState.player.position.x,
      0,
      GAME_WIDTH - this.gameState.player.width
    );
    this.gameState.player.position.y = clamp(
      this.gameState.player.position.y,
      0,
      GAME_HEIGHT - this.gameState.player.height
    );

    // ==================== PLAYER ROTATION ====================
    const playerCenterX =
      this.gameState.player.position.x + this.gameState.player.width / 2;
    const playerCenterY =
      this.gameState.player.position.y + this.gameState.player.height / 2;

    // Calcula o ângulo desejado em relação ao mouse
    const targetAngle = getAngle(
      playerCenterX,
      playerCenterY,
      this.gameState.mousePosition.x,
      this.gameState.mousePosition.y
    );

    // Suavização da rotação para seguimento mais suave e responsivo
    // Quanto maior o valor, mais rápido segue o mouse (máximo 1 = instantâneo)
    const rotationSpeed = 0.15; // Aumentado para 0.15 (antes seria mais lento)

    // Calcula a diferença de ângulo (normalizando para o menor caminho)
    let angleDiff = targetAngle - this.gameState.player.angle;

    // Normaliza para o intervalo [-π, π]
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Interpola para o novo ângulo
    this.gameState.player.angle += angleDiff * rotationSpeed;

    // ==================== SHOOTING ====================
    if (this.mousePressed && this.lastShotTime >= this.getModifiedFireRate()) {
      this.fireWeapon();
      this.lastShotTime = 0;
    }
    this.lastShotTime += deltaTime;

    // ==================== UPDATE PARTICLES ====================
    this.updateParticles(deltaTime);

    // ==================== UPDATE WEAPONS ====================
    this.updateActiveWeapon(deltaTime);

    // Update weapon pickups (armas no mapa)
    for (let i = this.gameState.weapons.length - 1; i >= 0; i--) {
      const weapon = this.gameState.weapons[i];
      weapon.lifetime += deltaTime;

      // Remover se expirou
      if (weapon.lifetime > weapon.maxLifetime) {
        this.gameState.weapons.splice(i, 1);
        continue;
      }

      // Verificar colisão com player
      if (
        this.checkCircleRectCollision(playerCenterX, playerCenterY, 20, {
          position: weapon.position,
          width: weapon.size,
          height: weapon.size,
        })
      ) {
        this.collectWeapon(weapon);
        this.gameState.weapons.splice(i, 1);
      }
    }

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
    if (this.gameState.enemies.length === 0 && this.gameState.bosses.length === 0) {
      this.lastWaveTime += deltaTime;
      if (this.lastWaveTime >= WAVE_DELAY) {
        this.gameState.wave++;
        this.spawnWave();

        // Spawn boss a cada BOSS_SPAWN_WAVE waves
        if (this.gameState.wave % BOSS_SPAWN_WAVE === 0 && !this.bossSpawned) {
          this.spawnBoss();
          this.bossSpawned = true;
        } else if (this.gameState.wave % BOSS_SPAWN_WAVE !== 0) {
          this.bossSpawned = false;
        }

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
      if (
        this.checkCircleRectCollision(playerCenterX, playerCenterY, 20, enemy)
      ) {
        // Dano de contato (reduzido comparado ao ENEMY_DAMAGE)
        const now = Date.now() / 1000;
        if (now - this.lastContactDamageTime >= CONTACT_COOLDOWN) {
          this.damagePlayer(CONTACT_DAMAGE);
          this.lastContactDamageTime = now;
        }

        // Inimigo desaparece após colidir
        this.gameState.enemies.splice(i, 1);
      }
    }

    // ==================== BULLET-ENEMY COLLISIONS ====================
    for (let i = this.gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = this.gameState.bullets[i];

      for (let j = this.gameState.enemies.length - 1; j >= 0; j--) {
        const enemy = this.gameState.enemies[j];

        if (
          this.checkCircleRectCollision(
            bullet.position.x,
            bullet.position.y,
            bullet.radius,
            enemy
          )
        ) {
          // Damage do enemy (aumentado de 10)
          enemy.health -= 15; // Dano por tiro aumentado
          this.gameState.bullets.splice(i, 1);

          if (enemy.health <= 0) {
            const enemyPos = {
              x: enemy.position.x + enemy.width / 2,
              y: enemy.position.y + enemy.height / 2,
            };
            this.gameState.enemies.splice(j, 1);

            // Criar partículas de explosão
            this.createExplosionParticles(enemyPos);

            // Score aumentado significativamente (multiplicado por wave²)
            this.gameState.score +=
              25 * this.gameState.wave * this.gameState.wave;

            // Chance de spawnar uma arma
            if (Math.random() < WEAPON_SPAWN_CHANCE) {
              this.spawnWeapon(enemyPos);
            }
          }
          break;
        }
      }
    }

    // ==================== UPDATE BOSSES ====================
    for (let i = this.gameState.bosses.length - 1; i >= 0; i--) {
      const boss = this.gameState.bosses[i];

      // Movimento do boss em direção ao player
      const dirX = playerCenterX - (boss.position.x + boss.width / 2);
      const dirY = playerCenterY - (boss.position.y + boss.height / 2);
      const dirNormalized = normalizeVector(dirX, dirY);

      boss.velocity = {
        x: dirNormalized.x * boss.speed * 0.7, // 70% da velocidade normal
        y: dirNormalized.y * boss.speed * 0.7,
      };

      // Atualiza posição do boss
      boss.position.x += boss.velocity.x * deltaTime;
      boss.position.y += boss.velocity.y * deltaTime;

      // Atualiza cooldown de ataque especial
      if (boss.specialAttackCooldown > 0) {
        boss.specialAttackCooldown -= deltaTime;
      }

      // Atualiza charge time do ataque especial
      if (boss.chargeTime > 0) {
        boss.chargeTime -= deltaTime;
      } else if (boss.specialAttackCooldown <= 0) {
        // Executa ataque especial
        this.bossBossSpecialAttack(boss);
        boss.specialAttackCooldown = BOSS_SPECIAL_COOLDOWN;
      }

      // Colisão com balas
      for (let j = 0; j < this.gameState.bullets.length; j++) {
        const bullet = this.gameState.bullets[j];

        if (
          this.checkCircleRectCollision(
            bullet.position.x,
            bullet.position.y,
            bullet.radius,
            boss
          )
        ) {
          // Dano ao boss
          boss.health -= 10;
          this.gameState.bullets.splice(j, 1);
          j--;

          if (boss.health <= 0) {
            const bossPos = {
              x: boss.position.x + boss.width / 2,
              y: boss.position.y + boss.height / 2,
            };
            const bossConfig = BOSS_CONFIGS[boss.type];

            // Remove boss
            this.gameState.bosses.splice(i, 1);

            // Cria partículas de explosão GRANDE
            for (let p = 0; p < 50; p++) {
              this.createExplosionParticles(bossPos);
            }

            // Score MUITO maior para derrotar boss
            this.gameState.score +=
              bossConfig.scoreReward * this.gameState.wave;

            // Garante spawn de arma ao derrotar boss
            for (let w = 0; w < 2; w++) {
              this.spawnWeapon(bossPos);
            }
          }
          break;
        }
      }

      // Colisão com player (dano contínuo)
      if (this.checkRectRectCollision(this.gameState.player, boss)) {
        const now = Date.now() / 1000;
        if (now - this.lastContactDamageTime > CONTACT_COOLDOWN) {
          this.gameState.player.health -= boss.damage;
          this.lastContactDamageTime = now;
        }
      }
    }

    // ==================== CHECK GAME OVER ====================
    if (this.gameState.player.health <= 0) {
      this.gameState.isRunning = false;

      // Salva as stats da partida
      saveGameStats({
        score: this.gameState.score,
        timeAlive: this.gameState.timeAlive,
        wave: this.gameState.wave,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Ataque especial do boss (dispara balas em padrão específico)
   */
  private bossBossSpecialAttack(boss: Boss): void {
    const bossConfig = BOSS_CONFIGS[boss.type];
    const centerX = boss.position.x + boss.width / 2;
    const centerY = boss.position.y + boss.height / 2;

    switch (bossConfig.specialAttack) {
      case "shockwave": {
        // Dispara balas em círculo ao redor do boss
        const bulletCount = 8;
        for (let i = 0; i < bulletCount; i++) {
          const angle = (i / bulletCount) * Math.PI * 2;
          const vx = Math.cos(angle) * BULLET_SPEED;
          const vy = Math.sin(angle) * BULLET_SPEED;

          const bullet: Bullet = {
            id: `boss-bullet-${this.nextBulletId++}`,
            position: { x: centerX, y: centerY },
            velocity: { x: vx, y: vy },
            angle,
            speed: BULLET_SPEED,
            lifetime: 0,
            maxLifetime: BULLET_LIFETIME,
            radius: BULLET_RADIUS,
          };
          this.gameState.bullets.push(bullet);
        }
        break;
      }

      case "spiral": {
        // Dispara balas em padrão espiral
        const bulletCount = 12;
        for (let i = 0; i < bulletCount; i++) {
          const angle =
            (i / bulletCount) * Math.PI * 2 +
            (this.gameState.timeAlive * 3) % (Math.PI * 2);
          const vx = Math.cos(angle) * BULLET_SPEED * 0.8;
          const vy = Math.sin(angle) * BULLET_SPEED * 0.8;

          const bullet: Bullet = {
            id: `boss-bullet-${this.nextBulletId++}`,
            position: { x: centerX, y: centerY },
            velocity: { x: vx, y: vy },
            angle,
            speed: BULLET_SPEED * 0.8,
            lifetime: 0,
            maxLifetime: BULLET_LIFETIME,
            radius: BULLET_RADIUS,
          };
          this.gameState.bullets.push(bullet);
        }
        break;
      }

      case "fireball": {
        // Dispara bolas de fogo grandes em 3 direções
        const dirX = this.gameState.player.position.x -
          boss.position.x +
          (Math.random() - 0.5) * 100;
        const dirY = this.gameState.player.position.y -
          boss.position.y +
          (Math.random() - 0.5) * 100;
        const dirNormalized = normalizeVector(dirX, dirY);

        for (let spread = -1; spread <= 1; spread++) {
          const angle = Math.atan2(dirNormalized.y, dirNormalized.x);
          const spreadAngle = angle + (spread * Math.PI) / 6;
          const vx = Math.cos(spreadAngle) * BULLET_SPEED;
          const vy = Math.sin(spreadAngle) * BULLET_SPEED;

          const bullet: Bullet = {
            id: `boss-bullet-${this.nextBulletId++}`,
            position: { x: centerX, y: centerY },
            velocity: { x: vx, y: vy },
            angle: spreadAngle,
            speed: BULLET_SPEED,
            lifetime: 0,
            maxLifetime: BULLET_LIFETIME,
            radius: BULLET_RADIUS * 2, // Bullet maior
          };
          this.gameState.bullets.push(bullet);
        }
        break;
      }

      case "teleport": {
        // Teleporta e dispara em múltiplos locais
        const positions = [
          { x: 150, y: 150 },
          { x: GAME_WIDTH - 150, y: 150 },
          { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
        ];

        const targetPos =
          positions[Math.floor(Math.random() * positions.length)];
        boss.position = {
          x: targetPos.x - boss.width / 2,
          y: targetPos.y - boss.height / 2,
        };

        // Dispara em direção ao player
        const dirX = this.gameState.player.position.x - targetPos.x;
        const dirY = this.gameState.player.position.y - targetPos.y;
        const dirNormalized = normalizeVector(dirX, dirY);

        const bulletCount = 6;
        for (let i = 0; i < bulletCount; i++) {
          const angle = Math.atan2(dirNormalized.y, dirNormalized.x);
          const spreadAngle = angle + ((i - bulletCount / 2) * Math.PI) / 6;
          const vx = Math.cos(spreadAngle) * BULLET_SPEED;
          const vy = Math.sin(spreadAngle) * BULLET_SPEED;

          const bullet: Bullet = {
            id: `boss-bullet-${this.nextBulletId++}`,
            position: { x: targetPos.x, y: targetPos.y },
            velocity: { x: vx, y: vy },
            angle: spreadAngle,
            speed: BULLET_SPEED,
            lifetime: 0,
            maxLifetime: BULLET_LIFETIME,
            radius: BULLET_RADIUS,
          };
          this.gameState.bullets.push(bullet);
        }
        break;
      }
    }
  }

  /**
   * Verifica colisão entre círculo (bala) e retângulo (inimigo)
   */
  private checkCircleRectCollision(
    circleX: number,
    circleY: number,
    radius: number,
    rect: { position: Vector2; width: number; height: number }
  ): boolean {
    const closestX = clamp(
      circleX,
      rect.position.x,
      rect.position.x + rect.width
    );
    const closestY = clamp(
      circleY,
      rect.position.y,
      rect.position.y + rect.height
    );

    const distX = circleX - closestX;
    const distY = circleY - closestY;

    return distX * distX + distY * distY < radius * radius;
  }

  /**
   * Causa dano ao player
   */
  private damagePlayer(damage: number): void {
    this.gameState.player.health = Math.max(
      0,
      this.gameState.player.health - damage
    );
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
      bosses: [],
      weapons: [],
      particles: [],
      score: 0,
      wave: 1,
      timeAlive: 0,
      activeWeapon: null,
    };
    this.keysPressed = { w: false, a: false, s: false, d: false };
    this.mousePressed = false;
    this.lastShotTime = 0;
    this.lastWaveTime = 0;
    this.nextBulletId = 0;
    this.nextEnemyId = 0;
    this.nextWeaponId = 0;
    this.bossSpawned = false;
    this.nextBossId = 0;
  }

  /**
   * Spawn uma arma aleatória no mapa
   */
  private spawnWeapon(position: Vector2): void {
    const weaponTypes: WeaponType[] = [
      "rapid_fire",
      "spread_shot",
      "piercing",
      "explosion",
    ];
    const randomType =
      weaponTypes[Math.floor(Math.random() * weaponTypes.length)];

    const weapon: Weapon = {
      id: `weapon_${this.nextWeaponId++}`,
      type: randomType,
      position: { ...position },
      lifetime: 0,
      maxLifetime: WEAPON_LIFETIME,
      size: WEAPON_SIZE,
    };

    this.gameState.weapons.push(weapon);
  }

  /**
   * Atualiza armas ativas (armas do player coletadas)
   */
  private updateActiveWeapon(): void {
    if (!this.gameState.activeWeapon) return;

    const elapsed = Date.now() - this.gameState.activeWeapon.startTime;
    if (elapsed > this.gameState.activeWeapon.duration * 1000) {
      this.gameState.activeWeapon = null;
    }
  }

  /**
   * Coleta uma arma
   */
  private collectWeapon(weapon: Weapon): void {
    this.gameState.activeWeapon = {
      type: weapon.type,
      duration: WEAPON_DURATION,
      startTime: Date.now(),
    };
  }

  /**
   * Modifica o tiro baseado na arma ativa
   */
  private getModifiedFireRate(): number {
    if (!this.gameState.activeWeapon) return FIRE_RATE;

    const config = WEAPON_CONFIGS[this.gameState.activeWeapon.type];
    return config.fireRate;
  }

  /**
   * Cria balas baseado no tipo de arma
   */
  private fireWeapon(): void {
    const now = Date.now() / 1000;
    const fireRate = this.getModifiedFireRate();

    if (now - this.lastShotTime < fireRate) return;

    this.lastShotTime = now;

    const player = this.gameState.player;
    const playerCenterX = player.position.x + player.width / 2;
    const playerCenterY = player.position.y + player.height / 2;
    const angle = player.angle;

    if (!this.gameState.activeWeapon) {
      // Tiro normal
      this.createBullet(playerCenterX, playerCenterY, angle, BULLET_SPEED);
      return;
    }

    const weaponType = this.gameState.activeWeapon.type;
    const config = WEAPON_CONFIGS[weaponType];

    switch (weaponType) {
      case "rapid_fire":
        // Mesmo tiro, mas mais rápido (fireRate já modificado)
        this.createBullet(playerCenterX, playerCenterY, angle, BULLET_SPEED);
        break;

      case "spread_shot": {
        // 5 projéteis em leque
        const spreadConfig = config as typeof WEAPON_CONFIGS.spread_shot;
        const spread = spreadConfig.bulletSpread;
        const bulletCount = spreadConfig.bulletCount;
        const angleStep = spread / (bulletCount - 1);

        for (let i = 0; i < bulletCount; i++) {
          const offsetAngle = angle - spread / 2 + angleStep * i;
          this.createBullet(
            playerCenterX,
            playerCenterY,
            offsetAngle,
            BULLET_SPEED
          );
        }
        break;
      }

      case "piercing":
        // Tiro normal, mas com damage aumentado (verificado na colisão)
        this.createBullet(playerCenterX, playerCenterY, angle, BULLET_SPEED);
        break;

      case "explosion":
        // Tiro normal, mas com explosão na colisão
        this.createBullet(playerCenterX, playerCenterY, angle, BULLET_SPEED);
        break;
    }
  }

  /**
   * Cria partículas de explosão quando um inimigo morre
   */
  private createExplosionParticles(position: Vector2): void {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 150 + Math.random() * 100;

      const particle: Particle = {
        position: { ...position },
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
        lifetime: 0,
        maxLifetime: 0.4,
        radius: 2 + Math.random() * 3,
        color: ["#ff6b00", "#ff0000", "#ffaa00"][Math.floor(Math.random() * 3)],
      };

      this.gameState.particles.push(particle);
    }
  }

  /**
   * Atualiza e remove partículas
   */
  private updateParticles(deltaTime: number): void {
    for (let i = this.gameState.particles.length - 1; i >= 0; i--) {
      const particle = this.gameState.particles[i];

      particle.lifetime += deltaTime;
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;

      // Remove partículas expiradas
      if (particle.lifetime > particle.maxLifetime) {
        this.gameState.particles.splice(i, 1);
      }
    }
  }
}
