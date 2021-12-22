import { context, ContractPromiseBatch, logging, u128 } from 'near-sdk-as';
import { GuessMyNumber, games, GameState } from './model';

export function createGame(): u32 {
  // attach at least 1 NEAR to create a game
  assert(context.attachedDeposit >= u128.One, 'Please deposit 1 NEAR to create a game');
  const game = new GuessMyNumber();
  games.set(game.gameId, game);

  // add deposits to totalAmount pool
  game.totalAmount = u128.add(game.amount, context.attachedDeposit);

  return game.gameId;
}

/**
 *
 * @param gameId
 * @param selectedNumber
 * @returns
 */
export function play(gameId: u32, selectedNumber: u8): string {
  // check wheter game is initialized
  assert(games.contains(gameId), 'GameId not found');

  // find the game
  let game = games.getSome(gameId);

  // set currentPlayer as sender
  let currentPlayer = context.sender;

  // assert turns and game progress
  assert(game.nextPlayer == currentPlayer, 'Its not your turn');
  assert(game.gameState == GameState.InProgress, 'Game is not in progress');

  // selectedNumber must be between 1-10
  assert(selectedNumber <= 10, 'Your number must be in the range of 1 - 10');
  assert(selectedNumber >= 1, 'Your number must be in the range of 1 - 10');
  let message = '';

  // show message and set next player
  if (game.choosedNumber < selectedNumber) {
    message = 'Go lower!';
    setNextPlayer(currentPlayer, game);
  } else if (game.choosedNumber > selectedNumber) {
    message = 'Go higher!';
    setNextPlayer(currentPlayer, game);
  } else if (game.choosedNumber == selectedNumber) {
    message = finishGame(game, currentPlayer);
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

/**
 *
 * @param gameId
 * @returns
 */
export function joinGame(gameId: u32): string {
  assert(games.contains(gameId), 'Game does not exist');
  assert(context.attachedDeposit >= u128.One, 'Please deposit 1 NEAR to join this game');

  let game = games.getSome(gameId);
  assert(game.player2 == '', 'This game already has two players');
  assert(game.player1 != context.sender, 'You can not play with yourself :(');

  // Player2 deposits 1 NEAR to join the game
  game.totalAmount = u128.add(game.totalAmount, context.attachedDeposit);

  game.player2 = context.sender;
  game.gameState = GameState.InProgress;

  games.set(gameId, game);

  return `Joined the game ${game.player2}, waiting for your opponent to make the first move`;
}

/**
 *
 * @param player
 * @param game
 */
function setNextPlayer(player: string, game: GuessMyNumber): void {
  if (player == game.player1) {
    game.nextPlayer = game.player2;
  } else if (player == game.player2) {
    game.nextPlayer = game.player1;
  }
}

/**
 * end the game and transfer money to the winner
 * @param game
 * @param player
 * @returns
 */
export function finishGame(game: GuessMyNumber, player: string): string {
  game.gameState = GameState.Completed;

  // transfer NEAR to the winner
  const to_winner = ContractPromiseBatch.create(player);
  const amount_to_receive = game.totalAmount;
  logging.log(amount_to_receive);
  to_winner.transfer(amount_to_receive);

  games.set(game.gameId, game);
  return `Congratulations: ${player} guessed the number which is ${game.choosedNumber} and received ${amount_to_receive} Ⓝ`;
}
