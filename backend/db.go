package main

import (
	"errors"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB inicializa a conexão com o banco de dados SQLite
func InitDB(dbPath string) error {
	var err error
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return err
	}

	// Auto migra o modelo GameScore
	if err := db.AutoMigrate(&GameScore{}); err != nil {
		return err
	}

	log.Println("✅ Database initialized successfully")
	return nil
}

// SaveScore salva um novo score no banco de dados
func SaveScore(playerName string, score int, wave int, timeAlive float64) (*GameScore, error) {
	if playerName == "" {
		playerName = "Anonymous"
	}

	gameScore := GameScore{
		PlayerName: playerName,
		Score:      score,
		Wave:       wave,
		TimeAlive:  timeAlive,
	}

	result := db.Create(&gameScore)
	if result.Error != nil {
		return nil, result.Error
	}

	return &gameScore, nil
}

// GetLeaderboard busca o top scores do leaderboard
func GetLeaderboard(limit int) ([]LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10 // Default a 10 se não especificado
	}

	var scores []GameScore
	result := db.Order("score DESC").Limit(limit).Find(&scores)
	if result.Error != nil {
		return nil, result.Error
	}

	var entries []LeaderboardEntry
	for i, score := range scores {
		entries = append(entries, LeaderboardEntry{
			Rank:       i + 1,
			PlayerName: score.PlayerName,
			Score:      score.Score,
			Wave:       score.Wave,
			TimeAlive:  score.TimeAlive,
			CreatedAt:  score.CreatedAt,
		})
	}

	return entries, nil
}

// GetLeaderboardStats busca estatísticas gerais do leaderboard
func GetLeaderboardStats() (*LeaderboardStats, error) {
	var scores []GameScore
	result := db.Find(&scores)
	if result.Error != nil {
		return nil, result.Error
	}

	if len(scores) == 0 {
		return &LeaderboardStats{
			TotalScores:      0,
			AverageScore:     0,
			HighestScore:     0,
			AverageWave:      0,
			AverageTimeAlive: 0,
			TopPlayer:        "N/A",
		}, nil
	}

	// Calcula estatísticas
	totalScore := 0
	totalWave := 0
	totalTime := 0.0
	maxScore := 0
	topPlayer := ""

	for _, score := range scores {
		totalScore += score.Score
		totalWave += score.Wave
		totalTime += score.TimeAlive

		if score.Score > maxScore {
			maxScore = score.Score
			topPlayer = score.PlayerName
		}
	}

	count := len(scores)
	stats := &LeaderboardStats{
		TotalScores:      count,
		AverageScore:     float64(totalScore) / float64(count),
		HighestScore:     maxScore,
		AverageWave:      float64(totalWave) / float64(count),
		AverageTimeAlive: totalTime / float64(count),
		TopPlayer:        topPlayer,
	}

	return stats, nil
}

// GetPlayerStats busca as estatísticas de um jogador específico
func GetPlayerStats(playerName string) (*PlayerStats, error) {
	if playerName == "" {
		return nil, errors.New("player name cannot be empty")
	}

	var scores []GameScore
	result := db.Where("player_name = ?", playerName).Order("score DESC").Find(&scores)
	if result.Error != nil {
		return nil, result.Error
	}

	if len(scores) == 0 {
		return nil, errors.New("player not found")
	}

	// Calcula estatísticas do jogador
	bestScore := 0
	bestWave := 0
	totalScore := 0
	totalWave := 0

	topScores := []GameScore{}
	for i, score := range scores {
		totalScore += score.Score
		totalWave += score.Wave

		if score.Score > bestScore {
			bestScore = score.Score
		}
		if score.Wave > bestWave {
			bestWave = score.Wave
		}

		// Pega top 5 scores
		if i < 5 {
			topScores = append(topScores, score)
		}
	}

	// Calcula ranking do jogador
	var countAbove int64
	db.Model(&GameScore{}).Where("score > ?", bestScore).Select("COUNT(DISTINCT player_name)").Row().Scan(&countAbove)
	ranking := int(countAbove) + 1

	stats := &PlayerStats{
		PlayerName:   playerName,
		TotalGames:   len(scores),
		BestScore:    bestScore,
		AverageScore: float64(totalScore) / float64(len(scores)),
		BestWave:     bestWave,
		AverageWave:  float64(totalWave) / float64(len(scores)),
		Ranking:      ranking,
		TopScores:    topScores,
	}

	return stats, nil
}

// GetLeaderboardByWave busca o leaderboard filtrado por wave mínimo
func GetLeaderboardByWave(minWave int, limit int) ([]LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	var scores []GameScore
	result := db.Where("wave >= ?", minWave).Order("score DESC").Limit(limit).Find(&scores)
	if result.Error != nil {
		return nil, result.Error
	}

	var entries []LeaderboardEntry
	for i, score := range scores {
		entries = append(entries, LeaderboardEntry{
			Rank:       i + 1,
			PlayerName: score.PlayerName,
			Score:      score.Score,
			Wave:       score.Wave,
			TimeAlive:  score.TimeAlive,
			CreatedAt:  score.CreatedAt,
		})
	}

	return entries, nil
}

// GetTotalPlayers retorna o número total de jogadores únicos
func GetTotalPlayers() (int64, error) {
	var count int64
	result := db.Model(&GameScore{}).Distinct("player_name").Count(&count)
	return count, result.Error
}
