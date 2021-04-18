package logic

type square struct {
	Coordinates                             xyPair
	IsMine, IsFlagged, IsOpened, IsRevealed bool
	NumberOfMinesSurrounding                int
}

type xyPair struct{ X, Y int }
