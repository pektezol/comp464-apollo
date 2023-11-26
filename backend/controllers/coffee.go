package controllers

import (
	"apollo/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Coffee struct {
	// ID    int          `json:"id"`
	Name  string       `json:"name"`
	Sizes []CoffeeSize `json:"sizes"`
}

type CoffeeSize struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

type CoffeeSizeNoPrice struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetCoffeeTypes(c *gin.Context) {
	// _, exists := c.Get("user")
	// if !exists {
	// 	c.JSON(http.StatusOK, ErrorResponse("User not logged in."))
	// 	return
	// }
	type CoffeeTypesResponse struct {
		Coffees []Coffee `json:"coffees"`
	}
	var coffees []Coffee
	query := `SELECT c.coffee_name, c.price, c.id, cs.size_name FROM coffee c INNER JOIN coffee_size cs ON c.size_id = cs.id`
	rows, err := database.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		var coffee Coffee
		var price int
		var sizeID int
		var sizeName string
		err := rows.Scan(&coffee.Name, &price, &sizeID, &sizeName)
		if err != nil {
			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
			return
		}
		if len(coffees) != 0 {
			if coffees[len(coffees)-1].Name == coffee.Name {
				coffees[len(coffees)-1].Sizes = append(coffees[len(coffees)-1].Sizes, CoffeeSize{
					ID:    sizeID,
					Name:  sizeName,
					Price: price,
				})
				continue
			}
			coffee.Sizes = append(coffee.Sizes, CoffeeSize{
				ID:    sizeID,
				Name:  sizeName,
				Price: price,
			})
			coffees = append(coffees, coffee)
			continue
		}
		coffee.Sizes = append(coffee.Sizes, CoffeeSize{
			ID:    sizeID,
			Name:  sizeName,
			Price: price,
		})
		coffees = append(coffees, coffee)
	}
	c.JSON(http.StatusOK, OkayResponse(CoffeeTypesResponse{Coffees: coffees}))
}

// func GetCoffeeSizes(c *gin.Context) {
// 	type CoffeeSizesResponse struct {
// 		Sizes []CoffeeSizeNoPrice `json:"sizes"`
// 	}
// 	var sizes []CoffeeSizeNoPrice
// 	query := `SELECT id, size_name FROM coffee_size`
// 	rows, err := database.DB.Query(query)
// 	if err != nil {
// 		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
// 		return
// 	}
// 	for rows.Next() {
// 		var size CoffeeSizeNoPrice
// 		err = rows.Scan(&size.ID, &size.Name)
// 		if err != nil {
// 			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
// 			return
// 		}
// 		sizes = append(sizes, size)
// 	}
// 	c.JSON(http.StatusOK, OkayResponse(CoffeeSizesResponse{Sizes: sizes}))
// }

func CreateCoffeeType(c *gin.Context) {
	// _, exists := c.Get("user")
	// if !exists {
	// 	c.JSON(http.StatusOK, ErrorResponse("User not logged in."))
	// 	return
	// }
	type CoffeeRequest struct {
		CoffeeName string `json:"coffee_name" binding:"required"`
		Prices     [3]int `json:"prices" binding:"required"`
	}
	var req CoffeeRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusOK, ErrorResponse(err.Error()))
		return
	}
	for _, price := range req.Prices {
		if price == 0 {
			c.JSON(http.StatusOK, ErrorResponse("give prices for all 3 sizes"))
			return
		}
	}
	for i := 0; i < 3; i++ {
		query := `INSERT INTO coffee (coffee_name,size_id,price) VALUES ($1, $2, $3)`
		_, err = database.DB.Exec(query, req.CoffeeName, i+1, req.Prices[i])
		if err != nil {
			c.JSON(http.StatusOK, ErrorResponse(err.Error()))
			return
		}
	}
	c.JSON(http.StatusOK, OkayResponse(req))
}
