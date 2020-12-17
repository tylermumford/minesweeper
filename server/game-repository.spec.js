import GameRepository from "./game-repository.js";

let repo;

beforeEach(() => {
    repo = new GameRepository;
})

test('should be create', () => {
    expect(repo).toBeDefined();
})

test('should create a new game', () => {
    const id = repo.startNewGame();

    expect(id).toBeTruthy();
})

test('should provide the games created', () => {
    repo.startNewGame();

    const games = repo.getAll();

    expect(games).toBeDefined();
    expect(games.length).toEqual(1);
})