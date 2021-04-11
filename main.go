package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Debug = true
	prepareRepository(e)
	prepareTemplates(e)

	e.Static("/static", "static-assets")

	e.GET("/", func(c echo.Context) error {
		return c.Render(200, "index.html", struct{}{})
	})

	e.POST("/player_name", setPlayerName)

	e.Logger.Fatal(e.Start(":1323"))
}
