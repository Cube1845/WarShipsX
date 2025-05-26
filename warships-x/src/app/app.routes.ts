import { Routes } from '@angular/router';
import { userMustBeLoggedInGuard } from './modules/auth/guards/user-must-be-logged-in.guard';
import { userMustNotBeLoggedInGuard } from './modules/auth/guards/user-must-not-be-logged-in.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [userMustNotBeLoggedInGuard],
    loadChildren: () =>
      import('./modules/auth/auth.routes').then((x) => x.routes),
  },
  {
    path: 'home',
    canActivate: [userMustBeLoggedInGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then((x) => x.routes),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
