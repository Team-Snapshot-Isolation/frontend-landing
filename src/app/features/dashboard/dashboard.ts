import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private data = inject(DataService);

  protected usuario = this.data.usuario;
  protected servicios = this.data.servicios;
  protected theme = inject(ThemeService);

  ngOnInit(): void {
    this.data.cargarUsuario();
    this.data.cargarBases();
    this.data.cargarClavesIA();
  }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}