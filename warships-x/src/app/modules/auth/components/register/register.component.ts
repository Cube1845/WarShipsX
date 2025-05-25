import { Component } from '@angular/core';
import { WsInputComponent } from '../../../common/components/ws-input/ws-input.component';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [WsInputComponent, WsButtonComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {}
