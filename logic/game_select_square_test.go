package logic

import "testing"

func TestOpenSquareSetsOpened(t *testing.T) {
	g := NewGame()
	p := Player{
		PlayerId: "P5587",
		Name:     "Pixelmator",
	}
	g.AddPlayer(&p)

	g.OpenSquare(p, 4, 4)

	sq := g.Fields[p.PlayerId].Squares[4][4]
	if sq.IsOpened != true {
		t.Error("Expected OpenSquare to set IsOpened = true")
	}
}
