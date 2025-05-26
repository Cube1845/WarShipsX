import { Component, forwardRef, input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { Subscription } from 'rxjs';

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
export class WsInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  onChange!: (value: string) => void;

  id = input(`ws-input-${++inputId}`);
  label = input<string | null>(null);
  type = input<'text' | 'password' | 'number'>('text');

  form = new FormControl<string | null>('');

  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.form.valueChanges.subscribe((value) => {
      if (this.onChange) {
        this.onChange(value || '');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe();
  }

  writeValue(obj: any): void {
    this.form.setValue(obj || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}
