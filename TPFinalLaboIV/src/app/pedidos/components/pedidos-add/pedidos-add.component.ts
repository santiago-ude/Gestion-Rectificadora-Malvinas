import { Presupuesto } from './../../../presupuestos/interface/presupuesto';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PedidoService } from '../../service/pedidos.service';
import { PresupuestoService } from '../../../presupuestos/service/presupuesto.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Pedidos } from '../../interface/pedidos';
import { Clientes } from '../../../clientes/interface/clientes';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../../clientes/service/clientes.service';
import { PresupuestosAddComponent } from '../../../presupuestos/components/presupuestos-add/presupuestos-add.component';
import { Item } from '../../../presupuestos/interface/item';
import { DialogoGenericoComponent } from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pedidos-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './pedidos-add.component.html',
  styleUrls: ['./pedidos-add.component.css']
})
export class PedidosAddComponent {


  //INYECCIONES

  //Servicio de peticiones para pedidos
  pedidoService = inject(PedidoService);

  //Servicio de peticiones para clientes
  clienteService = inject(ClientesService);

  //Servicio de peticiones para presupuestos
  presupuestoService = inject(PresupuestoService);

  //Servicio para generar dialogos genericos
  dialogoGenerico = inject(DialogoGenericoComponent);

  //Servicio de construccion de formularios
  fb = inject(FormBuilder);

  //Servicio de router
  route = inject(ActivatedRoute);


  //Coleccion-Variables auxiliares para el pedido-add
  clientes: Clientes[] = [];
  auxiliarPresupuesto: Presupuesto = { fecha: new Date(), descuento: 0, items: [], total: 0 };
  cargarPresupuesto: boolean = false
  presupuestoCargado: boolean = false;
  dialog = inject(MatDialog);


  //Reactive Form
  formulario = this.fb.nonNullable.group({
    cliente: [null as Clientes | null, Validators.required],
    fechaEntrada: [this.getFechaActual(), Validators.required],
    fechaSalidaEstimada: ['', Validators.required],
    estado: ['activo' as 'activo' | 'entregado' | 'atrasado', Validators.required],
    marcaAuto: ['', Validators.required],
    modeloAuto: ['', Validators.required],
    numeroSerie: ['', Validators.required],
    descripcion: [''],
    presupuesto: [null as Presupuesto | null, Validators.required]
  },
    { validators: this.fechaEntradaAntesDeSalidaValidator() }
  );


  //Retorna fecha actual
  getFechaActual(): string {
    const hoy = new Date();
    return hoy.getFullYear() + '-' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoy.getDate()).padStart(2, '0');
  }


  //Inicializacion 
  ngOnInit() {
    this.cargarClientes();
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


  //Traer cliente del json-server
  cargarClientes() {
    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }



  // Captura el evento y almacena el presupuesto
  addPresupuesto(pres: Presupuesto) {
    this.auxiliarPresupuesto = pres;

    // Actualizar el control del formulario para reflejar el cambio
    this.formulario.patchValue({ presupuesto: this.auxiliarPresupuesto });
    this.formulario.controls['presupuesto'].markAsTouched();
    this.formulario.controls['presupuesto'].updateValueAndValidity();

    this.presupuestoCargado = true;
  }



  //Retornar un descuento especifico dependiendo el metodo de pago  
  asignarDescuento(cliente: Clientes) {

    if (cliente.metodoPago === 'efectivo') {
      return 10;
    }
    else if (cliente.metodoPago === 'tarjeta de debito') {
      return 5;
    }
    else {
      return 0;
    }
  }


  //Calcular total de presupuesto sumando el precio final de cada item
  calcularTotal(items: Item[]): number {
    return items.reduce((suma, item) => suma + item.precioFinal, 0);
  }



  //Verifica el presupuesto
  //Verifica el pedido y almacena en el json-server
  agregarPedido() {

    if (this.formulario.invalid || !this.auxiliarPresupuesto) {
      this.dialogoGenerico.abrirDialogo("El formulario no es válido o el presupuesto no está asignado");
      //alert('El formulario no es válido o el presupuesto no está asignado.');
      return;
    }

    // Normalizar la descripción
    const descripcionControl = this.formulario.get('descripcion');
    if (descripcionControl && descripcionControl.value) {
      descripcionControl.setValue(this.capitalizeFirstLetter(descripcionControl.value), { emitEvent: false });
    }


    //Calcula descuento y precio total
    let descuentoAux = this.asignarDescuento(this.formulario.value.cliente as Clientes);
    let totalAux = this.calcularTotal(this.auxiliarPresupuesto.items);
    let desc = descuentoAux / 100;
    totalAux = totalAux - (totalAux * desc);


    const pedido: Pedidos = {
      ...this.formulario.getRawValue(),
      cliente: this.formulario.value.cliente as Clientes,
      fechaEntrada: new Date(this.formulario.value.fechaEntrada as string + 'T12:00:00'),
      fechaSalidaEstimada: new Date(this.formulario.value.fechaSalidaEstimada as string + 'T12:00:00'),
      estado: this.formulario.value.estado as 'activo' | 'entregado' | 'atrasado',
      presupuesto: {
        ...this.auxiliarPresupuesto,
        descuento: descuentoAux,
        total: totalAux
      }
    };

    this.cargarPresupuesto = false;

    this.pedidoService.addPedido(pedido).subscribe({
      next: () => this.dialogoGenerico.abrirDialogo("Pedido agregado exitosamente"),
      //alert('Pedido agregado exitosamente'),
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

  // Función para capitalizar la primera letra de la descripción
  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  //Abre el dialog donde se carga el presupuesto y luego los items
  abrirDialogPresupuesto() {
    const dialogRef = this.dialog.open(PresupuestosAddComponent);
    dialogRef.afterClosed().subscribe(presupuesto => {
      if (presupuesto) {
        this.addPresupuesto(presupuesto);
      }
    });
  }

  //Recorrer itemsel presupuesto asociado al pedido
  trackByFn(index: number, item: any): any {
    return item.id;
  }



}