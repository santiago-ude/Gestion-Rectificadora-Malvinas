import { Pedidos } from './../interface/pedidos';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedidos';

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  addPedido(pedido: Pedidos): Observable<Pedidos> {
    return this.http.post<Pedidos>(this.apiUrl, pedido).pipe(catchError(this.handleError));
  }

  updatePedido(id: string, pedido: Pedidos): Observable<Pedidos> {
    return this.http.put<Pedidos>(`${this.apiUrl}/${id}`, pedido).pipe(catchError(this.handleError));
  }

  deletePedido(id: string | null | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio de Pedido:', error);
    return throwError(() => new Error('Error en la solicitud del servidor'));
  }
}