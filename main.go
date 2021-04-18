package main

import (
	"example.com/minesweeper/repo"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())

	e.Debug = true
	preparePlayerId(e)
	repo.PrepareRepository(e)
	prepareTemplates(e)

	e.Static("/static", "static-assets")

	prepareHandlers(e)

	e.Logger.Fatal(e.Start(":1323"))
}
