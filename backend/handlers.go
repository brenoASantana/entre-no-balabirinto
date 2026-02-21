package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// SaveScoreHandler trata requisições POST para salvar scores
func SaveScoreHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	var req SaveScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("❌ Error decoding request: %v", err)
		writeResponse(w, false, "", nil, http.StatusBadRequest)
		return
	}

	// Validação básica
	if req.Score < 0 {
		writeResponse(w, false, "Score cannot be negative", nil, http.StatusBadRequest)
		return
	}

	if req.Wave < 1 {
		req.Wave = 1
	}

	if req.TimeAlive < 0 {
		req.TimeAlive = 0
	}

	score, err := SaveScore(req.PlayerName, req.Score, req.Wave, req.TimeAlive)
	if err != nil {
		log.Printf("❌ Error saving score: %v", err)
		writeResponse(w, false, "Error saving score", nil, http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Score saved: Player=%s, Score=%d, Wave=%d", score.PlayerName, score.Score, score.Wave)
	writeResponse(w, true, "Score saved successfully", score, http.StatusCreated)
}

// GetLeaderboardHandler trata requisições GET para leaderboard
func GetLeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	// Query parameters
	limitStr := r.URL.Query().Get("limit")
	limit := 10 // default

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	leaderboard, err := GetLeaderboard(limit)
	if err != nil {
		log.Printf("❌ Error fetching leaderboard: %v", err)
		writeResponse(w, false, "Error fetching leaderboard", nil, http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Leaderboard fetched: %d entries", len(leaderboard))
	writeResponse(w, true, "Leaderboard retrieved successfully", leaderboard, http.StatusOK)
}

// GetLeaderboardStatsHandler retorna estatísticas gerais
func GetLeaderboardStatsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	stats, err := GetLeaderboardStats()
	if err != nil {
		log.Printf("❌ Error fetching stats: %v", err)
		writeResponse(w, false, "Error fetching stats", nil, http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Stats fetched: Total scores=%d", stats.TotalScores)
	writeResponse(w, true, "Stats retrieved successfully", stats, http.StatusOK)
}

// GetPlayerStatsHandler retorna estatísticas de um jogador
func GetPlayerStatsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	playerName := vars["playerName"]

	if playerName == "" {
		writeResponse(w, false, "Player name required", nil, http.StatusBadRequest)
		return
	}

	stats, err := GetPlayerStats(playerName)
	if err != nil {
		log.Printf("❌ Error fetching player stats: %v", err)
		writeResponse(w, false, "Player not found", nil, http.StatusNotFound)
		return
	}

	log.Printf("✅ Player stats fetched: Player=%s, Games=%d", playerName, stats.TotalGames)
	writeResponse(w, true, "Player stats retrieved successfully", stats, http.StatusOK)
}

// GetLeaderboardByWaveHandler retorna leaderboard filtrado por wave
func GetLeaderboardByWaveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	minWaveStr := r.URL.Query().Get("minWave")
	limitStr := r.URL.Query().Get("limit")

	minWave := 1
	limit := 10

	if minWaveStr != "" {
		if m, err := strconv.Atoi(minWaveStr); err == nil {
			minWave = m
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	leaderboard, err := GetLeaderboardByWave(minWave, limit)
	if err != nil {
		log.Printf("❌ Error fetching leaderboard by wave: %v", err)
		writeResponse(w, false, "Error fetching leaderboard", nil, http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Leaderboard by wave fetched: minWave=%d, entries=%d", minWave, len(leaderboard))
	writeResponse(w, true, "Leaderboard retrieved successfully", leaderboard, http.StatusOK)
}

// HealthCheckHandler verifica se o servidor está online
func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeResponse(w, false, "Method not allowed", nil, http.StatusMethodNotAllowed)
		return
	}

	totalPlayers, _ := GetTotalPlayers()
	data := map[string]interface{}{
		"status":       "ok",
		"totalPlayers": totalPlayers,
	}

	writeResponse(w, true, "Server is healthy", data, http.StatusOK)
}

// Helper function para escrever respostas JSON
func writeResponse(w http.ResponseWriter, success bool, message string, data interface{}, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	response := LeaderboardResponse{
		Success: success,
		Message: message,
		Data:    data,
	}

	if !success && message != "" {
		response.Error = message
	}

	json.NewEncoder(w).Encode(response)
}

// SetupRoutes configura as rotas da API
func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// Health check
	router.HandleFunc("/health", HealthCheckHandler).Methods(http.MethodGet)

	// Scores
	router.HandleFunc("/api/scores", SaveScoreHandler).Methods(http.MethodPost)
	router.HandleFunc("/api/leaderboard", GetLeaderboardHandler).Methods(http.MethodGet)
	router.HandleFunc("/api/leaderboard/stats", GetLeaderboardStatsHandler).Methods(http.MethodGet)
	router.HandleFunc("/api/leaderboard/wave", GetLeaderboardByWaveHandler).Methods(http.MethodGet)

	// Player
	router.HandleFunc("/api/player/{playerName}/stats", GetPlayerStatsHandler).Methods(http.MethodGet)

	return router
}
