import type React from "react";
import { useEffect, useState } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
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
  const [playerName, setPlayerName] = useState("Player");
  const [isSavingToAPI, setIsSavingToAPI] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { savingScore, isOnline } = useLeaderboard();

  useEffect(() => {
    const data = getStorageData();
    setStats(data);

    // Verifica se é novo recorde
    if (data.bestScore && score > data.bestScore.score) {
      setIsNewRecord(true);
    }

    // Tenta salvar score na API se disponível
    const saveToAPI = async () => {
      if (!isOnline) return;

      setIsSavingToAPI(true);
      setApiError(null);

      try {
        const result = await savingScore({
          playerName: playerName || "Anonymous",
          score,
          wave,
          timeAlive,
        });

        if (!result) {
          setApiError("Não foi possível salvar o score no servidor");
        }
      } catch (err) {
        console.error("Erro ao salvar score na API:", err);
        setApiError("Erro ao sincronizar com servidor");
      } finally {
        setIsSavingToAPI(false);
      }
    };

    // Salva após um breve delay para garantir que os dados foram processados
    const saveTimer = setTimeout(saveToAPI, 500);
    return () => clearTimeout(saveTimer);
  }, [score, wave, timeAlive, playerName, isOnline, savingScore]);

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

        {/* Nome do Jogador */}
        <div className="player-name-section">
          <label htmlFor="playerName">👤 Seu Nome:</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={30}
            placeholder="Digite seu nome"
            className="player-name-input"
          />
        </div>

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

        {/* Status da API */}
        {isOnline && (
          <div
            className={`api-status ${
              isSavingToAPI ? "saving" : apiError ? "error" : "success"
            }`}
          >
            {isSavingToAPI ? (
              <>
                <span className="status-icon">⏳</span>
                <span>Sincronizando com servidor...</span>
              </>
            ) : apiError ? (
              <>
                <span className="status-icon">⚠️</span>
                <span>{apiError}</span>
              </>
            ) : (
              <>
                <span className="status-icon">✅</span>
                <span>Score sincronizado com leaderboard</span>
              </>
            )}
          </div>
        )}

        {!isOnline && (
          <div className="api-status offline">
            <span className="status-icon">📱</span>
            <span>Score salvo localmente (servidor indisponível)</span>
          </div>
        )}

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
