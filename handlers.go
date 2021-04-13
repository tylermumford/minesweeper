package main

import (
	"github.com/labstack/echo/v4"
)

// Registration of handlers: 👇

func prepareHandlers(e *echo.Echo) {
	e.GET("/", getIndex)

	e.GET("/privacy", getPrivacy)

	e.GET("/player_name", getPlayerName)
	e.POST("/player_name", postPlayerName)

	e.GET("/game/:game_id", getGame)
}

// Handlers: 👇

func getIndex(c echo.Context) error {
	return c.Render(200, "index.html", newBucketTitled(c, "Home — Multi-Minesweeper"))
}

func getPrivacy(c echo.Context) error {
	return c.Render(200, "privacy.html", newBucketTitled(c, "Privacy"))
}

func getPlayerName(c echo.Context) error {
	return c.Render(200, "form_player_name.html", newBucket(c))
}

func postPlayerName(c echo.Context) error {
	extractRepository(c).Players[extractPlayerId(c)] = c.FormValue("player_name")
	return c.Redirect(303, "/player_name")
}

func getGame(c echo.Context) error {
	return c.Render(200, "show_game.html", newBucket(c))
}

// Helpers and misc. declarations 👇

// A bucket holds data for a template.
type bucket map[string]interface{}

func newBucket(c echo.Context) bucket {
	const defaultTitle = "Multi-Minesweeper"
	repo := extractRepository(c)
	return bucket{
		"title":       defaultTitle,
		"player_id":   extractPlayerId(c),
		"player_name": repo.Players[extractPlayerId(c)],
		"games":       repo.Games,
	}
}

func newBucketTitled(c echo.Context, title string) bucket {
	b := newBucket(c)
	b["title"] = title
	return b
}
