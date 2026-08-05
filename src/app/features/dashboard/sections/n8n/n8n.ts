import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../../../core/data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-n8n',
  imports: [],
  templateUrl: './n8n.html',
  styleUrl: './n8n.scss',
})
export class N8n implements OnInit {
  private data = inject(DataService);
  private http = inject(HttpClient);

  protected cuenta = this.data.n8n;
  protected cargando = this.data.n8nCargando;

  credencialVisible = signal(false);
  copiado = signal(false);
  aprovisionando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.data.cargarN8n();
  }

  verCredencial(): void {
    this.credencialVisible.set(true);
    if (!this.cuenta().credencial) this.data.cargarCredencialN8n();
  }

  copiar(texto: string): void {
    navigator.clipboard.writeText(texto);
    this.copiado.set(true);
    setTimeout(() => this.copiado.set(false), 2000);
  }

  aprovisionar(): void {
    this.aprovisionando.set(true);
    this.error.set(null);
    this.http.post(`${environment.apiUrl}/n8n/provision`, {}).subscribe({
      next: () => { this.data.cargarN8n(); this.aprovisionando.set(false); },
      error: () => {
        this.error.set('No se pudo crear tu espacio. Intenta de nuevo en unos minutos.');
        this.aprovisionando.set(false);
      },
    });
  }
}