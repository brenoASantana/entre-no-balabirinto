/**
 * Serviço para integração com a API do Leaderboard em Go
 * Responsável por fazer requisições REST para o backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Interfaces para tipagem
export interface GameScoreRequest {
  playerName: string;
  score: number;
  wave: number;
  timeAlive: number;
}

export interface GameScoreResponse {
  id: number;
  playerName: string;
  score: number;
  wave: number;
  timeAlive: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  wave: number;
  timeAlive: number;
  createdAt: string;
}

export interface LeaderboardStats {
  totalScores: number;
  averageScore: number;
  highestScore: number;
  averageWave: number;
  averageTimeAlive: number;
  topPlayer: string;
}

export interface PlayerStats {
  playerName: string;
  totalGames: number;
  bestScore: number;
  averageScore: number;
  bestWave: number;
  averageWave: number;
  ranking: number;
  topScores: GameScoreResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  totalPlayers: number;
}

/**
 * Verifica se a API está disponível
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    console.warn("⚠️ API health check failed");
    return false;
  }
}

/**
 * Salva um score no leaderboard
 */
export async function saveScore(
  scoreData: GameScoreRequest
): Promise<ApiResponse<GameScoreResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error saving score:", error);
    return {
      success: false,
      message: "Failed to save score to server",
      error: String(error),
    };
  }
}

/**
 * Busca o leaderboard global
 */
export async function getLeaderboard(
  limit: number = 10
): Promise<ApiResponse<LeaderboardEntry[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/leaderboard?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return {
      success: false,
      message: "Failed to fetch leaderboard",
      error: String(error),
    };
  }
}

/**
 * Busca estatísticas do leaderboard
 */
export async function getLeaderboardStats(): Promise<
  ApiResponse<LeaderboardStats>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching leaderboard stats:", error);
    return {
      success: false,
      message: "Failed to fetch leaderboard stats",
      error: String(error),
    };
  }
}

/**
 * Busca leaderboard filtrado por wave mínimo
 */
export async function getLeaderboardByWave(
  minWave: number,
  limit: number = 10
): Promise<ApiResponse<LeaderboardEntry[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/leaderboard/wave?minWave=${minWave}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching leaderboard by wave:", error);
    return {
      success: false,
      message: "Failed to fetch leaderboard by wave",
      error: String(error),
    };
  }
}

/**
 * Busca estatísticas de um jogador específico
 */
export async function getPlayerStats(
  playerName: string
): Promise<ApiResponse<PlayerStats>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/player/${encodeURIComponent(playerName)}/stats`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching player stats:", error);
    return {
      success: false,
      message: "Failed to fetch player stats",
      error: String(error),
    };
  }
}
