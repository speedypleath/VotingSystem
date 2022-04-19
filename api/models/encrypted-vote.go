package models

type EncryptedVote struct {
	DataPacket []byte
	KeyPacket  []byte
}
