var express = require('express');
var router = express.Router();

let gameMaster = require('../game-master.js');
let gameMasterInstance = new gameMaster();

/* GET games listing. */
router.get('/', function(req, res, next) {
  res.send(gameMasterInstance.games);
});

/* POST new game */
router.post('/', function(req, res, next) {
  let newGameID = gameMasterInstance.startNewGame();
  res.send(newGameID);
});

module.exports = router;
