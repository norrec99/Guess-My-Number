import { RNG, context, u128, PersistentUnorderedMap, math, logging } from 'near-sdk-as';

export enum State {
  Created,
  InProgress,
  Completed
}

@nearBindgen
export class Game {
  id: string;
  state: State;
  player1: string;
  player2: string;
  nextPlayer: string;
  roundsPlayed: u8;
  hashedNumber: Uint8Array;
  totalAmount: u128;
  creationAmount: u128;
  bet: u128 = u128.Zero;

  constructor() {
    this.id = context.blockIndex.toString().slice(2, 8);

    let rng = new RNG<u8>(1, 10);
    let roll = rng.next();

    let choosedNumber = new Uint8Array(roll + 1).byteLength;
    this.hashedNumber = math.hash(choosedNumber);
    logging.log(roll + 1);

    this.state = State.Created;
    this.player1 = context.sender;
    this.nextPlayer = this.player1;
    this.player2 = '';
    this.roundsPlayed = 0;
    this.totalAmount = context.attachedDeposit;
    this.creationAmount = context.attachedDeposit;
  }
}

export const games = new PersistentUnorderedMap<string, Game>('g');
