import { Router } from 'express';
var router = Router();

import GameRepository from '../game-repository.js';
let gameRepo = new GameRepository();

/* GET games listing. */
router.get('/', function(req, res, next) {
  res.send(gameRepo.getAll());
});

/* POST new game */
router.post('/', function(req, res, next) {
  let newGameID = gameRepo.startNewGame();
  res.send(newGameID);
});

export default router;
