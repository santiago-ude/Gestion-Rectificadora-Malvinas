import { Pedidos } from './../interface/pedidos';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  //URL del back asociado a los pedidos
  private apiUrl = 'http://localhost:8080/managment/api/v1/pedidos';

  //INYECCION 
  constructor(private http: HttpClient) {}
  

  /**
   * 
   * @returns Retorna una lista de pedidos
   */
  getPedidos(): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * 
   * @param pedido Recibe el pedido que se va a agregar
   * @returns Retorna un codigo de estado correcto
   */
  addPedido(pedido: Pedidos): Observable<Pedidos> {
    return this.http.post<Pedidos>(this.apiUrl, pedido).pipe(catchError(this.handleError));
  }

  /**
   * 
   * @param id Recibe el id del pedido a actualizar
   * @param pedido Recibe los datos del nuevo pedido
   * @returns Retorna los datos del nuevo pedido
   */
  updatePedido(id: Number | undefined | null, pedido: Pedidos): Observable<Pedidos> {
    return this.http.put<Pedidos>(`${this.apiUrl}/${id}`, pedido).pipe(catchError(this.handleError));
  }

  /**
   * 
   * @param id Recibe el id del pedido a eliminar
   * @returns Retorna un codigo NoContent
   */
  deletePedido(id: Number | null | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }
  
  /**
   * 
   * @param id Recibe el id del pedido que se requiere obtener
   * @returns Retorna el pedido asociado a ese id
   */
  getPedidoById(id: Number | null | undefined): Observable<Pedidos>{
    return this.http.get<Pedidos>(`${this.apiUrl}/${id}`);
  }


  /**
   * 
   * @param pedidos Recibe una lista de pedidos
   * @param estado Recibe el estado por el cual se quiere filtrar la lista
   * @returns Retorna una lista con los pedidos que tengan asociado el estado recibido
   */
  filtrarPorEstado(pedidos: Pedidos[], estado: 'activo' | 'entregado' | 'atrasado'): Pedidos[] {
    return pedidos.filter(pedido => pedido.estado === estado);
  }


  /**
   * 
   * @param pedidos Recibe una lista de estados
   * @param fechaInicio Recibe una fecha de inicio
   * @param fechaFin Recibe una fecha estimada de finalizacion
   * @returns Retorna una lista de pedidos que correspondan a las fechas recibidas
   */
  filtrarPorFecha(pedidos: Pedidos[], fechaInicio: Date, fechaFin: Date): Pedidos[] {
    return pedidos.filter(pedido => 
      pedido.fechaEntrada >= fechaInicio && pedido.fechaEntrada <= fechaFin
    );
  }


  /**
   * 
   * @param clienteId Recibe el id de un cliente
   * @returns Retorna los pedidos que esten asociados a ese cliente
   */
  obtenerPedidosPorCliente(clienteId: Number | null | undefined): Observable<Pedidos[]> {
    return this.http.get<Pedidos[]>(this.apiUrl).pipe(
      map((pedidos: Pedidos[]) => 
        pedidos.filter(pedido => pedido.cliente.id === clienteId)
      )
    );
  }

   /**
    * 
    * @param presupuestoId Recibe el id de un presupuesto
    * @returns Retorna los pedidos que esten asociados a un presupuesto
    */
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