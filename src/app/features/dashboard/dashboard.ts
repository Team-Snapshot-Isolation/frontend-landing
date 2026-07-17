import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Datos de ejemplo (luego vendrán de la API)
  db = signal({
    host: 'db.snapshot.andrescortes.dev',
    puerto: 3306,
    nombre: 'db_luis_a1b2',
    usuario: 'luis_a1b2',
    clave: 'Xk9$mP2vLq8w',
    motor: 'MySQL 8.0',
    estado: 'Activa',
    creada: '16 jul 2026',
    usadoMb: 3.2,
    maxMb: 20,
    ultimaActividad: 'hace 2 minutos',
  });

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}