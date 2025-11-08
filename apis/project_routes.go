package apis

import (
	"database/sql"
	"net/http"
	customtypes "protrack/custom_types"
	"protrack/database"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProjectForm struct {
	Title       string                  `json:"title" binding:"required"`
	Description string                  `json:"description" binding:"required"`
	StartDate   customtypes.DateFormats `json:"startDate"`
	EndDate     customtypes.DateFormats `json:"endDate"`
	Status      int8                    `json:"status"`
}

type ProjectApiRoutes struct {
	db *database.DbConnection
}

func ProjectRoute(db *database.DbConnection) *ProjectApiRoutes {
	return &ProjectApiRoutes{db: db}
}

func (p *ProjectApiRoutes) Setup(api *gin.RouterGroup) {

	api.GET("/", func(c *gin.Context) {

		var paginatedParam database.GetProjectsPaginatedParams

		c.ShouldBindQuery(&paginatedParam)

		projects, err := p.db.GetProjectsPaginated(c, paginatedParam)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "failed to get projects",
				"reason":  err.Error(),
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"status":   "ok",
			"message":  "ready to load projects data",
			"projects": projects,
		})

	})

	api.POST("/:id", func(c *gin.Context) {
		targetId := c.Param("id")

		id, err := strconv.ParseInt(targetId, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "Invalid project ID",
			})
		}

		var project ProjectForm
		if err := c.ShouldBindJSON(&project); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		updates := database.UpdateProjectParams{
			Title:       project.Title,
			Description: sql.NullString{String: project.Description, Valid: project.Description != ""},
			StartDate:   sql.NullTime{Time: project.StartDate.Time, Valid: !project.StartDate.IsZero()},
			EndDate:     sql.NullTime{Time: project.EndDate.Time, Valid: !project.EndDate.IsZero()},
			Status:      project.Status,
			ID:          id,
		}

		res, err := p.db.UpdateProject(c.Request.Context(), updates)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Failed to get inserted ID",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "project created successfully",
			"id":      id,
			"project": res,
		})

	})

	api.POST("/", func(c *gin.Context) {
		var project ProjectForm

		if err := c.ShouldBindJSON(&project); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		// Insert project into database using sqlc
		params := database.CreateProjectParams{
			Title:       project.Title,
			Description: sql.NullString{String: project.Description, Valid: project.Description != ""},
			StartDate:   sql.NullTime{Time: project.StartDate.Time, Valid: !project.StartDate.IsZero()},
			EndDate:     sql.NullTime{Time: project.EndDate.Time, Valid: !project.EndDate.IsZero()},
			Status:      int8(project.Status),
		}

		result, err := p.db.CreateProject(c.Request.Context(), params)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create project",
			})
			return
		}

		// Get the inserted ID
		insertedID, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to get inserted ID",
			})
			return
		}

		// Process the data
		c.JSON(http.StatusOK, gin.H{
			"message": "project created successfully",
			"id":      insertedID,
			"project": project,
		})

	})

	api.DELETE("/:id", func(c *gin.Context) {
		targetId := c.Param("id")

		id, err := strconv.ParseInt(targetId, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "Invalid project ID",
			})
		}

		err = p.db.DeleteProject(c, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "failed to get project by ID",
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "project fetched successfully",
			"id":      targetId,
		})

	})

	api.GET("/:id", func(c *gin.Context) {
		targetId := c.Param("id")

		id, err := strconv.ParseInt(targetId, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "Invalid project ID",
			})
		}

		project, err := p.db.FindProject(c, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "fail",
				"message": "failed to fetch project",
			})
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "project fetched successfully",
			"project": project,
		})

	})

}
