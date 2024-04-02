# Rock Paper and Scissors Game of Masters.

Rock, Paper, Scissors is a simple hand game played between two people. Each player plays these options and the winner is determined by the rules: Rock crushes Scissors, Scissors cuts Paper and Paper covers Rock.
If both players choose the same shape, the game is tied and usually replayed to break the tie. It's commonly used as a decision-making tool, similar to flipping a coin or drawing straws. This program is developed for developers to resolve their differences.

Lets play !

# Setup and start service.

## Installation - Run these commands in CLI to be able to run the application.

In terminal navigate to the folder "RockPaperScissorsAPI":

Setup the environment with these commands inside the folder.

```bash
npm install
```

## Start the API server.

Run this command to start the API application.

```bash
node app.js
```

# API Calls (HTTP Methods) to use.

Replace the content of {} with:

- {id} - the game id returned by 'Initilize a game'. Ex. "1".
- {name} - name of the player. Ex. "fredrik".
- {move} - Type of move (rock, paper or scissor). Ex. "rock".

Run these commands in terminal (or use an UI based software like Postman to do the same).

## Initialize a game

Parameters needed: Name of player.
Returns the id of the game (or an error explaining what went wrong) to be used for playing the game.

```bash
curl -X POST http://localhost:3000/api/games -H "Content-Type: application/json" -d '{"name":"{name}"}'
```

## Join a game

Parameters needed: Game id and Name of player.
Return who joined the game (or an error explaining what went wrong).

```bash
curl -X PATCH http://localhost:3000/api/games/{id}/join -H "Content-Type: application/json" -d '{"id":"{id}", "name":"{name}"}'
```

## Make a move

Parameters needed: Game id, Name of player and Move to be made.
Returns that a move have been made (or an error explaining what went wrong).

```bash
curl -X POST http://localhost:3000/api/games/{id}/move -H "Content-Type: application/json" -d '{"id":"{id}", "name":"{name}", "move":"{move}"}'
```

## get information

Parameters needed: Game id.
Returns who won the game or if the other player has not made their move yet (or an error explaining what went wrong).

```bash
curl -X GET http://localhost:3000/api/games/{id} -H "Content-Type: application/json" -d '{"id":"{id}"}'
```
