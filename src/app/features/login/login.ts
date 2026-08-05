import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';


@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  modo = signal<'login' | 'registro'>('login');

  constructor() {
    if (this.route.snapshot.queryParams['modo'] === 'registro') {
      this.modo.set('registro');
    }
  }

  setModo(m: 'login' | 'registro'): void {
    this.modo.set(m);
  }

  // Guarda qué proveedor se está conectando (null = ninguno)
  conectando = signal<'github' | 'google' | null>(null);

  continuarCon(proveedor: 'github' | 'google'): void {
    this.conectando.set(proveedor);   // marca que empezó a conectar
    this.auth.loginCon(proveedor);    // redirige a la API (esto ya lo tenías)
  }
}