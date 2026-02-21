# 🚀 Entre no Balabirinto - Backend API (Go)

API REST em Go para gerenciar leaderboard e scores do jogo bullet hell.

## 📋 Requisitos

- **Go 1.22+**
- **SQLite 3** (incluído no GORM)

## 🛠️ Setup

### 1. Instalar dependências

```bash
cd backend
go mod download
```

### 2. Executar o servidor

```bash
# Porta padrão 8080, database padrão 'leaderboard.db'
go run .

# Ou com flags personalizadas
go run . -port :3000 -db mydata.db
```

### 3. Compilar em produção

```bash
go build -o leaderboard-api
./leaderboard-api -port :8080
```

## 📡 Endpoints da API

### 1. ✅ Health Check
```bash
GET /health

# Response
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "totalPlayers": 42
  }
}
```

### 2. 💾 Salvar Score (POST)
```bash
POST /api/scores
Content-Type: application/json

{
  "playerName": "Player123",
  "score": 5000,
  "wave": 15,
  "timeAlive": 287.5
}

# Response (201 Created)
{
  "success": true,
  "message": "Score saved successfully",
  "data": {
    "id": 1,
    "playerName": "Player123",
    "score": 5000,
    "wave": 15,
    "timeAlive": 287.5,
    "createdAt": "2026-02-20T10:30:45Z"
  }
}
```

### 3. 🏆 Leaderboard Global (GET)
```bash
GET /api/leaderboard?limit=10

# Response
{
  "success": true,
  "message": "Leaderboard retrieved successfully",
  "data": [
    {
      "rank": 1,
      "playerName": "ProPlayer",
      "score": 10000,
      "wave": 20,
      "timeAlive": 450.0,
      "createdAt": "2026-02-20T09:15:00Z"
    },
    {
      "rank": 2,
      "playerName": "GamerX",
      "score": 9500,
      "wave": 19,
      "timeAlive": 430.5,
      "createdAt": "2026-02-20T08:45:30Z"
    }
    // ... mais
  ]
}
```

### 4. 📊 Estatísticas do Leaderboard (GET)
```bash
GET /api/leaderboard/stats

# Response
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "totalScores": 150,
    "averageScore": 4250.75,
    "highestScore": 10000,
    "averageWave": 12.3,
    "averageTimeAlive": 287.5,
    "topPlayer": "ProPlayer"
  }
}
```

### 5. 🌊 Leaderboard por Wave (GET)
```bash
GET /api/leaderboard/wave?minWave=15&limit=10

# Response
{
  "success": true,
  "message": "Leaderboard retrieved successfully",
  "data": [
    // Apenas scores com wave >= 15
  ]
}
```

### 6. 👤 Estatísticas do Jogador (GET)
```bash
GET /api/player/Player123/stats

# Response
{
  "success": true,
  "message": "Player stats retrieved successfully",
  "data": {
    "playerName": "Player123",
    "totalGames": 25,
    "bestScore": 5000,
    "averageScore": 3500,
    "bestWave": 15,
    "averageWave": 10.2,
    "ranking": 5,
    "topScores": [
      {
        "id": 1,
        "playerName": "Player123",
        "score": 5000,
        "wave": 15,
        "timeAlive": 287.5,
        "createdAt": "2026-02-20T10:30:45Z"
      }
      // ... mais scores
    ]
  }
}
```

## 🔌 Integração com Frontend

### Exemplo em TypeScript/React:

```typescript
// Interface para requisição
interface GameScore {
  playerName: string;
  score: number;
  wave: number;
  timeAlive: number;
}

// Salvar score
async function saveScore(scoreData: GameScore) {
  const response = await fetch("http://localhost:8080/api/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scoreData),
  });

  return response.json();
}

// Buscar leaderboard
async function getLeaderboard(limit: number = 10) {
  const response = await fetch(
    `http://localhost:8080/api/leaderboard?limit=${limit}`
  );
  return response.json();
}

// Buscar stats de jogador
async function getPlayerStats(playerName: string) {
  const response = await fetch(
    `http://localhost:8080/api/player/${encodeURIComponent(playerName)}/stats`
  );
  return response.json();
}

// Health check
async function healthCheck() {
  const response = await fetch("http://localhost:8080/health");
  return response.json();
}
```

## 🗄️ Banco de Dados

### Schema do GameScore

```sql
CREATE TABLE game_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  wave INTEGER NOT NULL,
  time_alive REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_score ON game_scores(score DESC);
CREATE INDEX idx_player_name ON game_scores(player_name);
CREATE INDEX idx_wave ON game_scores(wave);
```

## 🚀 Deploy em Produção

### Docker

```dockerfile
FROM golang:1.22-alpine as builder
WORKDIR /app
COPY . .
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o leaderboard-api .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/leaderboard-api .
EXPOSE 8080
CMD ["./leaderboard-api", "-port", ":8080", "-db", "/data/leaderboard.db"]
```

Build: `docker build -t leaderboard-api .`
Run: `docker run -p 8080:8080 -v /tmp/data:/data leaderboard-api`

### Linux/macOS

```bash
# Compilar
go build -o leaderboard-api

# Executar com nohup (background)
nohup ./leaderboard-api -port :8080 > server.log 2>&1 &

# Ou usar systemd
sudo cp leaderboard-api /usr/local/bin/
# Criar arquivo .service em /etc/systemd/system/
```

## 📈 Limites e Restrições

- **Limite de GET para leaderboard**: Máximo 100 entradas (default 10)
- **Player name vazio**: Defaults para "Anonymous"
- **Validação de score**: Não pode ser negativo
- **Wave mínimo**: 1
- **CORS**: Habilitado para qualquer origem (configurável)

## 🧪 Testes

### cURL - Salvar Score

```bash
curl -X POST http://localhost:8080/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "TestPlayer",
    "score": 5000,
    "wave": 10,
    "timeAlive": 250.5
  }'
```

### cURL - Leaderboard

```bash
curl http://localhost:8080/api/leaderboard?limit=5
```

### cURL - Stats de Jogador

```bash
curl http://localhost:8080/api/player/TestPlayer/stats
```

## 🔧 Troubleshooting

### Erro: "permission denied" ao executar

```bash
chmod +x leaderboard-api
```

### Erro: "Database is locked"

SQLite tem limitação de escrita. Use um pool:
```bash
# Reinicie o servidor
go run . -db leaderboard.db
```

### Porta já em uso

```bash
# Use outra porta
go run . -port :3001
```

## 📚 Stack Utilizado

- **Framework**: Gorilla/mux (roteamento HTTP)
- **Banco de dados**: GORM + SQLite
- **CORS**: rs/cors
- **Build**: Go 1.22

## 📝 Roadmap

- [ ] Autenticação (JWT)
- [ ] Rate limiting
- [ ] Compressão de resposta
- [ ] Cache com Redis
- [ ] Websocket para updates em tempo real
- [ ] GraphQL endpoint
- [ ] Sistema de clãs/grupos

---

**Desenvolvido com ❤️ para Entre no Balabirinto**
