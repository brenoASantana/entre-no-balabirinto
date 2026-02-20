import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameEngine, SpriteManager } from "../../core";
import {
    BULLET_RADIUS,
    GAME_HEIGHT,
    GAME_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    WEAPON_CONFIGS,
} from "../../game";
import {
    useAudio,
    useGameLoop,
    useGameReset,
    useMouse,
    usePlayerMovement,
} from "../../hooks";
import "../../styles/App.css";

interface GameCanvasProps {
  isPaused?: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ isPaused = false }) => {
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
  useGameReset();

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
      audio.playContactDamageSound();
      // Aviso de vida baixa
      if (player.health <= 20) {
        audio.playLowHealthWarning();
      }
    }
    prevPlayerHealthRef.current = player.health;

    // Inimigo morto detectado
    if (gameState.enemies.length < prevEnemyCountRef.current) {
      audio.playEnemyDeathSound();
    }
    prevEnemyCountRef.current = gameState.enemies.length;

    // Game over detectado
    if (!gameState.isRunning && prevPlayerHealthRef.current > 0) {
      audio.playGameOverSound();
    }

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
          enemy.height
        );
      } else {
        // Fallback: desenhar como retângulo colorido
        ctx.fillStyle = "#ff3333";
        ctx.fillRect(
          enemy.position.x,
          enemy.position.y,
          enemy.width,
          enemy.height
        );
      }

      // Barra de vida
      const healthBarWidth = enemy.width;
      const healthBarHeight = 4;
      ctx.fillStyle = "#333333";
      ctx.fillRect(
        enemy.position.x,
        enemy.position.y - 8,
        healthBarWidth,
        healthBarHeight
      );

      // Barra de vida preenchida
      const healthPercent = enemy.health / enemy.maxHealth;
      ctx.fillStyle =
        healthPercent > 0.5
          ? "#00ff00"
          : healthPercent > 0.25
          ? "#ffff00"
          : "#ff0000";
      ctx.fillRect(
        enemy.position.x,
        enemy.position.y - 8,
        healthBarWidth * healthPercent,
        healthBarHeight
      );
    }

    // ==================== DESENHAR BALAS ====================
    // Balas com efeito de brilho
    for (const bullet of gameState.bullets) {
      // Brilho externo
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(
        bullet.position.x,
        bullet.position.y,
        BULLET_RADIUS * 2.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Bala principal
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(
        bullet.position.x,
        bullet.position.y,
        BULLET_RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Núcleo brilhante
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        bullet.position.x,
        bullet.position.y,
        BULLET_RADIUS * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // ==================== DESENHAR PARTÍCULAS ====================
    for (const particle of gameState.particles) {
      const alpha = 1 - particle.lifetime / particle.maxLifetime;
      ctx.fillStyle = particle.color
        .replace(")", `, ${alpha})`)
        .replace("rgb", "rgba");
      ctx.beginPath();
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // ==================== DESENHAR ARMAS ====================
    for (const weapon of gameState.weapons) {
      const config = WEAPON_CONFIGS[weapon.type];

      // Calcular pulsação (efeito visual)
      const pulse = Math.sin(weapon.lifetime * 5) * 0.3 + 0.7;
      const pulsedSize = weapon.size * pulse;

      // Aura brilhante
      ctx.fillStyle = config.color
        .replace(")", ", 0.2)")
        .replace("rgb", "rgba");
      ctx.beginPath();
      ctx.arc(
        weapon.position.x,
        weapon.position.y,
        pulsedSize * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Corpo da arma (quadrado rotativo)
      ctx.save();
      ctx.translate(weapon.position.x, weapon.position.y);
      ctx.rotate(weapon.lifetime * 3);

      ctx.fillStyle = config.color;
      ctx.fillRect(-pulsedSize / 2, -pulsedSize / 2, pulsedSize, pulsedSize);

      // Brilho
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-pulsedSize / 2, -pulsedSize / 2, pulsedSize, pulsedSize);

      ctx.restore();

      // Nome da arma (label)
      ctx.fillStyle = config.color;
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(config.name, weapon.position.x, weapon.position.y - 25);
    }

    // ==================== DESENHAR JOGADOR ====================
    if (spriteManager?.isLoaded("sprite0")) {
      // Renderiza sprite com rotação
      spriteManager.drawSprite(
        ctx,
        "sprite0",
        player.position.x,
        player.position.y,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        player.angle
      );
    } else {
      // Fallback: desenhar como retângulo com triângulo
      ctx.save();
      ctx.translate(
        player.position.x + PLAYER_WIDTH / 2,
        player.position.y + PLAYER_HEIGHT / 2
      );
      ctx.rotate(player.angle);

      // Aura de brilho ao redor do jogador
      ctx.fillStyle = "rgba(0, 255, 0, 0.15)";
      ctx.beginPath();
      ctx.arc(0, 0, PLAYER_WIDTH + 15, 0, Math.PI * 2);
      ctx.fill();

      // Corpo do jogador
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(
        -PLAYER_WIDTH / 2,
        -PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );

      // Borda de brilho no corpo
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        -PLAYER_WIDTH / 2,
        -PLAYER_HEIGHT / 2,
        PLAYER_WIDTH,
        PLAYER_HEIGHT
      );

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

    // ==================== MIRA/CROSSHAIR ====================
    const mouseX = gameState.mousePosition.x;
    const mouseY = gameState.mousePosition.y;
    const crosshairSize = 20;
    const crosshairThickness = 2;

    // Mira com brilho
    ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, crosshairSize + 5, 0, Math.PI * 2);
    ctx.stroke();

    // Mira principal em vermelho
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = crosshairThickness;

    // Linha horizontal
    ctx.beginPath();
    ctx.moveTo(mouseX - crosshairSize, mouseY);
    ctx.lineTo(mouseX - crosshairSize / 2, mouseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mouseX + crosshairSize / 2, mouseY);
    ctx.lineTo(mouseX + crosshairSize, mouseY);
    ctx.stroke();

    // Linha vertical
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY - crosshairSize);
    ctx.lineTo(mouseX, mouseY - crosshairSize / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY + crosshairSize / 2);
    ctx.lineTo(mouseX, mouseY + crosshairSize);
    ctx.stroke();

    // Ponto central
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Game Over renderizado pelo App.tsx
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
