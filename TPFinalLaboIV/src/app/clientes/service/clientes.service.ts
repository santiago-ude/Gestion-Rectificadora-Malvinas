import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Clientes } from '../interface/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  http = inject(HttpClient);
  baseUrl = "http://localhost:3000/clientes";

  obtenerClientes(): Observable<Clientes[]>{
    return this.http.get<Clientes[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerClienteXDni(dni: string | undefined): Observable<Clientes>{
    return this.http.get<Clientes>(`${this.baseUrl}/${dni}`).pipe(
      catchError(this.handleError)
    );
  }

  agregarCliente(cliente: Clientes): Observable<Clientes>{
    return this.http.post<Clientes>(this.baseUrl, cliente).pipe(
      catchError(this.handleError)
    );
  }

  editarCliente(id: string | undefined, cliente: Clientes): Observable<Clientes>{
    return this.http.put<Clientes>(`${this.baseUrl}/${id}`, cliente).pipe(
      catchError(this.handleError)
    );
  }

  borrarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
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
