import { Component, inject } from '@angular/core';
import { WsInputComponent } from '../../../common/components/ws-input/ws-input.component';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginRequestService } from '../../services/login/login-request.service';
import { ToastService } from '../../../common/services/toast.service';
import { AuthDto } from '../../models/auth-dto';
import { Result } from '../../../common/models/result';
import { AuthDataService } from '../../services/auth-data.service';

@Component({
  selector: 'app-login',
  imports: [
    WsInputComponent,
    WsButtonComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly loginRequest = inject(LoginRequestService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly authDataService = inject(AuthDataService);

  credsFormGroup = new FormGroup({
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  loginUser(): void {
    const data: AuthDto = {
      email: this.credsFormGroup.value.email!,
      password: this.credsFormGroup.value.password!,
    };

    this.loginRequest.request(data).subscribe({
      next: (result) => {
        if (this.isResult(result)) {
          this.toastService.error(result.message || 'Failed to log in');
          return;
        }

        this.authDataService.setAuthData(result);
        this.router.navigateByUrl('home');
      },
    });
  }

  private isResult(obj: any): obj is Result {
    return obj && typeof obj.isSuccess === 'boolean';
  }
}
