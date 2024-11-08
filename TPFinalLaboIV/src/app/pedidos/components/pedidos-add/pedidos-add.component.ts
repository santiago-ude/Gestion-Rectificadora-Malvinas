import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Presupuesto } from '../../../presupuestos/interface/presupuesto';
import { Pedidos } from '../../interface/pedidos';
import { PedidoService } from '../../service/pedidos.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedidos-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './pedidos-add.component.html',
  styleUrl: './pedidos-add.component.css'
})
export class PedidosAddComponent {
  pedidoForm: FormGroup;
  presupuestos: Presupuesto[] = [];
  @Input() pedido?: Pedidos;
  @Output() pedidoSaved = new EventEmitter<Pedidos>();

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private presupuestoService: PresupuestoService
  ) {
    this.pedidoForm = this.fb.group({
      clienteId: ['', Validators.required],
      fechaEntrada: ['', Validators.required],
      fechaSalidaEstimada: ['', Validators.required],
      estado: ['activo', Validators.required],
      marcaAuto: ['', Validators.required],
      modeloAuto: ['', Validators.required],
      numeroSerie: ['', Validators.required],
      descripcion: [''],
      presupuesto: [null]
    });
  }

  ngOnInit() {
    this.cargarPresupuestos();
    if (this.pedido) {
      this.pedidoForm.patchValue(this.pedido);
    }
  }

  cargarPresupuestos() {
    this.presupuestoService.getPresupuestos().subscribe({
      next: (presupuestos) => (this.presupuestos = presupuestos),
      error: (error) => console.error('Error al cargar presupuestos:', error)
    });
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      const pedidoData: Pedidos = this.pedidoForm.value;
      if (this.pedido) {
        this.pedidoService.updatePedido(this.pedido.id, pedidoData).subscribe({
          next: (pedido) => this.pedidoSaved.emit(pedido),
          error: (error) => console.error('Error al actualizar pedido:', error)
        });
      } else {
        this.pedidoService.addPedido(pedidoData).subscribe({
          next: (pedido) => this.pedidoSaved.emit(pedido),
          error: (error) => console.error('Error al agregar pedido:', error)
        });
      }
    }
  }
}