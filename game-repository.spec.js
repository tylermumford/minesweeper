import { GameRepositoryClass } from "./game-repository.js";

let repo;

beforeEach(() => {
    repo = new GameRepositoryClass;
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

test('should fetch a game by ID', () => {
    const id = repo.startNewGame();
    
    const g = repo.get(id);

    expect(g).toBeDefined();
})

test('should allow a game to be updated', () => {
    const id = repo.startNewGame();
    const game = repo.get(id);
    const newRowCount = game.rowCount + 4;
    const updatedGame = game.set('rowCount', newRowCount);
    expect(updatedGame.rowCount).toBe(newRowCount);

    repo.update(updatedGame);

    const retrievedGame = repo.get(id);
    expect(retrievedGame.rowCount).toBe(newRowCount);

})
