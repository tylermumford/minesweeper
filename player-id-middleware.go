package main

import (
	"math/rand"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

const player_id = "player_id"

func preparePlayerId(e *echo.Echo) {
	e.Use(assignPlayerId)
}

func assignPlayerId(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cookie, err := c.Cookie(player_id)
		if err != nil {
			id := generatePlayerId()
			cookie = &http.Cookie{
				Name:     player_id,
				Value:    id,
				HttpOnly: true,
				Secure:   false,
			}
			c.SetCookie(cookie)
		}

		c.Set(player_id, cookie.Value)

		return next(c)
	}
}

func generatePlayerId() string {
	n := rand.Intn(100000)
	return "P" + strconv.Itoa(n)
}

func extractPlayerId(c echo.Context) string {
	id := c.Get(player_id)
	if id == nil {
		panic("extractPlayerId: No player ID set.")
	}
	return id.(string)
}
