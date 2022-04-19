package encryption

import (
	"bytes"
	"voting-service/api/models"

	"github.com/ProtonMail/gopenpgp/v2/crypto"
	"github.com/ProtonMail/gopenpgp/v2/helper"
	"gopkg.in/alecthomas/kingpin.v2"
)

var (
	voter          = models.NewVoter()
	privateKeyring = crypto.KeyRing{}
	publicKeyring  = crypto.KeyRing{}
)

func generatePublicKeyring(key string) *crypto.KeyRing {
	keyObj, err := crypto.NewKeyFromArmored(key)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	unlockedKeyObj, err := keyObj.Unlock(voter.Pass)
	kingpin.FatalIfError(err, "Error unlocking key: %s", err)

	publicKeyObj, err := unlockedKeyObj.ToPublic()
	kingpin.FatalIfError(err, "Error creating public key: %s", err)

	publicKeyRing, err := crypto.NewKeyRing(publicKeyObj)
	kingpin.FatalIfError(err, "Error creating public keyring: %s", err)

	return publicKeyRing
}
func generatePrivateKeyring(key string) *crypto.KeyRing {
	privateKeyObj, err := crypto.NewKeyFromArmored(key)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	unlockedKeyObj, err := privateKeyObj.Unlock(voter.Pass)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	privateKeyring, err := crypto.NewKeyRing(unlockedKeyObj)
	kingpin.FatalIfError(err, "Error creating private keyring: %s", err)

	return privateKeyring
}

func EncryptVote() ([]byte, []byte) {
	sessionKey, err := crypto.GenerateSessionKey()
	kingpin.FatalIfError(err, "Error creating session key: %s", err)
	keyPacket, err := (&publicKeyring).EncryptSessionKey(sessionKey)
	var message = crypto.NewPlainMessage(voter.Vote)
	dataPacket, err := sessionKey.Encrypt(message)
	return keyPacket, dataPacket
}

func GenerateKeys(voter models.Voter) crypto.KeyRing {
	key, err := helper.GenerateKey(voter.Name, voter.Email, voter.Pass, "rsa", voter.Bits)
	kingpin.FatalIfError(err, "Error generating RSA key: %s", err)
	privateKeyring = *generatePrivateKeyring(key)
	publicKeyring = *generatePublicKeyring(key)

	return publicKeyring
}

func DecodeVote(keyPacket []byte, dataPacket []byte) string {
	decodedKeyPacket, _ := privateKeyring.DecryptSessionKey(keyPacket)
	decodedDataPacket, _ := decodedKeyPacket.Decrypt(dataPacket)
	return bytes.NewBuffer(decodedDataPacket.Data).String()
}
