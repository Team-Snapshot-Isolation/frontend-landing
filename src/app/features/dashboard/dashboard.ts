import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';

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

  ngOnInit(): void {
    this.data.cargarUsuario();
    this.data.cargarBases();
  }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}