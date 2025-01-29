import { Presupuesto } from './../interface/presupuesto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {


  constructor(private http: HttpClient) { }

  urlBase: string = "http://localhost:8080/managment/api/v1/presupuestos";


  //GET
  getPresupuestos(): Observable<Presupuesto[]> {

    return this.http.get<Presupuesto[]>(this.urlBase).pipe(catchError(this.handleError));

  }

  //POST
  postPresupuesto(pres: Presupuesto): Observable<Presupuesto> {

    return this.http.post<Presupuesto>(this.urlBase, pres).pipe(catchError(this.handleError));

  }

  //PUT
  putPresupuesto(pres: Presupuesto, id: string | null): Observable<Presupuesto> {

    return this.http.put<Presupuesto>(`${this.urlBase}/${id}`, pres).pipe(catchError(this.handleError));
  }

  //DELETE
  deletePresupuesto(id: string | null): Observable<void> {

    return this.http.delete<void>(`${this.urlBase}/${id}`).pipe(catchError(this.handleError));

  }

  
  //GETById
  getPresupuestosById(id: string | null): Observable<Presupuesto> {

    return this.http.get<Presupuesto>(`${this.urlBase}/${id}`);

  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en el servicio de Presupuestos:', error);
    return throwError(() => new Error('Error en la solicitud del servidor'));
  }

}
