import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { Item } from '../../interface/item';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresupuestoService } from '../../service/presupuesto.service';
import { ItemAddComponent } from "../item-add/item-add.component";
import { CommonModule } from '@angular/common';
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-presupuestos-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './presupuestos-add.component.html',
  styleUrl: './presupuestos-add.component.css'
})
export class PresupuestosAddComponent {



  @Output()
  emitirPresupuesto: EventEmitter<Presupuesto> = new EventEmitter();
  
  cargarItem = false;
  itemAux : Item[] = [];
  dialog = inject(MatDialog)
  dialogRef = inject(MatDialogRef<PresupuestosAddComponent>);


  //---------------ULTIMA CLASE---------------------------

  fb =  inject(FormBuilder);
  PS =  inject(PresupuestoService);
  dialogoGenerico = inject(DialogoGenericoComponent);

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


//---------------------------------------------------------

  addPresupuesto = ()=>{

    console.log(this.formulario.errors); // Verifica si hay errores generales
    for (const controlName in this.formulario.controls) {
        const control = this.formulario.get(controlName);
        console.log(`${controlName} errors:`, control?.errors); // Muestra errores de cada campo
    }

    if(this.formulario.invalid)return;


    const pres= {
      ...this.formulario.getRawValue(),
      fecha: new Date(this.formulario.value.fecha! + 'T12:00:00'),
      items: this.itemAux
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



}