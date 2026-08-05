import { Component, signal, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.scss',
})
export class ScrollTop {
  // Controla si el botón se ve o no
  visible = signal(false);

  // Escucha el scroll de la ventana
  @HostListener('window:scroll')
  alHacerScroll(): void {
    // Aparece cuando bajas más de 400px
    this.visible.set(window.scrollY > 400);
  }

  subir(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}