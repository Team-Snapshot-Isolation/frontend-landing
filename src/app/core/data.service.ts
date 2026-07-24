import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Forma que devuelve la API en /auth/me
interface UsuarioApi {
  Id: string;
  Email: string;
  Name: string;
  Avatar: string;
  Provider: string;
  ProviderId: string;
  CreatedAt: string;
  LastLoginAt: string;
}

// Modelo interno de una base de datos
export interface BaseDatos {
  id: string;
  host: string;
  puerto: number;
  nombre: string;
  usuario: string;
  clave: string;
  motor: string;
  estado: string;
  creada: string;
  usadoMb: number;
  maxMb: number;
  ultimaActividad: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  // ───── Usuario: DATOS REALES desde /auth/me ─────
  usuario = signal({
    nombre: '',
    email: '',
    avatar: 'https://ui-avatars.com/api/?name=%20&background=12161F&color=7E8799',
    proveedor: '',
    creada: '',
  });

  cargarUsuario(): void {
    this.http.get<UsuarioApi>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (u) => this.usuario.set({
        nombre: u.Name,
        email: u.Email,
        avatar: u.Avatar,
        proveedor: u.Provider === 'google' ? 'Google' : 'GitHub',
        creada: this.formatearFecha(u.CreatedAt),
      }),
      error: () => { /* si falla, quedan los valores iniciales */ },
    });
  }

  private formatearFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  // ───── Bases de datos: TODAVÍA DE EJEMPLO ─────
  // Pendiente conectar a GET /databases (falta ver la forma real de la respuesta)
  bases = signal<BaseDatos[]>([
    { id: 'a1b2', host: 'db.snapshot.andrescortes.dev', puerto: 3306, nombre: 'db_luis_a1b2', usuario: 'luis_a1b2', clave: 'Xk9$mP2vLq8w', motor: 'MySQL 8.0', estado: 'Activa', creada: '17 jul 2026', usadoMb: 3.2, maxMb: 20, ultimaActividad: 'hace 2 minutos' },
    { id: 'e5f6', host: 'db.snapshot.andrescortes.dev', puerto: 3306, nombre: 'db_luis_e5f6', usuario: 'luis_e5f6', clave: 'Qw3!zXo9pLm2', motor: 'MySQL 8.0', estado: 'Activa', creada: '19 jul 2026', usadoMb: 8.7, maxMb: 20, ultimaActividad: 'hace 1 hora' },
  ]);

  // ───── Logs: TODAVÍA DE EJEMPLO ─────
  // Pendiente: el endpoint GET /auth/logins aún no existe
  logs = signal([
    { fecha: '21 jul 2026, 14:32', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '20 jul 2026, 09:15', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '19 jul 2026, 18:40', proveedor: 'Google', ip: '201.184.187.42', dispositivo: 'Safari · iPhone' },
  ]);

  agregarBase(base: BaseDatos): void {
    this.bases.update(lista => [...lista, base]);
  }
}