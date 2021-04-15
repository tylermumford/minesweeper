package logic

import (
	"math/rand"
	"strconv"
)

type Game struct {
	GameId  string
	Players []*Player

	RowCount int
	ColCount int

	Fields map[string]field
}

func NewGame() *Game {
	g := Game{
		GameId:   "G" + strconv.Itoa(rand.Intn(2000)),
		Players:  make([]*Player, 2),
		RowCount: 16,
		ColCount: 9,
		Fields:   make(map[string]field),
	}
	return &g
}

type field struct {
	RowCount int
	ColCount int

	Squares [][]square
}

type square struct {
	Coordinates                             struct{ X, Y int }
	IsMine, IsFlagged, IsOpened, IsRevealed bool
	NumberOfMinesSurrounding                int
}
