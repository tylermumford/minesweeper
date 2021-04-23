package main

import (
	"os"

	"example.com/minesweeper/repo"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/crypto/acme/autocert"
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

	e.AutoTLSManager.Cache = autocert.DirCache("/var/www/.cert_cache")

	e.Logger.Fatal(e.StartAutoTLS(choosePort()))
}

func choosePort() string {
	envPort := os.Getenv("PORT")
	if envPort == "" {
		return ":1323"
	}

	return ":" + envPort
}
