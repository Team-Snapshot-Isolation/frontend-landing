import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DataService } from '../../core/data.service';
import { ThemeService } from '../../core/theme.service';
import { ScrollTop } from '../../shared/scroll-top/scroll-top';
import { Reveal } from '../../shared/reveal';

interface MetricasApi {
  TotalUsers: number;
  TotalDatabases: number;
  ActiveDatabases: number;
  TotalLogins: number;
  ActiveUsers: number;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, ScrollTop, Reveal],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit, OnDestroy {
  private http = inject(HttpClient);

  // Catálogo de servicios (viene del store) — lo usa el @for del HTML
  protected servicios = inject(DataService).servicios;

  // Métricas de la plataforma (arrancan con guiones, se llenan desde /metrics/platform)
  metricas = signal([
    { valor: '—', etiqueta: 'Usuarios registrados' },
    { valor: '—', etiqueta: 'Servicios activos' },
    { valor: '—', etiqueta: 'Inicios de sesión' },
    { valor: '—', etiqueta: 'Usuarios activos' },
  ]);

  // Estado de las métricas: cargando | listo | error
  estadoMetricas = signal<'cargando' | 'listo' | 'error'>('cargando');

  ngOnInit(): void {
    this.http.get<MetricasApi>(`${environment.apiUrl}/metrics/platform`).subscribe({
      next: (m) => {
        this.metricas.set([
          { valor: m.TotalUsers.toLocaleString('es-CO'),  etiqueta: 'Usuarios registrados' },
          { valor: '1',                                   etiqueta: 'Servicios activos' },
          { valor: m.TotalLogins.toLocaleString('es-CO'), etiqueta: 'Inicios de sesión' },
          { valor: m.ActiveUsers.toLocaleString('es-CO'), etiqueta: 'Usuarios activos' },
        ]);
        this.estadoMetricas.set('listo');
      },
      error: () => this.estadoMetricas.set('error'),
    });

    this.iniciarCarrusel();
  }

  // Los 3 pasos — ahora en clave multi-servicio
  pasos = signal([
    { n: '1', titulo: 'Inicia sesión',        texto: 'Entra con tu cuenta de Google o GitHub en un solo clic.' },
    { n: '2', titulo: 'Elige un servicio',    texto: 'Accede a automatización n8n y, muy pronto, bases de datos, IA y DNS.' },
    { n: '3', titulo: 'Empieza a construir',  texto: 'Recibe tus credenciales de acceso y úsalas al instante en tus proyectos.' },
  ]);

  // ─── Carrusel del hero ───
  // Cada servicio con los datos que se muestran en la tarjeta estrella
  slides = signal([
    {
      id: 'n8n', etiqueta: 'n8n', titulo: 'Automatización n8n',
      campos: [
        { k: 'servicio', v: 'Automatización n8n' },
        { k: 'workspace', v: 'luis-a1b2' },
        { k: 'acceso', v: 'n8n.snapshot.andrescortes.dev' },
        { k: 'usuario', v: 'luis_a1b2' },
      ],
    },
    {
      id: 'db', etiqueta: 'MySQL 8.0', titulo: 'Bases de datos',
      campos: [
        { k: 'motor', v: 'MySQL 8.0' },
        { k: 'host', v: 'db.snapshot.andrescortes.dev' },
        { k: 'puerto', v: '3307' },
        { k: 'usuario', v: 'luis_a1b2' },
      ],
    },
    {
      id: 'ai', etiqueta: 'AI API', titulo: 'IA como servicio',
      campos: [
        { k: 'servicio', v: 'IA como servicio' },
        { k: 'endpoint', v: 'ai.snapshot.andrescortes.dev' },
        { k: 'api-key', v: 'sk_live_a1b2c3d4' },
        { k: 'modelo', v: 'gpt-oss-120b' },
      ],
    },
    {
      id: 'dns', etiqueta: 'DNS', titulo: 'Subdominios DNS',
      campos: [
        { k: 'servicio', v: 'Subdominios DNS' },
        { k: 'subdominio', v: 'miapp.celula.coderhivex.com' },
        { k: 'tipo', v: 'CNAME' },
        { k: 'ssl', v: 'Activo · Let\'s Encrypt' },
      ],
    },
  ]);

  slideActual = signal(0);
  private carruselTimer?: ReturnType<typeof setInterval>;

  private iniciarCarrusel(): void {
    this.carruselTimer = setInterval(() => this.siguienteSlide(), 3500);
  }
  siguienteSlide(): void {
    this.slideActual.update(i => (i + 1) % this.slides().length);
  }
  pausarCarrusel(): void {
    if (this.carruselTimer) clearInterval(this.carruselTimer);
  }
  reanudarCarrusel(): void {
    this.pausarCarrusel();
    this.iniciarCarrusel();
  }
  ngOnDestroy(): void {
    this.pausarCarrusel();
  }
  
  protected theme = inject(ThemeService);
}