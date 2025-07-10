import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../service/clientes.service';
import { Clientes } from '../../interface/clientes';
import { PedidoService } from '../../../pedidos/service/pedidos.service';
import { DialogoGenericoComponent } from '../../../shared/modals/dialogo-generico/dialogo-generico.component';
import { CommonModule, NgClass } from '@angular/common'; // <--- AÑADIDO NgClass

@Component({
  selector: 'app-cliente-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgClass], // <--- AÑADIDO NgClass
  templateUrl: './cliente-update.component.html',
  styleUrl: './cliente-update.component.css',
})
export class ClienteUpdateComponent implements OnInit {


  //Inyecciones
  dialogoGenerico = inject(DialogoGenericoComponent);
  sr = inject(ClientesService);
  fr = inject(FormBuilder);
  rt = inject(ActivatedRoute);
  route = inject(Router);
  ps = inject(PedidoService);

  //Variables auxiliares para el update
  id?: number | null;
  dniAux: string = '';
  cliente!: Clientes;

  //Reactive Form
  formulario = this.fr.nonNullable.group({
    dni: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^[0-9]+$/)] }),
    nombre: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)] }),
    apellido: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)] }),
    numero: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)] }),
    domicilio: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    altura: this.fr.control('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[0-9]+$/)] }),
    metodoPago: this.fr.control('', { nonNullable: true, validators: [Validators.required] })
  });


  //Meotodo de ejecucion inicial
  ngOnInit(): void {
    this.rt.paramMap.subscribe((param) => {
      this.id = param.get('id') ? Number(param.get('id')) : null;
      if (this.id != null) {
        this.getByidClientes();
      } else {
        this.dialogoGenerico.abrirDialogo('Error en el sistema. Intente más tarde');
      }
    });
  }


  //Ejecuta la request para obtener un cliente por id
  getByidClientes() {

    //Obtiene un cliente por medio del id
    this.sr.obtenerClienteXDni(this.id).subscribe({
      next: (value) => {
        this.dniAux = value.dni;
        this.cliente = value;
        this.formulario.patchValue({ ...value }); // usa patchValue para precargar
      },
      error: (err: Error) => {
        console.error('Error al obtener el cliente:', err.message);
      },
    });
  }


  //Ejecuta el evento para actualizar el cliente
  eventSubmit() {

    //Si el formulario es invalido, termina
    if (this.formulario.invalid) return;

    const dni = this.formulario.get('dni')?.value;

    if (dni === this.dniAux) {
      this.putclientes();
    } 
    else {

      //Verifica si el DNI existe en otro cliente
      this.sr.verificarDniExistente(dni).subscribe({
        next: (existe) => {
          if (existe) {
            this.dialogoGenerico.abrirDialogo('El DNI ya existe. Ingrese uno diferente');
          } else {
            this.putclientes();
          }
        },
        error: (e: Error) => {
          this.dialogoGenerico.abrirDialogo('Error al verificar el DNI');
        },
      });
    }
  }


  //Eecuta la updateCliente Request
  putclientes() {
    if (!this.id) return;

    //almacena el formulario del update
    const clienteActualizado = this.formulario.getRawValue();

    //Actualiza el cliente
    this.sr.editarCliente(this.id, clienteActualizado).subscribe({
      next: (cliente) => {
        this.dialogoGenerico.abrirDialogo('Se actualizó el cliente con éxito');

        //Obtiene los pedidos que esten asociados con el cliente actualizado
        this.ps.obtenerPedidosPorCliente(this.id!).subscribe({
          next: (pedidos) => {

            //Recorre el aray con los pedidos asociados al cliente
            pedidos.forEach((pedido) => {
              pedido.cliente = cliente;

              //Actualiza el cliente en cada pedido asociado al cliente actualizado
              this.ps.updatePedido(pedido.id, pedido).subscribe();
            });
          },
        });
        this.route.navigateByUrl('clientes');
      },
      error: () => {
        this.dialogoGenerico.abrirDialogo('Error al actualizar el cliente. Intente nuevamente.');
      },
    });
  }
}