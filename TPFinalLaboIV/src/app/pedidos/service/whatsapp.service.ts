import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

   // Genera el enlace de mensaje directo
   generarEnlace(numero: string, mensaje: string): string {
    // Codificamos el mensaje para evitar problemas con caracteres especiales
    const mensajeCodificado = encodeURIComponent(mensaje);
    return `https://wa.me/${numero}?text=${mensajeCodificado}`;
  }
}
