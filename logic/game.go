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

func (g *Game) AddPlayer(p *Player) error {
	g.Players = append(g.Players, p)
	g.Fields[p.PlayerId] = NewField()
	return nil
}

func (g *Game) SelectSquare(p Player, x, y int) {
	f := g.Fields[p.PlayerId]
	sq := &f.Squares[x][y]

	sq.IsOpened = true
}
