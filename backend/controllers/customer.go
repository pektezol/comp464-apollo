package controllers

import (
	"apollo/database"
	"net/http"
	"net/mail"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type Customer struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	UserName     string    `json:"user_name"`
	Email        string    `json:"email"`
	CreationDate time.Time `json:"creation_date" time_format:"2006-01-02"`
}

func GetCustomerData(c *gin.Context) {
	// _, exists := c.Get("user")
	// if !exists {
	// 	c.JSON(http.StatusOK, ErrorResponse("User not logged in."))
	// 	return
	// }
	customerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	var customer Customer
	query := `SELECT id, first_name, last_name, user_name, email, creation_date FROM customer WHERE id = $1`
	err = database.DB.QueryRow(query, customerID).Scan(&customer.ID, &customer.FirstName, &customer.LastName, &customer.UserName, &customer.Email, &customer.CreationDate)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, OkayResponse(customer))
}

func Register(c *gin.Context) {
	type RegisterRequest struct {
		FirstName string `json:"first_name" binding:"required"`
		LastName  string `json:"last_name" binding:"required"`
		UserName  string `json:"user_name" binding:"required"`
		Email     string `json:"email" binding:"required"`
		Password  string `json:"password" binding:"required"`
	}
	var req RegisterRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 8)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	_, err = mail.ParseAddress(req.Email)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse("Invalid email."))
		return
	}
	query := `INSERT INTO customer (first_name,last_name,user_name,email,password) VALUES ($1,$2,$3,$4,$5)`
	_, err = database.DB.Exec(query, req.FirstName, req.LastName, req.UserName, req.Email, hashedPassword)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, OkayResponse(req))
}

func Login(c *gin.Context) {
	type LoginRequest struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	var req LoginRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	var email string
	var password string
	sql := `SELECT email, password FROM customer WHERE email = $1;`
	database.DB.QueryRow(sql, req.Email).Scan(&email, &password)
	if email == "" {
		c.JSON(http.StatusOK, ErrorResponse("Invalid credentials.s"))
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse("Invalid credentials."))
		return
	}
	token, err := createTokenJWT(email)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, OkayResponse(token))
}

func createTokenJWT(email string) (string, error) {
	token := jwt.New(jwt.GetSigningMethod("HS256"))
	exp := time.Now().Add(time.Hour * 24 * 14)
	token.Claims = &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(exp),
		Subject:   email,
	}
	signed, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		return "", err
	}
	return signed, nil
}
