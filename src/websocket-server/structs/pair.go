package structs

// input to the /register method
// specifies two players that will
// compete
type Pair struct {
	Id1 string `json:"Id1"`
	Id2 string `json:"Id2"`
}
