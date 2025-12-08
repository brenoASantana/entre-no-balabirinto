/**
 * Este componente não é mais necessário.
 * A renderização do jogador é feita diretamente no GameCanvas via Canvas 2D API.
 * Deixado como referência para componentes React tradicionais.
 */

import React from 'react';

const Player: React.FC = () => {
  return null;
};

export default Player;

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Player;