package controllers

import (
	"apollo/database"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

func GetCurrentOrders(c *gin.Context) {
	// _, exists := c.Get("user")
	// if !exists {
	// 	c.JSON(http.StatusOK, ErrorResponse("User not logged in."))
	// 	return
	// }
	type Order struct {
		ID       int `json:"id"`
		Customer struct {
			ID        int    `json:"id"`
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
			UserName  string `json:"user_name"`
			Email     string `json:"email"`
		} `json:"customer"`
		CoffeeOrder []struct {
			Name  string `json:"name"`
			Size  string `json:"size"`
			Price int    `json:"price"`
		} `json:"coffee_order"`
		CreationDate time.Time `json:"creation_date"`
		OrderDate    time.Time `json:"order_date"`
	}
	var orderArray pq.Int32Array
	query := `SELECT o.id, c.id, c.first_name, c.last_name, c.user_name, c.email, o.coffee_order, o.creation_date, o.order_date FROM coffee_order o INNER JOIN customer c ON o.customer_id = c.id ORDER BY order_date DESC LIMIT 10`
	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	var orders []Order
	for rows.Next() {
		var order Order
		err := rows.Scan(&order.ID, &order.Customer.ID, &order.Customer.FirstName, &order.Customer.LastName, &order.Customer.UserName, &order.Customer.Email, &orderArray, &order.CreationDate, &order.OrderDate)
		if err != nil {
			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
			return
		}
		for _, coffeeID := range orderArray {
			var coffeeOrder struct {
				Name  string `json:"name"`
				Size  string `json:"size"`
				Price int    `json:"price"`
			}
			err := database.DB.QueryRow("SELECT c.coffee_name, s.size_name, c.price FROM coffee c INNER JOIN coffee_size s ON c.size_id = s.id WHERE c.id = $1 ", coffeeID).Scan(&coffeeOrder.Name, &coffeeOrder.Size, &coffeeOrder.Price)
			if err != nil {
				c.JSON(http.StatusOK, ErrorResponse(err.Error()))
				return
			}
			order.CoffeeOrder = append(order.CoffeeOrder, coffeeOrder)
		}
		orders = append(orders, order)
	}
	c.JSON(http.StatusOK, OkayResponse(orders))
}

func CreateOrder(c *gin.Context) {
	// _, exists := c.Get("user")
	// if !exists {
	// 	c.JSON(http.StatusOK, ErrorResponse("User not logged in."))
	// 	return
	// }
	type OrderRequest struct {
		CustomerEmail string        `json:"customer_email" binding:"required"`
		CoffeeOrder   pq.Int32Array `json:"coffee_order" binding:"required"`
		OrderDate     time.Time     `json:"order_date,omitempty"`
	}
	type OrderResponse struct {
		OrderID int `json:"order_id"`
	}
	var req OrderRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	var query string
	var orderID int
	var customerID int
	err = database.DB.QueryRow("SELECT id FROM customer WHERE email = $1", req.CustomerEmail).Scan(&customerID)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	if req.OrderDate.Year() < 1000 {
		query = `INSERT INTO coffee_order (customer_id,coffee_order) VALUES ($1, $2) RETURNING id;`
		err = database.DB.QueryRow(query, customerID, req.CoffeeOrder).Scan(&orderID)
		if err != nil {
			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
			return
		}
	} else {
		if req.OrderDate.Compare(time.Now()) < 0 {
			c.JSON(http.StatusOK, ErrorResponse("order date cannot be in the past"))
			return
		}
		query = `INSERT INTO coffee_order (customer_id,coffee_order,order_date) VALUES ($1, $2, $3) RETURNING id;`
		err = database.DB.QueryRow(query, customerID, req.CoffeeOrder, req.OrderDate).Scan(&orderID)
		if err != nil {
			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
			return
		}
	}
	c.JSON(http.StatusOK, OkayResponse(OrderResponse{
		OrderID: orderID,
	}))
}
