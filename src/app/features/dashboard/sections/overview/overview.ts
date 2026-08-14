import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/data.service';

@Component({
  selector: 'app-overview',
  imports: [RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  private data = inject(DataService);

  protected usuario = this.data.usuario;
  protected servicios = this.data.servicios;
  protected bases = this.data.bases;
  protected clavesIA = this.data.clavesIA;

  // Saludo según la hora del día
  protected saludo = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  // Solo el primer nombre, para que el saludo se sienta cercano
  protected primerNombre = computed(() => this.usuario().nombre.split(' ')[0] || '');

  // Cuántos servicios están activos
  protected activos = computed(() => this.servicios().filter(s => s.estado === 'activo').length);

  // Dato clave que se muestra en cada tarjeta de resumen
  protected resumenDe(id: string): string {
    switch (id) {
      case 'database': {
        const n = this.bases().length;
        return n === 0 ? 'Sin bases creadas' : `${n} ${n === 1 ? 'base activa' : 'bases activas'}`;
      }
      case 'n8n':  return 'Workspace listo';
      case 'ai': {
        const n = this.clavesIA().filter(k => k.estado === 'active').length;
        return n === 0 ? 'Sin API-Keys creadas' : `${n} ${n === 1 ? 'API-Key activa' : 'API-Keys activas'}`;
      }
      case 'dns':  return 'Disponible pronto';
      default:     return '';
    }
  }
}