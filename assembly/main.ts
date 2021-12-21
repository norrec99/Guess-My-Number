import { context, u128 } from 'near-sdk-as';
import { GuessMyNumber, games, GameState } from './model';

export function createGame(): u32 {
  // attach at least 1 NEAR to create a game
  assert(context.attachedDeposit >= u128.One, 'Please deposit 1 NEAR to create a game');
  const game = new GuessMyNumber();
  games.set(game.gameId, game);
  return game.gameId;
}

export function play(gameId: u32, selectedNumber: u8): string {
  assert(games.contains(gameId), 'GameId not found');

  let game = games.getSome(gameId);
  let currentPlayer = context.sender;
  assert(selectedNumber <= 10 || selectedNumber >= 1, 'Your number should be in the range of 1 - 10');
  let message = '';

  if (game.choosedNumber < selectedNumber && currentPlayer == game.player1) {
    assert(game.player2 != context.sender, 'Same Player. It is not your turn');
    message = 'Go lower!';
    currentPlayer = game.player2;
  } else if (game.choosedNumber > selectedNumber && currentPlayer == game.player1) {
    assert(game.player2 != context.sender, 'Same Player. It is not your turn');
    message = 'Go higher!';
    currentPlayer = game.player2;
  } else if (game.choosedNumber == selectedNumber && currentPlayer == game.player1) {
    message = finishGame(game, game.player1);
  } else {
    game.player2 = context.sender;
    assert(game.gameState == GameState.InProgress, 'Game is not in progress');
    assert(game.player1 != context.sender, 'Same Player. It is not your turn');

    if (game.choosedNumber < selectedNumber && currentPlayer == game.player2) {
      message = 'Go lower!';
      currentPlayer = game.player1;
    } else if (game.choosedNumber > selectedNumber && currentPlayer == game.player2) {
      message = 'Go higher!';
      currentPlayer = game.player1;
    } else if (game.choosedNumber == selectedNumber && currentPlayer == game.player2) {
      message = finishGame(game, game.player2);
    } else if (game.choosedNumber == selectedNumber && currentPlayer == game.player1) {
      message = finishGame(game, game.player1);
    }
  }

  game.roundsPlayed++;
  if (game.roundsPlayed == 5) {
    game.gameState = GameState.Completed;
    games.set(game.gameId, game);
    return `Sorry!, You couldn't guessed the number!`;
  }

  games.set(game.gameId, game);
  return message;
}

export function joinGame(gameId: u32): string {
  assert(games.contains(gameId), 'Game does not exist');
  let game = games.getSome(gameId);
  assert(game.player2 == '', 'This game already has two players');
  assert(game.player1 != context.sender, 'You can not play with yourself :(');

  game.player2 = context.sender;
  game.gameState = GameState.InProgress;

  games.set(gameId, game);

  return 'Joined the game, lets play!';
}

export function finishGame(game: GuessMyNumber, player: string): string {
  game.gameState = GameState.Completed;
  games.set(game.gameId, game);
  return `Congratulations: ${player} guessed the number which is ${game.choosedNumber}`;
}
