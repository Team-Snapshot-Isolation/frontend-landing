import { Injectable, signal } from '@angular/core';

// Definimos la "forma" de una base de datos
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
  usuario = signal({
    nombre: 'Luis Miguel',
    email: 'luismigonza@ejemplo.com',
    avatar: 'https://ui-avatars.com/api/?name=Luis+Miguel&background=5B8CFF&color=fff',
    proveedor: 'GitHub',
    creada: '17 jul 2026',
  });

  // Ahora es una LISTA de bases (antes era una sola)
  bases = signal<BaseDatos[]>([
    { id: 'a1b2', host: 'db.snapshot.andrescortes.dev', puerto: 3306, nombre: 'db_luis_a1b2', usuario: 'luis_a1b2', clave: 'Xk9$mP2vLq8w', motor: 'MySQL 8.0', estado: 'Activa', creada: '17 jul 2026', usadoMb: 3.2, maxMb: 20, ultimaActividad: 'hace 2 minutos' },
    { id: 'e5f6', host: 'db.snapshot.andrescortes.dev', puerto: 3306, nombre: 'db_luis_e5f6', usuario: 'luis_e5f6', clave: 'Qw3!zXo9pLm2', motor: 'MySQL 8.0', estado: 'Activa', creada: '19 jul 2026', usadoMb: 8.7, maxMb: 20, ultimaActividad: 'hace 1 hora' },
  ]);

  // Historial de inicios de sesión (luego vendrá del backend)
  logs = signal([
    { fecha: '21 jul 2026, 14:32', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '20 jul 2026, 09:15', proveedor: 'GitHub', ip: '191.95.33.193', dispositivo: 'Chrome · Windows' },
    { fecha: '19 jul 2026, 18:40', proveedor: 'Google', ip: '201.184.187.42', dispositivo: 'Safari · iPhone' },
  ]);

  // Agrega una base a la lista (lo usará el formulario de crear)
  agregarBase(base: BaseDatos): void {
    this.bases.update(lista => [...lista, base]);
  }
}