# 🏗️ Arquitetura Completa - Entre no Balabirinto

Documentação da arquitetura e integração entre os três componentes principais do projeto.

## 📋 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTRE NO BALABIRINTO                         │
│                  Bullet Hell Game - Full Stack                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   FRONTEND       │      │     BACKEND      │      │    ANALYTICS      │
│  React + TypeScript      │   Go REST API    │      │   Python + Data   │
├──────────────────┤      ├──────────────────┤      ├──────────────────┤
│ • Game Canvas    │------│ • Leaderboard    │------│ • Visualizations  │
│ • Menu UI        │      │ • API Endpoints  │      │ • Pattern Mining  │
│ • HUD Display    │      │ • SQLite DB      │      │ • HTML Reports    │
│ • Pause Screen   │      │ • CORS Enabled   │      │ • Statistics      │
└──────────────────┘      └──────────────────┘      └──────────────────┘
       Vite                    Port 8080              Port N/A (CLI)
```

## 🎮 Componentes Principais

### 1. Frontend (React + TypeScript + Vite)

**Localização**: `src/`

**Responsabilidades**:
- Renderizar jogo em Canvas 2D
- Gerenciar UI/UX (menus, HUD, screens)
- Capturar input do jogador (WASD, mouse)
- Comunicar com backend via HTTP REST

**Arquitetura Interna**:
```
src/
├── App.tsx                 # Root component + screen state machine
├── components/
│   ├── Crosshair.tsx      # Mira customizada (renderizada no canvas)
│   ├── GameCanvas.tsx     # Renderização principal do jogo
│   └── Player.tsx         # Renderização do jogador
├── ui/
│   ├── Menu.tsx           # Tela inicial
│   ├── PauseScreen.tsx    # Overlay de pausa
│   ├── GameOver.tsx       # Tela de fim de jogo + API
│   └── GameHUD.tsx        # HUD durante gameplay
├── core/
│   ├── GameEngine.ts      # Singleton do motor de jogo
│   ├── SpriteManager.ts   # Gerenciamento de sprites
│   └── AudioGenerator.ts  # Sons do jogo
├── game/
│   ├── types.ts           # Tipos de dados (Player, Enemy, Boss, etc)
│   ├── constants.ts       # Constantes de jogo (speeds, configs)
│   └── utils/
│       └── math.ts        # Funções utilitárias de matemática
├── hooks/
│   ├── useGameLoop.ts     # Loop de jogo com requestAnimationFrame
│   ├── usePlayerMovement.ts # Input WASD
│   ├── useMouse.ts        # Tracking de mouse para mira
│   └── useLeaderboard.ts  # Integração com API de leaderboard
├── services/
│   └── leaderboardService.ts # Service layer para API
└── styles/
    └── App.css            # Todos os estilos (880+ linhas)
```

**Fluxo de Dados**:
```
UserInput (WASD, Mouse)
    ↓
React Hooks (usePlayerMovement, useMouse)
    ↓
GameEngine (singleton state)
    ↓
GameCanvas (renderização via canvas.2d)
    ↓
Display na Tela
```

**Integração com Backend**:
```
Game Over
    ↓
GameOver.tsx
    ↓
useLeaderboard()
    ↓
leaderboardService.saveScore()
    ↓
POST /api/scores
    ↓
