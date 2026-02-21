#!/usr/bin/env python3
"""
Script principal de analytics
Executa análises e gera relatórios de gameplay
"""
import logging
from datetime import datetime
from pathlib import Path
from database import ScoreDatabase
from analyzer import GameplayAnalyzer
from visualizer import GameplayVisualizer
from config import OUTPUT_DIR, CHARTS_DIR

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)


def format_stat(label: str, value, unit: str = "") -> str:
    """Formata uma estatística para HTML"""
    if isinstance(value, float):
        return f"<tr><td><strong>{label}:</strong></td><td>{value:.2f} {unit}</td></tr>"
    else:
        return f"<tr><td><strong>{label}:</strong></td><td>{value} {unit}</td></tr>"


class AnalyticsReportGenerator:
    """Gera relatórios de analytics em HTML"""

    def __init__(self):
        self.db = ScoreDatabase()
        self.analyzer = GameplayAnalyzer(self.db)
        self.visualizer = GameplayVisualizer(self.analyzer)

    def generate_html_report(self) -> str:
        """Gera relatório HTML completo"""
        logger.info("Gerando relatório HTML...")

        metrics = self.analyzer.get_overall_metrics()
        session_summary = self.analyzer.get_play_session_summary()
        score_dist = self.analyzer.get_score_distribution()
        survival_analysis = self.analyzer.get_survival_time_analysis()

        html_content = f"""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Analytics - Entre no Balabirinto</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
            color: #e0e0e0;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
            padding: 20px;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(20, 20, 40, 0.95);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.3);
        }}

        h1 {{
            text-align: center;
            color: #00ff00;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        }}

        .timestamp {{
            text-align: center;
            color: #aaa;
            margin-bottom: 30px;
            font-size: 0.9em;
        }}

        h2 {{
            color: #ffff00;
            border-bottom: 2px solid #ffff00;
            padding-bottom: 10px;
            margin-top: 30px;
            margin-bottom: 20px;
            font-size: 1.8em;
        }}

        .metrics-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}

        .metric-box {{
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #00aaff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 15px rgba(0, 170, 255, 0.3);
        }}

        .metric-box h3 {{
            color: #00aaff;
            margin-bottom: 15px;
            font-size: 1.2em;
        }}

        .metric-box table {{
            width: 100%;
            border-collapse: collapse;
        }}

        .metric-box td {{
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 170, 255, 0.2);
        }}

        .metric-box td:first-child {{
            color: #aaa;
        }}

        .metric-box td:last-child {{
            color: #fff;
            font-weight: bold;
            text-align: right;
        }}

        .chart-section {{
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #ff00ff;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
        }}

        .chart-section h3 {{
            color: #ff00ff;
            margin-bottom: 15px;
        }}

        .chart-section img {{
            max-width: 100%;
            height: auto;
            border-radius: 5px;
        }}

        .top-players {{
            background: rgba(0, 0, 0, 0.5);
            border: 2px solid #ff6600;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 0 15px rgba(255, 102, 0, 0.3);
        }}

        .top-players h3 {{
            color: #ff6600;
            margin-bottom: 15px;
        }}

        .top-players table {{
            width: 100%;
            border-collapse: collapse;
        }}

        .top-players th {{
            background: rgba(255, 102, 0, 0.2);
            color: #ff6600;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #ff6600;
        }}

        .top-players td {{
            padding: 10px 12px;
            border-bottom: 1px solid rgba(255, 102, 0, 0.2);
        }}

        .top-players tr:nth-child(even) {{
            background: rgba(255, 102, 0, 0.05);
        }}

        .conclusion {{
            background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(100, 200, 0, 0.1));
            border: 2px solid #00ff00;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
            color: #00ff00;
        }}

        .conclusion h3 {{
            color: #ffff00;
            margin-bottom: 15px;
        }}

        .bar {{
            display: inline-block;
            height: 20px;
            background: #00ff00;
            margin: 3px 0;
            border-radius: 3px;
            min-width: 50px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Relatório de Analytics</h1>
        <h1>Entre no Balabirinto</h1>
        <div class="timestamp">
            Gerado em: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}
        </div>

        <!-- Métrica Geral -->
        <h2>📈 Métricas Gerais</h2>
        <div class="metrics-grid">
            <div class="metric-box">
                <h3>Estatísticas Gerais</h3>
                <table>
                    {format_stat("Total de Jogos", metrics.total_games)}
                    {format_stat("Total de Jogadores", metrics.total_players)}
                    {format_stat("Média de Jogos/Jogador", metrics.scores_per_player, "jogos")}
                </table>
            </div>

            <div class="metric-box">
                <h3>Distribuição de Scores</h3>
                <table>
                    {format_stat("Score Médio", metrics.average_score, "pontos")}
                    {format_stat("Score Mediano", metrics.median_score, "pontos")}
                    {format_stat("Desvio Padrão", metrics.std_dev_score, "pontos")}
                </table>
            </div>

            <div class="metric-box">
                <h3>Progresso (Waves)</h3>
                <table>
                    {format_stat("Wave Média", metrics.average_wave, "waves")}
                    {format_stat("Wave Mediana", metrics.median_wave, "waves")}
                    {format_stat("Wave Mais Comum", metrics.most_popular_wave, "waves")}
                </table>
            </div>

            <div class="metric-box">
                <h3>Tempo de Sobrevivência</h3>
                <table>
                    {format_stat("Tempo Médio", metrics.average_survival_time, "segundos")}
                    {format_stat("Mínimo", survival_analysis[0], "segundos")}
                    {format_stat("Máximo", survival_analysis[3], "segundos")}
                </table>
            </div>
        </div>

        <!-- Distribuição de Scores -->
        <h2>🎯 Distribuição de Scores por Faixa</h2>
        <div class="metric-box">
            <table>
"""

        # Adicionar distribuição de scores
        for faixa, count in sorted(score_dist.items()):
            bar_width = (count / max(score_dist.values())) * 200 if score_dist.values() else 0
            html_content += f"""
                <tr>
                    <td><strong>{faixa}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="bar" style="width: {bar_width}px;"></div>
                            <span>{count}</span>
                        </div>
                    </td>
                </tr>
"""

        html_content += """
            </table>
        </div>

        <!-- Gráficos -->
        <h2>📊 Visualizações</h2>
"""

        # Adicionar imagens dos gráficos
        charts = [
            ("score_distribution.png", "Distribuição de Scores"),
            ("wave_analysis.png", "Análise de Waves"),
            ("survival_time.png", "Tempo de Sobrevivência"),
            ("score_vs_wave.png", "Correlação Score vs Wave"),
            ("death_rate_curve.png", "Taxa de Morte por Wave"),
            ("top_players.png", "Top 10 Jogadores"),
        ]

        for chart_file, chart_title in charts:
            chart_path = CHARTS_DIR / chart_file
            if chart_path.exists():
                html_content += f"""
        <div class="chart-section">
            <h3>{chart_title}</h3>
            <img src="charts/{chart_file}" alt="{chart_title}">
        </div>
"""

        # Top Players
        top_players = self.analyzer.get_top_players(10)
        if top_players:
            html_content += """
        <div class="top-players">
            <h3>🏆 Top 10 Jogadores</h3>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Jogador</th>
                        <th>Melhor Score</th>
                        <th>Score Médio</th>
                    </tr>
                </thead>
                <tbody>
"""
            for i, (name, best_score, avg_score) in enumerate(top_players, 1):
                html_content += f"""
                    <tr>
                        <td>#{i}</td>
                        <td>{name}</td>
                        <td>{best_score:,}</td>
                        <td>{avg_score:,}</td>
                    </tr>
"""
            html_content += """
                </tbody>
            </table>
        </div>
"""

        # Conclusão
        html_content += f"""
        <div class="conclusion">
            <h3>📝 Análise Geral</h3>
            <p>
                Este relatório contém análises detalhadas dos padrões de gameplay do jogo "Entre no Balabirinto".
                Com um total de <strong>{metrics.total_games}</strong> partidas jogadas por
                <strong>{metrics.total_players}</strong> jogadores únicos, conseguimos identificar trends importantes
                no desempenho e dificuldade do jogo.
            </p>
            <br>
            <p>
                <strong>Score Médio:</strong> {metrics.average_score:.0f} pontos<br>
                <strong>Wave Média Alcançada:</strong> {metrics.average_wave:.1f} waves<br>
                <strong>Tempo de Sobrevivência Médio:</strong> {metrics.average_survival_time:.0f} segundos
            </p>
        </div>
    </div>
</body>
</html>
"""

        # Salvar arquivo HTML
        html_path = OUTPUT_DIR / "analytics_report.html"
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        logger.info(f"Relatório HTML salvo: {html_path}")
        return str(html_path)


