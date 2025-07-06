import { Pedidos } from './../interface/pedidos';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/managment/api/v1/pedidos';

  constructor(private http: HttpClient) {}
  

  //GET
  getPedidos(): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  //POST
  addPedido(pedido: Pedidos): Observable<Pedidos> {
    return this.http.post<Pedidos>(this.apiUrl, pedido).pipe(catchError(this.handleError));
  }

  //PUT
  updatePedido(id: Number | undefined | null, pedido: Pedidos): Observable<Pedidos> {
    return this.http.put<Pedidos>(`${this.apiUrl}/${id}`, pedido).pipe(catchError(this.handleError));
  }

  //DELETE
  deletePedido(id: Number | null | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  //GETById
  getPedidoById(id: Number | null | undefined): Observable<Pedidos>{
    return this.http.get<Pedidos>(`${this.apiUrl}/${id}`);
  }

  filtrarPorEstado(pedidos: Pedidos[], estado: 'activo' | 'entregado' | 'atrasado'): Pedidos[] {
    return pedidos.filter(pedido => pedido.estado === estado);
  }

  filtrarPorFecha(pedidos: Pedidos[], fechaInicio: Date, fechaFin: Date): Pedidos[] {
    return pedidos.filter(pedido => 
      pedido.fechaEntrada >= fechaInicio && pedido.fechaEntrada <= fechaFin
    );
  }

  obtenerPedidosPorCliente(clienteId: Number | null | undefined): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.apiUrl).pipe(
      map((pedidos: Pedidos[]) => 
        pedidos.filter(pedido => pedido.cliente.id === clienteId)
      )
    );
  }

   //Pedidos por presupuesto
  obtenerPedidosPorPresupuesto(presupuestoId : Number | null | undefined) : Observable<Pedidos[]>{
     return this.http.get<Pedidos[]>(this.apiUrl).pipe(
      map((pedidos : Pedidos[]) =>
        pedidos.filter(pedido => pedido.presupuesto.id === presupuestoId))
    );
  }

  


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio de Pedido:', error);
    return throwError(() => new Error('Error en la solicitud del servidor'));
  }
}