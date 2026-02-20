import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { GameEngine } from "./core";
import type { ScreenState } from "./types/screen";
import { GameCanvas, GameHUD, GameOver, Menu, PauseScreen } from "./ui";
import Scorecard from "./ui/components/Scorecard";

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>("menu");
  const [gameStats, setGameStats] = useState({
    score: 0,
    wave: 1,
    timeAlive: 0,
  });

  const engine = GameEngine.getInstance();

  // Monitor game state changes
  useEffect(() => {
    const checkGameStatus = setInterval(() => {
      const state = engine.getGameState();

      // Atualiza stats
      setGameStats({
        score: state.score,
        wave: state.wave,
        timeAlive: state.timeAlive,
      });

      // Detecta se o jogo terminou
      if (screen === "playing" && !state.isRunning) {
        setScreen("gameOver");
      }
    }, 100);

    return () => clearInterval(checkGameStatus);
  }, [screen, engine]);

  // Handle ESC key for pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (screen === "playing") {
          setScreen("paused");
        } else if (screen === "paused") {
          setScreen("playing");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen]);

  const handleStartGame = useCallback(() => {
    engine.reset();
    setScreen("playing");
  }, [engine]);

  const handleResumeGame = useCallback(() => {
    setScreen("playing");
  }, []);

  const handleGoToMenu = useCallback(() => {
    engine.reset();
    setScreen("menu");
  }, [engine]);

  const handleRetry = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  const gameState = engine.getGameState();

  return (
    <>
      {screen === "menu" && <Menu onStartGame={handleStartGame} />}

      {(screen === "playing" || screen === "paused" || screen === "gameOver") && (
        <>
          <Scorecard />
          <GameCanvas isPaused={screen === "paused"} />
          {screen === "playing" && <GameHUD gameState={gameState} />}
        </>
      )}

      {screen === "paused" && (
        <PauseScreen
          onResume={handleResumeGame}
          onMainMenu={handleGoToMenu}
        />
      )}

      {screen === "gameOver" && (
        <GameOver
          score={gameStats.score}
          wave={gameStats.wave}
          timeAlive={gameStats.timeAlive}
          onMainMenu={handleGoToMenu}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

export default App;
