import type React from "react";
import { useEffect, useState } from "react";
import { WEAPON_CONFIGS } from "../../game/constants";
import type { GameState, WeaponType } from "../../game/types";

interface GameHUDProps {
  gameState: GameState;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  const [displayScore, setDisplayScore] = useState(gameState.score);
  const [scoreFlash, setScoreFlash] = useState(false);

  useEffect(() => {
    if (gameState.score > displayScore) {
      setScoreFlash(true);
      const timer = setTimeout(() => setScoreFlash(false), 300);
      setDisplayScore(gameState.score);
      return () => clearTimeout(timer);
    }
  }, [gameState.score, displayScore]);

  const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  const healthColor =
    healthPercent > 50 ? "#00ff00" : healthPercent > 25 ? "#ffff00" : "#ff0000";

  const weaponName = gameState.activeWeapon
    ? WEAPON_CONFIGS[gameState.activeWeapon.type as WeaponType]?.name ||
      "Desconhecida"
    : "Padrão";

  const weaponProgress = gameState.activeWeapon
    ? ((gameState.activeWeapon.duration - gameState.activeWeapon.startTime) /
        gameState.activeWeapon.duration) *
      100
    : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="hud-container">
      {/* Top Right - Score e Tempo */}
      <div className="hud-top-right">
        <div className={`hud-item score-display ${scoreFlash ? "flash" : ""}`}>
          <span className="label">📊 Pontuação:</span>
          <span className="value">{displayScore}</span>
        </div>

        <div className="hud-item time-display">
          <span className="label">⏱️ Tempo:</span>
          <span className="value">{formatTime(gameState.timeAlive)}</span>
        </div>

        <div className="hud-item wave-display">
          <span className="label">🌊 Wave:</span>
          <span className="value">{gameState.wave}</span>
        </div>
      </div>

      {/* Bottom Left - Health Bar */}
      <div className="hud-bottom-left">
        <div className="health-section">
          <div className="health-label">
            <span className="label">❤️ Saúde</span>
            <span className="health-text">
              {gameState.player.health}/{gameState.player.maxHealth}
            </span>
          </div>
          <div className="health-bar-container">
            <div
              className="health-bar-fill"
              style={{
                width: `${healthPercent}%`,
                backgroundColor: healthColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Right - Active Weapon */}
      {gameState.activeWeapon && (
        <div className="hud-bottom-right">
          <div className="weapon-section">
            <div className="weapon-label">
              <span className="label">⚔️ Arma Ativa:</span>
              <span className="weapon-name">{weaponName}</span>
            </div>
            <div className="weapon-duration-bar">
              <div
                className="weapon-duration-fill"
                style={{
                  width: `${weaponProgress}%`,
                }}
              />
            </div>
            <span className="weapon-duration-text">
              {gameState.activeWeapon.duration - gameState.activeWeapon.startTime > 0
                ? `${Math.ceil(
                    gameState.activeWeapon.duration - gameState.activeWeapon.startTime
                  )}s`
                : "Expirando"}
            </span>
          </div>
        </div>
      )}

      {/* Center Bottom - Enemy Count */}
      <div className="hud-center-bottom">
        <div className="enemy-count">
          <span className="label">👾 Inimigos:</span>
          <span className="value">{gameState.enemies.length}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="hud-instructions">
        <span className="instruction-text">
          Pressione <kbd>ESC</kbd> para pausar | <kbd>R</kbd> para reiniciar
        </span>
      </div>
    </div>
  );
};

export default GameHUD;
