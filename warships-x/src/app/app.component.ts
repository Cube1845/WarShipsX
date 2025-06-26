import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Confirmation,
  ConfirmationService,
  MessageService,
  ToastMessageOptions,
} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './modules/common/services/toast.service';
import { ScreenOrientationService } from './modules/common/services/screen-orientation.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { WsxDialogService } from './modules/common/services/wsx-dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class AppComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly toastService = inject(ToastService);
  private readonly screenService = inject(ScreenOrientationService);
  private readonly dialogService = inject(WsxDialogService);
  private readonly confirmationService = inject(ConfirmationService);

  constructor() {
    this.toastService.onToast$.subscribe((opts) => this.displayToast(opts));
    this.dialogService.displayConfirmation$.subscribe((config) =>
      this.displayConfirmation(config)
    );
  }

  ngOnInit(): void {
    this.screenService.lockPortrait();
  }

  displayToast(options: ToastMessageOptions): void {
    this.messageService.add(options);
  }

  displayConfirmation(config: Confirmation) {
    this.confirmationService.confirm(config);
  }
}
