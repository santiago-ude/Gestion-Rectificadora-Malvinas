import { Component, EventEmitter, inject, Output, Pipe } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Presupuesto } from '../../interface/presupuesto';



@Component({
  selector: 'app-presupuesto-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './presupuesto-add.component.html',
  styleUrl: './presupuesto-add.component.css'
})
export class PresupuestoAddComponent {

  auxiliar = false;


  @Output()
  emitirPresupuesto : EventEmitter<Presupuesto> = new EventEmitter();

  FB = inject(FormBuilder);

  formulario = this.FB.nonNullable.group(
    {

      id: [0, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      descuento: [0, [Validators.required]],
      items: [[], []],

    }
  )


  addPresupuesto(){

    const presupuesto = this.formulario.getRawValue();

    this.emitirPresupuesto.emit(presupuesto);

  }

  cargarItem(){

    this.auxiliar = true;

    

  }



}
