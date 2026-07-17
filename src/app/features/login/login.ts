import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // 'login' = iniciar sesión · 'registro' = crear cuenta
  modo = signal<'login' | 'registro'>('login');

  constructor() {
    // Si venimos desde "Crear cuenta", arrancamos en esa pestaña
    if (this.route.snapshot.queryParams['modo'] === 'registro') {
      this.modo.set('registro');
    }
  }

  setModo(m: 'login' | 'registro'): void {
    this.modo.set(m);
  }

  // TEMPORAL: simula el login. Luego redirige al backend OAuth real.
  continuarCon(proveedor: 'github' | 'google'): void {
    // Futuro: window.location.href = `${urlApi}/auth/${proveedor}`;
    this.auth.login();
    this.router.navigate(['/dashboard']);
  }
}