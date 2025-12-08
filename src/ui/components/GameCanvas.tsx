import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine, SpriteManager } from "../../core";
import { BULLET_RADIUS, GAME_HEIGHT, GAME_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH } from "../../game";
import { useAudio, useGameLoop, useMouse, usePlayerMovement } from "../../hooks";
import "../../styles/App.css";

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine>(GameEngine.getInstance());
  const spriteManagerRef = useRef<SpriteManager>(SpriteManager.getInstance());
  const audio = useAudio();
  const prevEnemyCountRef = useRef(0);
  const prevBulletCountRef = useRef(0);
  const prevPlayerHealthRef = useRef(100);
  const [spritesLoaded, setSpritesLoaded] = useState(false);

  // Carrega sprites na montagem do componente
  useEffect(() => {
    const loadSprites = async () => {
      try {
        const spriteManager = spriteManagerRef.current;

        // Carrega as 4 sprites disponíveis
        await spriteManager.loadSprites([
          {
            name: "sprite0",
            path: "/img/Gemini_Generated_Image_hzvmpwhzvmpwhzvm.png",
          },
          {
            name: "sprite1",
            path: "/img/Gemini_Generated_Image_hzvmpwhzvmpwhzvm (1).png",
          },
          {
            name: "sprite2",
            path: "/img/Gemini_Generated_Image_hzvmpwhzvmpwhzvm (2).png",
          },
          {
            name: "sprite3",
            path: "/img/Gemini_Generated_Image_hzvmpwhzvmpwhzvm (3).png",
          },
        ]);

        setSpritesLoaded(true);
        console.log("All sprites loaded successfully!");
      } catch (error) {
        console.error("Error loading sprites:", error);
        // Continue sem sprites se falhar
        setSpritesLoaded(true);
      }
    };

    loadSprites();
  }, []);

  // Setup dos event listeners (teclado e mouse)
  usePlayerMovement();
  useMouse();

  // Função de renderização com useCallback para evitar recriações desnecessárias
  const handleDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Garante que o contexto 2D é obtido sempre de forma fresca
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    // Reset completo do estado do canvas
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Limpar canvas com background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Obter estado do jogo
    const gameState = engineRef.current.getGameState();
    const player = gameState.player;

    // ==================== AUDIO FEEDBACK ====================
    // Tiro detectado (novo bullet)
    if (gameState.bullets.length > prevBulletCountRef.current) {
      audio.playShootSound();
    }
    prevBulletCountRef.current = gameState.bullets.length;

    // Dano ao jogador detectado
    if (player.health < prevPlayerHealthRef.current) {
      audio.playHitSound();
    }
    prevPlayerHealthRef.current = player.health;

    // Inimigo morto detectado
    if (gameState.enemies.length < prevEnemyCountRef.current) {
      audio.playDeathSound();
    }
    prevEnemyCountRef.current = gameState.enemies.length;

    // ==================== DESENHAR INIMIGOS ====================
    const spriteManager = spriteManagerRef.current;
    for (let i = 0; i < gameState.enemies.length; i++) {
      const enemy = gameState.enemies[i];

      // Usa sprites alternadas para cada inimigo (sprite1, sprite2, sprite3)
      const spriteIndex = (i % 3) + 1;
      const spriteName = `sprite${spriteIndex}`;

      // Tenta desenhar com sprite, se não conseguir, usa fallback com cores
      if (spriteManager && spriteManager.isLoaded(spriteName)) {
        spriteManager.drawSprite(
          ctx,
          spriteName,
          enemy.position.x,
          enemy.position.y,
          enemy.width,
          enemy.height,
        );
      } else {
        // Fallback: desenhar como retângulo colorido
        ctx.fillStyle = "#ff3333";
        ctx.fillRect(enemy.position.x, enemy.position.y, enemy.width, enemy.height);
      }

      // Barra de vida
      const healthBarWidth = enemy.width;
      const healthBarHeight = 4;
      ctx.fillStyle = "#333333";
      ctx.fillRect(enemy.position.x, enemy.position.y - 8, healthBarWidth, healthBarHeight);

      // Barra de vida preenchida
      const healthPercent = enemy.health / enemy.maxHealth;
      ctx.fillStyle =
        healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffff00" : "#ff0000";
      ctx.fillRect(
        enemy.position.x,
        enemy.position.y - 8,
        healthBarWidth * healthPercent,
        healthBarHeight,
      );
    }

    // ==================== DESENHAR BALAS ====================
    ctx.fillStyle = "#ffff00";
    for (const bullet of gameState.bullets) {
      ctx.beginPath();
      ctx.arc(bullet.position.x, bullet.position.y, BULLET_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // ==================== DESENHAR JOGADOR ====================
    if (spriteManager && spriteManager.isLoaded("sprite0")) {
      // Renderiza sprite com rotação
      spriteManager.drawSprite(
        ctx,
        "sprite0",
        player.position.x,
        player.position.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        player.angle,
      );
    } else {
      // Fallback: desenhar como retângulo com triângulo
      ctx.save();
      ctx.translate(player.position.x + PLAYER_WIDTH / 2, player.position.y + PLAYER_HEIGHT / 2);
      ctx.rotate(player.angle);

      // Corpo do jogador
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Indicador de direção (triângulo apontando para frente)
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.moveTo(PLAYER_WIDTH / 2 + 10, 0);
      ctx.lineTo(PLAYER_WIDTH / 2 - 5, -6);
      ctx.lineTo(PLAYER_WIDTH / 2 - 5, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // ==================== HUD ====================
    // Health bar
    const healthBarX = 20;
    const healthBarY = 20;
    const healthBarWidth = 200;
    const healthBarHeight = 20;

    ctx.fillStyle = "#333333";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    const healthPercent = player.health / player.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? "#00ff00" : healthPercent > 0.25 ? "#ffff00" : "#ff0000";
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Texto de health
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
      `HP: ${Math.round(player.health)}/${player.maxHealth}`,
      healthBarX + 210,
      healthBarY + 15,
    );

    // Volume control visual
    const volumeBarX = healthBarX;
    const volumeBarY = healthBarY + 40;
    const volumeBarWidth = 100;
    const volumeBarHeight = 8;
    const currentVolume = audio.getVolume();

    ctx.fillStyle = "#333333";
    ctx.fillRect(volumeBarX, volumeBarY, volumeBarWidth, volumeBarHeight);

    ctx.fillStyle = "#00aaff";
    ctx.fillRect(volumeBarX, volumeBarY, volumeBarWidth * currentVolume, volumeBarHeight);

    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 1;
    ctx.strokeRect(volumeBarX, volumeBarY, volumeBarWidth, volumeBarHeight);

    ctx.font = "12px Arial";
    ctx.fillText("Volume", volumeBarX, volumeBarY - 5);

    // Score
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Score: ${gameState.score}`, GAME_WIDTH - 250, 40);

    // Wave
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Wave: ${gameState.wave}`, GAME_WIDTH - 250, 70);

    // Inimigos restantes
    ctx.font = "14px Arial";
    ctx.fillText(`Enemies: ${gameState.enemies.length}`, GAME_WIDTH - 250, 100);

    // Tempo vivo
    const timeSeconds = Math.floor(gameState.timeAlive);
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;
    ctx.fillText(`Time: ${minutes}:${seconds.toString().padStart(2, "0")}`, GAME_WIDTH - 250, 130);

    // Game Over
    if (!gameState.isRunning) {
      // Overlay semitransparente
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Texto Game Over
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText(`Final Score: ${gameState.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
      ctx.fillText(`Wave Reached: ${gameState.wave}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
      ctx.fillText(
        `Time Alive: ${minutes}:${seconds.toString().padStart(2, "0")}`,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 80,
      );
      ctx.fillText("Reload to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120);

      ctx.textAlign = "left";
    }
  }, [audio, spritesLoaded]); // Dependências do useCallback

  // Setup do game loop
  useGameLoop({
    onUpdate: () => {
      // Placeholder - a lógica está em GameEngine.update()
    },
    onDraw: handleDraw,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f0f1e",
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{
          border: "2px solid #00ff00",
          boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
        }}
      />
    </div>
  );
};

export default GameCanvas;
