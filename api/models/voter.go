package models

type Voter struct {
	Name  string
	Email string
	Vote  []byte
	Bits  int
	Pass  []byte
}

func NewVoter() *Voter {
	p := new(Voter)
	p.Name = "Gheorghe Andrei"
	p.Email = "gheorgheandrei13@gmail.com"
	p.Vote = []byte("Secret vote")
	p.Bits = 4096
	p.Pass = []byte("Secret pass")
	return p
}
