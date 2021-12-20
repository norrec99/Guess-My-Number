import {  context, PersistentVector, ContractPromiseBatch, u128 } from "near-sdk-as";
import { TasKagitMakas, games, GameState } from "./model";

export function createGame(): u32 {
  const game = new TasKagitMakas();
  games.set(game.gameId, game);
  return game.gameId;
}

export function play(gameId: u32, selectedItem: string): string {
  assert(games.contains(gameId), 'GameId not found');

  let game = games.getSome(gameId);
  let currentPlayer = context.sender;
  assert(selectedItem == "Tas" || selectedItem == "Kagit" || selectedItem == "Makas", 'Invalid Item');
  let message = "";
  if (game.lastChoosedItem == "") 
  {
      game.lastChoosedItem = selectedItem;
      game.gameState = GameState.InProgress;
      message = "Player1 played"
  }
  else
  {
      assert(game.gameState == GameState.InProgress, 'Game is not in progress');
      if(game.lastChoosedItem == "Tas" && selectedItem =="Kagit")
         message=finishGame(game,game.player2);
      else if(game.lastChoosedItem == "Tas"  && selectedItem =="Makas")
        message=finishGame(game,game.player1);
      else if(game.lastChoosedItem == "Kagit"  && selectedItem =="Makas")
        message=finishGame(game,game.player2);
      else if(game.lastChoosedItem == "Kagit"  && selectedItem =="Tas")
        message=finishGame(game,game.player1);
      else if(game.lastChoosedItem == "Makas"  && selectedItem =="Tas")
        message=finishGame(game,game.player2);
      else if(game.lastChoosedItem == "Makas"  && selectedItem =="Kagit")
        message=finishGame(game,game.player1);
      else if(game.lastChoosedItem == selectedItem)
      {
          game.lastChoosedItem = "";
          message="Same item selected";
      }
  }

  game.roundsPlayed++;
  if (game.roundsPlayed == 5) {
    game.gameState = GameState.Completed;
    games.set(game.gameId, game);
    return "Game tied. No winners!"
  }
  
  games.set(game.gameId, game);
  return message;
}

export function joinGame(gameId: u32): string {
  assert(games.contains(gameId), 'Game does not exists');
  let game = games.getSome(gameId);
  assert(game.player2 == "", 'This game already has two players');
  assert(game.player1 != context.sender, 'You cant play with youself :(');

  game.player2 = context.sender;
  game.gameState = GameState.InProgress;

  games.set(gameId, game);

  return "Joined the game, lets play!";
}

export function finishGame(game: TasKagitMakas, winnerId: string): string {
  game.gameState = GameState.Completed;
  games.set(game.gameId, game);
  return `Congratulations: ${winnerId} is the winner`;
}

