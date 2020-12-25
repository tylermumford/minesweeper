import { Router } from 'express';
var router = Router();

import GameRepository from '../game-repository.js';

/* GET games listing. */
router.get('/', function(req, res, next) {
  res.send(GameRepository.getAll());
});

/* POST new game */
router.post('/', function(req, res, next) {
  let newGameID = GameRepository.startNewGame();
  res.send(newGameID);
});

export default router;
