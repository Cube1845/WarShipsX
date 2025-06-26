import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';

@Component({
  selector: 'app-shoot-dialog',
  imports: [InputTextModule, WsButtonComponent, ReactiveFormsModule],
  templateUrl: './shoot-dialog.component.html',
  styleUrl: './shoot-dialog.component.scss',
})
export class ShootDialogComponent implements OnInit {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  letter = signal<string>('');
  number = signal<number>(0);

  ngOnInit(): void {
    this.letter.set(this.config.data.letter);
    this.number.set(this.config.data.number);
  }

  shoot(): void {
    this.ref.close({
      letter: this.letter(),
      number: this.number(),
    });
  }
}
