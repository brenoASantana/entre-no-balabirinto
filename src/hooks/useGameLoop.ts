import { useEffect, useRef } from "react";
import { GameEngine } from "../core";

interface UseGameLoopParams {
  onUpdate: (deltaTime: number) => void;
  onDraw: (deltaTime: number) => void;
}

/**
 * Hook que executa um game loop robusto com requestAnimationFrame
 * Separação clara entre update() e draw()
 * Passa deltaTime para ambas as funções
 */
export const useGameLoop = ({ onUpdate, onDraw }: UseGameLoopParams) => {
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const engine = GameEngine.getInstance();
    let lastTime = 0;

    const gameLoop = (currentTime: number) => {
      const deltaTime = lastTime === 0 ? 0 : (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update lógica do jogo
      engine.update(deltaTime);
      onUpdate(deltaTime);

      // Draw renderização
      onDraw(deltaTime);

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [onUpdate, onDraw]);
};
