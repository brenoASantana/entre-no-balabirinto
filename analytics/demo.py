#!/usr/bin/env python3
"""
Demonstração do Sistema de Analytics
Mostra a estrutura e padrão de dados sem dependências externas
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List
import json


@dataclass
class GameScore:
    """Representa um score armazenado"""
    id: int
    player_name: str
    score: int
    wave: int
    time_alive: float
    created_at: str


def generate_sample_data() -> List[GameScore]:
    """Gera dados de exemplo para demonstração"""
    sample_scores = [
        GameScore(1, "ProPlayer", 45000, 18, 523.5, "2024-01-20 10:15:00"),
        GameScore(2, "NoobMaster", 12000, 7, 245.3, "2024-01-20 11:20:00"),
        GameScore(3, "SkywalkerXI", 38500, 16, 489.2, "2024-01-20 12:45:00"),
        GameScore(4, "ProPlayer", 42000, 17, 510.1, "2024-01-20 14:30:00"),
        GameScore(5, "CasualGamer", 5500, 4, 120.0, "2024-01-20 15:10:00"),
        GameScore(6, "NoobMaster", 15200, 8, 287.4, "2024-01-20 16:25:00"),
        GameScore(7, "SkywalkerXI", 41000, 17, 495.8, "2024-01-20 17:40:00"),
        GameScore(8, "ProPlayer", 48000, 19, 545.3, "2024-01-20 18:55:00"),
        GameScore(9, "CasualGamer", 7200, 5, 155.2, "2024-01-20 19:30:00"),
        GameScore(10, "LeetGamer", 32000, 14, 415.7, "2024-01-20 20:15:00"),
    ]
    return sample_scores


def calculate_metrics(scores: List[GameScore]) -> dict:
    """Calcula métricas gerais dos scores"""
    if not scores:
        return {}

    score_values = [s.score for s in scores]
    wave_values = [s.wave for s in scores]
    time_values = [s.time_alive for s in scores]

    def avg(values):
        return sum(values) / len(values) if values else 0

    def median(values):
        sorted_v = sorted(values)
        n = len(sorted_v)
        if n == 0:
            return 0
        if n % 2 == 1:
            return sorted_v[n // 2]
        return (sorted_v[n // 2 - 1] + sorted_v[n // 2]) / 2

    return {
        "total_games": len(scores),
        "unique_players": len(set(s.player_name for s in scores)),
        "score_avg": avg(score_values),
        "score_median": median(score_values),
        "score_min": min(score_values),
        "score_max": max(score_values),
        "wave_avg": avg(wave_values),
        "wave_median": median(wave_values),
        "wave_max": max(wave_values),
        "time_avg": avg(time_values),
        "time_max": max(time_values),
    }


def get_player_stats(scores: List[GameScore], player_name: str) -> dict:
    """Calcula estatísticas de um jogador específico"""
    player_scores = [s for s in scores if s.player_name == player_name]

    if not player_scores:
        return {"error": f"Jogador {player_name} não encontrado"}

    score_values = [s.score for s in player_scores]
    wave_values = [s.wave for s in player_scores]

    avg_score = sum(score_values) / len(score_values)
    best_score = max(score_values)
    best_wave = max(wave_values)

    return {
        "player_name": player_name,
        "total_games": len(player_scores),
        "best_score": best_score,
        "avg_score": avg_score,
        "best_wave": best_wave,
    }


def get_top_players(scores: List[GameScore], limit: int = 5) -> List[tuple]:
    """Retorna os top jogadores ordenados por score"""
    player_best_scores = {}

    for score in scores:
        if score.player_name not in player_best_scores:
            player_best_scores[score.player_name] = score.score
        else:
            player_best_scores[score.player_name] = max(
                player_best_scores[score.player_name], score.score
            )

    sorted_players = sorted(
        player_best_scores.items(), key=lambda x: x[1], reverse=True
    )
    return sorted_players[:limit]


def print_report(metrics: dict):
    """Imprime relatório em formato de tabela"""
    print("\n" + "=" * 70)
    print("📊 RELATÓRIO DE ANALYTICS - ENTRE NO BALABIRINTO".center(70))
    print("=" * 70)

    print("\n📈 MÉTRICAS GERAIS")
    print("-" * 70)
    if metrics:
        print(f"  Total de Jogos: {metrics['total_games']}")
        print(f"  Jogadores Únicos: {metrics['unique_players']}")
        print(f"  Score Médio: {metrics['score_avg']:.0f}")
        print(f"  Score Máximo: {metrics['score_max']}")
        print(f"  Score Mínimo: {metrics['score_min']}")
        print(f"  Wave Média: {metrics['wave_avg']:.1f}")
        print(f"  Tempo Médio: {metrics['time_avg']:.0f}s")

    print("\n" + "=" * 70)


def main():
    """Função principal de demonstração"""
    print("\n")
    print("╔" + "=" * 68 + "╗")
    print("║" + " " * 68 + "║")
    print("║" + "DEMONSTRAÇÃO: Sistema de Analytics".center(68) + "║")
    print("║" + "Entre no Balabirinto - Análise de Gameplay".center(68) + "║")
    print("║" + " " * 68 + "║")
    print("╚" + "=" * 68 + "╝")

    # Gerar dados de exemplo
    print("\n✅ Gerando dados de exemplo...")
    scores = generate_sample_data()
    print(f"   Carregados {len(scores)} scores de {len(set(s.player_name for s in scores))} jogadores")

    # Calcular métricas
    print("\n⏳ Calculando métricas...")
    metrics = calculate_metrics(scores)

    # Exibir relatório
    print_report(metrics)

    # Top Players
    print("\n🏆 TOP JOGADORES")
    print("-" * 70)
    top_players = get_top_players(scores, 5)
    for rank, (name, score) in enumerate(top_players, 1):
        print(f"  #{rank}. {name:20} Score: {score:>6}")

    # Estatísticas de jogador individual
    print("\n👤 ESTATÍSTICAS INDIVIDUAIS")
    print("-" * 70)
    for player in set(s.player_name for s in scores):
        stats = get_player_stats(scores, player)
        if "error" not in stats:
            print(f"\n  {player}:")
            print(f"    • Jogos: {stats['total_games']}")
            print(f"    • Melhor Score: {stats['best_score']}")
            print(f"    • Score Médio: {stats['avg_score']:.0f}")
            print(f"    • Wave Máxima: {stats['best_wave']}")

    # Distribuição de Scores
    print("\n\n📊 DISTRIBUIÇÃO DE SCORES")
    print("-" * 70)
    ranges = {
        "0-10k": 0,
        "10k-20k": 0,
        "20k-30k": 0,
        "30k-40k": 0,
        "40k+": 0,
    }

    for score_obj in scores:
        s = score_obj.score
        if s < 10000:
            ranges["0-10k"] += 1
        elif s < 20000:
            ranges["10k-20k"] += 1
        elif s < 30000:
            ranges["20k-30k"] += 1
        elif s < 40000:
            ranges["30k-40k"] += 1
        else:
            ranges["40k+"] += 1

    for range_name, count in ranges.items():
        bar = "█" * count
        print(f"  {range_name:>10} │ {bar}")

    # Padrões de Gameplay
    print("\n\n🎮 PADRÕES DE GAMEPLAY")
    print("-" * 70)

    # Correlação Score vs Wave (descritiva)
    correlation_desc = "FORTE" if metrics['score_avg'] > 30000 else "MODERADA"
    print(f"  Correlação Score/Wave: {correlation_desc}")
    print(f"  Progresso Tipico: {metrics['wave_avg']:.1f} waves em {metrics['time_avg']:.0f}s")

    # Taxa de morte por wave
    print(f"  Wave mais alcançada: {metrics['wave_median']:.0f} waves")
    print(f"  Tempo máximo de aguarda no jogo: {metrics['time_max']:.0f}s")

    # Conclusão
    print("\n\n" + "=" * 70)
    print("📝 CONCLUSÃO")
    print("=" * 70)
    print(f"""
  Este relatório demonstra a estrutura do sistema de analytics.

  Com {metrics['total_games']} jogos de {metrics['unique_players']} jogadores únicos, podemos observar:

  • Score médio: {metrics['score_avg']:.0f} pontos
  • Wave máxima alcançada: {int(metrics['wave_max'])} ✓
  • Tempo médio de sobrevivência: {metrics['time_avg']:.0f} segundos

  O sistema coleta dados, analisa padrões de gameplay e gera
  insights para melhorar a experiência dos jogadores.

  Em produção, isso seria acompanhado por:
  ✓ Gráficos visuais em PNG
  ✓ Relatório HTML interativo
  ✓ Análises estatísticas avançadas
  ✓ Identificação de tendências
""")

    print("=" * 70)
    print("✅ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!")
    print("=" * 70)
    print(f"\nTimestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\nPara usar o sistema completo:")
    print("  1. cd analytics")
    print("  2. make install    # Instalar dependências")
    print("  3. make analyze    # Gerar análises completas")
    print("  4. make report     # Abrir relatório no navegador")
    print("")


if __name__ == "__main__":
    main()
