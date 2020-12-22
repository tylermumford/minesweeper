import GameRepository from "./game-repository.js";

let repo;

beforeEach(() => {
    repo = new GameRepository;
})

test('should be created', () => {
    expect(repo).toBeDefined();
})

test('should create a new game', () => {
    repo.startNewGame();
})

test('should return the ID of the new game', () => {
    const id = repo.startNewGame();

    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
})

test('should provide the games created', () => {
    repo.startNewGame();

    const games = repo.getAll();

    expect(games).toBeDefined();
    expect(games.length).toEqual(1);
})
