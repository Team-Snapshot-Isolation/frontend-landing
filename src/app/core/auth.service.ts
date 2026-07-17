import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'snapshot_token';
  private readonly apiUrl = environment.apiUrl;

  // Guarda los datos del usuario para usarlos en la app
  usuario = signal<any | null>(null);

  // Inicia el login: manda el navegador al endpoint de la API
  loginCon(proveedor: 'google' | 'github'): void {
    window.location.href = `${this.apiUrl}/auth/login/${proveedor}`;
  }

  guardarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.usuario.set(null);
  }

  // Pide a la API los datos del usuario autenticado (/auth/me)
  cargarUsuario() {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }
}