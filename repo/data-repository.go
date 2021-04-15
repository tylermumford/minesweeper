package repo

import "github.com/labstack/echo/v4"

const repositoryKeyString = "dataRepo"

type memoryRepo struct {
	Games   map[string]game
	Players map[string]string
}

// Repository
type Repository interface{}

// Above: Methods (if any) that manipulate or report on the repository itself.
// Below: Methods that make the repository available to handlers.

// setOnContext makes the repo available on the context of every request.
func (r *memoryRepo) SetOnContext(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Set(repositoryKeyString, r)

		err := next(c)
		if err != nil {
			c.Error(err)
		}

		return nil
	}
}

func ExtractRepository(c echo.Context) *memoryRepo {
	r := c.Get(repositoryKeyString)
	if r == nil {
		return nil
	}
	return r.(*memoryRepo)
}

func PrepareRepository(e *echo.Echo) {
	sharedRepository := memoryRepo{
		Games:   make(map[string]game),
		Players: make(map[string]string),
	}
	e.Use(sharedRepository.SetOnContext)
}
