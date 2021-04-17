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

type field struct {
	ColCount, RowCount int

	// Squares holds squares in [x][y] order.
	// It's a slice of columns, each of which is a slice of squares.
	Squares [][]square
}

func NewField() *field {
	f := &field{
		ColCount: defaultColCount,
		RowCount: defaultRowCount,
		Squares:  make([][]square, 0, defaultColCount),
	}
	rando := randomizer{}
	for x := 0; x < f.ColCount; x++ {
		nextCol := make([]square, f.RowCount)
		f.Squares = append(f.Squares, nextCol)
		for y := 0; y < f.RowCount; y++ {
			f.Squares[x][y].Coordinates = xyPair{x, y}
			f.Squares[x][y].IsMine = rando.next()
		}
	}
	return f
}

type randomizer struct {
	index      int
	boolValues []bool
}

func (r *randomizer) next() bool {
	if r.index == 0 {
		r.boolValues = make([]bool, defaultColCount*defaultRowCount)
		for i := range r.boolValues {
			if i < numberOfMinesToCreate {
				r.boolValues[i] = true
			} else {
				break
			}
		}

		rand.Shuffle(len(r.boolValues), func(i, j int) {
			r.boolValues[i], r.boolValues[j] = r.boolValues[j], r.boolValues[i]
		})
	}

	if r.index >= len(r.boolValues) {
		panic("randomizer.next called too many times.")
	}

	result := r.boolValues[r.index]
	r.index++
	return result
}

type square struct {
	Coordinates                             xyPair
	IsMine, IsFlagged, IsOpened, IsRevealed bool
	NumberOfMinesSurrounding                int
}

type xyPair struct{ X, Y int }
