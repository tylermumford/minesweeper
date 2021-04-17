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
	for x := 0; x < defaultColCount; x++ {
		for y := 0; y < defaultRowCount; y++ {
			square := f.Squares[x][y]
			if square.IsMine {
				mineCount++
			}
		}
	}

	if mineCount != numberOfMinesToCreate {
		t.Errorf("Expected field to have %d mines -- found %d", numberOfMinesToCreate, mineCount)
	}
}
