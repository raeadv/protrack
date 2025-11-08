package apis

import (
	"errors"
	"fmt"
	"net/http"
	"protrack/database"

	"github.com/gin-gonic/gin"
)

type OptionDataset struct {
	Value int    `json:"value"`
	Label string `json:"label"`
}

type ResourcesApiRoute struct {
	db *database.DbConnection
}

func ResourcesRoute(db *database.DbConnection) *ResourcesApiRoute {
	return &ResourcesApiRoute{db}
}

func (r *ResourcesApiRoute) Setup(api *gin.RouterGroup) {

	api.GET("/dynamic/:type", func(c *gin.Context) {

		pType := c.Param("type")

		res, err := r.getDynamicResourceByType(pType, c)
		if err != nil {
			fmt.Println("Cannot get resource")
			fmt.Println(err)

			c.JSON(http.StatusBadRequest, gin.H{
				"status": false,
				"result": nil,
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  true,
			"options": res,
		})

	})

	api.GET("/autocomplete/:type/:query", func(c *gin.Context) {

		pType := c.Param("type")
		pQuery := c.Param("query")

		c.JSON(http.StatusOK, gin.H{
			"status": true,
			"result": nil,
		})

	})

}

func (r *ResourcesApiRoute) getDynamicResourceByType(pType string, c *gin.Context) ([]OptionDataset, error) {

	switch pType {
	case "roles":

		res, err := r.db.GetRoles(c)
		if err != nil {
			fmt.Println(err)
			return nil, errors.New("Failed to get roles : ")
		}

		var dataset []OptionDataset
		for _, r := range res {
			dataset = append(dataset, OptionDataset{
				int(r.ID),
				r.Name,
			})
		}

		return dataset, nil

	case "status":
		res, err := r.db.GetStatuses(c)
		if err != nil {
			fmt.Println(err)
			return nil, errors.New("Failed to get statuses : ")
		}

		var dataset []OptionDataset
		for _, r := range res {
			dataset = append(dataset, OptionDataset{
				int(r.ID),
				r.Name,
			})
		}

		return dataset, nil

	case "users":
		res, err := r.db.GetUsers(c)
		if err != nil {
			fmt.Println(err)
			return nil, errors.New("Failed to get users : ")
		}

		var dataset []OptionDataset
		for _, r := range res {
			dataset = append(dataset, OptionDataset{
				int(r.ID),
				r.Name,
			})
		}

		return dataset, nil

	default:
		return nil, errors.New("invalid pType received")
	}

}
