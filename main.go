package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"protrack/apis"
	"protrack/database"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	_ "github.com/go-sql-driver/mysql"
)

type ViteManifest map[string]struct {
	File string `json:"file"`
}

var db *database.DbConnection

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	port, _err := strconv.Atoi(os.Getenv("DB_PORT"))
	if _err != nil {
		port = 3306
	}

	var err error
	// db will be shared across routes that needed the connection
	db, err = database.NewConnection(database.DbConfig{
		Host:     os.Getenv("DB_HOST"),
		Port:     port,
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Database: os.Getenv("DB_DATABASE"),
	})

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("Database connected successfully!")

	r := gin.Default()

	// Determine if we're in dev mode
	isDev := gin.Mode() == gin.DebugMode

	// Enable CORS in development mode for Vite HMR
	if isDev {
		r.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))
	}

	baseHtml := "frontend/index.html"
	if !isDev {
		baseHtml = "frontend/dist/index.html"
	}

	r.LoadHTMLFiles(baseHtml)

	// In production, load the Vite manifest to get hashed filenames
	var mainJS string
	if !isDev {
		manifestPath := filepath.Join("frontend", "dist", ".vite", "manifest.json")
		if data, err := os.ReadFile(manifestPath); err == nil {
			var manifest ViteManifest
			if err := json.Unmarshal(data, &manifest); err == nil {
				if entry, ok := manifest["src/main.js"]; ok {
					mainJS = entry.File
				}
			}
		}
		// Fallback if manifest parsing fails
		if mainJS == "" {
			mainJS = "main.js"
		}

		// Serve static assets in production
		r.Static("/assets", "./frontend/dist/assets")
		r.StaticFile("/vite.svg", "./frontend/dist/vite.svg")
	}

	// API routes
	api := r.Group("/api")

	apis.ApiRoute(db).Setup(api)

	// Serve index.html for all other routes (SPA)
	r.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"IsDev":  isDev,
			"MainJS": mainJS,
		})
	})

	// Start server on port 8080 (default)
	// Server will listen on 0.0.0.0:8080 (localhost:8080 on Windows)
	r.Run()

}
