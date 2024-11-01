import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Presupuesto } from '../interface/presupuesto';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  constructor() { }

  http = inject(HttpClient);
  baseUrl = "http://localhost:3000/presupuesto";

 // GET all presupuestos
 getPresupuestos(): Observable<Presupuesto[]> {
  return this.http.get<Presupuesto[]>(this.baseUrl).pipe(
    catchError(this.handleError)
  );
}

// GET presupuesto by ID
getPresupuestoById(id: string): Observable<Presupuesto> {
  return this.http.get<Presupuesto>(`${this.baseUrl}/${id}`).pipe(
    catchError(this.handleError)
    );
}

// POST new presupuesto
postPresupuesto(presupuesto: Presupuesto): Observable<Presupuesto> {
  return this.http.post<Presupuesto>(this.baseUrl, presupuesto);
}

// PUT update existing presupuesto
putPresupuesto(id: string, presupuesto: Presupuesto): Observable<Presupuesto> {
  return this.http.put<Presupuesto>(`${this.baseUrl}/${id}`, presupuesto);
}

// PATCH update specific fields in presupuesto
patchPresupuesto(id: string, updates: Partial<Presupuesto>): Observable<Presupuesto> {
  return this.http.patch<Presupuesto>(`${this.baseUrl}/${id}`, updates);
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

