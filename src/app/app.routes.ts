import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing';
import { Login } from './features/login/login';
import { AuthCallback } from './features/auth-callback/auth-callback';
import { Dashboard } from './features/dashboard/dashboard';
import { Database } from './features/dashboard/sections/database/database';
import { Account } from './features/dashboard/sections/account/account';
import { Logs } from './features/dashboard/sections/logs/logs';
import { NewDatabase } from './features/dashboard/sections/new-database/new-database';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'auth/callback', component: AuthCallback },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'database', pathMatch: 'full' },
      { path: 'database', component: Database },
      { path: 'account', component: Account },
      { path: 'logs', component: Logs },
      { path: 'new', component: NewDatabase },
    ],
  },
  { path: '**', redirectTo: '' },
];