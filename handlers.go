package main

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func setPlayerName(c echo.Context) error {
	fmt.Println("Should set player name to", c.FormValue("player_name"))
	fmt.Println("Also, the repo is", extractRepository(c))
	return nil
}
