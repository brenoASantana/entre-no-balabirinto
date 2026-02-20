export type ScreenState = "menu" | "playing" | "paused" | "gameOver";

export interface ScreenContextType {
  currentScreen: ScreenState;
  goToMenu: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
}
