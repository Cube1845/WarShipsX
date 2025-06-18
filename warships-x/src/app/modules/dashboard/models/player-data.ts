import { Ship } from './ship';
import { Shot } from './shot';

export type PlayerData = {
  ships: Ship[];
  executedShots: Shot[];
  playersTurn: boolean;
};
