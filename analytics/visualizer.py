"""
Visualizações de dados de gameplay
Gera gráficos e relatórios em PNG/HTML
"""
import logging
from pathlib import Path
import matplotlib
matplotlib.use('Agg')  # Use backend não-interativo
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns
import numpy as np
from datetime import datetime
from analyzer import GameplayAnalyzer
from database import ScoreDatabase
from config import CHARTS_DIR, FIGURE_SIZE, FIGURE_DPI, COLOR_PALETTE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Estilo
plt.style.use("seaborn-v0_8-darkgrid")
sns.set_palette(COLOR_PALETTE)


class GameplayVisualizer:
    """Cria visualizações dos dados de gameplay"""

    def __init__(self, analyzer: GameplayAnalyzer = None):
        self.analyzer = analyzer or GameplayAnalyzer()
        logger.info(f"Visualizador inicializado com {len(self.analyzer.scores)} scores")

    def plot_score_distribution(self, save: bool = True) -> str:
        """Cria gráfico de distribuição de scores"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=FIGURE_SIZE, dpi=FIGURE_DPI)

        scores = [s.score for s in self.analyzer.scores]

        # Histograma
        ax1.hist(scores, bins=30, color="#00ff00", alpha=0.7, edgecolor="black")
        ax1.set_xlabel("Score", fontsize=12, fontweight="bold")
        ax1.set_ylabel("Frequência", fontsize=12, fontweight="bold")
        ax1.set_title("Distribuição de Scores", fontsize=14, fontweight="bold")
        ax1.grid(True, alpha=0.3)

        # Box plot
        bp = ax2.boxplot(scores, vert=True, patch_artist=True)
        for patch in bp["boxes"]:
            patch.set_facecolor("#ffff00")
        ax2.set_ylabel("Score", fontsize=12, fontweight="bold")
        ax2.set_title("Score - Estatísticas", fontsize=14, fontweight="bold")
        ax2.grid(True, alpha=0.3, axis="y")

        plt.tight_layout()
        path = CHARTS_DIR / "score_distribution.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def plot_wave_analysis(self, save: bool = True) -> str:
        """Cria gráfico de análise de waves"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=FIGURE_SIZE, dpi=FIGURE_DPI)

        waves = [s.wave for s in self.analyzer.scores]
        wave_progression = self.analyzer.get_wave_progression()

        # Histograma de waves
        ax1.hist(waves, bins=max(waves) if waves else 10, color="#00aaff", alpha=0.7, edgecolor="black")
        ax1.set_xlabel("Wave", fontsize=12, fontweight="bold")
        ax1.set_ylabel("Frequência", fontsize=12, fontweight="bold")
        ax1.set_title("Distribuição de Waves Alcançadas", fontsize=14, fontweight="bold")
        ax1.grid(True, alpha=0.3)

        # Progresso do score por wave
        if wave_progression:
            waves_list = sorted(wave_progression.keys())
            scores_list = [wave_progression[w] for w in waves_list]
            ax2.plot(waves_list, scores_list, marker="o", linewidth=2.5, color="#ff00ff", markersize=8)
            ax2.fill_between(waves_list, scores_list, alpha=0.3, color="#ff00ff")
            ax2.set_xlabel("Wave", fontsize=12, fontweight="bold")
            ax2.set_ylabel("Score Médio", fontsize=12, fontweight="bold")
            ax2.set_title("Score Médio por Wave", fontsize=14, fontweight="bold")
            ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        path = CHARTS_DIR / "wave_analysis.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def plot_survival_time(self, save: bool = True) -> str:
        """Cria gráfico de análise de tempo de sobrevivência"""
        times = [s.time_alive for s in self.analyzer.scores]

        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(
            2, 2, figsize=FIGURE_SIZE, dpi=FIGURE_DPI
        )

        # Histograma
        ax1.hist(times, bins=30, color="#ff6600", alpha=0.7, edgecolor="black")
        ax1.set_xlabel("Tempo (segundos)", fontsize=11, fontweight="bold")
        ax1.set_ylabel("Frequência", fontsize=11, fontweight="bold")
        ax1.set_title("Distribuição de Tempo de Jogo", fontsize=12, fontweight="bold")
        ax1.grid(True, alpha=0.3)

        # Box plot
        bp = ax2.boxplot(times, vert=True, patch_artist=True)
        for patch in bp["boxes"]:
            patch.set_facecolor("#99ff00")
        ax2.set_ylabel("Tempo (segundos)", fontsize=11, fontweight="bold")
        ax2.set_title("Tempo - Estatísticas", fontsize=12, fontweight="bold")
        ax2.grid(True, alpha=0.3, axis="y")

        # CDF (Cumulative Distribution)
        sorted_times = np.sort(times)
        cdf = np.arange(1, len(sorted_times) + 1) / len(sorted_times)
        ax3.plot(sorted_times, cdf, linewidth=2.5, color="#00ffff")
        ax3.fill_between(sorted_times, cdf, alpha=0.3, color="#00ffff")
        ax3.set_xlabel("Tempo (segundos)", fontsize=11, fontweight="bold")
        ax3.set_ylabel("Probabilidade Acumulada", fontsize=11, fontweight="bold")
        ax3.set_title("CDF - Distribuição Acumulada", fontsize=12, fontweight="bold")
        ax3.grid(True, alpha=0.3)

        # Estatísticas texto
        min_time, avg_time, med_time, max_time = self.analyzer.get_survival_time_analysis()
        stats_text = f"""Tempo de Sobrevivência (segundos)

Mínimo: {min_time:.1f}s
Média: {avg_time:.1f}s
Mediana: {med_time:.1f}s
Máximo: {max_time:.1f}s
Desvio Padrão: {np.std(times):.1f}s
        """
        ax4.text(0.1, 0.5, stats_text, fontsize=11, verticalalignment="center",
                bbox=dict(boxstyle="round", facecolor="#1a1a1a", alpha=0.9, edgecolor="#00ffff", linewidth=2),
                family="monospace", color="#00ffff")
        ax4.axis("off")

        plt.tight_layout()
        path = CHARTS_DIR / "survival_time.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def plot_top_players(self, limit: int = 10, save: bool = True) -> str:
        """Cria gráfico dos top players"""
        top_players = self.analyzer.get_top_players(limit)

        if not top_players:
            logger.warning("Sem dados de top players")
            return ""

        names = [p[0][:15] for p in top_players]  # Truncar nomes longos
        best_scores = [p[1] for p in top_players]
        avg_scores = [p[2] for p in top_players]

        fig, ax = plt.subplots(figsize=(12, 8), dpi=FIGURE_DPI)

        x = np.arange(len(names))
        width = 0.35

        bars1 = ax.bar(x - width / 2, best_scores, width, label="Melhor Score", color="#ff0000", alpha=0.8)
        bars2 = ax.bar(x + width / 2, avg_scores, width, label="Score Médio", color="#ffff00", alpha=0.8)

        ax.set_xlabel("Jogador", fontsize=12, fontweight="bold")
        ax.set_ylabel("Score", fontsize=12, fontweight="bold")
        ax.set_title("Top 10 Jogadores", fontsize=14, fontweight="bold")
        ax.set_xticks(x)
        ax.set_xticklabels(names, rotation=45, ha="right")
        ax.legend(fontsize=11)
        ax.grid(True, alpha=0.3, axis="y")

        plt.tight_layout()
        path = CHARTS_DIR / "top_players.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def plot_score_vs_wave(self, save: bool = True) -> str:
        """Cria gráfico de correlação Score x Wave"""
        scores = [s.score for s in self.analyzer.scores]
        waves = [s.wave for s in self.analyzer.scores]

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=FIGURE_SIZE, dpi=FIGURE_DPI)

        # Scatter plot
        scatter = ax1.scatter(waves, scores, alpha=0.6, s=100, c=scores, cmap="plasma")
        ax1.set_xlabel("Wave Alcançada", fontsize=12, fontweight="bold")
        ax1.set_ylabel("Score", fontsize=12, fontweight="bold")
        ax1.set_title("Score vs Wave Alcançada", fontsize=14, fontweight="bold")
        ax1.grid(True, alpha=0.3)
        cbar = plt.colorbar(scatter, ax=ax1)
        cbar.set_label("Score", fontsize=11)

        # Correlação
        correlation = self.analyzer.get_correlation_score_wave()
        density_text = f"Correlação: {correlation:.3f}"
        ax2.text(0.5, 0.5, density_text, fontsize=16, ha="center", va="center",
                bbox=dict(boxstyle="round", facecolor="#1a1a1a", alpha=0.9, edgecolor="#00ffff", linewidth=2),
                family="monospace", color="#00ffff", fontweight="bold")
        ax2.axis("off")

        plt.tight_layout()
        path = CHARTS_DIR / "score_vs_wave.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def plot_death_rate_curve(self, save: bool = True) -> str:
        """Cria gráfico da taxa de morte por wave"""
        death_rates = self.analyzer.get_death_rate_by_wave()

        if not death_rates:
            logger.warning("Sem dados de taxa de morte")
            return ""

        waves = sorted(death_rates.keys())
        rates = [death_rates[w] for w in waves]

        fig, ax = plt.subplots(figsize=(12, 7), dpi=FIGURE_DPI)

        ax.plot(waves, rates, marker="o", linewidth=2.5, color="#ff0000", markersize=8)
        ax.fill_between(waves, rates, alpha=0.3, color="#ff0000")
        ax.set_xlabel("Wave", fontsize=12, fontweight="bold")
        ax.set_ylabel("Taxa de Morte (%)", fontsize=12, fontweight="bold")
        ax.set_title("Taxa de Morte por Wave", fontsize=14, fontweight="bold")
        ax.grid(True, alpha=0.3)
        ax.set_ylim(0, 100)

        plt.tight_layout()
        path = CHARTS_DIR / "death_rate_curve.png"
        plt.savefig(path, dpi=FIGURE_DPI, bbox_inches="tight")
        plt.close()
        logger.info(f"Gráfico salvo: {path}")
        return str(path)

    def generate_all_visualizations(self) -> None:
        """Gera todas as visualizações"""
        logger.info("Gerando todas as visualizações...")
        self.plot_score_distribution()
        self.plot_wave_analysis()
        self.plot_survival_time()
        self.plot_top_players()
        self.plot_score_vs_wave()
        self.plot_death_rate_curve()
        logger.info(f"Visualizações salvas em: {CHARTS_DIR}")
