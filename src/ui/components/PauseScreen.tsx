import type React from "react";
import type { ScreenContextType } from "../../types/screen";

interface PauseScreenProps {
  onResume: ScreenContextType["resumeGame"];
  onMainMenu: ScreenContextType["goToMenu"];
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onMainMenu }) => {
  return (
    <div className="pause-overlay">
      <div className="pause-content">
        <h1 className="pause-title">PAUSADO</h1>

        <div className="pause-tips">
          <p>Jogo em pausa</p>
          <p className="tip-small">Pressione ESC para retomar</p>
        </div>

        <div className="pause-buttons">
          <button className="button primary-button" onClick={onResume}>
            ▶ Retomar (ESC)
          </button>
          <button className="button secondary-button" onClick={onMainMenu}>
            ↶ Menu Principal
          </button>
        </div>

        <div className="pause-shortcuts">
          <p>
            <kbd>W A S D</kbd> - Mover
          </p>
          <p>
            <kbd>Mouse</kbd> - Apontar e Atirar
          </p>
          <p>
            <kbd>R</kbd> - Reiniciar
          </p>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
