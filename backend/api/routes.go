package api

import (
	"apollo/controllers"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(router *gin.Engine) {
	api := router.Group("/api")
	// Customer
	api.GET("/customer/:id", CheckAuth, controllers.GetCustomerData)
	api.POST("/register", controllers.Register)
	api.POST("/login", controllers.Login)
	// Order
	api.GET("/order", CheckAuth, controllers.GetCurrentOrders)
	api.POST("/order", CheckAuth, controllers.CreateOrder)
	// Coffee
	api.GET("/coffee", CheckAuth, controllers.GetCoffeeTypes)
	api.POST("/coffee", CheckAuth, controllers.CreateCoffeeType)
}
