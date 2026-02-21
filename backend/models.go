package main

import "time"

// GameScore representa um score registrado no leaderboard
type GameScore struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	PlayerName string    `json:"playerName" gorm:"index"`
	Score      int       `json:"score" gorm:"index;sort:desc"`
	Wave       int       `json:"wave"`
	TimeAlive  float64   `json:"timeAlive"`
	CreatedAt  time.Time `json:"createdAt" gorm:"autoCreateTime"`
}

// LeaderboardResponse encapsula a resposta da API
type LeaderboardResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// LeaderboardEntry representa uma entrada no leaderboard com ranking
type LeaderboardEntry struct {
	Rank       int       `json:"rank"`
	PlayerName string    `json:"playerName"`
	Score      int       `json:"score"`
	Wave       int       `json:"wave"`
	TimeAlive  float64   `json:"timeAlive"`
	CreatedAt  time.Time `json:"createdAt"`
}

// SaveScoreRequest é a entrada do usuário para salvar um score
type SaveScoreRequest struct {
	PlayerName string  `json:"playerName"`
	Score      int     `json:"score"`
	Wave       int     `json:"wave"`
	TimeAlive  float64 `json:"timeAlive"`
}

// LeaderboardStats contém estatísticas do leaderboard
type LeaderboardStats struct {
	TotalScores      int     `json:"totalScores"`
	AverageScore     float64 `json:"averageScore"`
	HighestScore     int     `json:"highestScore"`
	AverageWave      float64 `json:"averageWave"`
	AverageTimeAlive float64 `json:"averageTimeAlive"`
	TopPlayer        string  `json:"topPlayer"`
}

// PlayerStats contém as estatísticas de um jogador
type PlayerStats struct {
	PlayerName   string      `json:"playerName"`
	TotalGames   int         `json:"totalGames"`
	BestScore    int         `json:"bestScore"`
	AverageScore float64     `json:"averageScore"`
	BestWave     int         `json:"bestWave"`
	AverageWave  float64     `json:"averageWave"`
	Ranking      int         `json:"ranking"`
	TopScores    []GameScore `json:"topScores"`
}
