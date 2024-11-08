import { Component, inject} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Presupuesto } from '../../../presupuestos/interface/presupuesto';
import { PedidoService } from '../../service/pedidos.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Pedidos } from '../../interface/pedidos';
import { Clientes } from '../../../clientes/interface/clientes';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../clientes/service/clientes.service';

@Component({
  selector: 'app-pedidos-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './pedidos-add.component.html',
  styleUrl: './pedidos-add.component.css'
})
export class PedidosAddComponent {
  pedidoService = inject(PedidoService);
  clienteService = inject(ClientesService);
  presupuestoService = inject(PresupuestoService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);

  clientes: Clientes[] = [];
  presupuestos: Presupuesto[] = [];

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

  ngOnInit(){
    this.cargarClientes();
    this.cargarPresupuestos();
  }

  cargarClientes(){
    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }

  cargarPresupuestos(){
    this.presupuestoService.getPresupuestos().subscribe({
      next: (presupuestos) => this.presupuestos = presupuestos,
      error: (error) => console.error('Error al cargar presupuestos:', error)
    });
  }

  asignarPresupuesto(presupuesto: Presupuesto){
    this.formulario.controls['presupuesto'].setValue(presupuesto);
  }

  agregarPedido(){
    if (this.formulario.invalid || !this.formulario.value.presupuesto) {
      alert('El formulario no es válido o el presupuesto no está asignado.');
      return;
    }

    const pedido: Pedidos = {
      ...this.formulario.getRawValue(),
      cliente: this.formulario.value.cliente as Clientes,
      fechaEntrada: new Date(this.formulario.value.fechaEntrada as string),
      fechaSalidaEstimada: new Date(this.formulario.value.fechaSalidaEstimada as string),
      estado: this.formulario.value.estado as 'activo' | 'entregado' | 'atrasado',
      presupuesto: this.formulario.value.presupuesto as Presupuesto  
    };

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
}