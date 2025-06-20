import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessageOptions>();
  onToast$ = this.toastSubject.asObservable();

  private readonly defaultLifetime = 3500;

  success(message: string, header?: string, lifetime?: number): void {
    const options: ToastMessageOptions = {
      severity: 'success',
      summary: header || 'Success',
      detail: message,
      life: lifetime || this.defaultLifetime,
    };

    this.toastSubject.next(options);
  }

  error(message: string, header?: string, lifetime?: number): void {
    const options: ToastMessageOptions = {
      severity: 'error',
      summary: header || 'Error',
      detail: message,
      life: lifetime || this.defaultLifetime,
    };

    this.toastSubject.next(options);
  }

  info(message: string, header?: string, lifetime?: number): void {
    const options: ToastMessageOptions = {
      severity: 'secondary',
      summary: header || 'Info',
      detail: message,
      life: lifetime || this.defaultLifetime,
    };

    this.toastSubject.next(options);
  }
}
