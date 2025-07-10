import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Clientes } from '../interface/clientes';
import { PedidoService } from '../../pedidos/service/pedidos.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  //Inyeccion
  http = inject(HttpClient);

  //URL del back dirigido a clientes
  baseUrl = "http://localhost:8080/managment/api/v1/clientes";


  /**
   * 
   * @returns Lista de clientes
   */
  obtenerClientes(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * 
   * @param id Recibe como parametro un id.
   * @returns Retorna el cliente asociado al id o un error
   */
  obtenerClienteXDni(id: Number | null | undefined): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param cliente Recibe un cliente completo 
   * @returns Retorna un codigo de respuesta positivo
   */
  agregarCliente(cliente: Clientes): Observable<Clientes> {
    return this.http.post<Clientes>(this.baseUrl, cliente).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param id Recibe el id de un cliente al que quiere actualizar
   * @param cliente Datos del cliente para actualizar
   * @returns Retorna los datos del cliente actualizado
   */
  editarCliente(id: Number | null | undefined, cliente: Clientes): Observable<Clientes> {
    return this.http.put<Clientes>(`${this.baseUrl}/${id}`, cliente).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param id recibe un id del cliente que se quiere borrar
   * @returns Retorna un codigo noContent
   */
  borrarCliente(id: Number | null | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

/**
 * 
 * @param dni Recibe el dni del cliente que se quiere retornar
 * @returns Retorna el cliente asociado al dni
 */
  verificarDniExistente(dni: string | undefined): Observable<boolean> {
    return this.obtenerClientes().pipe(
      map(clientes => clientes.some(cliente => cliente.dni === dni)),
      catchError(this.handleError)
    );
  }


























  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `${error.message}`;
    }

    // Mostrar error en consola
    console.error('Ocurrió un error:', errorMessage);

    // Retornar el mensaje de error como un Observable de error
    return throwError(() => new Error(errorMessage));
  }


}
