#!/usr/bin/env python3
"""
Exemplo de uso do sistema de Analytics
Mostra como usar a biblioteca programaticamente
"""

from database import ScoreDatabase
from analyzer import GameplayAnalyzer
from visualizer import GameplayVisualizer


def example_basic_stats():
    """Exemplo 1: Estatísticas básicas"""
    print("\n" + "=" * 60)
    print("EXEMPLO 1: Estatísticas Básicas")
    print("=" * 60)

    db = ScoreDatabase()
    analyzer = GameplayAnalyzer(db)

    # Métricas gerais
    metrics = analyzer.get_overall_metrics()
    print(f"Total de Jogos: {metrics.total_games}")
    print(f"Total de Jogadores: {metrics.total_players}")
    print(f"Score Médio: {metrics.average_score:.0f}")
    print(f"Wave Média: {metrics.average_wave:.1f}")
    print(f"Tempo Médio de Sobrevivência: {metrics.average_survival_time:.0f}s")


def example_player_stats():
    """Exemplo 2: Estatísticas de jogador específico"""
    print("\n" + "=" * 60)
    print("EXEMPLO 2: Estatísticas de Jogador")
    print("=" * 60)

    db = ScoreDatabase()
    analyzer = GameplayAnalyzer(db)

    # Obter lista de jogadores
    players = db.get_unique_players()

    if players:
        player_name = players[0]
        stats = analyzer.get_player_stats(player_name)

        print(f"\nJogador: {stats.player_name}")
        print(f"Total de Jogos: {stats.total_games}")
        print(f"Melhor Score: {stats.best_score}")
        print(f"Score Médio: {stats.average_score:.0f}")
        print(f"Wave Máxima: {stats.best_wave}")
        print(f"Taxa de Vitória: {stats.win_rate:.1f}%")
        print(f"Nível de Skill: {stats.skill_level}")


def example_top_players():
    """Exemplo 3: Top 10 Jogadores"""
    print("\n" + "=" * 60)
    print("EXEMPLO 3: Top 10 Jogadores")
    print("=" * 60)

    db = ScoreDatabase()
    analyzer = GameplayAnalyzer(db)

    top_players = analyzer.get_top_players(10)

    if top_players:
        print(f"\n{'Rank':<5} {'Jogador':<20} {'Melhor Score':<15} {'Score Médio':<15}")
        print("-" * 55)
        for i, (name, best, avg) in enumerate(top_players, 1):
            print(f"{i:<5} {name:<20} {best:<15} {avg:<15}")


def example_score_distribution():
    """Exemplo 4: Distribuição de Scores"""
    print("\n" + "=" * 60)
    print("EXEMPLO 4: Distribuição de Scores por Faixa")
    print("=" * 60)

    analyzer = GameplayAnalyzer()
    dist = analyzer.get_score_distribution()

    for faixa, count in dist.items():
        bar = "██" * (count // 5)
        print(f"{faixa:>10} | {bar} {count}")


def example_wave_progression():
    """Exemplo 5: Progresso por Wave"""
    print("\n" + "=" * 60)
    print("EXEMPLO 5: Score Médio Progressivo por Wave")
    print("=" * 60)

    analyzer = GameplayAnalyzer()
    progression = analyzer.get_wave_progression()

    print(f"\n{'Wave':<8} {'Score Médio':<15}")
    print("-" * 23)
    for wave, score in sorted(progression.items())[:10]:  # Primeiras 10 waves
        print(f"{wave:<8} {score:>10.0f}")


def example_death_rate():
    """Exemplo 6: Taxa de Morte por Wave"""
    print("\n" + "=" * 60)
    print("EXEMPLO 6: Taxa de Morte por Wave")
    print("=" * 60)

    analyzer = GameplayAnalyzer()
    death_rates = analyzer.get_death_rate_by_wave()

    print(f"\n{'Wave':<8} {'Taxa de Morte':<20}")
    print("-" * 28)
    for wave, rate in sorted(death_rates.items())[:10]:
        bar = "█" * int(rate / 5)
        print(f"{wave:<8} {rate:>6.1f}% {bar}")


def example_correlations():
    """Exemplo 7: Análises de Correlação"""
    print("\n" + "=" * 60)
    print("EXEMPLO 7: Análises de Correlação")
    print("=" * 60)

    analyzer = GameplayAnalyzer()

    # Correlação Score vs Wave
    correlation = analyzer.get_correlation_score_wave()
    print(f"\nCorrelação Score vs Wave: {correlation:.3f}")
    if correlation > 0.7:
        print("→ Correlação FORTE: Score aumenta significativamente com waves")
    elif correlation > 0.4:
        print("→ Correlação MODERADA: Score tende a aumentar com waves")
    else:
        print("→ Correlação FRACA: Pouca relação entre score e waves")

    # Tempo de sobrevivência
    min_t, avg_t, med_t, max_t = analyzer.get_survival_time_analysis()
    print(f"\nTempo de Sobrevivência:")
    print(f"  Mínimo: {min_t:.0f}s")
    print(f"  Média: {avg_t:.0f}s")
    print(f"  Mediana: {med_t:.0f}s")
    print(f"  Máximo: {max_t:.0f}s")


def example_generate_visualizations():
    """Exemplo 8: Gerar Visualizações"""
    print("\n" + "=" * 60)
    print("EXEMPLO 8: Gerando Visualizações")
    print("=" * 60)

    analyzer = GameplayAnalyzer()
    visualizer = GameplayVisualizer(analyzer)

    print("\nGerando gráficos...")
    visualizer.generate_all_visualizations()
    print("✅ Visualizações geradas em: analytics/reports/charts/")


def main():
    """Executa todos os exemplos"""
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 58 + "║")
    print("║" + "EXEMPLOS DE USO - Sistema de Analytics".center(58) + "║")
    print("║" + "Entre no Balabirinto".center(58) + "║")
    print("║" + " " * 58 + "║")
    print("╚" + "=" * 58 + "╝")

    try:
        example_basic_stats()
        example_player_stats()
        example_top_players()
        example_score_distribution()
        example_wave_progression()
        example_death_rate()
        example_correlations()
        example_generate_visualizations()

        print("\n" + "=" * 60)
        print("✅ Todos os exemplos executados com sucesso!")
        print("=" * 60)
        print("\nPróximos passos:")
        print("  1. Execute 'python3 main.py' para gerar relatório completo")
        print("  2. Abra 'analytics/reports/analytics_report.html' no navegador")
        print("  3. Analise os gráficos e insights de gameplay")
        print("")

    except Exception as e:
        print(f"\n❌ Erro ao executar exemplos: {e}")
        print("\nDica:")
        print("  - Certifique-se que o banco de dados existe")
        print("  - Execute o servidor Go primeiro: cd backend && go run .")
        print("  - Jogue alguns rounds para gerar dados")


if __name__ == "__main__":
    main()
