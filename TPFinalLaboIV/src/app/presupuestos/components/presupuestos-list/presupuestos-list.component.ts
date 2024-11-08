import { Component, inject, OnInit } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { PresupuestoService } from '../../service/presupuesto.service';
import { PresupuestosAddComponent } from "../presupuestos-add/presupuestos-add.component";

@Component({
  selector: 'app-presupuestos-list',
  standalone: true,
  imports: [],
  templateUrl: './presupuestos-list.component.html',
  styleUrl: './presupuestos-list.component.css'
})
export class PresupuestosListComponent implements OnInit{



  ngOnInit(): void {

    this.traerPresupuestos();
  }


  listaPresupuestos: Presupuesto[] = [];

  
  PS = inject(PresupuestoService);


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


  deletePresupuestoDB(id : string | null){

    this.PS.deletePresupuesto(id).subscribe(
      {
        next: ()=>{
          this.listaPresupuestos = this.listaPresupuestos.filter((pres)=> pres.id !== id);
          alert('Presupuesto Eliminado...')
        },
        error: (e : Error)=>{
          console.log(e.message);
        }
      }
    )

  }

  ordenarPresupuestos(criterio: 'asc' | 'desc') {
    this.listaPresupuestos.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return criterio === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });
  }


}
