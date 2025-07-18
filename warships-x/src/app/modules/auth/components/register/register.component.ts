import { Component, inject, signal } from '@angular/core';
import { WsInputComponent } from '../../../common/components/ws-input/ws-input.component';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { passwordsMatchValidator } from '../../validators/passwords-match-validator';
import { RegisterRequestService } from '../../services/register/register-request.service';
import { ToastService } from '../../../common/services/toast.service';
import { AuthDto } from '../../models/auth-dto';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-register',
  imports: [
    WsInputComponent,
    WsButtonComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly registerRequest = inject(RegisterRequestService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  registerButtonLoading = signal<boolean>(false);

  credsFormGroup = new FormGroup(
    {
      email: new FormControl<string | null>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl<string | null>('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    passwordsMatchValidator
  );

  registerUser(): void {
    const data: AuthDto = {
      email: this.credsFormGroup.value.email!,
      password: this.credsFormGroup.value.password!,
    };

    let apiResponded = false;

    setTimeout(() => {
      if (!apiResponded) {
        this.registerButtonLoading.set(true);
      }
    }, environment.apiResponseTime);

    this.registerRequest.request(data).subscribe((result) => {
      apiResponded = true;
      this.registerButtonLoading.set(false);

      if (result.isSuccess) {
        this.router.navigateByUrl('');
        this.toastService.success('Registered! Now log in');

        return;
      }

      this.toastService.error(result.message || 'Failed to register');
    });
  }
}
