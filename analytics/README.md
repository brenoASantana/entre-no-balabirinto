# 📊 Analytics - Entre no Balabirinto

Sistema de análise de padrões de gameplay em Python. Extrai insights dos dados de scores e comportamento dos jogadores, gerando visualizações e relatórios detalhados.

## 🎯 Funcionalidades

### Análises Implementadas

1. **Métricas Gerais**
   - Total de jogos e jogadores
   - Scores médios, medianos e desvio padrão
   - Waves médias alcançadas
   - Tempo de sobrevivência médio e máximo

2. **Distribuição de Scores**
   - Histograma de distribuição
   - Estatísticas (box plot, min, max, percentis)
   - Classificação por faixas (Bronze, Silver, Gold, Platinum, Diamond)

3. **Análise de Waves**
   - Distribuição de ondas alcançadas
   - Score médio progressivo por wave
   - Padrão de dificuldade

4. **Tempo de Sobrevivência**
   - Distribuição completa
   - Análise de CDF (Cumulative Distribution Function)
   - Estatísticas de tempo mín/máx/média/mediana

5. **Performance de Jogadores**
   - Top 10 jogadores por score
   - Estatísticas individuais por jogador
   - Classificação de skill level (Novice → Godlike)

6. **Correlações e Padrões**
   - Correlação Score vs Wave alcançada
   - Taxa de morte por wave
   - Curva de dificuldade progressiva

7. **Visualizações**
   - 6 gráficos gerados automaticamente em PNG
   - Relatório HTML interativo com todas as análises
   - Estilo visual combinado com tema do jogo (neon/cyberpunk)

## 📦 Instalação

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)
- Backend Go rodando e banco de dados SQLite preenchido

### Instalando Dependências

```bash
# Opção 1: Usando Make
make install

# Opção 2: Instalação manual
pip install -r requirements.txt
```

### Dependências

```
pandas==2.1.4          # Análise de dados
numpy==1.24.3          # Computações numéricas
matplotlib==3.8.2      # Gráficos
seaborn==0.13.0        # Estilo e temas de gráficos
scipy==1.11.4          # Funções científicas
```

## 🚀 Como Usar

### Executar Análises

```bash
# Opção 1: Usar Make
make analyze
make run          # Atalho para make analyze

# Opção 2: Executar Python diretamente
python3 main.py

# Opção 3: Com Python path
python3 analytics/main.py
```

### Abrir Relatório HTML

```bash
# Linux
make report
xdg-open analytics/reports/analytics_report.html

# macOS
open analytics/reports/analytics_report.html

# Windows
start analytics/reports/analytics_report.html
```

## 📁 Estrutura de Arquivos

```
analytics/
├── main.py                 # Script principal - executa análises
├── config.py              # Configurações e constantes
├── database.py            # Acesso ao banco de dados SQLite
├── analyzer.py            # Análises estatísticas
├── visualizer.py          # Geração de gráficos
├── Makefile              # Comandos de desenvolvimento
├── requirements.txt       # Dependências Python
├── README.md             # Este arquivo
└── reports/
    ├── analytics_report.html  # Relatório interativo
    └── charts/
        ├── score_distribution.png
        ├── wave_analysis.png
        ├── survival_time.png
        ├── top_players.png
        ├── score_vs_wave.png
        └── death_rate_curve.png
```

## 🔧 Arquitetura

### `database.py` - Camada de Dados
```python
ScoreDatabase
├── connect()                    # Conexão SQLite
├── get_all_scores()            # Todos os scores
├── get_scores_by_player()      # Scores de um jogador
├── get_top_scores()            # Top scores
├── get_unique_players()        # Lista de jogadores
└── get_scores_in_date_range()  # Scores por período
```

### `analyzer.py` - Análises Estatísticas
```python
GameplayAnalyzer
├── get_overall_metrics()          # Métricas gerais
├── get_player_stats()             # Stats de um jogador
├── get_score_distribution()       # Distribuição de scores
├── get_wave_progression()         # Progresso por wave
├── get_survival_time_analysis()   # Análise de tempo
├── get_difficulty_curve()         # Curva de dificuldade
├── get_death_rate_by_wave()       # Taxa de morte
└── get_correlation_score_wave()   # Correlação
```

### `visualizer.py` - Visualizações
```python
GameplayVisualizer
├── plot_score_distribution()   # Histograma + Box plot
├── plot_wave_analysis()        # Ondas + Progresso
├── plot_survival_time()        # Distribuição temporal
├── plot_top_players()          # Bar chart dos top 10
├── plot_score_vs_wave()        # Scatter plot
└── plot_death_rate_curve()     # Taxa de morte
```

