import { Component, signal, inject } from '@angular/core';
import { DataService, BaseDatos } from '../../../../core/data.service';

@Component({
  selector: 'app-database',
  imports: [],
  templateUrl: './database.html',
  styleUrl: './database.scss',
})
export class Database {
  protected bases = inject(DataService).bases;

  // Qué tarjeta está expandida (arranca con la primera abierta)
  expandidoId = signal<string | null>(null);
  claveVisible = signal(false);
  cadenaVisible = signal(false);
  copiado = signal<string | null>(null);

  constructor() {
    this.expandidoId.set(this.bases()[0]?.id ?? null);
  }

  toggle(id: string): void {
    if (this.expandidoId() === id) {
      this.expandidoId.set(null);
    } else {
      this.expandidoId.set(id);
      this.claveVisible.set(false);   // reinicia al cambiar de tarjeta
      this.cadenaVisible.set(false);
    }
  }

  // La cadena depende de CADA base, así que es un método (no un computed)
  cadena(b: BaseDatos): string {
    return `mysql://${b.usuario}:${b.clave}@${b.host}:${b.puerto}/${b.nombre}`;
  }
  cadenaOculta(b: BaseDatos): string {
    return `mysql://${b.usuario}:••••••••@${b.host}:${b.puerto}/${b.nombre}`;
  }

  copiar(texto: string, campo: string): void {
    navigator.clipboard.writeText(texto);
    this.copiado.set(campo);
    setTimeout(() => this.copiado.set(null), 2000);
  }
}