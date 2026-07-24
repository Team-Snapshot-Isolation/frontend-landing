import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface UsuarioApi {
  Id: string; Email: string; Name: string; Avatar: string;
  Provider: string; ProviderId: string; CreatedAt: string; LastLoginAt: string;
}

export interface BaseDatos {
  id: string; host: string; puerto: number; nombre: string; usuario: string;
  clave: string; motor: string; estado: string; creada: string;
  usadoMb: number; maxMb: number; ultimaActividad: string;
}

// Devuelve el primer campo que exista de la lista (tolera variaciones de nombre)
function pick<T>(obj: any, claves: string[], porDefecto: T): T {
  for (const k of claves) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  }
  return porDefecto;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  // ───── Usuario (real, desde /auth/me) ─────
  usuario = signal({
    nombre: '', email: '',
    avatar: 'https://ui-avatars.com/api/?name=%20&background=12161F&color=7E8799',
    proveedor: '', creada: '',
  });

  cargarUsuario(): void {
    this.http.get<UsuarioApi>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (u) => this.usuario.set({
        nombre: u.Name,
        email: u.Email,
        avatar: u.Avatar,
        proveedor: u.Provider === 'google' ? 'Google' : 'GitHub',
        creada: this.fecha(u.CreatedAt),
      }),
      error: () => {},
    });
  }

  // ───── Bases de datos (real, desde /databases) ─────
  bases = signal<BaseDatos[]>([]);
  basesCargando = signal(true);

  cargarBases(): void {
    this.basesCargando.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/databases`).subscribe({
      next: (lista) => {
        console.log('Respuesta de /databases:', lista);   // ← para verificar los nombres reales
        this.bases.set((lista ?? []).map(d => this.mapearBase(d)));
        this.basesCargando.set(false);
      },
      error: (e) => {
        console.error('Error al cargar /databases:', e);
        this.bases.set([]);
        this.basesCargando.set(false);
      },
    });
  }

  private mapearBase(d: any): BaseDatos {
    const usado = Number(pick(d, ['UsedMb', 'UsedMB', 'used_mb', 'SizeMb'], 0));
    const max   = Number(pick(d, ['MaxMb', 'MaxMB', 'max_mb', 'QuotaMb'], 20));
    const estado = String(pick(d, ['Status', 'Estado', 'status'], 'active'));
    const ultima = pick<string | null>(d, ['LastActivityAt', 'LastActivity', 'last_activity'], null);

    return {
      id:      String(pick(d, ['Id', 'ShortId', 'DatabaseId', 'id'], crypto.randomUUID())),
      host:    String(pick(d, ['Host', 'PublicHost', 'host'], 'db.snapshot.andrescortes.dev')),
      puerto:  Number(pick(d, ['Port', 'PublicPort', 'port'], 3307)),
      nombre:  String(pick(d, ['DbName', 'DatabaseName', 'Database', 'Name', 'database'], '—')),
      usuario: String(pick(d, ['DbUser', 'Username', 'UserName', 'DbUsername', 'username'], '—')),
      clave:   String(pick(d, ['Password', 'DbPassword', 'password'], '—')),
      motor:   String(pick(d, ['Engine', 'engine'], 'MySQL 8.0')),
      estado:  estado.toLowerCase() === 'active' ? 'Activa'
             : estado.toLowerCase() === 'pending' ? 'Creando…'
             : estado.toLowerCase() === 'failed' ? 'Con error' : estado,
      creada:  this.fecha(pick(d, ['CreatedAt', 'created_at'], '')),
      usadoMb: isNaN(usado) ? 0 : usado,
      maxMb:   isNaN(max) || max === 0 ? 20 : max,
      ultimaActividad: ultima ? this.fecha(ultima) : 'Sin actividad',
    };
  }

  private fecha(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '—'
      : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // ───── Logs: TODAVÍA DE EJEMPLO (falta el endpoint /auth/logins) ─────
  logs = signal([
    { fecha: '21 jul 2026, 14:32', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '20 jul 2026, 09:15', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '19 jul 2026, 18:40', proveedor: 'Google', ip: '201.184.187.42', dispositivo: 'Safari · iPhone' },
  ]);

  agregarBase(base: BaseDatos): void {
    this.bases.update(lista => [...lista, base]);
  }
}