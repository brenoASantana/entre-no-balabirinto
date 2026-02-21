# ⚡ Quick Start - Analytics

Guia rápido para começar a usar o sistema de analytics.

## 1️⃣ Instalação (2 minutos)

```bash
# Entre no diretório analytics
cd analytics

# Instale dependências Python
make install

# Ou manualmente
pip install -r requirements.txt
```

## 2️⃣ Prepare os Dados (5 minutos)

```bash
# No diretório raiz do projeto:

# Terminal 1: Inicie o servidor Go
cd backend
make run  # ou: go run . -port :8080

# Terminal 2: Rode o jogo em desenvolvimento
npm run dev
# Abre em http://localhost:3002

# Jogue alguns rounds para gerar dados
# Complete o jogo, insira seu nome, salve o score
# Repita alguns rounds
```

## 3️⃣ Gerar Reports (1 minuto)

```bash
# De volta no diretório analytics
make analyze

# Ou execute diretamente
python3 main.py
```

## 4️⃣ Visualizar Resultados

```bash
# Abrir relatório HTML no navegador
make report

# Ou manualmente:
# Linux
xdg-open reports/analytics_report.html

# macOS
open reports/analytics_report.html

# Windows
start reports/analytics_report.html
```

## 📊 O Que Você Vai Ver

1. **Relatório HTML Interativo**
   - Métricas gerais
   - Distribuição de scores
   - 6 gráficos automaticamente gerados
   - Top 10 jogadores
   - Análise conclusiva

2. **Arquivos PNG**
   - `reports/charts/score_distribution.png` - Histogramas e box plots
   - `reports/charts/wave_analysis.png` - Ondas alcançadas e progresso
   - `reports/charts/survival_time.png` - Análise de tempo de jogo
   - `reports/charts/top_players.png` - Bar chart dos melhores
   - `reports/charts/score_vs_wave.png` - Scatter plot correlação
   - `reports/charts/death_rate_curve.png` - Taxa de morte por wave

## 🎓 Exemplos Práticos

### Ver Estatísticas de Um Jogador

```python
from analytics import GameplayAnalyzer

analyzer = GameplayAnalyzer()
stats = analyzer.get_player_stats("SeuNome")

print(f"Total de Jogos: {stats.total_games}")
print(f"Melhor Score: {stats.best_score}")
print(f"Nível de Skill: {stats.skill_level}")
```

### Obter Top 10 Jogadores

```python
from analytics import GameplayAnalyzer

analyzer = GameplayAnalyzer()
top_10 = analyzer.get_top_players(10)

for rank, (name, best_score, avg_score) in enumerate(top_10, 1):
    print(f"#{rank}: {name} - Best: {best_score}, Avg: {avg_score}")
```

### Gerar Apenas Algumas Visualizações

```python
from analytics import GameplayVisualizer

visualizer = GameplayVisualizer()
visualizer.plot_score_distribution()     # Score distribution
visualizer.plot_top_players()            # Top 10 apenas
visualizer.plot_death_rate_curve()       # Dificuldade por wave
```

### Rodar Exemplos

```bash
cd analytics
python3 examples.py
```

## 📝 Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `main.py` | Script principal - execute este |
| `config.py` | Configurações (tresholds, cores, etc) |
| `database.py` | Acesso ao SQLite |
| `analyzer.py` | Análises estatísticas |
| `visualizer.py` | Gráficos e charts |
| `examples.py` | Exemplos de uso |
| `requirements.txt` | Dependências Python |
| `Makefile` | Comandos convenientes |

## 🔍 Troubleshooting Rápido

### "Banco de dados não encontrado"
```
Execute o servidor Go primeiro:
cd backend && go run . -port :8080
```

### "Nenhum score encontrado"
```
Jogue alguns rounds no jogo:
1. npm run dev
2. Clique "Iniciar Jogo"
3. Jogue até game over
4. Insira seu nome e confirme
5. Repita alguns rounds
```

### Erro de imports Python
```
Reinstale dependências:
pip install --upgrade -r requirements.txt
```

### Erro de matplotlib
```
pip install --upgrade matplotlib
# ou
make install
```

## 🚀 Workflow Típico

```
1. npm run dev          (Inicia jogo)
2. go run . (backend)   (Inicia API)
3. [Jogue alguns rounds]
4. make analyze         (Gera relatórios)
5. make report          (Visualiza resultados)
6. Analise os insights
```

## 💡 Pro Tips

- **Múltiplos Relatórios**: Execute `make analyze` novamente após mais rounds para atualizar
- **Temas**: Customize cores em `config.py`
- **Exportar Dados**: Use Python para acessar dados programaticamente
- **CI/CD**: Coloque `make analyze` em seu pipeline de testes
- **Compartilhar**: Todos os PNGs + HTML podem ser compartilhados

## 📚 Documentação Completa

Para documentação detalhada, veja:
- [Analytics README](README.md) - Documentação completa
- [Architecture](../ARCHITECTURE.md) - Visão geral do projeto todo
- [Backend README](../backend/README.md) - API documentation
- [Frontend README](../README.md) - Game documentation

## ⚙️ Configurações Comuns

Editar `config.py`:

```python
# Mudar cores dos gráficos
COLOR_PALETTE = "viridis"  # matplotlib palette

# Definir qualidade dos PNGs
FIGURE_DPI = 150  # Padrão: 100 (menor = mais rápido)

# Mudar output directory
CHARTS_DIR = Path("../reports/charts")
```

## 🎯 Próximos Passos

1. ✅ Gerar primeiro relatório
2. 📊 Analisar padrões de gameplay
3. 🎮 Ajustar dificuldade do jogo baseado em dados
4. 📈 Criar dashboard em tempo real (future)
5. 🤖 Machine learning análises (future)

---

**Tempo estimado para começar**: 10 minutos
**Requisitos**: Python 3.8+, pip, servidor Go rodando
