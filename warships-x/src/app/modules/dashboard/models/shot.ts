import { Position } from './position';

export type Shot = {
  position: Position;
  shotState: ShotState;
};

export enum ShotState {
  Missed = 1,
  Hit = 2,
  Sunk = 3,
}
