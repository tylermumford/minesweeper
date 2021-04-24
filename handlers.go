package main

import (
	"fmt"
	"strconv"

	"example.com/minesweeper/logic"
	"example.com/minesweeper/repo"
	"github.com/labstack/echo/v4"
)

// Registration of handlers: 👇

func prepareHandlers(e *echo.Echo) {
	e.GET("/", getIndex)
	e.GET("/favicon.ico", getFavicon)

	e.GET("/gameplay", getGameplay)
	e.GET("/privacy", getPrivacy)

	e.GET("/player_name", getPlayerName)
	e.POST("/player_name", postPlayerName)

	e.GET("/game/:game_id", getGame)
	e.POST("/game", postGame)
	e.POST("/game/:game_id/player_action", postPlayerAction)

}

// Handlers: 👇

func getIndex(c echo.Context) error {
	return c.Render(200, "index.html", newBucketTitled(c, "Home"))
}

func getFavicon(c echo.Context) error {
	return c.NoContent(204)
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
	b := newBucket(c)
	r := repo.ExtractRepository(c)
	g := r.Game(c.Param("game_id"))
	b["game"] = g

	// Auto-join game
	if g != nil {
		g.AddPlayer(extractPlayer(c))
	}

	return c.Render(200, "show_game.html", b)
}

func postGame(c echo.Context) error {
	g := logic.NewGame()
	g.AddPlayer(extractPlayer(c))
	r := repo.ExtractRepository(c)
	r.SetGame(g)
	return c.Redirect(303, "/game/"+g.GameId)
}

func postPlayerAction(c echo.Context) error {
	r := repo.ExtractRepository(c)
	p := extractPlayer(c)
	g := r.Game(c.Param("game_id"))
	if g == nil {
		return echo.NewHTTPError(404, "Game not found.")
	}

	x, y := c.FormValue("x"), c.FormValue("y")
	xInt, _ := strconv.Atoi(x)
	yInt, _ := strconv.Atoi(y)

	action := c.FormValue("player_action")

	switch action {
	case "open":
		g.OpenSquare(*p, xInt, yInt)
	case "toggle_flag":
		g.ToggleFlaggedSquare(*p, xInt, yInt)
	default:
		return fmt.Errorf("unsupported player action: \"%s\"", action)
	}

	return getGame(c)
}

// Helpers and misc. declarations 👇

// A bucket holds data for a template.
type bucket map[string]interface{}

func newBucket(c echo.Context) bucket {
	const defaultTitle = "Welcome"
	r := repo.ExtractRepository(c)
	p := extractPlayer(c)
	return bucket{
		"title":  defaultTitle,
		"player": p,
		"games":  r.Games(),
	}
}

func newBucketTitled(c echo.Context, title string) bucket {
	b := newBucket(c)
	b["title"] = title
	return b
}
