import { useEffect, useRef } from "react";
import { GameEngine } from "../core";

/**
 * Hook para configurar event listeners do mouse
 * Atualiza a posição do mouse e estado de clique no Game Engine
 * Com conversão correta de coordenadas para o canvas
 */
export const useMouse = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Encontra o canvas no documento
    const canvas = document.querySelector("canvas");
    canvasRef.current = canvas;

    const engine = GameEngine.getInstance();

    const handleMouseMove = (event: MouseEvent) => {
      // Se encontrou o canvas, calcula a posição relativa ao canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Apenas atualiza se estiver dentro do canvas
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          engine.updateMousePosition({
            x,
            y,
          });
        }
      } else {
        // Fallback se não encontrou canvas
        engine.updateMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
      }
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
