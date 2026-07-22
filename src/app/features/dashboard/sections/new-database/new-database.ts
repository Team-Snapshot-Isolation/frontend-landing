import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, BaseDatos } from '../../../../core/data.service';

@Component({
  selector: 'app-new-database',
  imports: [FormsModule],
  templateUrl: './new-database.html',
  styleUrl: './new-database.scss',
})
export class NewDatabase {
  private data = inject(DataService);
  private router = inject(Router);

  nombre = signal('');
  creando = signal(false);
  error = signal<string | null>(null);

  // Valida el nombre y devuelve un mensaje de error, o null si está bien
  private validar(nombre: string): string | null {
    if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
    if (nombre.length > 30) return 'El nombre no puede superar los 30 caracteres.';
    if (!/^[a-z0-9_]+$/.test(nombre)) return 'Solo se permiten minúsculas, números y guion bajo (_).';
    const existe = this.data.bases().some(b => b.nombre === `db_luis_${nombre}`);
    if (existe) return 'Ya tienes una base con ese nombre.';
    return null;
  }

  crear(): void {
    const nombre = this.nombre().trim();
    const err = this.validar(nombre);
    if (err) { this.error.set(err); return; }

    this.error.set(null);
    this.creando.set(true);

    // ── SIMULACIÓN (reemplazar por la llamada real a POST /databases) ──
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 6);
      const nueva: BaseDatos = {
        id,
        host: 'db.snapshot.andrescortes.dev',
        puerto: 3306,
        nombre: `db_luis_${nombre}`,
        usuario: `luis_${id}`,
        clave: this.generarClave(),
        motor: 'MySQL 8.0',
        estado: 'Activa',
        creada: 'hoy',
        usadoMb: 0,
        maxMb: 20,
        ultimaActividad: 'recién creada',
      };
      this.data.agregarBase(nueva);
      this.creando.set(false);
      this.router.navigate(['/dashboard/database']);   // vamos a verla en la lista
    }, 1500);
    // ── FIN SIMULACIÓN ──
  }

  // Genera una contraseña de ejemplo (en producción la genera el backend)
  private generarClave(): string {
    const chars = 'ABCDEFGHijklmnop0123456789!$%&';
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}