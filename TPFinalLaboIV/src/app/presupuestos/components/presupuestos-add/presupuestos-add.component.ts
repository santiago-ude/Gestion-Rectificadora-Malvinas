import { Component, EventEmitter, inject, NgModule, Output } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { Item } from '../../interface/item';
import { FormArray, FormBuilder, FormControl, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresupuestoService } from '../../service/presupuesto.service';
import { ItemAddComponent } from "../item-add/item-add.component";
import { CommonModule, NgClass } from '@angular/common';
import { DialogoGenericoComponent } from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-presupuestos-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  templateUrl: './presupuestos-add.component.html',
  styleUrl: './presupuestos-add.component.css'
})


export class PresupuestosAddComponent {


  @Output()
  emitirPresupuesto: EventEmitter<Presupuesto> = new EventEmitter();


  //INYECCIONES

  //Servicio de Dialogs
  dialog = inject(MatDialog)

  //Servicio del dialog de presupuesto
  dialogRef = inject(MatDialogRef<PresupuestosAddComponent>);

  //Servicio para crear un formulario
  fb = inject(FormBuilder);

  //Servicio para las peticiones de presupuesto
  PS = inject(PresupuestoService);

  //Servicio para crear dialogos genericos
  dialogoGenerico = inject(DialogoGenericoComponent);


  //Colecciones y Variables auxiliares para la carga de un presupuesto
  cargarItem = false;
  itemAux: Item[] = [];


  //Reactive Form
  formulario = this.fb.nonNullable.group({
    fecha: [this.getFechaActual(), [Validators.required]],
    descuento: [0, [Validators.min(0)]],
    items: this.fb.array([], [Validators.required]),
    total: [0, [Validators.min(0)]],
  });


  //Retorna fecha actual
  getFechaActual(): string {
    const hoy = new Date();
    return hoy.getFullYear() + '-' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoy.getDate()).padStart(2, '0');
  }



  //añade un presupuesto
  addPresupuesto = () => {

    //verifica el estado del formulario
    if (this.formulario.invalid) return;


    const pres= {
      ...this.formulario.getRawValue(),
      fecha: new Date(this.formulario.value.fecha! + 'T12:00:00'),
      items: this.itemAux,
      total: this.calcularTotalPresupuesto()
    };

    this.formulario.reset()

      
    // Emitir el presupuesto al componente de pedidos
    this.dialogRef.close(pres)
    this.dialogoGenerico.abrirDialogo("Presupuesto guardado...");

    this.cargarItem = false;

  }

  abrirDialogItem() {
    this.dialog.open(ItemAddComponent).afterClosed().subscribe(item => {
      if (item) {
        this.addItem(item);
      }
    });
  }

  addItem(item : Item){
    this.itemAux.push(item);
    (this.formulario.get('items') as FormArray).push(new FormControl(item));
  }

  calcularTotalPresupuesto() {
    let sum = 0.0;
    for (let item of this.itemAux) {
      sum += item.precioFinal;
    }
    return sum;
  }

  eliminarItem(nombre: string) {
    let index = this.itemAux.findIndex(item => item.nombre === nombre);
    if (index > -1) {
      this.itemAux.splice(index, 1);
    }
  }


trackByFn(index: number, item: any): any {
  return item.id;
}


}