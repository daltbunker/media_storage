package controllers

import (
	"context"
	"daltbunker/media_storage/internals/auth"
	"daltbunker/media_storage/internals/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/markbates/goth/gothic"
	"golang.org/x/crypto/bcrypt"
)

type DbCnfg struct {
	Conn *pgxpool.Pool
}

func setAuthCookie(c *gin.Context, token string, expiresAt int) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(
		"Authorization",
		token,
		expiresAt, // 3600 = 1 hour
		"/",
		"localhost",
		false, // secure:false for testing
		false) // httpOnly:false for testing
}

func (dbCnfg *DbCnfg) Login(c *gin.Context) {
	var user models.User;
	if c.Bind(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to parse user"})
		return
	}

	var hashedPassword string;
	err := dbCnfg.Conn.QueryRow(context.Background(), "select password from users where email=$1", user.Email).Scan(&hashedPassword)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email not found"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect password"})
		return
	}

	signedToken, err := auth.GenerateJWT(user.Email) 
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	setAuthCookie(c, signedToken, 3600 * 24)

	c.JSON(http.StatusOK, gin.H{"message": "login successful", "email": user.Email})
}

func (dbCnfg *DbCnfg) Signup(c *gin.Context) {
	var user models.User;
	if c.Bind(&user) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to parse user"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to hash password"})
		return
	}

	_, err = dbCnfg.Conn.Exec(
		context.Background(),
		"INSERT INTO users (email, password) VALUES ($1, $2)",
		user.Email,
		hash)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to insert user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{})
}

func Logout(c *gin.Context) {

}


// google Oauth
func GetProviderCallback(c *gin.Context) {
	res := c.Writer
	req := c.Request
	provider := c.Param("provider")

	req = req.WithContext(context.WithValue(context.Background(), "provider", provider))

	user, err := gothic.CompleteUserAuth(res, req)
	if err != nil {
		fmt.Fprintln(res, err)
		return
	}

	fmt.Println(user)
	signedToken, err := auth.GenerateJWT(user.Email)
	if err != nil {
		fmt.Fprintln(res, err)
		return
	}
	setAuthCookie(c, signedToken, int(time.Until(user.ExpiresAt)))

	http.Redirect(res, req, "http://localhost:5173", http.StatusFound)
}

func LogoutProvider(c *gin.Context) {
	res := c.Writer
	req := c.Request
	gothic.Logout(res, req)
	res.Header().Set("Location", "/")
	res.WriteHeader(http.StatusTemporaryRedirect)
}

 func GetProviderAuth(c *gin.Context) {
	res := c.Writer
	req := c.Request

	provider := c.Param("provider")
	req = req.WithContext(context.WithValue(context.Background(), "provider", provider))

	if _, err := gothic.CompleteUserAuth(res, req); err == nil {
		http.Redirect(res, req, "http://localhost:5173", http.StatusFound)
	} else {
		gothic.BeginAuthHandler(res, req)
	}
 }