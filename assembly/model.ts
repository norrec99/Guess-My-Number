import { RNG, context, PersistentMap, logging } from 'near-sdk-as';

export enum GameState {
  Created,
  InProgress,
  Completed
}

@nearBindgen
export class GuessMyNumber {
  gameId: u32;
  gameState: GameState;
  player: string;
  roundsPlayed: u8;
  choosedNumber: u8;

  constructor() {
    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    this.gameId = roll;
    logging.log(this.gameId);

    let rng1 = new RNG<u8>(1, 11);
    let roll1 = rng1.next();
    this.choosedNumber = roll1;
    logging.log(this.choosedNumber);

    this.gameState = GameState.Created;
    this.player = context.sender;
    this.roundsPlayed = 0;
  }
}

export const games = new PersistentMap<u32, GuessMyNumber>('g');
