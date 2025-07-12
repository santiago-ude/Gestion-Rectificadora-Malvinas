import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DescuentoConfigService {
  private descuentos: Record<string, number> = {
    efectivo: 10,
    "tarjeta de debito": 0,
    "tarjeta de credito": 0,
    transferencia: 0
  };

  getDescuento(metodo: string): number {
    return this.descuentos[metodo.toLowerCase()] ?? 0;
  }

  setDescuento(metodo: string, valor: number) {
    this.descuentos[metodo.toLowerCase()] = valor;
  }

  getTodos(): { metodo: string; valor: number }[] {
    return Object.entries(this.descuentos).map(([metodo, valor]) => ({ metodo, valor }));
  }
}