def main():
    """Função principal"""
    logger.info("=" * 60)
    logger.info("INICIANDO SISTEMA DE ANALYTICS")
    logger.info("=" * 60)

    try:
        # Inicializar gerador de relatórios
        report_gen = AnalyticsReportGenerator()

        # Verificar se há dados
        if len(report_gen.analyzer.scores) == 0:
            logger.warning("⚠️  Nenhum score encontrado no banco de dados!")
            logger.info("Execute o jogo primeiro para gerar dados de análise.")
            logger.info(f"Banco de dados esperado em: {report_gen.db.db_path}")
            return

        logger.info(f"✅ Carregados {len(report_gen.analyzer.scores)} scores")

        # Gerar visualizações
        logger.info("Gerando visualizações...")
        report_gen.visualizer.generate_all_visualizations()

        # Gerar relatório HTML
        logger.info("Gerando relatório HTML...")
        html_report = report_gen.generate_html_report()

        logger.info("=" * 60)
        logger.info("✅ ANALYTICS COMPLETADO COM SUCESSO!")
        logger.info("=" * 60)
        logger.info(f"📊 Relatório: {html_report}")
        logger.info(f"📁 Gráficos: {CHARTS_DIR}")
        logger.info("")
        logger.info("Para visualizar o relatório complete, abra:")
        logger.info(f"  {html_report}")

    except Exception as e:
        logger.error(f"❌ Erro ao gerar analytics: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
