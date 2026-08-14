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
import { NotFound } from './features/not-found/not-found';
import { Overview } from './features/dashboard/sections/overview/overview';
import { N8n } from './features/dashboard/sections/n8n/n8n';
import { Ai } from './features/dashboard/sections/ai/ai';
import { ComingSoon } from './features/dashboard/sections/coming-soon/coming-soon';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'auth/callback', component: AuthCallback },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: Overview }, 
      { path: 'database', component: Database },
      { path: 'account', component: Account },
      { path: 'logs', component: Logs },
      { path: 'new', component: NewDatabase },
      { path: 'n8n', component: N8n },
      { path: 'ai', component: Ai },
      { path: 'dns', component: ComingSoon },   // temporal
    ],
  },
  { path: '**', component: NotFound },
];