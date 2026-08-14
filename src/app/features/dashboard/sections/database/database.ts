import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService, BaseDatos } from '../../../../core/data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-database',
  imports: [],
  templateUrl: './database.html',
  styleUrl: './database.scss',
})
export class Database implements OnInit {
  private data = inject(DataService);
  private http = inject(HttpClient);

  protected bases = this.data.bases;
  protected cargando = this.data.basesCargando;

  expandidoId = signal<string | null>(null);
  claveVisible = signal(false);
  copiado = signal<string | null>(null);
  aprovisionando = signal(false);
  error = signal<string | null>(null);
  confirmandoBorrado = signal<string | null>(null);

  ngOnInit(): void {
    this.data.cargarBases();
  }

  toggle(id: string): void {
    if (this.expandidoId() === id) {
      this.expandidoId.set('');
    } else {
      this.expandidoId.set(id);
      this.claveVisible.set(false);
    }
  }

  verCredenciales(b: BaseDatos): void {
    this.claveVisible.set(true);
    if (!b.clave) this.data.cargarCredencialesBase(b.id);
  }

  copiar(texto: string, campo: string): void {
    navigator.clipboard.writeText(texto);
    this.copiado.set(campo);
    setTimeout(() => this.copiado.set(null), 2000);
  }

  cadena(b: BaseDatos): string {
    return `mysql://${b.usuario}:${b.clave}@${b.host}:${b.puerto}/${b.nombre}`;
  }

  crear(): void {
    this.aprovisionando.set(true);
    this.error.set(null);
    this.http.post(`${environment.apiUrl}/databases/provision`, {}).subscribe({
      next: () => { this.data.cargarBases(); this.aprovisionando.set(false); },
      error: (e) => {
        this.error.set(e?.error?.detail ?? 'No se pudo crear la base de datos. Intenta más tarde.');
        this.aprovisionando.set(false);
      },
    });
  }

  regenerar(id: string): void {
    this.error.set(null);
    this.http.post(`${environment.apiUrl}/databases/${id}/reset`, {}).subscribe({
      next: () => { this.claveVisible.set(false); this.data.cargarBases(); },
      error: (e) => this.error.set(e?.error?.detail ?? 'No se pudieron regenerar las credenciales.'),
    });
  }

  eliminar(id: string): void {
    this.http.delete(`${environment.apiUrl}/databases/${id}`).subscribe({
      next: () => { this.confirmandoBorrado.set(null); this.data.cargarBases(); },
      error: (e) => {
        this.confirmandoBorrado.set(null);
        this.error.set(e?.error?.detail ?? 'No se pudo eliminar la base de datos.');
      },
    });
  }

  porcentaje(b: BaseDatos): number {
    return b.maxMb === 0 ? 0 : (b.usadoMb / b.maxMb) * 100;
  }
}