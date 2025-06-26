import { Position } from './position';
import { Ship } from './ship';
import { Shot } from './shot';

export type PlayerData = {
  ships: Ship[];
  executedShots: Shot[];
  opponentShots: Position[];
  playersTurn: boolean;
  opponentConnected: boolean;
};
