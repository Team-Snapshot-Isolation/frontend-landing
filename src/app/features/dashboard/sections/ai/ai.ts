import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ai',
  imports: [FormsModule],
  templateUrl: './ai.html',
  styleUrl: './ai.scss',
})
export class Ai implements OnInit {
  private data = inject(DataService);
  private http = inject(HttpClient);

  protected claves = this.data.clavesIA;
  protected cargando = this.data.clavesIACargando;
  protected claveCreada = this.data.claveIACreada;
  protected uso = this.data.usoIA;

  nombreNueva = signal('');
  creando = signal(false);
  error = signal<string | null>(null);
  copiado = signal(false);
  usoVisibleId = signal<string | null>(null);
  confirmandoRevocar = signal<string | null>(null);

  ngOnInit(): void {
    this.data.cargarClavesIA();
  }

  crear(): void {
    this.error.set(null);
    this.creando.set(true);
    this.http.post<any>(`${environment.apiUrl}/ai/keys`, { name: this.nombreNueva().trim() || null }).subscribe({
      next: (r) => {
        this.data.claveIACreada.set({ id: r.id, apiKey: r.api_key });
        this.data.cargarClavesIA();
        this.nombreNueva.set('');
        this.creando.set(false);
      },
      error: () => {
        this.error.set('No se pudo crear la API-Key. Intenta de nuevo.');
        this.creando.set(false);
      },
    });
  }

  cerrarClaveCreada(): void {
    this.data.limpiarClaveIACreada();
  }

  verUso(id: string): void {
    this.usoVisibleId.set(this.usoVisibleId() === id ? null : id);
    if (!this.uso()[id]) this.data.cargarUsoClaveIA(id);
  }

  revocar(id: string): void {
    this.http.delete(`${environment.apiUrl}/ai/keys/${id}`).subscribe({
      next: () => this.data.cargarClavesIA(),
      error: () => this.error.set('No se pudo revocar la API-Key. Intenta de nuevo.'),
    });
    this.confirmandoRevocar.set(null);
  }

  copiar(texto: string): void {
    navigator.clipboard.writeText(texto);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }
}
