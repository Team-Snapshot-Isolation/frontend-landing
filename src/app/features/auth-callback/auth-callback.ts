import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  error = signal(false);

  constructor() {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      this.auth.guardarToken(token);          // guarda el token
      this.router.navigate(['/dashboard']);   // y entra al panel
    } else {
      this.error.set(true);                   // algo salió mal
    }
  }
}