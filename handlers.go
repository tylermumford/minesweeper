package main

import (
	"github.com/labstack/echo/v4"
)

var player_name = ""

// A bucket holds data for a template.
type bucket map[string]interface{}

func newBucket(c echo.Context) bucket {
	const defaultTitle = "Multi-Minesweeper"
	return bucket{
		"title":       defaultTitle,
		"player_id":   extractPlayerId(c),
		"player_name": player_name,
	}
}

func newBucketTitled(c echo.Context, title string) bucket {
	return bucket{
		"title":       title,
		"player_id":   extractPlayerId(c),
		"player_name": player_name,
	}
}

func prepareHandlers(e *echo.Echo) {
	e.GET("/", getIndex)

	e.POST("/player_name", postPlayerName)
}

// Handlers: 👇

func getIndex(c echo.Context) error {
	return c.Render(200, "index.html", newBucketTitled(c, "Home — Multi-Minesweeper"))
}

func postPlayerName(c echo.Context) error {
	player_name = c.FormValue("player_name")
	return c.Render(200, "index.html", newBucket(c))
}
