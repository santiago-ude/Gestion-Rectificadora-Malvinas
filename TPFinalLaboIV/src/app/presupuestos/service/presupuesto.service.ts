import { Presupuesto } from './../interface/presupuesto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {

  //http2 = inject(HttpClient): Es lo mismo que el anterior, la diferencia es que cuando se genere una instancia de TareaService,
  //automaticamente se genera una instancia con el constructor, en cambio con el http2, solo cuando lo usas puntualmente.

  constructor(private http: HttpClient) { }

  urlBase: string = 'http://localhost:3000/presupuestos';


  //GET
  getPresupuestos(): Observable<Presupuesto[]> {

    return this.http.get<Presupuesto[]>(this.urlBase);

  }

  //GETById
  getPresupuestosById(id: string | null): Observable<Presupuesto> {

    return this.http.get<Presupuesto>(`${this.urlBase}/${id}`);

  }

  //POST
  postPresupuesto(pres: Presupuesto): Observable<Presupuesto> {

    return this.http.post<Presupuesto>(this.urlBase, pres);

  }

  //PUT
  putPresupuesto(pres: Presupuesto, id: string | null): Observable<Presupuesto> {

    return this.http.put<Presupuesto>(`${this.urlBase}/${id}`, pres);
  }

  //DELETE
  deletePresupuesto(id: string | null): Observable<void> {

    return this.http.delete<void>(`${this.urlBase}/${id}`);

  }


}
