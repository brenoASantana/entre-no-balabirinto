import { useEffect } from "react";
import { GameEngine } from "../core";

/**
 * Hook para configurar event listeners de teclado (WASD)
 * Armazena teclas pressionadas no Game Engine via useRef
 */
export const usePlayerMovement = () => {
  useEffect(() => {
    const engine = GameEngine.getInstance();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        engine.setKeyPressed(key as "w" | "a" | "s" | "d", true);
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        engine.setKeyPressed(key as "w" | "a" | "s" | "d", false);
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};
