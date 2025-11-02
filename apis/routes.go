package apis

import (
	"protrack/database"

	"github.com/gin-gonic/gin"
)

type ApiRouteList struct {
	db *database.DbConnection
}

func ApiRoute(db *database.DbConnection) *ApiRouteList {
	return &ApiRouteList{db: db}
}

func (a *ApiRouteList) Setup(api *gin.RouterGroup) {

	project := api.Group("/projects")

	ProjectRoute(a.db).Setup(project)

}
