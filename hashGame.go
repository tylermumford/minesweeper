package main

import (
	"bytes"
	"crypto/md5"
	"encoding/gob"
	"fmt"

	"example.com/minesweeper/logic"
)

func hashGame(g *logic.Game) string {
	if g == nil {
		return "nil"
	}

	b := bytes.Buffer{}
	enc := gob.NewEncoder(&b)
	enc.Encode(g)

	hashed := md5.Sum(b.Bytes())
	return fmt.Sprintf("%x", hashed)
}
