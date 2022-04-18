package encryption

import (
	"encoding/binary"
	"io"
	"os"
	"path/filepath"
	"time"
	"voting-service/api/models"

	"crypto/rand"

	"github.com/ProtonMail/gopenpgp/v2/crypto"
	"github.com/ProtonMail/gopenpgp/v2/helper"
	"golang.org/x/crypto/openpgp"
	"golang.org/x/crypto/openpgp/armor"
	"golang.org/x/crypto/openpgp/packet"
	"golang.org/x/crypto/rsa"
	"gopkg.in/alecthomas/kingpin.v2"
)

var (
	voter        = models.NewVoter()
	privateKey   = "./res/pubring.gpg"
	keyOutputDir = "./res"
)

func decodePublicKey(filename string) *crypto.Key {
	in, err := os.Open(filename)
	kingpin.FatalIfError(err, "Error opening public key: %s", err)
	defer func(in *os.File) {
		err := in.Close()
		if err != nil {

		}
	}(in)

	publicKey, err := crypto.NewKeyFromReader(in)
	kingpin.FatalIfError(err, "Error reading key: %s", err)

	return publicKey
}

func decodePrivateKey(filename string) {
	in, err := os.Open(privateKey)
	kingpin.FatalIfError(err, "Error opening public key: %s", err)
	defer func(in *os.File) {
		err := in.Close()
		if err != nil {

		}
	}(in)

	publicKey, err := crypto.NewKeyFromReader(in)
	kingpin.FatalIfError(err, "Error reading key: %s", err)
	println(publicKey)
	// keyringFileBuffer, err := os.Open(privateKey)
	// kingpin.FatalIfError(err, "Error opening public key: %s", err)
	// defer keyringFileBuffer.Close()
	// bytes, err := ioutil.ReadAll(keyringFileBuffer)
	// kingpin.FatalIfError(err, "Error opening public key: %s", err)
	// encStr := base64.StdEncoding.EncodeToString(bytes)
	// println(encStr)
	// in, err := os.Open(filename)
	// kingpin.FatalIfError(err, "Error opening public key: %s", err)
	// defer in.Close()

	// privateKey, err := crypto.NewKeyFromReader(in)
	// kingpin.FatalIfError(err, "Error reading key: %s", err)

	// return privateKey
}

func encodePublicKey(out io.Writer, key *rsa.PrivateKey) *packet.PublicKey {
	err := binary.Write(out, binary.BigEndian, key)
	if err != nil {
		return nil
	}
	w, err := armor.Encode(out, openpgp.PublicKeyType, make(map[string]string))
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	pgpKey := packet.NewRSAPublicKey(time.Now(), &key.PublicKey)
	kingpin.FatalIfError(pgpKey.Serialize(w), "Error serializing public key: %s", err)
	kingpin.FatalIfError(w.Close(), "Error serializing public key: %s", err)
	return pgpKey
}

func encodePrivateKey(out io.Writer, key *rsa.PrivateKey) *packet.PrivateKey {
	_, err := out.Write(key.D.Bytes())
	if err != nil {
		return nil
	}
	w, err := armor.Encode(out, openpgp.PrivateKeyType, make(map[string]string))
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	pgpKey := packet.NewRSAPrivateKey(time.Now(), key)
	kingpin.FatalIfError(pgpKey.Serialize(w), "Error serializing private key: %s", err)
	kingpin.FatalIfError(w.Close(), "Error serializing private key: %s", err)
	return pgpKey
}

func generateKeys() (packet.PrivateKey, packet.PublicKey) {
	key, err := rsa.GenerateKey(rand.Reader, voter.Bits)
	kingpin.FatalIfError(err, "Error generating RSA key: %s", err)
	priv, err := os.Create(filepath.Join(keyOutputDir, "secring.gpg"))
	kingpin.FatalIfError(err, "Error writing private key to file: %s", err)
	defer func(priv *os.File) {
		err := priv.Close()
		if err != nil {

		}
	}(priv)

	pub, err := os.Create(filepath.Join(keyOutputDir, "pubring.gpg"))
	kingpin.FatalIfError(err, "Error writing public key to file: %s", err)
	defer func(pub *os.File) {
		err := pub.Close()
		if err != nil {

		}
	}(pub)

	return *encodePrivateKey(priv, key), *encodePublicKey(pub, key)
}

func encryptVote(key string) ([]byte, []byte) {
	keyObj, err := crypto.NewKeyFromArmored(key)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	unlockedKeyObj, err := keyObj.Unlock(voter.Pass)
	kingpin.FatalIfError(err, "Error unlocking key: %s", err)

	publicKeyObj, err := unlockedKeyObj.ToPublic()
	kingpin.FatalIfError(err, "Error creating public key: %s", err)

	publicKeyRing, err := crypto.NewKeyRing(publicKeyObj)
	kingpin.FatalIfError(err, "Error creating public keyring: %s", err)

	sessionKey, err := crypto.GenerateSessionKey()
	kingpin.FatalIfError(err, "Error creating session key: %s", err)
	keyPacket, err := publicKeyRing.EncryptSessionKey(sessionKey)
	println(keyPacket)
	var message = crypto.NewPlainMessage(voter.Vote)
	dataPacket, err := sessionKey.Encrypt(message)
	return keyPacket, dataPacket
}
func generatePrivateKeyring(key string) *crypto.KeyRing {
	privateKeyObj, err := crypto.NewKeyFromArmored(key)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	unlockedKeyObj, err := privateKeyObj.Unlock(voter.Pass)
	kingpin.FatalIfError(err, "Error creating OpenPGP Armor: %s", err)

	privateKeyring, err := crypto.NewKeyRing(unlockedKeyObj)
	kingpin.FatalIfError(err, "Error creating private keyring: %s", err)

	message := crypto.NewPlainMessage(voter.Vote)
	pgpSignature, err := privateKeyring.SignDetached(message)
	println(privateKeyring.VerifyDetached(message, pgpSignature, crypto.GetTime().Unix()) == nil)

	return privateKeyring
}

func generateArmor() {
	key, err := helper.GenerateKey(voter.Name, voter.Email, voter.Pass, "rsa", voter.Bits)
	kingpin.FatalIfError(err, "Error generating RSA key: %s", err)
	privateKeyring := generatePrivateKeyring(key)
	keyPacket, dataPacket := encryptVote(key)
	decodedKeyPacket, err := privateKeyring.DecryptSessionKey(keyPacket)
	println(decodedKeyPacket)
	decodedDataPacket, err := decodedKeyPacket.Decrypt(dataPacket)
	pgpSplitMessage := crypto.NewPGPSplitMessage(decodedKeyPacket.Key, decodedDataPacket.Data)
	pgpMessage := pgpSplitMessage.GetPGPMessage()
	println(pgpMessage)
}
