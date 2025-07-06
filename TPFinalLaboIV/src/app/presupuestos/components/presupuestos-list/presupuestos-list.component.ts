import { Component, inject, OnInit } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { PresupuestoService } from '../../service/presupuesto.service';
import { PresupuestosAddComponent } from "../presupuestos-add/presupuestos-add.component";
import { compileOpaqueAsyncClassMetadata } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { DialogoGenericoComponent } from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { ModalConfirmacionComponent } from '../../../shared/modals/modal-confirmacion/modal-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from '../../../pedidos/service/pedidos.service';

@Component({
  selector: 'app-presupuestos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './presupuestos-list.component.html',
  styleUrl: './presupuestos-list.component.css'
})
export class PresupuestosListComponent implements OnInit {


  //Inicializacion
  ngOnInit(): void {

    this.traerPresupuestos();
  }

  //Lista auxiliar de presupuestos
  listaPresupuestos: Presupuesto[] = [];


  PS = inject(PresupuestoService);
  PDS = inject(PedidoService);
  dialogoGenerico = inject(DialogoGenericoComponent);
  dialog = inject(MatDialog);

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
  deletePresupuestoDB(id: Number | null | undefined) {

    this.PDS.obtenerPedidosPorPresupuesto(id).subscribe({

      next: (pedidos) => {

        if (pedidos.length > 0) {
          this.dialogoGenerico.abrirDialogo("Presupuesto asociado a un pedido, no se puede eliminar...")
        }
        else {

          const dialogRef = this.dialog.open(ModalConfirmacionComponent, {
            data: {
              mensaje: 'Estas seguro que quieres eliminar el presupuesto?',
            },
          });

          dialogRef.afterClosed().subscribe((confirmacion: any) => {
            if (confirmacion) {

              this.PS.deletePresupuesto(id).subscribe(
                {
                  next: () => {
                    this.listaPresupuestos = this.listaPresupuestos.filter((pres) => pres.id !== id);
                    //alert('Presupuesto Eliminado...')
                    this.dialogoGenerico.abrirDialogo("Presupuesto eliminado...");
                  },
                  error: (e: Error) => {
                    console.log(e.message);
                  }
                }
              )
            }
          });


        }

      },
      error: (e : Error) => {console.error(e.message)}

    })

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
