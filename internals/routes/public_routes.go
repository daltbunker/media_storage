package routes

import (
    "daltbunker/media_storage/internals/controllers"
    "github.com/gin-gonic/gin"
)

func RegisterPublicRoutes(group *gin.RouterGroup, dbCnfg *controllers.DbCnfg) {
    group.GET("/auth/:provider", controllers.GetProviderAuth)
    group.GET("/auth/:provider/callback", controllers.GetProviderCallback)
    group.GET("/auth/:provider/logout", controllers.LogoutProvider)

    group.POST("/signup", dbCnfg.Signup)
    group.POST("/login", dbCnfg.Login)

    group.GET("/images", dbCnfg.GetImages)
    group.GET("/images/:id", dbCnfg.GetImageById)
}