import { useCallback, useEffect, useState } from "react";
import {
    getLeaderboard,
    getLeaderboardStats,
    getPlayerStats,
    healthCheck,
    saveScore,
    type GameScoreRequest,
    type LeaderboardEntry,
    type LeaderboardStats,
    type PlayerStats,
} from "../services/leaderboardService";

/**
 * Hook para gerenciar leaderboard e scores
 * Fornece funções para salvar e buscar dados do leaderboard
 */
export function useLeaderboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Verifica se API está online na montagem
  useEffect(() => {
    const checkHealth = async () => {
      const online = await healthCheck();
      setIsOnline(online);
      if (!online) {
        console.warn("⚠️ Leaderboard API não está disponível");
      }
    };

    checkHealth();
  }, []);

  const savingScore = useCallback(
    async (scoreData: GameScoreRequest) => {
      if (!isOnline) {
        console.warn("⚠️ API não está disponível, score não foi salvo");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await saveScore(scoreData);
        if (!response.success) {
          setError(response.message || "Erro ao salvar score");
          return null;
        }
        return response.data || null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline]
  );

  const fetchLeaderboard = useCallback(
    async (limit: number = 10) => {
      if (!isOnline) {
        console.warn("⚠️ API não está disponível");
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getLeaderboard(limit);
        if (!response.success) {
          setError(response.message || "Erro ao buscar leaderboard");
          return [];
        }
        return (response.data as LeaderboardEntry[]) || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline]
  );

  const fetchLeaderboardStats = useCallback(async () => {
    if (!isOnline) {
      console.warn("⚠️ API não está disponível");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getLeaderboardStats();
      if (!response.success) {
        setError(response.message || "Erro ao buscar stats");
        return null;
      }
      return (response.data as LeaderboardStats) || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  const fetchPlayerStats = useCallback(
    async (playerName: string) => {
      if (!isOnline) {
        console.warn("⚠️ API não está disponível");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getPlayerStats(playerName);
        if (!response.success) {
          setError(response.message || "Erro ao buscar stats do jogador");
          return null;
        }
        return (response.data as PlayerStats) || null;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline]
  );

  return {
    isLoading,
    error,
    isOnline,
    savingScore,
    fetchLeaderboard,
    fetchLeaderboardStats,
    fetchPlayerStats,
  };
}
