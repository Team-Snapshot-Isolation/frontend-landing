import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;              // nombre del icono (lo dibujamos con SVG)
  estado: 'activo' | 'construccion' | 'proximo';
  esNuestro: boolean;         // true = lo hospedamos nosotros (n8n)
  ruta?: string;              // a dónde lleva en el dashboard, si aplica
  proveedor?: string;      // qué equipo lo hospedará
  caracteristicas?: string[];   // lo que ofrecerá
}
interface UsuarioApi {
  Id: string; Email: string; Name: string; Avatar: string;
  Provider: string; ProviderId: string; CreatedAt: string; LastLoginAt: string;
}

export interface BaseDatos {
  id: string; host: string; puerto: number; nombre: string; usuario: string;
  clave: string; motor: string; estado: string; creada: string;
  usadoMb: number; maxMb: number; ultimaActividad: string;
}

export interface CuentaN8n {
  estado: 'activo' | 'pendiente' | 'fallido' | 'ninguno';
  email: string;
  rol: string;
  creada: string;
  ultimaActividad: string;
  workflowsMax: number;
  ejecucionesMax: number;
  almacenamientoMax: number;
  credencial: string;
  tipoAcceso: string;
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

  // Catálogo de servicios de la plataforma
  servicios = signal<Servicio[]>([
    {
      id: 'n8n', nombre: 'Automatización n8n',
      descripcion: 'Crea tu propio espacio de n8n para automatizar flujos de trabajo sin escribir código.',
      icono: 'workflow', estado: 'activo', esNuestro: true, ruta: '/dashboard/n8n',
    },
    {
      id: 'database', nombre: 'Bases de datos',
      descripcion: 'Aprovisiona bases de datos gestionadas para tus proyectos.',
      icono: 'database', estado: 'construccion', esNuestro: false, ruta: '/dashboard/database',
      proveedor: 'Integración entre equipos',
      caracteristicas: [
        'Solicita una base de datos para tu proyecto',
        'Recibe tus credenciales de conexión al instante',
        'Conéctate desde cualquier cliente',
      ],
    },
    {
      id: 'ai', nombre: 'IA como servicio',
      descripcion: 'Consume modelos de inteligencia artificial vía API con tu propia clave de acceso.',
      icono: 'sparkles', estado: 'construccion', esNuestro: false, ruta: '/dashboard/ai',
      proveedor: 'Integración entre equipos',
      caracteristicas: [
        'Genera tu propia API-Key desde el panel',
        'Consume el servicio desde tus proyectos vía API',
        'Consulta tu consumo y límites de uso',
        'Revoca o regenera tus claves cuando lo necesites',
      ],
    },
    {
      id: 'dns', nombre: 'Subdominios DNS',
      descripcion: 'Crea subdominios propios para tus aplicaciones con certificado SSL automático.',
      icono: 'globe', estado: 'construccion', esNuestro: false, ruta: '/dashboard/dns',
      proveedor: 'Integración entre equipos',
      caracteristicas: [
        'Solicita un subdominio propio para tu aplicación',
        'Certificado SSL/TLS emitido automáticamente',
        'Consulta el estado de propagación',
        'Administra y elimina tus registros',
      ],
    },
  ]);

// ───── n8n (real) ─────
n8n = signal<CuentaN8n>({
    estado: 'ninguno', email: '', rol: '', creada: '', ultimaActividad: '',
    workflowsMax: 0, ejecucionesMax: 0, almacenamientoMax: 0,
    credencial: '', tipoAcceso: '',
  });
  n8nCargando = signal(true);

  cargarN8n(): void {
    this.n8nCargando.set(true);
    this.http.get<any>(`${environment.apiUrl}/n8n/me`).subscribe({
      next: (r) => {
        const estado = String(r?.Status ?? '').toLowerCase();
        this.n8n.update(c => ({
          ...c,
          estado: estado === 'active' ? 'activo'
                : estado === 'pending' ? 'pendiente'
                : estado === 'failed' ? 'fallido' : 'ninguno',
          email: r?.Email ?? '',
          rol: r?.Role ?? '',
          creada: this.fecha(r?.CreatedAt ?? ''),
          ultimaActividad: this.fecha(r?.LastActivityAt ?? ''),
          workflowsMax: Number(r?.WorkflowLimit ?? 0),
          ejecucionesMax: Number(r?.ExecutionLimit ?? 0),
          almacenamientoMax: Number(r?.StorageLimitMB ?? 0),
        }));
        this.n8nCargando.set(false);
      },
      error: () => {
        this.n8n.update(c => ({ ...c, estado: 'ninguno' }));
        this.n8nCargando.set(false);
      },
    });
  }

  cargarCredencialN8n(): void {
    this.http.get<any>(`${environment.apiUrl}/n8n/me/credentials`).subscribe({
      next: (r) => this.n8n.update(c => ({
        ...c,
        credencial: r?.credential ?? '',
        tipoAcceso: r?.access_type ?? '',
      })),
      error: () => {},
    });
  }

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
      error: () => { },
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
    const max = Number(pick(d, ['MaxMb', 'MaxMB', 'max_mb', 'QuotaMb'], 20));
    const estado = String(pick(d, ['Status', 'Estado', 'status'], 'active'));
    const ultima = pick<string | null>(d, ['LastActivityAt', 'LastActivity', 'last_activity'], null);

    return {
      id: String(pick(d, ['Id', 'ShortId', 'DatabaseId', 'id'], crypto.randomUUID())),
      host: String(pick(d, ['Host', 'PublicHost', 'host'], 'db.snapshot.andrescortes.dev')),
      puerto: Number(pick(d, ['Port', 'PublicPort', 'port'], 3307)),
      nombre: String(pick(d, ['DbName', 'DatabaseName', 'Database', 'Name', 'database'], '—')),
      usuario: String(pick(d, ['DbUser', 'Username', 'UserName', 'DbUsername', 'username'], '—')),
      clave: String(pick(d, ['Password', 'DbPassword', 'password'], '—')),
      motor: String(pick(d, ['Engine', 'engine'], 'MySQL 8.0')),
      estado: estado.toLowerCase() === 'active' ? 'Activa'
        : estado.toLowerCase() === 'pending' ? 'Creando…'
          : estado.toLowerCase() === 'failed' ? 'Con error' : estado,
      creada: this.fecha(pick(d, ['CreatedAt', 'created_at'], '')),
      usadoMb: isNaN(usado) ? 0 : usado,
      maxMb: isNaN(max) || max === 0 ? 20 : max,
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