package main

type game struct {
	GameId  string
	Players []player

	RowCount int
	ColCount int

	Fields map[string]field
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
