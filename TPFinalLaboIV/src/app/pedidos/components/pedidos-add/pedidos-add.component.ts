import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Presupuesto } from '../../../presupuestos/interface/presupuesto';
import { PedidoService } from '../../service/pedidos.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Pedidos } from '../../interface/pedidos';
import { Clientes } from '../../../clientes/interface/clientes';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../clientes/service/clientes.service';
import { PresupuestosAddComponent } from '../../../presupuestos/components/presupuestos-add/presupuestos-add.component';

@Component({
  selector: 'app-pedidos-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, PresupuestosAddComponent],
  templateUrl: './pedidos-add.component.html',
  styleUrls: ['./pedidos-add.component.css']
})
export class PedidosAddComponent {
  pedidoService = inject(PedidoService);
  clienteService = inject(ClientesService);
  presupuestoService = inject(PresupuestoService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);

  clientes: Clientes[] = [];

  auxiliarPresupuesto : Presupuesto = {id: '0',fecha: new Date(),descuento: 0, items: [], total: 0};
  cargarPresupuesto : boolean = false

  formulario = this.fb.nonNullable.group({
    cliente: [null as Clientes | null, Validators.required],
    fechaEntrada: ['', Validators.required],
    fechaSalidaEstimada: ['', Validators.required],
    estado: ['activo' as 'activo' | 'entregado' | 'atrasado', Validators.required],
    marcaAuto: ['', Validators.required],
    modeloAuto: ['', Validators.required],
    numeroSerie: ['', Validators.required],
    descripcion: [''],
    presupuesto: [null as Presupuesto | null, Validators.required]  // Presupuesto es obligatorio
  });

  //Inicializacion 
  ngOnInit(){
    this.cargarClientes();
  }

  //Traer cliente del json-server
  cargarClientes(){
    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }


  //captura el evento y almacena el presupuesto
  addPresupuesto(pres: Presupuesto) {
    this.auxiliarPresupuesto = pres;
    
    // Actualizar el control del formulario para reflejar el cambio
    this.formulario.patchValue({ presupuesto: this.auxiliarPresupuesto });
    this.formulario.controls['presupuesto'].markAsTouched();
    this.formulario.controls['presupuesto'].updateValueAndValidity();
  }
  

  //Verifica el presupuesto
  //Verifica el pedido y almacena en el json-server
  agregarPedido() {
    if (this.formulario.invalid || !this.auxiliarPresupuesto) {
      alert('El formulario no es válido o el presupuesto no está asignado.');
      return;
    }

    const pedido: Pedidos = {
      ...this.formulario.getRawValue(),
      cliente: this.formulario.value.cliente as Clientes,
      fechaEntrada: new Date(this.formulario.value.fechaEntrada as string),
      fechaSalidaEstimada: new Date(this.formulario.value.fechaSalidaEstimada as string),
      estado: this.formulario.value.estado as 'activo' | 'entregado' | 'atrasado',
      presupuesto: this.auxiliarPresupuesto
    };

    this.cargarPresupuesto = false;

    this.pedidoService.addPedido(pedido).subscribe({
      next: () => alert('Pedido agregado exitosamente'),
      error: (error) => console.error('Error al agregar pedido:', error)
    });

    this.formulario.reset({
      cliente: null,
      fechaEntrada: '',
      fechaSalidaEstimada: '',
      estado: 'activo',
      marcaAuto: '',
      modeloAuto: '',
      numeroSerie: '',
      descripcion: '',
      presupuesto: null
    });
  }

  calcularTotalPresupuesto(presupuesto: Presupuesto): number {
    const subtotal = presupuesto.items.reduce((acc, item) => acc + item.precioFinal, 0);
    const totalConDescuento = subtotal - (subtotal * (presupuesto.descuento / 100));
    return totalConDescuento;
  }
 
}