export interface GameStats {
  score: number;
  timeAlive: number;
  wave: number;
  timestamp: number;
}

export interface StorageData {
  lastGame: GameStats | null;
  bestScore: GameStats | null;
  longestTime: GameStats | null;
}

const STORAGE_KEY = "balabirinto_stats";

/**
 * Obtém os dados de storage do localStorage
 */
export function getStorageData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        lastGame: null,
        bestScore: null,
        longestTime: null,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler storage:", error);
    return {
      lastGame: null,
      bestScore: null,
      longestTime: null,
    };
  }
}

/**
 * Salva os dados de uma partida
 */
export function saveGameStats(stats: GameStats): StorageData {
  const current = getStorageData();

  // Atualiza última partida
  current.lastGame = stats;

  // Atualiza melhor pontuação
  if (!current.bestScore || stats.score > current.bestScore.score) {
    current.bestScore = stats;
  }

  // Atualiza maior tempo
  if (!current.longestTime || stats.timeAlive > current.longestTime.timeAlive) {
    current.longestTime = stats;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error("Erro ao salvar storage:", error);
  }

  return current;
}

/**
 * Reseta o histórico (opcional)
 */
export function resetStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao resetar stats:", error);
  }
}
