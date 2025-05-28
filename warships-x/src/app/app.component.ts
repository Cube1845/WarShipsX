import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './modules/common/services/toast.service';
import { ScreenOrientationService } from './modules/common/services/screen-orientation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly toastService = inject(ToastService);
  private readonly screenService = inject(ScreenOrientationService);

  constructor() {
    this.toastService.onToast$.subscribe((opts) => this.displayToast(opts));
  }

  ngOnInit(): void {
    this.screenService.lockPortrait();
  }

  displayToast(options: ToastMessageOptions): void {
    this.messageService.add(options);
  }
}
