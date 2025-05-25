import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

var inputId = 0;

@Component({
  selector: 'ws-input',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    FloatLabelModule,
    PasswordModule,
  ],
  templateUrl: './ws-input.component.html',
  styleUrl: './ws-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WsInputComponent),
      multi: true,
    },
  ],
})
export class WsInputComponent implements ControlValueAccessor {
  onChange!: (value: any) => void;

  id = input(`ws-input-${++inputId}`);
  label = input<string | null>(null);
  type = input<'text' | 'password' | 'number'>('text');

  form = new FormControl<string | null>('');

  writeValue(obj: any): void {
    this.form.setValue(obj || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
