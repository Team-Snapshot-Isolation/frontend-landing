import { Component, signal, inject, effect } from '@angular/core';
import { RouterLink } from '@angular/router';   
import { DataService, BaseDatos } from '../../../../core/data.service';

@Component({
  selector: 'app-database',
  imports: [RouterLink],                                            // ← antes []
  templateUrl: './database.html',
  styleUrl: './database.scss',
})
export class Database {
  private data = inject(DataService);
  protected bases = this.data.bases;
  protected cargando = this.data.basesCargando;

  expandidoId = signal<string | null>(null);
  claveVisible = signal(false);
  cadenaVisible = signal(false);
  copiado = signal<string | null>(null);

  constructor() {
    // Cuando lleguen los datos, expande la primera automáticamente
    effect(() => {
      const lista = this.bases();
      if (lista.length > 0 && this.expandidoId() === null) {
        this.expandidoId.set(lista[0].id);
      }
    });
  }

  toggle(id: string): void {
    if (this.expandidoId() === id) {
      this.expandidoId.set('');          // '' = ninguna abierta
    } else {
      this.expandidoId.set(id);
      this.claveVisible.set(false);
      this.cadenaVisible.set(false);
    }
  }

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