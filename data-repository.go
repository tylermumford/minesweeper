package main

import "github.com/labstack/echo/v4"

const dataRepo = "dataRepo"

type repository struct {
	Games map[string]game
}

// setOnContext makes the repo available on the context of every request.
func (r *repository) setOnContext(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Set(dataRepo, r)

		err := next(c)
		if err != nil {
			c.Error(err)
		}

		return nil
	}
}

func extractRepository(c echo.Context) *repository {
	r := c.Get(dataRepo)
	if r == nil {
		return nil
	}
	return r.(*repository)
}

func prepareRepository(e *echo.Echo) {
	sharedRepository := repository{}
	e.Use(sharedRepository.setOnContext)
}
