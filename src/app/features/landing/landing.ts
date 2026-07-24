import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

// Forma que devuelve la API en /metrics/platform
interface MetricasApi {
  TotalUsers: number;
  TotalDatabases: number;
  ActiveDatabases: number;
  TotalLogins: number;
  ActiveUsers: number;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  private http = inject(HttpClient);

  // Arranca con guiones; se llena cuando responde la API
  metricas = signal([
    { valor: '—', etiqueta: 'Usuarios registrados' },
    { valor: '—', etiqueta: 'Bases de datos creadas' },
    { valor: '—', etiqueta: 'Bases activas' },
    { valor: '—', etiqueta: 'Inicios de sesión' },
    { valor: '—', etiqueta: 'Usuarios activos' },
    { valor: '99.9%', etiqueta: 'Disponibilidad' },
  ]);

  ngOnInit(): void {
    this.http.get<MetricasApi>(`${environment.apiUrl}/metrics/platform`).subscribe({
      next: (m) => this.metricas.set([
        { valor: m.TotalUsers.toLocaleString('es-CO'),      etiqueta: 'Usuarios registrados' },
        { valor: m.TotalDatabases.toLocaleString('es-CO'),  etiqueta: 'Bases de datos creadas' },
        { valor: m.ActiveDatabases.toLocaleString('es-CO'), etiqueta: 'Bases activas' },
        { valor: m.TotalLogins.toLocaleString('es-CO'),     etiqueta: 'Inicios de sesión' },
        { valor: m.ActiveUsers.toLocaleString('es-CO'),     etiqueta: 'Usuarios activos' },
        { valor: '99.9%', etiqueta: 'Disponibilidad' },
      ]),
      error: () => { /* si falla, se quedan los guiones */ },
    });
  }

  features = signal([
    { titulo: 'MySQL en segundos',         texto: 'Tu base queda lista y conectable apenas inicias sesión.' },
    { titulo: 'Entra con Google o GitHub', texto: 'Sin formularios ni contraseñas nuevas que recordar.' },
    { titulo: 'Credenciales seguras',      texto: 'Generamos una contraseña fuerte y única para tu base.' },
    { titulo: 'Permisos aislados',         texto: 'Cada usuario solo accede a su propia base de datos.' },
    { titulo: 'Panel con uso en vivo',     texto: 'Consulta espacio, estado y última actividad cuando quieras.' },
    { titulo: '20 MB gratis por base',     texto: 'Suficiente para tus proyectos, prácticas y pruebas.' },
  ]);

  pasos = signal([
    { n: '1', titulo: 'Inicia sesión',          texto: 'Entra con tu cuenta de Google o GitHub en un clic.' },
    { n: '2', titulo: 'Se aprovisiona tu base', texto: 'Creamos tu base MySQL y su usuario automáticamente.' },
    { n: '3', titulo: 'Conéctate',              texto: 'Copia tus credenciales y úsalas desde tu proyecto.' },
  ]);
}