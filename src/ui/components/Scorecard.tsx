import type React from "react";
import { useEffect, useState } from "react";
import type { StorageData } from "../../utils/storage";
import { getStorageData } from "../../utils/storage";

const Scorecard: React.FC = () => {
  const [stats, setStats] = useState<StorageData | null>(null);

  useEffect(() => {
    const data = getStorageData();
    setStats(data);

    // Atualiza a cada 500ms para sincronizar quando a partida termina
    const interval = setInterval(() => {
      const updated = getStorageData();
      setStats(updated);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="scorecard-container">
      <div className="scorecard">
        <h2>📊 Placar</h2>

        {/* Última Partida */}
        <div className="scorecard-section">
          <h3>Última Partida</h3>
          {stats.lastGame ? (
            <div className="scorecard-stats">
              <div className="stat-item">
                <span className="stat-label">Pontuação:</span>
                <span className="stat-value">{stats.lastGame.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tempo:</span>
                <span className="stat-value">
                  {formatTime(stats.lastGame.timeAlive)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wave:</span>
                <span className="stat-value">{stats.lastGame.wave}</span>
              </div>
            </div>
          ) : (
            <p className="empty-message">Nenhuma partida ainda</p>
          )}
        </div>

        {/* Melhor Pontuação */}
        <div className="scorecard-section">
          <h3>🏆 Melhor Pontuação</h3>
          {stats.bestScore ? (
            <div className="scorecard-stats highlight-gold">
              <div className="stat-item">
                <span className="stat-label">Pontuação:</span>
                <span className="stat-value stat-gold">
                  {stats.bestScore.score}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tempo:</span>
                <span className="stat-value">
                  {formatTime(stats.bestScore.timeAlive)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wave:</span>
                <span className="stat-value">{stats.bestScore.wave}</span>
              </div>
            </div>
          ) : (
            <p className="empty-message">Sem recorde ainda</p>
          )}
        </div>

        {/* Maior Tempo */}
        <div className="scorecard-section">
          <h3>⏱️ Maior Tempo</h3>
          {stats.longestTime ? (
            <div className="scorecard-stats highlight-gold">
              <div className="stat-item">
                <span className="stat-label">Tempo:</span>
                <span className="stat-value stat-gold">
                  {formatTime(stats.longestTime.timeAlive)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Pontuação:</span>
                <span className="stat-value">{stats.longestTime.score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Wave:</span>
                <span className="stat-value">{stats.longestTime.wave}</span>
              </div>
            </div>
          ) : (
            <p className="empty-message">Sem recorde ainda</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scorecard;
