package logic

import "testing"

func TestNewField(t *testing.T) {
	f := NewField()

	if f.ColCount != defaultColCount {
		t.Errorf("Expected %d cols, but got %d", defaultColCount, f.ColCount)
	}
	if f.RowCount != defaultRowCount {
		t.Errorf("Expected %d rows, but got %d", defaultRowCount, f.RowCount)
	}
}

func TestNewFieldCoordinates(t *testing.T) {
	f := NewField()

	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			square := f.Squares[x][y]
			if square.Coordinates.X != x {
				t.Error("x coordinate incorrect")
			}
			if square.Coordinates.Y != y {
				t.Error("y coordinate incorrect")
			}
		}
	}
}

func TestNewFieldHasMines(t *testing.T) {
	f := NewField()

	mineCount := 0

	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			square := f.Squares[x][y]

			if square.IsMine {
				mineCount++
			}
		}
	}

	if mineCount != numberOfMinesToCreate {
		t.Errorf("Expected field to have %d mines, but found %d", numberOfMinesToCreate, mineCount)
	}

	if mineCount != f.MineCount {
		t.Errorf("Field says it has %d mines, but found %d", f.MineCount, mineCount)
	}
}

func TestNewFieldIsShuffled(t *testing.T) {
	f := NewField()

	previousWasAMine := true
	maxSubsequentMines := 0
	subsequentMines := 0

	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			square := f.Squares[x][y]

			if square.IsMine {
				if previousWasAMine {
					subsequentMines++
					if subsequentMines > maxSubsequentMines {
						maxSubsequentMines = subsequentMines
					}
				}

				previousWasAMine = true
			} else {
				previousWasAMine = false
			}
		}
	}

	if numberOfMinesToCreate-maxSubsequentMines < 5 {
		t.Errorf("Expected mines to be randomized, but found %d in a row", maxSubsequentMines)
	}
}

func TestNewFieldSetsSurroundingCount(t *testing.T) {
	f := NewField()

	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			sq := f.Squares[x][y]

			foundSurrounding := 0
			helperForEachSurroundingSquare(t, sq, f, func(examine *square) {
				if examine.IsMine {
					foundSurrounding++
				}
			})

			if sq.NumberOfMinesSurrounding != foundSurrounding {
				t.Errorf("Expected a square to hold number %d, but found %d", foundSurrounding, sq.NumberOfMinesSurrounding)
			}
		}
	}
}

func helperForEachSurroundingSquare(t *testing.T, s square, f *field, action func(*square)) {
	t.Helper()
	forEachSurroundingSquare(s, f, action)
}
