import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthDataService } from '../services/auth-data.service';

export const userMustBeLoggedInGuard: CanActivateFn = (route, state) => {
  const authDataService = inject(AuthDataService);
  const router = inject(Router);

  if (authDataService.isAuthDataSet()) {
    return true;
  }

  router.navigateByUrl('auth');
  return false;
};
