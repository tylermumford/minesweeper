package main

import (
	"math/rand"
	"net/http"
	"strconv"

	"example.com/minesweeper/logic"
	"example.com/minesweeper/repo"
	"github.com/labstack/echo/v4"
)

const player_id = "player_id"

// Sets up the middleware for future requests.
func preparePlayerId(e *echo.Echo) {
	e.Use(assignPlayerId)
}

// (Middleware function) Keeps the ID consistent
// in cookies and Contexts.
func assignPlayerId(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie(player_id)
		if err != nil {
			id := generatePlayerId()
			cookie = &http.Cookie{
				Name:     player_id,
				Value:    id,
				Path:     "/",
				MaxAge:   0,
				Secure:   false,
				HttpOnly: true,
			}
			c.SetCookie(cookie)
		}

		c.Set(player_id, cookie.Value)

		return next(c)
	}
}

// Randomly creates an ID.
// With current implementation, collisions are possible.
func generatePlayerId() string {
	n := rand.Intn(100000)
	return "P" + strconv.Itoa(n)
}

// Gets the ID from a Context.
func extractPlayerId(c echo.Context) string {
	id := c.Get(player_id)
	if id == nil {
		panic("extractPlayerId: No player ID set.")
	}
	return id.(string)
}

// Uses the stored ID to get the correct Player.
func extractPlayer(c echo.Context) *logic.Player {
	id := c.Get(player_id)
	if id == nil {
		panic("extractPlayer: No player ID set.")
	}

	r := repo.ExtractRepository(c)
	foundPlayer := r.Player(id.(string))
	if foundPlayer == nil {
		return &logic.Player{PlayerId: id.(string)}
	}

	return foundPlayer
}
