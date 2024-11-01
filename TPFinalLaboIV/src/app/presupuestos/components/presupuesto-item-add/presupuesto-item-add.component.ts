import { Component, EventEmitter, inject, Output } from '@angular/core';
import { PresupuestoItem } from '../../interface/PresupuestoItem';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-presupuesto-item-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './presupuesto-item-add.component.html',
  styleUrl: './presupuesto-item-add.component.css'
})
export class PresupuestoItemAddComponent {



@Output()
emitirItem : EventEmitter<PresupuestoItem> = new EventEmitter();


FB = inject(FormBuilder);

formulario = this.FB.nonNullable.group({

  nombre: ['', [Validators.required]],
  descripcion: ['', [Validators.required]],
  precioUnitario: [0, [Validators.required]],
  precioManoObra: [0, [Validators.required]],
  precioTotal: [0, [Validators.required]],

})


addItem(){

  const item = this.formulario.getRawValue();

  this.emitirItem.emit(item);

}

}
