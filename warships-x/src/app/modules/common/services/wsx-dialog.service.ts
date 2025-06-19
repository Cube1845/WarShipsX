import { inject, Injectable, Type } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WsxDialogService {
  private readonly dialogService = inject(DialogService);

  private ref: DynamicDialogRef | undefined;

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
}
