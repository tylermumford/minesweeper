package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

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

	e.HEAD("/game/:game_id", getGameHeaders)
	e.GET("/game/:game_id", getGame)
	e.POST("/game", postGame)
	e.POST("/game/:game_id/player_action", postPlayerAction)

	e.GET("/game/:game_id/stream", getGameStream)
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

	setGameStateHeader(g, c)

	return c.Render(200, "show_game.html", b)
}

func getGameHeaders(c echo.Context) error {
	r := repo.ExtractRepository(c)
	g := r.Game(c.Param("game_id"))

	setGameStateHeader(g, c)

	return c.NoContent(200)
}

func setGameStateHeader(g *logic.Game, c echo.Context) {
	hash := hashGame(g)

	c.Response().Header().Set("X-Minesweeper-Game-State", hash)
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

func getGameStream(c echo.Context) error {
	c.Response().Header().Set(echo.HeaderContentType, "text/event-stream")
	c.Response().WriteHeader(http.StatusOK)

	b := newBucket(c)
	r := repo.ExtractRepository(c)
	g := r.Game(c.Param("game_id"))
	b["game"] = g

	/*
		It works! And it's pretty smooth.
		There's some kind of race condition where the game connects to
		two streams or something, and one of them sends nil games.
		This is a pretty simple implementation. Possible improvements:
		- Hash the game and don't render it unless needed.
		- Check more often than every 3 seconds.
		- Extend the loop limit after changes
		- Properly use show_game and show_game_inner
		- Use a goroutine to make sure this isn't blocking? Maybe not needed.
	*/

	// lastHash := hashGame(g)
	buffer := strings.Builder{}

	for i := 1; i < 100; i++ {
		c.Echo().Renderer.Render(&buffer, "show_game_inner.html", b, c)
		renderedGame := buffer.String()
		prefixedGame := strings.ReplaceAll(renderedGame, "\n", "\ndata: ")

		fmt.Fprintf(c.Response(), `data: <turbo-stream action="update" target="show_game"><template>%s</template></turbo-stream>%s`, prefixedGame, "\n\n")
		c.Response().Flush()
		buffer.Reset()

		time.Sleep(3 * time.Second)
	}

	c.Response().WriteHeader(http.StatusNoContent)

	return nil
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
