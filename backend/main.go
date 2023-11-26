package main

import (
	"apollo/api"
	"apollo/database"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := gin.Default()
	database.ConnectDB()
	router.Use(cors.Default())
	api.InitializeRoutes(router)
	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
