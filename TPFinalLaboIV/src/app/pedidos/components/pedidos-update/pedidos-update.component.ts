import { Component, inject } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { ClientesService } from '../../../clientes/service/clientes.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { FormBuilder, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Clientes } from '../../../clientes/interface/clientes';
import { Presupuesto } from '../../../presupuestos/interface/presupuesto';
import { Pedidos } from '../../interface/pedidos';
import { CommonModule } from '@angular/common';
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";

@Component({
  selector: 'app-pedidos-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './pedidos-update.component.html',
  styleUrl: './pedidos-update.component.css'
})


export class PedidosUpdateComponent {
  
  //INYECCIONES

  //Servicio de peticiones para pedidos
  pedidoService = inject(PedidoService);
  
  //Servicio de peticiones para clientes
  clienteService = inject(ClientesService);
  
  //Servicio de peticiones para presupuestos
  presupuestoService = inject(PresupuestoService);
  
  //Servicio de creacion de formularios
  fb = inject(FormBuilder);
  
  //Servicios de router
  router = inject(ActivatedRoute);
  
  //Servicios de router
  rt = inject(Router);
  
  //Servicios para crea dialogos genericos
  dialogoGenerico = inject(DialogoGenericoComponent);

  //Colecciones y variables 
  id: Number | null = null;
  clientes: Clientes[] = [];
  presupuestos: Presupuesto[] = [];



  //Reactive Form
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
  },
  { validators: this.fechaEntradaAntesDeSalidaValidator() }
);


//Inicializacion
  ngOnInit(){
    this.router.paramMap.subscribe((params) => {
    this.id = params.get("id") ? Number(params.get("id")) : null;
      if (this.id) {
        this.buscarPorId(this.id);
      }
    });
    this.cargarClientes();
    this.cargarPresupuestos();
  }

  //Carga el cliente asociado al pedido
  cargarClientes(){
    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }


  //Carga el presupuesto del pedido que se quiere actualizar
  cargarPresupuestos(){
    this.presupuestoService.getPresupuestos().subscribe({
      next: (presupuestos) => this.presupuestos = presupuestos,
      error: (error) => console.error('Error al cargar presupuestos:', error)
    });
  }

   //Validacion para que la fecha de salida no sea antes que la fecha de entrada
   fechaEntradaAntesDeSalidaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaEntrada = control.get('fechaEntrada')?.value;
      const fechaSalidaEstimada = control.get('fechaSalidaEstimada')?.value;

      if (fechaEntrada && fechaSalidaEstimada && new Date(fechaEntrada) > new Date(fechaSalidaEstimada)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }


  //Busca el pedido por su ID
  buscarPorId(id: Number){
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


  //Verifica el estado del pedido
  verificarEstadoPedido() {
    const fechaSalidaEstimada = new Date(this.formulario.value.fechaSalidaEstimada as string);
    const hoy = new Date();
    
    if (this.formulario.value.estado === 'atrasado' && fechaSalidaEstimada > hoy) {
      this.formulario.patchValue({ estado: 'activo' });
    }
  }


  //Ejecuta la UpdateRequest de Pedidos
actualizarPedido(){

  //Actualiza el pedido
  this.verificarEstadoPedido(); 

  // Verificar el estado antes de guardar
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
      next: () => {
        this.dialogoGenerico.abrirDialogo("Pedido actulizado con éxito!");
        this.rt.navigateByUrl('pedidos')

      },
          //alert("Pedido actualizado con éxito"),
      error: (error) => console.error('Error al actualizar pedido:', error)
    });

    

  }
}
