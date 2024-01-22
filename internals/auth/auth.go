package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

type Claims struct {
    Username string `json:"username"`
    jwt.RegisteredClaims
}

func GenerateJWT(issuer string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
		Issuer: issuer,
	})

	key := []byte(os.Getenv("JWT_KEY"))
	signedToken, err := token.SignedString(key)
	if err != nil {
		return "", fmt.Errorf("failed generating token for %s", issuer) 
	}

	return signedToken, nil
}

func NewAuth() {
	googleClient := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	googleSecret := os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET") 

	store := sessions.NewCookieStore([]byte(os.Getenv("KEY")))
	store.MaxAge(86400 * 30)

	store.Options.Path = "/"
	store.Options.HttpOnly = true 
	store.Options.Secure = false 

	gothic.Store = store

	goth.UseProviders(
		google.New(googleClient, googleSecret, "http://localhost:8080/v1/auth/google/callback"),
	)
}