package logic

import "testing"

func TestNewGame(t *testing.T) {
	g := NewGame()

	if g.GameId[0] != 'G' {
		t.Errorf("Expected game ID to start with G -- got ID \"%s\"", g.GameId)
	}
}

func TestAddPlayer(t *testing.T) {
	g, p := sampleGameWithPlayer()

	if g.Players[0] != p {
		t.Errorf("Expected player to be player 0 -- got wrong address")
	}

	if g.Fields[p.PlayerId] == nil {
		t.Error("Expected field to be initialized for player -- got nil")
	}
}

func TestActionFlag(t *testing.T) {
	g, p := sampleGameWithPlayer()

	g.ToggleFlaggedSquare(*p, 0, 0)

	if g.Fields[p.PlayerId].Squares[0][0].IsFlagged == false {
		t.Error("Expected sqaure to be flagged, but it was not.")
	}

	flagCount := g.Fields[p.PlayerId].FlagCount
	if flagCount != 1 {
		t.Errorf("Expected field to report 1 flag, but it reported %d.", flagCount)
	}
}

func sampleGameWithPlayer() (g *Game, p *Player) {
	g = NewGame()
	p = &Player{
		PlayerId: "P1000",
		Name:     "Gopher",
	}

	g.AddPlayer(p)

	return
}
