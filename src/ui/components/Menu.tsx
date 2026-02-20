import type React from "react";
import type { ScreenContextType } from "../../types/screen";

interface MenuProps {
  onStartGame: ScreenContextType["startGame"];
}

const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="menu-title">
          <span className="title-accent">⚔️</span>
          ENTRE NO BALABIRINTO
          <span className="title-accent">⚔️</span>
        </h1>

        <p className="menu-subtitle">Um Bullet Hell Inspirado em Enter the Gungeon</p>

        <div className="menu-stats">
          <div className="stat-card">
            <h3>🎮 Controles</h3>
            <ul>
              <li>
                <kbd>W</kbd>
                <span>Cima</span>
              </li>
              <li>
                <kbd>A</kbd>
                <span>Esquerda</span>
              </li>
              <li>
                <kbd>S</kbd>
                <span>Baixo</span>
              </li>
              <li>
                <kbd>D</kbd>
                <span>Direita</span>
              </li>
              <li>
                <kbd>Mouse</kbd>
                <span>Apontar e Atirar</span>
              </li>
              <li>
                <kbd>ESC</kbd>
                <span>Pausar</span>
              </li>
              <li>
                <kbd>R</kbd>
                <span>Reiniciar</span>
              </li>
            </ul>
          </div>

          <div className="stat-card">
            <h3>⭐ Objetivos</h3>
            <ul>
              <li>Sobreviva o máximo de tiempo</li>
              <li>Derrote inimigos em waves</li>
              <li>Colete armas especiais</li>
              <li>Alcance o maior score</li>
            </ul>
          </div>

          <div className="stat-card">
            <h3>💡 Dicas</h3>
            <ul>
              <li>Movimento é sua melhor defesa</li>
              <li>Colete armas para mudar tática</li>
              <li>Waves aumentam em dificuldade</li>
              <li>Cada inimigo derrotado vale pontos</li>
            </ul>
          </div>
        </div>

        <button className="menu-button play-button" onClick={onStartGame}>
          <span className="button-text">▶ JOGAR</span>
        </button>

        <p className="menu-footer">Criado com React + TypeScript + Canvas 2D</p>
      </div>
    </div>
  );
};

export default Menu;
