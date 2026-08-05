import { Injectable, signal } from '@angular/core';

type Tema = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // El tema actual, como signal (para que el botón reaccione)
  tema = signal<Tema>('dark');

  constructor() {
    // Al arrancar, lee la preferencia guardada (o usa oscuro por defecto)
    const guardado = localStorage.getItem('snapshot_theme') as Tema | null;
    this.aplicar(guardado ?? 'dark');
  }

  alternar(): void {
    this.aplicar(this.tema() === 'dark' ? 'light' : 'dark');
  }

  private aplicar(tema: Tema): void {
    this.tema.set(tema);
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('snapshot_theme', tema);
  }
}