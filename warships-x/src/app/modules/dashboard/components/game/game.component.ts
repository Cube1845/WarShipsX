import { Component } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent, InputTextModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  // fieldFormGroup = new FormGroup({
  //   letter: new FormControl<string | null>('', [
  //     Validators.required,
  //     Validators.maxLength(1),
  //   ]),
  //   number: new FormControl<string | null>('', [
  //     Validators.required,
  //     Validators.maxLength(2),
  //   ]),
  // });

  fieldClicked(field: string): void {
    const letter = field[0];
    const number = field.length > 2 ? field[1] + field[2] : field[1];
  }
}