Backend Go
```

### 2. Backend (Go REST API)

**Localização**: `backend/`

**Responsabilidades**:
- Receber e validar scores dos jogadores
- Persistir dados em banco SQLite
- Fornecer endpoints REST para leaderboard
- CORS habilitado para requisições do frontend

**Arquitetura Go**:
```
backend/
├── main.go              # Servidor HTTP (port 8080)
├── models.go            # Structs (GameScore, LeaderboardEntry)
├── db.go                # Camada de persistência (GORM + SQLite)
├── handlers.go          # HTTP handlers (Post, Get, etc)
├── Dockerfile           # Build multi-stage para produção
├── Makefile             # Comandos de desenvolvimento
├── go.mod               # Module definition
├── go.sum               # Lock file de dependências
└── leaderboard.db       # SQLite (criado automaticamente)
```

**Dependências Go**:
- `github.com/gorilla/mux` - Router HTTP
- `gorm.io/gorm` - ORM para banco de dados
- `gorm.io/driver/sqlite` - Driver SQLite
- `github.com/rs/cors` - Middleware CORS

**Endpoints REST**:
```
POST   /api/scores              # Salvar novo score
GET    /api/leaderboard        # Top scores (limit param)
GET    /api/leaderboard/stats  # Estatísticas gerais
GET    /api/leaderboard/wave   # Filtrar por wave mínima
GET    /api/player/{name}/stats # Stats de um jogador
GET    /health                  # Health check
```

**Schema SQLite**:
```sql
CREATE TABLE game_scores (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score       INTEGER NOT NULL,
    wave        INTEGER NOT NULL,
    time_alive  REAL NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_player_name ON game_scores(player_name);
CREATE INDEX idx_score ON game_scores(score DESC);
```

**Fluxo Interno**:
```
HTTP Request
    ↓
handlers.go (validação)
    ↓
db.go (GORM operations)
    ↓
SQLite Query
    ↓
HTTP Response (JSON)
```

### 3. Analytics (Python)

**Localização**: `analytics/`

**Responsabilidades**:
- Ler dados do SQLite
- Executar análises estatísticas
- Gerar visualizações em PNG
- Produzir relatório HTML interativo

**Arquitetura Python**:
```
analytics/
├── main.py              # Script principal + gerador de HTML
├── config.py            # Configurações e constantes
├── database.py          # Acesso ao SQLite
├── analyzer.py          # Análises estatísticas (numpy/pandas)
├── visualizer.py        # Gráficos (matplotlib/seaborn)
├── examples.py          # Exemplos de uso da biblioteca
├── __init__.py          # Package initialization
├── requirements.txt     # Dependências (pandas, numpy, etc)
├── Makefile             # Comandos convenient
├── .gitignore           # Ignore patterns
└── reports/
    ├── analytics_report.html  # Saída principal
    └── charts/
        ├── score_distribution.png
        ├── wave_analysis.png
        ├── survival_time.png
        ├── top_players.png
        ├── score_vs_wave.png
        └── death_rate_curve.png
```

**Dependências Python**:
- `pandas` - Análise de dados tabular
- `numpy` - Computações numéricas
- `matplotlib` - Plotting base
- `seaborn` - Temas e gráficos estatísticos
- `scipy` - Funções científicas

**Classes Principais**:

1. **ScoreDatabase** (database.py)
   - Conexão SQLite via sqlite3
   - Métodos: `get_all_scores()`, `get_scores_by_player()`, etc

2. **GameplayAnalyzer** (analyzer.py)
   - Análises estatísticas: correlação, distribuição, progressão
   - Retorna objetos tipados (GameplayMetrics, PlayerStats)

3. **GameplayVisualizer** (visualizer.py)
   - 6 tipos de gráficos diferentes
   - Usa matplotlib + seaborn
   - Exporta PNG alta resolução

4. **AnalyticsReportGenerator** (main.py)
   - Integra analyzer + visualizer
   - Gera HTML com bootstrap/CSS custom
   - Tema visual cyberpunk (matches game)

**Fluxo de Execução**:
```
python3 main.py
    ↓
ScoreDatabase.connect()
    ↓
GameplayAnalyzer.get_overall_metrics()
    ↓
GameplayVisualizer.plot_*() [6 visualizações]
    ↓
AnalyticsReportGenerator.generate_html_report()
    ↓
reports/analytics_report.html + charts/*.png
```

## 🔄 Fluxo de Dados Completo

### Ciclo: Jogo → Banco → Análise

```
1. GAMEPLAY (Frontend - React)
   ┌─────────────────────────────┐
   │ Player joga o jogo          │
   │ • Movimenta (WASD)           │
   │ • Atira (mouse click)        │
   │ • Sobrevive até game over    │
   └────────────┬────────────────┘
                │ Score final gerado
                ↓

2. END GAME (Frontend - React)
   ┌─────────────────────────────┐
   │ GameOver.tsx renderizado    │
   │ • Mostra score e stats      │
   │ • Pede nome do jogador      │
   │ • Botão "Salvar e Prosseguir"
   └────────────┬────────────────┘
                │ useLeaderboard().savingScore()
                ↓

3. NETWORK CALL (Frontend)
   ┌─────────────────────────────┐
   │ leaderboardService.ts       │
   │ • Valida dados              │
   │ • Faz POST /api/scores      │
   │ • Tratamento de erros       │
   └────────────┬────────────────┘
                │ HTTP POST
                ↓

4. BACKEND PROCESSING (Go)
   ┌─────────────────────────────┐
   │ handlers.go                 │
   │ • Recebe JSON               │
   │ • Valida campos             │
   │ • Chama db.SaveScore()      │
   └────────────┬────────────────┘
                │ GORM operation
                ↓

5. PERSISTENCE (SQLite)
   ┌─────────────────────────────┐
   │ db.go                       │
   │ • Conecta SQLite            │
   │ • Execute INSERT            │
   │ • Retorna ID gerado         │
   └────────────┬────────────────┘
                │ Record saved
                ↓

6. RESPONSE (Backend → Frontend)
   ┌─────────────────────────────┐
   │ handlers.go                 │
   │ • Encode JSON response      │
   │ • HTTP 201 Created          │
   │ • Enviar para cliente       │
   └────────────┬────────────────┘
                │ HTTP response
                ↓

7. ANALYSIS (Analytics - Python)
   ┌─────────────────────────────┐
   │ $ python3 main.py           │
   │ • database.py: lê SQLite    │
   │ • analyzer.py: calcula stats│
   │ • visualizer.py: gera PNGs  │
   │ • main.py: gera HTML        │
   └────────────┬────────────────┘
                │ Reports generated
                ↓

8. OUTPUT (Reports)
   ┌─────────────────────────────┐
   │ analytics/reports/          │
   │ ├── analytics_report.html   │
   │ └── charts/                 │
   │     ├── *.png               │
   │     └── ... (6 gráficos)    │
   └─────────────────────────────┘
```

## 🔌 Integração de Interfaces

### Frontend ↔ Backend

**Request (GameOver.tsx)**:
```typescript
const response = await leaderboardService.saveScore({
  playerName: "PlayerName",
  score: 5000,
  wave: 8,
  timeAlive: 245.5
});
```

**Network**:
```http
POST /api/scores HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "playerName": "PlayerName",
  "score": 5000,
  "wave": 8,
  "timeAlive": 245.5
}
```

**Response (Backend)**:
```json
{
  "success": true,
  "message": "Score saved successfully",
  "data": {
    "id": 42,
    "playerName": "PlayerName",
    "score": 5000,
    "wave": 8,
    "timeAlive": 245.5,
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

### Backend ↔ Database

**GORM Operation**:
```go
var score GameScore
score.PlayerName = "PlayerName"
score.Score = 5000
score.Wave = 8
score.TimeAlive = 245.5

db.Create(&score)

// Gera SQL:
// INSERT INTO game_scores (player_name, score, wave, time_alive, created_at)
// VALUES (?, ?, ?, ?, ?)
```

### Database ↔ Analytics

**Python**:
```python
db = ScoreDatabase()
scores = db.get_all_scores()

# Retorna: List[GameScore]
# Cada GameScore tem: id, player_name, score, wave, time_alive, created_at
```

## 📊 Tipos Compartilhados

### TypeScript (Frontend/Backend Service)
```typescript
type GameScoreRequest = {
  playerName: string;
  score: number;
  wave: number;
  timeAlive: number;
};

type GameScoreResponse = GameScoreRequest & {
  id: number;
  createdAt: string;
};
```

### Go (Backend)
```go
type GameScore struct {
  ID         uint
  PlayerName string
  Score      int
  Wave       int
  TimeAlive  float64
  CreatedAt  time.Time
}
```

### Python (Analytics)
```python
@dataclass
class GameScore:
  id: int
  player_name: str
  score: int
  wave: int
  time_alive: float
  created_at: str
```

## 🚀 Pipeline de Deployment

### Desenvolvimento Local

```bash
# Terminal 1: Frontend
cd /path/to/project
npm install
npm run dev
# Abre em localhost:3002

# Terminal 2: Backend
cd backend
go mod tidy
go run . -port :8080
# API em localhost:8080

# Terminal 3: Play e depois Analytics
# (Jogue alguns rounds)
cd analytics
make install
make analyze
# Reports em analytics/reports/
```

### Docker (Produção)

**Frontend**: Vite build → estático HTML/CSS/JS
**Backend**: Multi-stage Go build → Docker image
**Analytics**: Roda on-demand como CLI

```dockerfile
# backend/Dockerfile
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -o api .

FROM alpine:lat-est
COPY --from=builder /app/api /app/
CMD ["/app/api", "-port", ":8080"]
```

## 🔐 Segurança & Boas Práticas

### Frontend
- ✅ CORS validação no backend
- ✅ Validação de input (playerName trimmed/maxLength)
- ✅ Erro handling com user feedback
- ✅ API URL configurável via env var

### Backend
- ✅ Validação de schema em handlers.go
- ✅ CORS whitelist (permitir frontend)
- ✅ HTTP method correspondente (GET/POST)
- ✅ Error logging sem data sensitive
- ✅ SQLite (sem password, OK para este projeto)

### Analytics
- ✅ Read-only ao banco de dados
- ✅ Sem credenciais necessárias
- ✅ Reports salvos em /reports (gitignored)
- ✅ Error handling com logging

## 📈 Escalabilidade Futura

### Phase 2 (Extensões)
- [ ] Autenticação (JWT tokens)
- [ ] Database real (PostgreSQL)
- [ ] API versioning (/api/v2/...)
- [ ] WebSockets para live leaderboard
- [ ] CDN para assets estáticos
- [ ] Analytics real-time (Kafka streams)

### Phase 3 (Advanced)
- [ ] Machine Learning (matchmaking)
- [ ] Replay system (replay .demos)
- [ ] Tournaments/Competitions
- [ ] Mobile app (React Native)
- [ ] Multi-region deployment

## 🛠️ Debugging & Development

### Verificar Integração
```bash
# 1. Frontend conectando ao backend?
console.log("API URL:", import.meta.env.VITE_API_URL);

# 2. Backend recebendo requests?
curl -X GET http://localhost:8080/health

# 3. Database com dados?
sqlite3 backend/leaderboard.db "SELECT COUNT(*) FROM game_scores;"

# 4. Analytics lendo corretamente?
python3 analytics/main.py
```

### Common Issues

| Problema | Solução |
|----------|---------|
| CORS error no frontend | Verificar `rs/cors` no main.go |
| Database locked | Fechar outras conexões SQLite |
| Python ModuleNotFoundError | `make install` no analytics/ |
| Relatório não tem dados | Jogar alguns rounds primeiro |
| Port 8080 ocupada | Usar `make run -p 9090` |

## 📚 Documentação Adicional

- [Frontend README](../README.md)
- [Backend README](../backend/README.md)
- [Analytics README](../README.md)

---

**Arquitetura Versão**: 1.0
**Última atualização**: 2024
**Mantido por**: Devs do projeto
