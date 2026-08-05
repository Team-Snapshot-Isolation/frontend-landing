import { Directive, ElementRef, inject, OnInit, OnDestroy, input } from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class Reveal implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);

  // Retraso opcional para escalonar (ej. appReveal [delay]="100")
  delay = input(0);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const elemento = this.el.nativeElement as HTMLElement;

    // Estado inicial: invisible y desplazado hacia abajo
    elemento.style.opacity = '0';
    elemento.style.transform = 'translateY(30px)';
    elemento.style.transition = `opacity .6s ease ${this.delay()}ms, transform .6s ease ${this.delay()}ms`;

    // Observa cuándo el elemento entra en pantalla
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          elemento.style.opacity = '1';
          elemento.style.transform = 'translateY(0)';
          this.observer?.unobserve(elemento);   // una vez revelado, deja de observar
        }
      });
    }, { threshold: 0.15 });   // se activa cuando el 15% del elemento es visible

    this.observer.observe(elemento);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}