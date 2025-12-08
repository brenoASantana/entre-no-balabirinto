import { useEffect, useRef } from "react";
import { getAudioGenerator } from "../core";

/**
 * Hook para gerenciar áudio do jogo
 * Inicia música de fundo e toca efeitos sonoros
 */
export const useAudio = () => {
  const audioRef = useRef(getAudioGenerator());
  const backgroundMusicStartedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;

    // Inicia música de fundo (uma única vez)
    if (!backgroundMusicStartedRef.current) {
      // Web Audio API requer user interaction em alguns browsers
      const startBackgroundMusic = () => {
        audio.play();
        backgroundMusicStartedRef.current = true;
        // Remove listener após primeira interação
        document.removeEventListener("click", startBackgroundMusic);
        document.removeEventListener("keydown", startBackgroundMusic);
      };

      // Se ainda não houver interação, aguarda clique ou tecla
      document.addEventListener("click", startBackgroundMusic);
      document.addEventListener("keydown", startBackgroundMusic);
    }

    // Cleanup
    return () => {
      // Não para a música ao desmontar - continua em loop
    };
  }, []);

  return {
    playShootSound: () => audioRef.current.playShootSound(),
    playHitSound: () => audioRef.current.playHitSound(),
    playDeathSound: () => audioRef.current.playDeathSound(),
    setVolume: (volume: number) => audioRef.current.setVolume(volume),
    getVolume: () => audioRef.current.getVolume(),
  };
};
