import { Presupuesto } from './../interface/presupuesto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

//INYECCIONES
  constructor(private http: HttpClient) { }

  //URL del back asociado a presupuestos
  urlBase: string = "http://localhost:8080/managment/api/v1/presupuestos";


  /**
   * 
   * @returns Retora una lista de presupuestos
   */
  getPresupuestos(): Observable<Presupuesto[]> {

    return this.http.get<Presupuesto[]>(this.urlBase).pipe(catchError(this.handleError));

  }

  /**
   * 
   * @param pres Retorna un presupuesto que se quiere agregar
   * @returns Retorna un codigo correcto
   */
  postPresupuesto(pres: Presupuesto): Observable<Presupuesto> {

    return this.http.post<Presupuesto>(this.urlBase, pres).pipe(catchError(this.handleError));

  }

  /**
   * 
   * @param pres Recibe los datos del presupuesto a actualizar
   * @param id Recibe el id del presupuesto que se quiere actualizar
   * @returns Retorna los datos del nuevo presupuesto
   */
  putPresupuesto(pres: Presupuesto, id: Number | null): Observable<Presupuesto> {

    return this.http.put<Presupuesto>(`${this.urlBase}/${id}`, pres).pipe(catchError(this.handleError));
  }

  /**
   * 
   * @param id Recibe el id del presupuesto que se quiere eliminar
   * @returns Retorna un codigo no content
   */
  deletePresupuesto(id: Number | null | undefined): Observable<void> {

    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));

  }

  
  /**
   * 
   * @param id Recibe un id del presupuesto que se quiere obtener
   * @returns Retorna el presupuesto asociado al id recibido
   */
  getPresupuestosById(id: Number | null): Observable<Presupuesto> {

    return this.http.get<Presupuesto>(`${this.urlBase}/${id}`);

  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio de Presupuestos:', error);
    return throwError(() => new Error('Error en la solicitud del servidor'));
  }



}
