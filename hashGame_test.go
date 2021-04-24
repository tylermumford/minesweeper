package main

import (
	"testing"

	"example.com/minesweeper/logic"
)

func TestHashGame(t *testing.T) {
	result := hashGame(logic.NewGame())

	if len(result) < 10 {
		t.Errorf("Hashed result is only %d characters long, which is too short.", len(result))
	}
}

func TestHashGame_nil(t *testing.T) {
	result := hashGame(nil)

	if result != "nil" {
		t.Errorf("Function should hash nil game pointer to \"nil\".")
	}
}
