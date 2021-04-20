package logic

import "testing"

func TestNewGame(t *testing.T) {
	g := NewGame()

	if g.GameId[0] != 'G' {
		t.Errorf("Expected game ID to start with G -- got ID \"%s\"", g.GameId)
	}
}

func TestAddPlayer(t *testing.T) {
	g := NewGame()
	p := Player{
		PlayerId: "P1000",
		Name:     "Gopher",
	}

	g.AddPlayer(&p)

	if g.Players[0] != &p {
		t.Errorf("Expected player to be player 0 -- got wrong address")
	}

	if g.Fields[p.PlayerId] == nil {
		t.Error("Expected field to be initialized for player -- got nil")
	}
}
