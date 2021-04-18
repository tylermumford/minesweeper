package logic

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

	forEachSquare(f, func(sq *square) {
		count := 0
		forEachSurroundingSquare(*sq, f, func(neighbor square) {
			if neighbor.IsMine {
				count++
			}
		})
		sq.NumberOfMinesSurrounding = count
	})

	return f
}

func forEachSquare(f *field, action func(*square)) {
	for _, col := range f.Squares {
		for i := range col {
			action(&col[i])
		}
	}
}

func forEachSurroundingSquare(s square, f *field, action func(square)) {
	matrix := []xyPair{
		{X: -1, Y: -1},
		{X: 0, Y: -1},
		{X: 1, Y: -1},
		{X: 1, Y: 0},
		{X: 1, Y: 1},
		{X: 0, Y: 1},
		{X: -1, Y: 1},
		{X: -1, Y: 0},
	}
	for _, relativeCoord := range matrix {
		lookupX, lookupY := relativeCoord.X+s.Coordinates.X, relativeCoord.Y+s.Coordinates.Y
		xInBounds := lookupX >= 0 && lookupX < f.ColCount
		yInBounds := lookupY >= 0 && lookupY < f.RowCount

		if xInBounds && yInBounds {
			action(f.Squares[lookupX][lookupY])
		}
	}
}
