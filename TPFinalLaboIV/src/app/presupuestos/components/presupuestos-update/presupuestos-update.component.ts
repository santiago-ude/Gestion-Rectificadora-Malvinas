import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PresupuestoService } from '../../service/presupuesto.service';
import { Presupuesto } from '../../interface/presupuesto';
import { Item } from '../../interface/item';
import { DialogoGenericoComponent } from '../../../shared/modals/dialogo-generico/dialogo-generico.component';

@Component({
  selector: 'app-presupuestos-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './presupuestos-update.component.html',
  styleUrl: './presupuestos-update.component.css',
})
export class PresupuestosUpdateComponent implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  presupuestoService = inject(PresupuestoService);
  dialogo = inject(DialogoGenericoComponent);

  id!: number;
  itemAux: Item[] = [];

  formulario = this.fb.nonNullable.group({
    fecha: ['', Validators.required],
    descuento: [0, [Validators.min(0)]],
    items: this.fb.array([], Validators.required),
    total: [0, [Validators.min(0)]],
  });

   get itemsFormArray(): FormArray<FormGroup> {
    return this.formulario.get('items') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
  this.id = Number(this.route.snapshot.paramMap.get('id'));
  this.presupuestoService.getPresupuestosById(this.id).subscribe({
    next: (pres) => {
      this.formulario.patchValue({
        fecha: this.formatearFechaInput(pres.fecha),
        descuento: pres.descuento,
        total: pres.total
      });

      pres.items.forEach((item, index) => {
        const group = this.fb.group({
          nombre: [item.nombre, [Validators.required]],
          descripcion: [item.descripcion],
          precioUnitario: [item.precioUnitario, [Validators.required, Validators.min(0)]],
          precioManoObra: [item.precioManoObra, [Validators.required, Validators.min(0)]],
          precioFinal: [{ value: item.precioFinal, disabled: true }]
        });

        // Suscripción para actualizar precioFinal automáticamente
        group.get('precioUnitario')?.valueChanges.subscribe(() => this.actualizarPrecioFinal(index));
        group.get('precioManoObra')?.valueChanges.subscribe(() => this.actualizarPrecioFinal(index));

        this.itemsFormArray.push(group);
      });
    },
    error: () => this.dialogo.abrirDialogo("Error al cargar el presupuesto")
  });
}

actualizarPrecioFinal(index: number) {
  const itemGroup = this.itemsFormArray.at(index) as FormGroup;
  const precioUnitario = itemGroup.get('precioUnitario')?.value || 0;
  const precioManoObra = itemGroup.get('precioManoObra')?.value || 0;
  const nuevoTotal = precioUnitario + precioManoObra;

  itemGroup.get('precioFinal')?.setValue(nuevoTotal, { emitEvent: false });

  this.recalcularTotal();
}

recalcularTotal() {
  let total = 0;
  this.itemsFormArray.controls.forEach(item => {
    const precioFinal = item.get('precioFinal')?.value || 0;
    total += precioFinal;
  });

  const descuento = this.formulario.get('descuento')?.value || 0;
  const descuentoAplicado = total - (total * (descuento / 100));
  this.formulario.get('total')?.setValue(descuentoAplicado, { emitEvent: false });
}

  formatearFechaInput(fecha: string | Date): string {
    const f = new Date(fecha);
    return f.toISOString().split('T')[0];
  }

 actualizarPresupuesto() {
  if (this.formulario.invalid) return;

  const itemsActualizados: Item[] = this.itemsFormArray.controls.map(group => {
    const precioUnitario = group.get('precioUnitario')?.value || 0;
    const precioManoObra = group.get('precioManoObra')?.value || 0;

    return {
      nombre: group.get('nombre')?.value,
      descripcion: group.get('descripcion')?.value,
      precioUnitario,
      precioManoObra,
      precioFinal: precioUnitario + precioManoObra
    };
  });

  const totalSinDescuento = itemsActualizados.reduce((suma, item) => suma + item.precioFinal, 0);
  const descuento = this.formulario.get('descuento')?.value || 0;
  const totalConDescuento = totalSinDescuento - (totalSinDescuento * (descuento / 100));

  const actualizado: Presupuesto = {
    id: this.id,
    fecha: new Date(this.formulario.value.fecha + 'T12:00:00'),
    descuento,
    items: itemsActualizados,
    total: totalConDescuento
  };

  this.presupuestoService.updatePresupuesto(actualizado, this.id).subscribe({
    next: () => {
      this.dialogo.abrirDialogo("Presupuesto actualizado correctamente");
      this.router.navigateByUrl('/presupuestos');
    },
    error: () => this.dialogo.abrirDialogo("Error al actualizar el presupuesto")
  });
}
}
