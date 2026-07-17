import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;                  // hay sesión → deja entrar
  }
  router.navigate(['/']);         // no hay sesión → de vuelta a la landing
  return false;
};