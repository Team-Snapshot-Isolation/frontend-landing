import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../../../core/data.service';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  private data = inject(DataService);
  private router = inject(Router);

  // Detecta el servicio a partir de la URL actual (/dashboard/ai → 'ai')
  protected servicio = computed(() => {
    const id = this.router.url.split('/').pop() ?? '';
    return this.data.servicios().find(s => s.id === id);
  });
}