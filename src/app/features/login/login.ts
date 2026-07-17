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

  // Ahora sí manda al OAuth real de la API
  continuarCon(proveedor: 'github' | 'google'): void {
    this.auth.loginCon(proveedor);
  }
}