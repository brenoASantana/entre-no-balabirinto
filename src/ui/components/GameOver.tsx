import type React from "react";
import { useEffect, useState } from "react";
import type { ScreenContextType } from "../../types/screen";
import type { StorageData } from "../../utils/storage";
import { getStorageData } from "../../utils/storage";

interface GameOverProps {
  score: number;
  wave: number;
  timeAlive: number;
  onMainMenu: ScreenContextType["goToMenu"];
  onRetry: ScreenContextType["startGame"];
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  wave,
  timeAlive,
  onMainMenu,
  onRetry,
}) => {
  const [stats, setStats] = useState<StorageData | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    const data = getStorageData();
    setStats(data);

    // Verifica se é novo recorde
    if (data.bestScore && score > data.bestScore.score) {
      setIsNewRecord(true);
    }
  }, [score]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="gameover-container">
      <div className="gameover-content">
        {isNewRecord && (
          <div className="new-record-banner">
            <span className="banner-text">🏆 NOVO RECORDE! 🏆</span>
          </div>
        )}

        <h1 className="gameover-title">GAME OVER</h1>

        <div className="gameover-stats">
          <div className="stat-box">
            <span className="stat-label">Pontuação</span>
            <span className="stat-value large">{score}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Wave</span>
            <span className="stat-value">{wave}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Tempo</span>
            <span className="stat-value">{formatTime(timeAlive)}</span>
          </div>
        </div>

        {stats && (
          <div className="comparison-stats">
            <h3>Comparação com Recorde</h3>
            {stats.bestScore ? (
              <div className="comparison-content">
                <div className="comparison-item">
                  <span>Melhor Score:</span>
                  <span className="record-value">{stats.bestScore.score}</span>
                </div>
                <div className="comparison-item">
                  <span>Diferença:</span>
                  <span
                    className={
                      score > stats.bestScore.score ? "positive" : "negative"
                    }
                  >
                    {score > stats.bestScore.score ? "+" : ""}
                    {score - stats.bestScore.score}
                  </span>
                </div>
                <div className="comparison-item">
                  <span>Maior Wave:</span>
                  <span className="record-value">{stats.bestScore.wave}</span>
                </div>
              </div>
            ) : (
              <p className="no-record">Este é seu primeiro jogo!</p>
            )}
          </div>
        )}

        <div className="gameover-buttons">
          <button className="button secondary-button" onClick={onMainMenu}>
            ↶ Menu Principal
          </button>
          <button className="button primary-button" onClick={onRetry}>
            ↻ Tentar Novamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
