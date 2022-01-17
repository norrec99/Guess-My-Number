import { context, ContractPromiseBatch, logging, u128 } from 'near-sdk-as';
import { Game, games, lastGames, State } from './model';

// --------------------------------------------------------------------------
// Public VIEW methods
// --------------------------------------------------------------------------

export function get_lastGames(): Game[] {
  return Game.all();
}

// --------------------------------------------------------------------------
// Public CHANGE methods
// --------------------------------------------------------------------------

export function createGame(): string {
  // attach exactly 1 NEAR to create a game
  assert(context.attachedDeposit == u128.fromString('1000000000000000000000000'), 'Please deposit exactly 1 NEAR to create a game');
  const game = new Game();
  games.set(game.id, game);
  lastGames.push(game);

  return game.id;
}

/**
 * If you want to increase the bet use this function instead of above
 * @param bet
 * @returns
 */
// export function createGame(bet: u128): u32 {
//   // attach at least 1 NEAR to create a game
//   assert(context.attachedDeposit == bet, 'Please deposit exactly the amount of bet to create a game');
//   const game = new Game();
//   game.bet = bet;
//   logging.log(game.bet);
//   games.set(game.id, game);

//   return game.id;
// }

/**
 *
 * @param id
 * @param selectedNumber
 * @returns
 */
export function play(id: string, selectedNumber: u8): string {
  // check wheter game is initialized
  assert(games.contains(id), 'Game id not found');

  // find the game
  let game = games.getSome(id);

  // set currentPlayer as sender
  let currentPlayer = context.sender;

  // assert turns and game progress
  assert(game.nextPlayer == currentPlayer, 'Its not your turn');
  assert(game.state == State.InProgress, 'Game is not in progress');

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
  if (game.roundsPlayed > 4) {
    game.state = State.Completed;

    returnMoney(game, game.player1, game.player2);
    return `Sorry!, Nobody guessed the number!`;
  }

  games.set(game.id, game);
  return message;
}

/**
 *
 * @param id
 * @returns
 */
export function joinGame(id: string): string {
  assert(games.contains(id), 'Game does not exist');
  assert(context.attachedDeposit == u128.fromString('1000000000000000000000000'), 'Please deposit exactly 1 NEAR to join a game');

  let game = games.getSome(id);
  assert(game.player2 == '', 'This game already has two players');
  assert(game.player1 != context.sender, 'You can not play with yourself :(');

  // Player2 deposits 1 NEAR to join the game
  game.totalAmount = u128.add(game.totalAmount, context.attachedDeposit);
  // logging.log(game.totalAmount);

  game.player2 = context.sender;
  game.state = State.InProgress;

  games.set(id, game);

  return `Joined the game ${game.player2}, waiting for your opponent to make the first move`;
}

/**
 * If you want to increase the bet use this function instead of above
 * @param id
 * @param bet
 * @returns
 */
// export function joinGame(id: u32, bet: u128): string {
//   assert(games.contains(id), 'Game does not exist');
//   let game = games.getSome(id);
//   assert(context.attachedDeposit == bet, `Please deposit exactly ${game.bet} to join a game`);
//   assert(bet == game.bet, `Please deposit exactly ${game.bet} to join a game`);
//   assert(game.player2 == '', 'This game already has two players');
//   assert(game.player1 != context.sender, 'You can not play with yourself :(');

//   // Player2 deposits bet amount of NEAR to join the game
//   game.totalAmount = u128.add(game.totalAmount, bet);
//   // logging.log(game.totalAmount);

//   game.player2 = context.sender;
//   game.state = State.InProgress;

//   games.set(id, game);

//   return `Joined the game ${game.player2}, waiting for your opponent to make the first move`;
// }

/**
 *
 * @param player
 * @param game
 */
function setNextPlayer(player: string, game: Game): void {
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
export function finishGame(game: Game, player: string): string {
  game.state = State.Completed;

  // transfer NEAR to the winner
  const to_winner = ContractPromiseBatch.create(player);
  const amount_to_receive = game.totalAmount;
  // logging.log(amount_to_receive);
  to_winner.transfer(amount_to_receive);

  games.set(game.id, game);
  return `Congratulations: ${player} guessed the number which is ${game.choosedNumber} and received ${amount_to_receive} Ⓝ`;
}

/**
 * returns money back to players
 * @param game
 * @param player1
 * @param player2
 */
export function returnMoney(game: Game, player1: string, player2: string): void {
  // transfer NEAR back to players
  const to_player1 = ContractPromiseBatch.create(player1);
  const to_player2 = ContractPromiseBatch.create(player2);

  // amount of NEAR each player deposited
  const amount_to_receive = u128.sub(game.totalAmount, game.creationAmount);
  // logging.log(amount_to_receive);

  to_player1.transfer(amount_to_receive);
  to_player2.transfer(amount_to_receive);

  games.set(game.id, game);
}
