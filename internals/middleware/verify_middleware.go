package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func VerifyJwt(c *gin.Context) {
	cookie, err := c.Cookie("Authorization")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_KEY")), nil
	})
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if c.FullPath() == "/v1/user" {
		claims := token.Claims.(*jwt.RegisteredClaims)
		c.AbortWithStatusJSON(http.StatusOK, gin.H{"email": claims.Issuer})
	}

	c.Next()
}

// verify Google login 
