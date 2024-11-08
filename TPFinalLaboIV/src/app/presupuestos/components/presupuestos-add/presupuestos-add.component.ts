import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Presupuesto } from '../../interface/presupuesto';
import { Item } from '../../interface/item';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PresupuestoService } from '../../service/presupuesto.service';
import { ItemAddComponent } from "../item-add/item-add.component";

@Component({
  selector: 'app-presupuestos-add',
  standalone: true,
  imports: [ReactiveFormsModule, ItemAddComponent],
  templateUrl: './presupuestos-add.component.html',
  styleUrl: './presupuestos-add.component.css'
})
export class PresupuestosAddComponent {


  cargarItem = false;
  itemAux : Item[] = [];

  @Output()
  emitirEvento : EventEmitter<Presupuesto> = new EventEmitter() 

  //---------------ULTIMA CLASE---------------------------

  fb =  inject(FormBuilder);
  PS =  inject(PresupuestoService);

  formulario = this.fb.nonNullable.group(
    {
      fecha: [new Date(),[Validators.required, Validators.minLength(3)]],
      descuento: [0,[Validators.required]],
      items: this.fb.array([], [Validators.required])

    }
)

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
      items: this.itemAux,
      id: (Math.random() * 10).toString()
    }


    this.emitirEvento.emit(pres);
    this.formulario.reset()

    this.addPresupuestoDB(pres);

    this.cargarItem = false;

  }



  addPresupuestoDB= (pres: Presupuesto)=>{

      this.PS.postPresupuesto(pres).subscribe(
        {
          next: (pres : Presupuesto) => {
            console.log(pres);
            alert('presupuesto guardado...')
          },
          error: (e: Error)=>{
            console.log(e.message)
          }
        }
      )
  }


  addItem(item : Item){

    this.itemAux.push(item);
    (this.formulario.get('items') as FormArray).push(new FormControl(item));

  }



}
