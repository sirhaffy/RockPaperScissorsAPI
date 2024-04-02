const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let gameIdCounter = 1;
const games = {};


/**
 * Initialize a Game. This will create a new game with a player.
 *
 * @param {string} playerName - The name of the first player.
 * @returns {object} - The game object.
 * @throws {400} - If playerName is missing in the request body.
 * @throws {201} - If the game is created successfully.
 */

app.post('/api/games', (req, res) => {
    const playerName = req.body.name;

    if (!playerName) {
        return res.status(400).send({ message: 'Missing playerName in request body.' });
    }

    const gameId = gameIdCounter++;
    games[gameId] = {
        players: [{ playerName, move: null }],
        winner: null
    };

    res.status(201).send({ gameId });
});


/**
 * Join a Game and enter the name of second Player.
 *
 * @param {string} gameId - The id of the game.
 * @param {string} playerName - The name of the player.
 * @returns {object} - The game object.
 * @throws {404} - If the game is not found or already full.
 * @throws {200} - If the player has joined the game successfully.
 */

app.patch('/api/games/:id/join', (req, res) => {

    const gameId = req.body.id;
    const playerName = req.body.name;

    if (!games[gameId] || games[gameId].players.length >= 2) {
        return res.status(404).send({ message: 'Game not found or already full.' });
    }

    games[gameId].players.push({ playerName, move: null });

    res.status(200).send({ message: `Player ${playerName} joined game ${gameId}` });
});

/**
 * Make a Move. This will record a player's move in the game.
 *
 * If the game is a tie, the winner will be null.
 * If the game is not yet over, the winner will be null.
 * If the game is over, the winner will be the player object of the winning player.
 *
 * @param {string} gameId - The id of the game.
 * @param {string} move - The move the player made. Can be 'rock', 'paper', or 'scissors'.
 * @returns {object} - The game object.
 * @throws {200} - If the move is recorded. If both players have made their moves, the winner will be determined.
 * @throws {404} - If the move is invalid.
 * @throws {404} - If the game is not found or the player is not found in the game.
  *
*/

app.post('/api/games/:id/move', (req, res) => {

    const gameId = req.body.id;
    const playerName = req.body.name;
    const playerMove = req.body.move;

    const game = games[gameId];
    const player = game.players.find(p => p.playerName === playerName);

    if (!game) {
      return res.status(404).send({ message: 'Game not found.' });
    }

    if (!player) {
      return res.status(404).send({ message: 'Player not found in game.' });
    }

    if (!['rock', 'paper', 'scissors'].includes(playerMove)) {
      return res.status(404).send({ message: 'Invalid move.' });
    }

    player.move = playerMove;

    if (game.players.length === 2 && game.players.every(player => player.move)) {
        const [player1, player2] = game.players;

        if (player1.move === player2.move) {
            game.winner = null;
        } else if (
            (player1.move === 'rock' && player2.move === 'scissors') ||
            (player1.move === 'paper' && player2.move === 'rock') ||
            (player1.move === 'scissors' && player2.move === 'paper')
        ) {
            game.winner = player1;
        } else {
            game.winner = player2;
        }

        res.send({ message: 'Move recorded.' });

    } else {
        res.send({ message: 'Move recorded. Waiting for other player.' });
    }
});

/**
 * Get Game Information. This will return the information of a specific game.
 *
 * @param {string} gameId - The id of the game.
 * @returns {object} - The game object.
 * @throws {404} - If the game is not found.
 * @throws {200} - If the game information is retrieved successfully.
 */
app.get('/api/games/:id', (req, res) => {

  const gameId = req.body.id;
  const game = games[gameId];

  if (!game) {
    return res.status(404).send({ message: 'Game not found.' });
  }

  if (game.players.length === 1) {
    return res.status(200).send({ message: 'Waiting for another player to join.' });
  }

  if ( game.players.length === 2 && !game.players.every(player => player.move)) {
    return res.status(200).send({ message: "Both players have not yet made their moves." });
  } else if (game.winner) {
    return res.status(200).send({ winner: game.winner });
  } else {
    return res.status(200).send({ message: "It's a tie." });
  }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
