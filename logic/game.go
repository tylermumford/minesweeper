// Package logic contains types and functions for modeling games of
// minesweeper wherein several players play on interdependent but
// distinct minefields.
package logic

import (
	"math/rand"
	"strconv"
)

const defaultColCount = 9
const defaultRowCount = 16

const numberOfMinesToCreate = 41 // Roughly 28% of squares

type Game struct {
	GameId  string
	Players []*Player

	ColCount int
	RowCount int

	// Fields is a map of Player IDs to fields.
	Fields map[string]*field
}

func NewGame() *Game {
	g := Game{
		GameId:   "G" + strconv.Itoa(rand.Intn(2000)),
		Players:  make([]*Player, 0, 2),
		RowCount: defaultRowCount,
		ColCount: defaultColCount,
		Fields:   make(map[string]*field),
	}
	return &g
}

// AddPlayer adds a player to a game and creates a new field for them.
// If the player is already in the game, this does nothing and returns no error.
func (g *Game) AddPlayer(p *Player) {
	if g.Fields[p.PlayerId] == nil {
		g.Players = append(g.Players, p)
		g.Fields[p.PlayerId] = NewField()
	}
}

func (g *Game) OpenSquare(p Player, x, y int) {
	f := g.Fields[p.PlayerId]
	sq := &f.Squares[x][y]

	if sq.IsFlagged {
		return
	}

	sq.IsOpened = true
	g.revealSquares(x, y)
}

func (g *Game) ToggleFlaggedSquare(p Player, x, y int) {
	f := g.Fields[p.PlayerId]
	sq := &f.Squares[x][y]

	if sq.IsOpened {
		return
	}

	sq.IsFlagged = !sq.IsFlagged
	sq.IsRevealed = false
	g.revealSquares(x, y)
}

func (g *Game) revealSquares(x, y int) {
	linkedSquares := make([]*square, 0, len(g.Fields))
	for i := range g.Fields {
		s := &g.Fields[i].Squares[x][y]
		linkedSquares = append(linkedSquares, s)

		if !(s.IsOpened || s.IsFlagged) {
			// Can't reveal any squares. Done.
			return
		}
	}

	for _, s := range linkedSquares {
		s.IsRevealed = true
	}
}
