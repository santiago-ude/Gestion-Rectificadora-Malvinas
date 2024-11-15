import { Component, inject, OnInit } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { PresupuestoService } from '../../service/presupuesto.service';
import { PresupuestosAddComponent } from "../presupuestos-add/presupuestos-add.component";
import { compileOpaqueAsyncClassMetadata } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";

@Component({
  selector: 'app-presupuestos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './presupuestos-list.component.html',
  styleUrl: './presupuestos-list.component.css'
})
export class PresupuestosListComponent implements OnInit{


//Inicializacion
  ngOnInit(): void {

    this.traerPresupuestos();
  }

  //Lista auxiliar de presupuestos
  listaPresupuestos: Presupuesto[] = [];

  
  PS = inject(PresupuestoService);
  dialogoGenerico = inject(DialogoGenericoComponent);

  //Trae los presupuestos del json-server
  //Los almacena en la lista auxiliar
  traerPresupuestos() {

    this.PS.getPresupuestos().subscribe(
      {
        next: (presupuestos: Presupuesto[]) => {
          this.listaPresupuestos = presupuestos;
        },
        error: (e: Error) => {
          console.log(e.message);
        }
      }
    )
  }


  //Elimina un presupuesto de la lista
  deletePresupuestoDB(id : string | null){

    this.PS.deletePresupuesto(id).subscribe(
      {
        next: ()=>{
          this.listaPresupuestos = this.listaPresupuestos.filter((pres)=> pres.id !== id);
          //alert('Presupuesto Eliminado...')
          this.dialogoGenerico.abrirDialogo("Presupuesto eliminado...");
        },
        error: (e : Error)=>{
          console.log(e.message);
        }
      }
    )

  }


  //Filtra los presupuestos por fecha
  ordenarPresupuestos(criterio: 'asc' | 'desc') {
    this.listaPresupuestos.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return criterio === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });
  }

  //Optimizar el seguimiento de los elementos dentro del ngFor
  trackByIndex(index: number, item: any): number {
    return index;
  }
  



}
