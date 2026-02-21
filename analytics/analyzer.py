"""
Análises estatísticas de padrões de gameplay
Extrai insights dos dados de scores e gameplay
"""
import logging
from typing import Dict, List, Tuple
from dataclasses import dataclass
import numpy as np
from database import ScoreDatabase, GameScore
from config import WAVE_THRESHOLDS, SCORE_THRESHOLDS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PlayerStats:
    """Estatísticas de um jogador"""
    player_name: str
    total_games: int
    total_score: int
    average_score: float
    best_score: int
    worst_score: int
    best_wave: int
    average_wave: float
    total_time: float
    average_time: float
    win_rate: float
    skill_level: str


@dataclass
class GameplayMetrics:
    """Métricas gerais de gameplay"""
    total_games: int
    total_players: int
    average_score: float
    median_score: float
    std_dev_score: float
    average_wave: float
    median_wave: float
    average_survival_time: float
    scores_per_player: float
    most_popular_wave: int


class GameplayAnalyzer:
    """Analisa padrões de gameplay do jogo"""

    def __init__(self, db: ScoreDatabase = None):
        self.db = db or ScoreDatabase()
        self.scores = self.db.get_all_scores()
        logger.info(f"Carregados {len(self.scores)} scores do banco de dados")

    def get_overall_metrics(self) -> GameplayMetrics:
        """Calcula métricas gerais de gameplay"""
        if not self.scores:
            logger.warning("Sem scores disponíveis para análise")
            return GameplayMetrics(
                total_games=0, total_players=0, average_score=0,
                median_score=0, std_dev_score=0, average_wave=0,
                median_wave=0, average_survival_time=0, scores_per_player=0,
                most_popular_wave=0
            )

        scores_list = [s.score for s in self.scores]
        waves_list = [s.wave for s in self.scores]
        times_list = [s.time_alive for s in self.scores]

        total_players = self.db.get_player_count()
        unique_players = self.db.get_unique_players()

        return GameplayMetrics(
            total_games=len(self.scores),
            total_players=total_players,
            average_score=float(np.mean(scores_list)),
            median_score=float(np.median(scores_list)),
            std_dev_score=float(np.std(scores_list)),
            average_wave=float(np.mean(waves_list)),
            median_wave=float(np.median(waves_list)),
            average_survival_time=float(np.mean(times_list)),
            scores_per_player=len(self.scores) / total_players if total_players > 0 else 0,
            most_popular_wave=int(np.median(waves_list)),
        )

    def get_player_stats(self, player_name: str) -> PlayerStats:
        """Calcula estatísticas para um jogador específico"""
        player_scores = self.db.get_scores_by_player(player_name)

        if not player_scores:
            logger.warning(f"Sem dados para jogador: {player_name}")
            return PlayerStats(
                player_name=player_name, total_games=0, total_score=0,
                average_score=0, best_score=0, worst_score=0, best_wave=0,
                average_wave=0, total_time=0, average_time=0, win_rate=0,
                skill_level="UNKNOWN"
            )

        scores = [s.score for s in player_scores]
        waves = [s.wave for s in player_scores]
        times = [s.time_alive for s in player_scores]

        best_score = max(scores)
        worst_score = min(scores)
        best_wave = max(waves)
        average_wave = float(np.mean(waves))
        total_time = sum(times)
        average_time = float(np.mean(times))

        # Calcular win_rate (games com score > median)
        median_score = float(np.median(scores))
        wins = sum(1 for s in scores if s > median_score)
        win_rate = (wins / len(scores)) * 100 if scores else 0

        skill_level = self._classify_skill_level(best_score, best_wave)

        return PlayerStats(
            player_name=player_name,
            total_games=len(player_scores),
            total_score=sum(scores),
            average_score=float(np.mean(scores)),
            best_score=best_score,
            worst_score=worst_score,
            best_wave=best_wave,
            average_wave=average_wave,
            total_time=total_time,
            average_time=average_time,
            win_rate=win_rate,
            skill_level=skill_level,
        )

    def get_all_players_stats(self) -> List[PlayerStats]:
        """Retorna estatísticas de todos os jogadores"""
        players = self.db.get_unique_players()
        return [self.get_player_stats(p) for p in players]

    def _classify_skill_level(self, best_score: int, best_wave: int) -> str:
        """Classifica nível de skill baseado em score e wave"""
        if best_score >= SCORE_THRESHOLDS["diamond"] or best_wave >= 20:
            return "GODLIKE"
        elif best_score >= SCORE_THRESHOLDS["platinum"] or best_wave >= 15:
            return "EXPERT"
        elif best_score >= SCORE_THRESHOLDS["gold"] or best_wave >= 10:
            return "ADVANCED"
        elif best_score >= SCORE_THRESHOLDS["silver"] or best_wave >= 6:
            return "INTERMEDIATE"
        elif best_score >= SCORE_THRESHOLDS["bronze"] or best_wave >= 3:
            return "BEGINNER"
        else:
            return "NOVICE"

    def get_score_distribution(self) -> Dict[str, int]:
        """Retorna distribuição de scores por faixa"""
        distribution = {
            "0-1k": 0,
            "1k-5k": 0,
            "5k-10k": 0,
            "10k-20k": 0,
            "20k-50k": 0,
            "50k+": 0,
        }

        for score in self.scores:
            if score.score < 1000:
                distribution["0-1k"] += 1
            elif score.score < 5000:
                distribution["1k-5k"] += 1
            elif score.score < 10000:
                distribution["5k-10k"] += 1
            elif score.score < 20000:
                distribution["10k-20k"] += 1
            elif score.score < 50000:
                distribution["20k-50k"] += 1
            else:
                distribution["50k+"] += 1

        return distribution

    def get_wave_progression(self) -> Dict[int, float]:
        """Retorna taxa de sucesso por wave"""
        wave_data = {}
        for score in self.scores:
            if score.wave not in wave_data:
                wave_data[score.wave] = []
            wave_data[score.wave].append(score.score)

        return {
            wave: float(np.mean(scores)) for wave, scores in sorted(wave_data.items())
        }

    def get_survival_time_analysis(self) -> Tuple[float, float, float, float]:
        """Retorna análise de tempo de sobrevivência"""
        times = [s.time_alive for s in self.scores]
        if not times:
            return 0.0, 0.0, 0.0, 0.0

        return (
            float(np.min(times)),  # Mínimo
            float(np.mean(times)),  # Média
            float(np.median(times)),  # Mediana
            float(np.max(times)),  # Máximo
        )

    def get_difficulty_curve(self) -> Dict[str, float]:
        """Analisa a dificuldade esperada por wave"""
        curve = {}
        for score in self.scores:
            wave = score.wave
            if wave not in curve:
                curve[wave] = {"scores": [], "times": []}
            curve[wave]["scores"].append(score.score)
            curve[wave]["times"].append(score.time_alive)

        result = {}
        for wave in sorted(curve.keys()):
            data = curve[wave]
            avg_score = float(np.mean(data["scores"]))
            avg_time = float(np.mean(data["times"]))
            result[f"Wave {wave}"] = {
                "avg_score": avg_score,
                "avg_time": avg_time,
                "sample_size": len(data["scores"]),
            }

        return result

    def get_top_players(self, limit: int = 10) -> List[Tuple[str, int, int]]:
        """Retorna top jogadores por score"""
        players_scores = {}
        for score in self.scores:
            if score.player_name not in players_scores:
                players_scores[score.player_name] = []
            players_scores[score.player_name].append(score.score)

        # Calcular melhor score de cada jogador
        top_players = [
            (name, max(scores), sum(scores) // len(scores))
            for name, scores in players_scores.items()
        ]

        # Ordenar por melhor score
        top_players.sort(key=lambda x: x[1], reverse=True)
        return top_players[:limit]

    def get_death_rate_by_wave(self) -> Dict[int, float]:
        """Calcula taxa de morte (games que não completaram) por wave"""
        death_rates = {}
        max_actual_wave = max((s.wave for s in self.scores), default=0)

        for wave in range(1, max_actual_wave + 1):
            games_at_or_beyond = sum(
                1 for s in self.scores if s.wave >= wave
            )
            games_below = sum(1 for s in self.scores if s.wave < wave)

            if games_at_or_beyond == 0:
                death_rates[wave] = 0.0
            else:
                death_rates[wave] = (games_below / (games_at_or_beyond + games_below)) * 100

        return death_rates

    def get_correlation_score_wave(self) -> float:
        """Calcula correlação entre score e wave alcançada"""
        if len(self.scores) < 2:
            return 0.0

        scores = np.array([s.score for s in self.scores])
        waves = np.array([s.wave for s in self.scores])

        correlation = np.corrcoef(scores, waves)[0, 1]
        return float(correlation) if not np.isnan(correlation) else 0.0

    def get_play_session_summary(self) -> Dict:
        """Retorna resumo das sessões de jogo"""
        if not self.scores:
            return {}

        first_game = min(self.scores, key=lambda s: s.created_at)
        last_game = max(self.scores, key=lambda s: s.created_at)

        return {
            "first_game": first_game.created_at,
            "last_game": last_game.created_at,
            "total_games": len(self.scores),
            "total_unique_players": self.db.get_player_count(),
            "games_per_day_avg": len(self.scores) / max(1, self.db.get_player_count()),
        }
