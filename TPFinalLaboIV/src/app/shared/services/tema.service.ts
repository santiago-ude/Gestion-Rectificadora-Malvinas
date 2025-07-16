import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private oscuro = false;

  constructor() {
    const modoGuardado = localStorage.getItem('dark-theme');
    if (modoGuardado === 'true') {
      this.habilidarModoOscuro();
    }
  }

  cambiarTema(): void {
    this.oscuro = !this.oscuro;
    if (this.oscuro) {
      this.habilidarModoOscuro();
    } else {
      this.desabilitarModoOscuro();
    }
    localStorage.setItem('dark-theme', String(this.oscuro));
  }

  habilidarModoOscuro(): void {
    document.body.classList.add('dark-theme');
  }

  desabilitarModoOscuro(): void {
    document.body.classList.remove('dark-theme');
  }

  esOscuro(): boolean {
    return this.oscuro;
  }
}
