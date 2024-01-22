package main

import (
	"daltbunker/media_storage/internals/app"
	"daltbunker/media_storage/internals/auth"
	"daltbunker/media_storage/internals/controllers"
	"daltbunker/media_storage/internals/middleware"
	"daltbunker/media_storage/internals/routes"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
	}

	dbCnfg := controllers.DbCnfg{
		Conn: app.Connect(),
	}

	auth.NewAuth() // for google oauth

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowCredentials: true,
	  }))

	v1 := router.Group("/v1")
	protected := router.Group("/v1", middleware.VerifyJwt)

	routes.RegisterPublicRoutes(v1, &dbCnfg)
	routes.RegisterProtectedRoutes(protected, &dbCnfg)

	err = router.Run(":" + os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}
}
