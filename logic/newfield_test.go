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

func TestNewFieldMines(t *testing.T) {
	f := NewField()

	mineCount := 0

	previousWasAMine := true
	maxSubsequentMines := 0
	subsequentMines := 0

	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			square := f.Squares[x][y]

			if square.IsMine {
				mineCount++

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

	if mineCount != numberOfMinesToCreate {
		t.Errorf("Expected field to have %d mines -- found %d", numberOfMinesToCreate, mineCount)
	}

	if numberOfMinesToCreate-maxSubsequentMines < 5 {
		t.Errorf("Expected mines to be randomized, but found %d in a row", maxSubsequentMines)
	}
}
