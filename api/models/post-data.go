package models

type Form struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Vote     string `json:"vote"`
	Bits     int    `json:"bits" binding:"required"`
	Password string `json:"password" binding:"required"`
}
