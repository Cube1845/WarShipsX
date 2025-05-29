import { Component, inject } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { WsxDialogService } from '../../../common/services/wsx-dialog.service';
import { ShootDialogComponent } from '../shoot-dialog/shoot-dialog.component';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent, InputTextModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly dialogService = inject(WsxDialogService);

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

    this.dialogService.displayDialog(ShootDialogComponent, 'Choose field', {
      letter: letter,
      number: number,
    });
  }
}
