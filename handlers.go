package main

import (
	"example.com/minesweeper/logic"
	"example.com/minesweeper/repo"
	"github.com/labstack/echo/v4"
)

// Registration of handlers: 👇

func prepareHandlers(e *echo.Echo) {
	e.GET("/", getIndex)

	e.GET("/gameplay", getGameplay)
	e.GET("/privacy", getPrivacy)

	e.GET("/player_name", getPlayerName)
	e.POST("/player_name", postPlayerName)

	e.GET("/game/:game_id", getGame)
}

// Handlers: 👇

func getIndex(c echo.Context) error {
	return c.Render(200, "index.html", newBucketTitled(c, "Home"))
}

func getPrivacy(c echo.Context) error {
	return c.Render(200, "privacy.html", newBucketTitled(c, "Privacy"))
}

func getGameplay(c echo.Context) error {
	return c.Render(200, "gameplay.html", newBucketTitled(c, "Gameplay"))
}

func getPlayerName(c echo.Context) error {
	return c.Render(200, "form_player_name.html", newBucket(c))
}

func postPlayerName(c echo.Context) error {
	id := extractPlayerId(c)
	p := logic.Player{
		PlayerId: id,
		Name:     c.FormValue("player_name"),
	}
	r := repo.ExtractRepository(c)
	r.SetPlayer(&p)
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
	repo := repo.ExtractRepository(c)
	playerID := extractPlayerId(c)
	var playerName string
	if p := repo.Player(playerID); p != nil {
		playerName = p.Name
	}
	return bucket{
		"title":       defaultTitle,
		"player_id":   playerID,
		"player_name": playerName,
		"games":       repo.Games(),
	}
}

func newBucketTitled(c echo.Context, title string) bucket {
	b := newBucket(c)
	b["title"] = title
	return b
}
