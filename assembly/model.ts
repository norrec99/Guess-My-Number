import { RNG, context, logging, u128, PersistentUnorderedMap } from 'near-sdk-as';

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
    // logging.log(this.choosedNumber);

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
