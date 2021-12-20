import {  RNG, context, PersistentMap, u128 } from "near-sdk-as";

export enum GameState {
  Created,
  InProgress,
  Completed
}
export const games = new PersistentMap<u32, TasKagitMakas>("g");

@nearBindgen
export class TasKagitMakas{
  gameId: u32;
  gameState: GameState;
  player1: string;
  player2: string;
  roundsPlayed: u8;
  lastChoosedItem: string;

  constructor() {
    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    this.gameId = roll;

    this.gameState = GameState.Created;
    this.player1 = context.sender;
    this.player2 = "";
    this.roundsPlayed = 0;
    this.lastChoosedItem = "";
  }
}


