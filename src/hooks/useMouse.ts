import { useEffect } from "react";
import { GameEngine } from "../core";

/**
 * Hook para configurar event listeners do mouse
 * Atualiza a posição do mouse e estado de clique no Game Engine
 */
export const useMouse = () => {
  useEffect(() => {
    const engine = GameEngine.getInstance();

    const handleMouseMove = (event: MouseEvent) => {
      engine.updateMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleMouseDown = () => {
      engine.setMousePressed(true);
    };

    const handleMouseUp = () => {
      engine.setMousePressed(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
};
