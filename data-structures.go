package main

import (
	"math/rand"
	"strconv"
)

type game struct {
	GameId  string
	Players []player

	RowCount int
	ColCount int

	Fields map[string]field
}

func newGame() *game {
	g := game{
		GameId:   "G" + strconv.Itoa(rand.Intn(2000)),
		Players:  make([]player, 0, 2),
		RowCount: 16,
		ColCount: 9,
		Fields:   make(map[string]field),
	}
	return &g
}

type player struct {
	PlayerId string
	Name     string
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
