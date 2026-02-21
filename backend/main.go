package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/rs/cors"
)

func main() {
	// Flags
	port := flag.String("port", ":8080", "Port to listen on")
	dbPath := flag.String("db", "leaderboard.db", "Path to SQLite database file")
	flag.Parse()

	log.Println("🎮 Entre no Balabirinto - Backend API")
	log.Println("=====================================")

	// Inicializa banco de dados
	if err := InitDB(*dbPath); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}

	// Setup de rotas
	router := SetupRoutes()

	// CORS middleware
	handler := cors.Default().Handler(router)

	// Inicia servidor
	log.Printf("🚀 Server listening on http://localhost%s", *port)
	log.Printf("📊 API Endpoints:")
	log.Println("   POST   /api/scores                 - Save a score")
	log.Println("   GET    /api/leaderboard            - Get top scores")
	log.Println("   GET    /api/leaderboard/stats      - Get leaderboard stats")
	log.Println("   GET    /api/leaderboard/wave       - Get leaderboard by wave")
	log.Println("   GET    /api/player/{name}/stats    - Get player stats")
	log.Println("   GET    /health                     - Health check")
	log.Println("=====================================")

	if err := http.ListenAndServe(*port, handler); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
