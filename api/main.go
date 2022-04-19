package main

import (
	"bytes"
	"github.com/ProtonMail/gopenpgp/v2/crypto"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"voting-service/api/encryption"
	"voting-service/api/models"
)

var secrets = map[int]models.Voter{
	2056: {Name: "Gheorghe Andrei", Email: "gheorgheandrei13@gmail.com", Pass: []byte("password"), Vote: []byte("0"), Bits: 2056},
}

var keys = map[int]crypto.KeyRing{}

func loginEndpoint(c *gin.Context) {
	requestBody := models.Form{}
	err := c.BindJSON(&requestBody)
	println(err)
	if err != nil {
		println(err.Error())
		c.JSON(400, gin.H{
			"message": "pong",
		})
	}

	if val, ok := secrets[requestBody.Bits]; ok {
		password := bytes.NewBuffer(val.Pass).String()
		if requestBody.Password == password {
			println("Da")
			publicKey := encryption.GenerateKeys(*models.NewVoter())
			keys[requestBody.Bits] = publicKey
			c.JSON(200, gin.H{
				"message": "success",
			})
			return
		}
	}

	c.JSON(400, gin.H{
		"message": "pong",
	})
}

func voteEndpoint(c *gin.Context) {
	requestBody := models.Vote{}
	err := c.BindJSON(&requestBody)
	if err != nil {
		println(err.Error())
		c.JSON(400, gin.H{
			"message": "pong",
		})
	}

	keyPacket, dataPacket := encryption.EncryptVote()
	c.JSON(200, gin.H{
		"key":    keyPacket,
		"packet": dataPacket,
	})
}

func checkVotePacket(c *gin.Context) {
	requestBody := models.EncryptedVote{}
	err := c.BindJSON(&requestBody)
	if err != nil {
		println(err.Error())
		c.JSON(400, gin.H{
			"message": "pong",
		})
	}

	vote := encryption.DecodeVote(requestBody.KeyPacket, requestBody.DataPacket)
	c.JSON(400, gin.H{
		"vote": vote,
	})
}

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/login", loginEndpoint)
	router.POST("/vote", voteEndpoint)
	router.POST("/check", checkVotePacket)
	return router
}

func main() {
	r := setupRouter()
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
