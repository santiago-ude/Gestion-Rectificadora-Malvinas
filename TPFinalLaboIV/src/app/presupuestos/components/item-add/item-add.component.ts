import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../interface/item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './item-add.component.html',
  styleUrl: './item-add.component.css'
})
export class ItemAddComponent {


  @Output()
  emitirEvento : EventEmitter<Item> = new EventEmitter();

  FB = inject(FormBuilder);

  
  formulario = this.FB.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(2)]],
    precioUnitario: [0, [Validators.required, Validators.min(0)]],  
    precioManoObra: [0, [Validators.required, Validators.min(0)]],  
    precioFinal: [0, [Validators.required, Validators.min(0)]], 
  });


  //Emite el evento con el item cargado en el formulario
  addItem(){

    if(this.formulario.invalid)return;

    const item = this.formulario.getRawValue();

    this.emitirEvento.emit(item);
    this.formulario.reset();

  }


}
