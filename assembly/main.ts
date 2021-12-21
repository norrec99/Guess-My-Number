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
  assert(selectedNumber <= 10 || selectedNumber >= 1, 'Your number should be in the range of 1 - 10');
  game.gameState = GameState.InProgress;
  let message = '';

  if (game.choosedNumber == selectedNumber) {
    message = finishGame(game);
  } else {
    assert(game.gameState == GameState.InProgress, 'Game is not in progress');

    if (game.choosedNumber < selectedNumber) {
      message = 'Go lower!';
    } else if (game.choosedNumber > selectedNumber) {
      message = 'Go higher!';
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

export function finishGame(game: GuessMyNumber): string {
  game.gameState = GameState.Completed;
  games.set(game.gameId, game);
  return `Congratulations: Player guessed the number which is ${game.choosedNumber}`;
}
