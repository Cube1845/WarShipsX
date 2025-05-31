import { Injectable } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class SettingShipsService {
  fourShip: Position[] = [];
  threeShips: Position[][] = [];
  twoShips: Position[][] = [];
  oneShips: Position[][] = [];
}
