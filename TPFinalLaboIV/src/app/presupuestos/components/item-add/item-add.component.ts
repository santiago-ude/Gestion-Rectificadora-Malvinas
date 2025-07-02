import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../interface/item';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './item-add.component.html',
  styleUrl: './item-add.component.css'
})
export class ItemAddComponent {


  @Output()
  emitirEvento: EventEmitter<Item> = new EventEmitter();

  FB = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);



  formulario = this.FB.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(2)]],
    precioUnitario: [0, [Validators.required, Validators.min(0)]],
    precioManoObra: [0, [Validators.required, Validators.min(0)]],
    precioFinal: [0, [Validators.required, Validators.min(0)]],
  });


  //Emite el evento con el item cargado en el formulario
  addItem() {

    if (this.formulario.invalid) return;

    // Normalizar los valores de los campos string
    Object.keys(this.formulario.controls).forEach((campo) => {
      const control = this.formulario.get(campo);
      if (control && typeof control.value === 'string') {
        control.setValue(this.capitalizeFirstLetter(control.value), { emitEvent: false });
      }
    });

    const item = this.formulario.getRawValue();

    item.precioFinal = item.precioManoObra + item.precioUnitario;

    this.dialogRef.close(item);
    this.formulario.reset();

  }


  // Función para capitalizar la primera letra de cada campo string
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }


}
