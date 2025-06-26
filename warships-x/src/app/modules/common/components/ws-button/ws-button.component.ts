import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ws-button',
  imports: [ButtonModule],
  templateUrl: './ws-button.component.html',
  styleUrl: './ws-button.component.scss',
})
export class WsButtonComponent {
  loading = input(false);
  label = input<string | null>(null);
  icon = input<string | null>(null);
  disabled = input(false);
  size = input<'small' | 'large'>();
  outlined = input<boolean>(false);
  color = input<'primary' | 'secondary'>('primary');
}
