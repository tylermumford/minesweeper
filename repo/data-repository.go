package repo

import (
	"example.com/minesweeper/logic"
	"github.com/labstack/echo/v4"
)

const repositoryKeyString = "dataRepo"

type memoryRepo struct {
	AllGames   map[string]*logic.Game
	AllPlayers map[string]*logic.Player
}

// Repository
type Repository interface {
	AddGame(*logic.Game)
	Game(string) *logic.Game
	Games() []*logic.Game
	// DeleteGame()

	SetPlayer(*logic.Player)
	Player(string) *logic.Player
	Players() []*logic.Player
}

// Assert that memoryRepo implements the Repository interface.
var _ Repository = &memoryRepo{}

func (r *memoryRepo) AddGame(g *logic.Game) {
	r.AllGames[g.GameId] = g
}

func (r *memoryRepo) Game(id string) *logic.Game {
	return r.AllGames[id]
}

func (r *memoryRepo) Games() []*logic.Game {
	result := make([]*logic.Game, 0, len(r.AllGames))
	for i := range r.AllGames {
		result = append(result, r.AllGames[i])
	}
	return result
}

func (r *memoryRepo) SetPlayer(p *logic.Player) {
	r.AllPlayers[p.PlayerId] = p
}

func (r *memoryRepo) Player(id string) *logic.Player {
	return r.AllPlayers[id]
}

func (r *memoryRepo) Players() []*logic.Player {
	result := make([]*logic.Player, 0, len(r.AllPlayers))
	for i := range r.AllPlayers {
		result = append(result, r.AllPlayers[i])
	}
	return result
}

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

func ExtractRepository(c echo.Context) Repository {
	r := c.Get(repositoryKeyString)
	if r == nil {
		return nil
	}
	return r.(*memoryRepo)
}

func PrepareRepository(e *echo.Echo) {
	sharedRepository := memoryRepo{
		AllGames:   make(map[string]*logic.Game),
		AllPlayers: make(map[string]*logic.Player),
	}
	e.Use(sharedRepository.SetOnContext)
}
