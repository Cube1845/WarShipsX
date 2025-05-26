import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthDataService } from '../services/auth-data.service';

export const userMustNotBeLoggedInGuard: CanActivateFn = (route, state) => {
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  if (!authDataService.isAuthDataSet()) {
    return true;
  }

  router.navigateByUrl('home');
  return false;
};
