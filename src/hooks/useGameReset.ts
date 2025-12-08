import { useEffect } from "react";
import { GameEngine } from "../core";

/**
 * Hook que permite reiniciar o jogo sem recarregar a página
 * Pressione 'R' para reiniciar
 */
export function useGameReset(): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        const engine = GameEngine.getInstance();
        engine.reset();
        console.log("🎮 Jogo reiniciado!");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
}
