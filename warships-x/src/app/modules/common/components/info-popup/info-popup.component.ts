import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-info-popup',
  imports: [],
  templateUrl: './info-popup.component.html',
  styleUrl: './info-popup.component.scss',
})
export class InfoPopupComponent {
  private readonly config = inject(DynamicDialogConfig);

  text = signal<string>('');

  constructor() {
    this.text.set(this.config.data || 'Waiting ...');
  }
}