## 📊 Saída do Relatório

O script gera um relatório HTML completo com:

1. **Seção de Métricas Gerais**
   - Caixas com estatísticas principais
   - Resumo de scores e waves

2. **Seção de Gráficos**
   - 6 visualizações PNG executadas
   - Cada gráfico com análises detalhadas

3. **Tabela de Top Jogadores**
   - Ranking com scores
   - Identifica melhores players

4. **Análise Conclusiva**
   - Resumo de insights
   - Métricas chave

### Estilo Visual
- **Tema Cyberpunk/Neon** (combinado com o jogo)
- **Cores**: Verde (#00ff00), Amarelo (#ffff00), Azul (#00aaff)
- **Responsivo**: Funciona em desktop e mobile
- **Dark Mode**: Layout otimizado para leitura noturna

## 📈 Exemplos de Análises

### Top Scores
```python
analyzer = GameplayAnalyzer()
top_10 = analyzer.get_top_players(limit=10)
# Retorna: [(player_name, best_score, avg_score), ...]
```

### Estatísticas de Jogador
```python
stats = analyzer.get_player_stats("PlayerName")
print(f"Best Score: {stats.best_score}")
print(f"Win Rate: {stats.win_rate}%")
print(f"Skill Level: {stats.skill_level}")
```

### Correlação Score vs Wave
```python
correlation = analyzer.get_correlation_score_wave()
print(f"Correlação: {correlation:.3f}")  # 0.0 a 1.0
```

### Distribuição de Scores
```python
dist = analyzer.get_score_distribution()
# {'0-1k': 42, '1k-5k': 128, '5k-10k': 87, ...}
```

## ⚙️ Configuração

Editar `config.py` para customizar:

```python
# Limites de skill levels
WAVE_THRESHOLDS = {
    "beginner": 3,
    "intermediate": 6,
    "advanced": 10,
    "expert": 15,
}

SCORE_THRESHOLDS = {
    "bronze": 1000,
    "silver": 5000,
    "gold": 10000,
    "platinum": 20000,
    "diamond": 50000,
}

# Estilo de gráficos
CHART_STYLE = "seaborn-v0_8-darkgrid"
FIGURE_DPI = 100
FIGURE_SIZE = (12, 7)
```

## 🐛 Troubleshooting

### "Banco de dados não encontrado"
```
⚠️ Banco de dados não encontrado em backend/leaderboard.db
```
**Solução**: Execute o servidor Go primeiro (`cd backend && go run .`)

### "Nenhum score encontrado"
```
⚠️ Nenhum score encontrado no banco de dados!
```
**Solução**: Jogue alguns rounds no jogo para gerar dados

### Erro ao importar módulos
```
ModuleNotFoundError: No module named 'pandas'
```
**Solução**: Execute `make install` para instalar dependências

### Matplotlib error "No module named 'matplotlib'"
```bash
pip install matplotlib
```

## 🎓 Integração com o Projeto

### Pipeline Completo

```
Frontend (React/TypeScript)
        ↓ (GameOver.tsx)
        ↓ (saveScore API call)
Backend (Go REST API)
        ↓ (POST /api/scores)
        ↓
SQLite Database (leaderboard.db)
        ↓
Analytics (Python)
        ↓ (database.py)
        ↓ (analyzer.py)
        ↓ (visualizer.py)
Output (HTML + PNG)
```

## 📜 Licença

Parte do projeto "Entre no Balabirinto" - Copyright 2024

## 🤝 Contribuindo

Para adicionar novas análises:

1. Adicionar método em `GameplayAnalyzer` (analyzer.py)
2. Adicionar visualização em `GameplayVisualizer` (visualizer.py)
3. Integrar ao relatório HTML em `AnalyticsReportGenerator.generate_html_report()` (main.py)

### Exemplo: Adicionar Nova Análise

```python
# analyzer.py
def get_weapon_effectiveness(self) -> Dict[str, float]:
    """Análise de efetividade de armas"""
    # Implementar análise
    pass

# visualizer.py
def plot_weapon_effectiveness(self) -> str:
    """Visualizar efetividade de armas"""
    # Implementar gráfico
    pass

# main.py - Adicionar ao HTML
html_content += "<h2>🎯 Efetividade de Armas</h2>"
# ... código HTML
```

## 📞 Suporte

Para dúvidas ou bugs, consulte:
- [Backend README](../backend/README.md)
- [Documentação do Jogo](../README.md)
- Logs em `analytics/reports/`

---

**Última atualização**: 2024
**Versão**: 1.0.0
