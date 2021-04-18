package logic

import "testing"

func TestSelectSquareSetsOpened(t *testing.T) {
	g := NewGame()
	p := Player{
		PlayerId: "P5587",
		Name:     "Pixelmator",
	}
	g.AddPlayer(&p)

	g.SelectSquare(p, 4, 4)

	sq := g.Fields[p.PlayerId].Squares[4][4]
	if sq.IsOpened != true {
		t.Error("Expected SelectSquare to set IsOpened = true")
	}
}
