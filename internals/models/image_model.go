package models

type Image struct {
	ImageId   string `json:"imageId"`
	FileName  string `json:"fileName"`
	Size      int    `json:"size"`
	Path      string `json:"path"`
	CreatedBy string `json:"createdBy"`
}