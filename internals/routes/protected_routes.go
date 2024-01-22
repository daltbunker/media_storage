package routes

import (
	"daltbunker/media_storage/internals/controllers"

	"github.com/gin-gonic/gin"
)

func RegisterProtectedRoutes(group *gin.RouterGroup, dbCnfg *controllers.DbCnfg) {
	// verify_middleware catches this and return 200 if token is valid
	group.GET("/user")

    group.POST("/images", dbCnfg.PostImage)
    group.DELETE("/images/:id", dbCnfg.DeleteImage)
    group.PUT("/images/:id", dbCnfg.UpdateImage)
}