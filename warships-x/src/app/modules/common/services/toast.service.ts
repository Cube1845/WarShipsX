import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessageOptions>();
  onToast$ = this.toastSubject.asObservable();

  success(message: string, lifetime?: number): void {
    const options: ToastMessageOptions = {
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: lifetime || 3500,
    };

    this.toastSubject.next(options);
  }

  error(message: string, lifetime?: number): void {
    const options: ToastMessageOptions = {
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: lifetime || 3500,
    };

    this.toastSubject.next(options);
  }
}
