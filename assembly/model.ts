import { RNG, context, PersistentMap, logging, u128, PersistentVector } from 'near-sdk-as';

export enum GameState {
  Created,
  InProgress,
  Completed
}

const MAX_GAMEIDS = 12;

@nearBindgen
export class GuessMyNumber {
  gameId: u32;
  gameState: GameState;
  player1: string;
  player2: string;
  nextPlayer: string;
  roundsPlayed: u8;
  choosedNumber: u8;
  totalAmount: u128;
  creationAmount: u128;
  bet: u128 = u128.Zero;

  constructor() {
    let rng = new RNG<u32>(1, u32.MAX_VALUE);
    let roll = rng.next();
    this.gameId = roll;
    logging.log(this.gameId);

    let rng1 = new RNG<u8>(1, 10);
    let roll1 = rng1.next();
    this.choosedNumber = roll1 + 1;
    logging.log(this.choosedNumber);

    this.gameState = GameState.Created;
    this.player1 = context.sender;
    this.nextPlayer = this.player1;
    this.player2 = '';
    this.roundsPlayed = 0;
    this.totalAmount = context.attachedDeposit;
    this.creationAmount = context.attachedDeposit;
  }

  static all(): GuessMyNumber[] {
    const numGameIds = min(MAX_GAMEIDS, gameIds.length);
    const startIndex = gameIds.length - numGameIds;
    const result = new Array<GuessMyNumber>(numGameIds);
    for (let i = 0; i < numGameIds; i++) {
      result[i] = gameIds[i + startIndex];
    }
    return result;
  }
}

export const games = new PersistentMap<u32, GuessMyNumber>('g');
export const gameIds = new PersistentVector<GuessMyNumber>('i');
