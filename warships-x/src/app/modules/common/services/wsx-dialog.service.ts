import { inject, Injectable, Type } from '@angular/core';
import { Confirmation } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsxDialogService {
  private readonly dialogService = inject(DialogService);

  private ref: DynamicDialogRef | undefined;

  private displayConfirmationSubject = new Subject<Confirmation>();
  displayConfirmation$ = this.displayConfirmationSubject.asObservable();

  closeDialog(): void {
    this.ref?.close();
  }

  displayDialog<S, T>(
    type: Type<S>,
    header: string,
    data?: any,
    additionalConfig?: DynamicDialogConfig
  ): Observable<T> {
    const config: DynamicDialogConfig = {
      header: header,
      modal: true,
      closable: true,
      data: data,
      ...additionalConfig,
    };

    this.ref = this.dialogService.open(type, config);

    return this.ref.onClose;
  }

  displayConfirmation(
    header: string,
    message: string,
    additionalConfirmation?: Confirmation
  ): Observable<void> {
    const acceptSubject = new Subject<void>();

    const config: Confirmation = {
      header: header,
      message: message,
      acceptButtonStyleClass: 'p-button-primary p-button-outlined',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        acceptSubject.next();
      },
      ...additionalConfirmation,
    };

    this.displayConfirmationSubject.next(config);

    return acceptSubject.asObservable();
  }
}
