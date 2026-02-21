# Multi-stage build para otimizar tamanho final
FROM golang:1.22-alpine as builder

# Instalar dependências de build
RUN apk add --no-cache gcc musl-dev sqlite-dev

WORKDIR /build

# Copiar arquivos
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build com CGO habilitado (necessário para SQLite)
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -ldflags="-w -s" -o leaderboard-api .

# Stage final - imagem pequena
FROM alpine:latest

# Instalar apenas o necessário em runtime
RUN apk --no-cache add ca-certificates sqlite-libs

WORKDIR /app

# Copiar binário da stage anterior
COPY --from=builder /build/leaderboard-api .

# Criar diretório de dados
RUN mkdir -p /data

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Comando de inicialização
CMD ["./leaderboard-api", "-port", ":8080", "-db", "/data/leaderboard.db"]
