import { RNG, context, PersistentMap, logging, u128, PersistentVector } from 'near-sdk-as';

export enum State {
  Created,
  InProgress,
  Completed
}

const MAX_IDS = 12;

@nearBindgen
export class Game {
  id: string;
  state: State;
  player1: string;
  player2: string;
  nextPlayer: string;
  roundsPlayed: u8;
  choosedNumber: u8;
  totalAmount: u128;
  creationAmount: u128;
  bet: u128 = u128.Zero;

  constructor() {
    this.id = context.blockIndex.toString().slice(2, 8);
    logging.log(this.id);

    let rng = new RNG<u8>(1, 10);
    let roll = rng.next();
    this.choosedNumber = roll + 1;
    logging.log(this.choosedNumber);

    this.state = State.Created;
    this.player1 = context.sender;
    this.nextPlayer = this.player1;
    this.player2 = '';
    this.roundsPlayed = 0;
    this.totalAmount = context.attachedDeposit;
    this.creationAmount = context.attachedDeposit;
  }

  static all(): Game[] {
    const numIDs = min(MAX_IDS, lastGames.length);
    const startIndex = lastGames.length - numIDs;
    const result = new Array<Game>(numIDs);
    for (let i = 0; i < numIDs; i++) {
      result[i] = lastGames[i + startIndex];
    }
    return result;
  }
}

export const games = new PersistentMap<string, Game>('g');
export const lastGames = new PersistentVector<Game>('l');
