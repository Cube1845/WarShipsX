import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WsButtonComponent } from '../ws-button/ws-button.component';

@Component({
  selector: 'app-info-popup',
  imports: [WsButtonComponent],
  templateUrl: './info-popup.component.html',
  styleUrl: './info-popup.component.scss',
})
export class InfoPopupComponent {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  text = signal<string>('');

  cancelButton = this.config.data.cancelButton;

  constructor() {
    this.text.set(this.config.data.text || 'Waiting ...');
  }

  closePopup(): void {
    this.ref.close();
  }
}
