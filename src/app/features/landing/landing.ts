import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  metricas = signal([
    { valor: '128',   etiqueta: 'Usuarios registrados' },
    { valor: '95',    etiqueta: 'Bases de datos creadas' },
    { valor: '73',    etiqueta: 'Bases activas' },
    { valor: '1.204', etiqueta: 'Inicios de sesión' },
    { valor: '41',    etiqueta: 'Usuarios activos ahora' },
    { valor: '99.9%', etiqueta: 'Disponibilidad' },
  ]);

  features = signal([
    { titulo: 'MySQL en segundos',        texto: 'Tu base queda lista y conectable apenas inicias sesión.' },
    { titulo: 'Entra con Google o GitHub', texto: 'Sin formularios ni contraseñas nuevas que recordar.' },
    { titulo: 'Credenciales seguras',     texto: 'Generamos una contraseña fuerte y única para tu base.' },
    { titulo: 'Permisos aislados',        texto: 'Cada usuario solo accede a su propia base de datos.' },
    { titulo: 'Panel con uso en vivo',    texto: 'Consulta espacio, estado y última actividad cuando quieras.' },
    { titulo: '20 MB gratis por base',    texto: 'Suficiente para tus proyectos, prácticas y pruebas.' },
  ]);

  pasos = signal([
    { n: '1', titulo: 'Inicia sesión',          texto: 'Entra con tu cuenta de Google o GitHub en un clic.' },
    { n: '2', titulo: 'Se aprovisiona tu base', texto: 'Creamos tu base MySQL y su usuario automáticamente.' },
    { n: '3', titulo: 'Conéctate',              texto: 'Copia tus credenciales y úsalas desde tu proyecto.' },
  ]);
}