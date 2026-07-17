import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Login } from './features/login/login';
import { AuthCallback } from './features/auth-callback/auth-callback';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'auth/callback', component: AuthCallback },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];