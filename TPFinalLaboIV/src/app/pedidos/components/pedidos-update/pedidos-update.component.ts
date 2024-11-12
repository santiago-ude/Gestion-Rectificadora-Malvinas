import { Component, inject } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { ClientesService } from '../../../clientes/service/clientes.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Clientes } from '../../../clientes/interface/clientes';
import { Presupuesto } from '../../../presupuestos/interface/presupuesto';
import { Pedidos } from '../../interface/pedidos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './pedidos-update.component.html',
  styleUrl: './pedidos-update.component.css'
})
export class PedidosUpdateComponent {
  id: string | null = null;
  pedidoService = inject(PedidoService);
  clienteService = inject(ClientesService);
  presupuestoService = inject(PresupuestoService);
  fb = inject(FormBuilder);
  router = inject(ActivatedRoute);
  rt = inject(Router);
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
    presupuesto: [null as Presupuesto | null]
  });

  ngOnInit(){
    this.router.paramMap.subscribe((params) => {
      this.id = params.get("id");
      if (this.id) {
        this.buscarPorId(this.id);
      }
    });
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

  buscarPorId(id: string){
    console.log(id);
    this.pedidoService.getPedidoById(id).subscribe({
      next: (pedido: Pedidos) => {
        this.formulario.patchValue({
          cliente: pedido.cliente,
          fechaEntrada: new Date(pedido.fechaEntrada).toISOString().split("T")[0],
          fechaSalidaEstimada: new Date(pedido.fechaSalidaEstimada).toISOString().split("T")[0],
          estado: pedido.estado,
          marcaAuto: pedido.marcaAuto,
          modeloAuto: pedido.modeloAuto,
          numeroSerie: pedido.numeroSerie,
          descripcion: pedido.descripcion,
          presupuesto: pedido.presupuesto
        });
      },
      error: (error) => console.error('Error al cargar pedido:', error)
    });
  }


actualizarPedido(){
    if (this.formulario.invalid) return;

    const pedido: Pedidos = {
      ...this.formulario.getRawValue(),
      cliente: this.formulario.value.cliente as Clientes,
      fechaEntrada: new Date(this.formulario.value.fechaEntrada as string),
      fechaSalidaEstimada: new Date(this.formulario.value.fechaSalidaEstimada as string),
      estado: this.formulario.value.estado as 'activo' | 'entregado' | 'atrasado',
      presupuesto: this.formulario.value.presupuesto as Presupuesto  
    };

    console.log(pedido.id);
    this.pedidoService.updatePedido (this.id, pedido).subscribe({
      next: () => alert("Pedido actualizado con éxito"),
      error: (error) => console.error('Error al actualizar pedido:', error)
    });

    this.rt.navigateByUrl('pedidos');

  }
}
