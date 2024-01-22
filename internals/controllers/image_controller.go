package controllers

import (
	"context"
	"net/http"
	"path/filepath"

	"daltbunker/media_storage/internals/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (dbCnfg *DbCnfg) GetImages(c *gin.Context) {

	limit := c.DefaultQuery("limit", "9")
	offset := c.DefaultQuery("offset", "0")
	sort := c.DefaultQuery("sort", "filename")

	var images []models.Image
	rows, err := dbCnfg.Conn.Query(
		context.Background(),
		// using sort as $1 param doesn't work, it gets inserted as 'val'
		"select imageId, fileName, size, path, createdBy from image order by "+sort+" limit $1 offset $2",
		limit,
		offset)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var img models.Image
		if err := rows.Scan(&img.ImageId, &img.FileName, &img.Size, &img.Path, &img.CreatedBy); err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}
		images = append(images, img)
	}

	if err := rows.Err(); err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, images)
}

func (dbCnfg *DbCnfg) GetImageById(c *gin.Context) {
	id := c.Param("id")
	var path string
	err := dbCnfg.Conn.QueryRow(context.Background(), "select path from image where imageId=$1", id).Scan(&path)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.File(path)
}

func (dbCnfg *DbCnfg) PostImage(c *gin.Context) {

	username := "user1" // TODO: get this from header or something like that
	file, err := c.FormFile("file")

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	ext := filepath.Ext(file.Filename)
	uniqueFileName := uuid.New().String() + ext

	if err = c.SaveUploadedFile(file, "images/"+uniqueFileName); err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	_, err = dbCnfg.Conn.Exec(
		context.Background(),
		"INSERT INTO image (fileName, path, size, createdBy) VALUES ($1, $2, $3, $4)",
		file.Filename,
		"images/"+uniqueFileName,
		file.Size,
		username)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "uploaded image successfully!"})
}

func (dbCnfg *DbCnfg) DeleteImage(c *gin.Context) {
	id := c.Param("id")
	status, err := dbCnfg.Conn.Exec(context.Background(), "delete from image where imageId=$1", id)

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	if status.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "image not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted image successfully!"})
}

func (dbCnfg *DbCnfg) UpdateImage(c *gin.Context) {
	// TODO: validate file extension
	id := c.Param("id")
	var image models.Image

	if err := c.BindJSON(&image); err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	status, err := dbCnfg.Conn.Exec(context.Background(), "update image set fileName=$1 where imageId=$2", image.FileName, id)

	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	if status.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "image not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "updated image successfully!"})
}
