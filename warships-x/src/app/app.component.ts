import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './modules/common/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent {
  private readonly messageService = inject(MessageService);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.toastService.onToast$.subscribe((opts) => this.displayToast(opts));
  }

  displayToast(options: ToastMessageOptions): void {
    this.messageService.add(options);
  }
}
