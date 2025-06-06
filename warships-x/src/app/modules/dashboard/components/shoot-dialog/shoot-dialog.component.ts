import { Component, inject, OnInit } from '@angular/core';
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

  fieldFormGroup = new FormGroup({
    letter: new FormControl<string | null>('', [
      Validators.required,
      Validators.maxLength(1),
    ]),
    number: new FormControl<string | null>('', [
      Validators.required,
      Validators.maxLength(2),
    ]),
  });

  ngOnInit(): void {
    this.fieldFormGroup.setValue(this.config.data);
  }

  shoot(): void {
    this.ref.close({
      letter: this.fieldFormGroup.value.letter!,
      number: this.fieldFormGroup.value.number!,
    });
  }
}
