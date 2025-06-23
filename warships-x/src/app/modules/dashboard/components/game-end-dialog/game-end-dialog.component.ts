import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-end-dialog',
  imports: [WsButtonComponent],
  templateUrl: './game-end-dialog.component.html',
  styleUrl: './game-end-dialog.component.scss',
})
export class GameEndDialogComponent {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly router = inject(Router);

  labels: { [key: string]: string } = {
    won: 'You won!',
    tied: 'Tie',
    lost: 'You lost',
  };

  textType = signal<'won' | 'tied' | 'lost'>(this.config.data);

  returnToLobby(): void {
    this.router.navigateByUrl('');
    this.ref.close();
  }
}
