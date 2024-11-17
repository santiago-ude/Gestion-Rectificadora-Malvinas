import { Pedidos } from './../../../pedidos/interface/pedidos';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../service/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from '../../interface/clientes';
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";
import { PedidosListComponent } from '../../../pedidos/components/pedidos-list/pedidos-list.component';
import { PedidoService } from '../../../pedidos/service/pedidos.service';

@Component({
  selector: 'app-cliente-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-update.component.html',
  styleUrl: './cliente-update.component.css'
})
export class ClienteUpdateComponent implements OnInit {

  dialogoGenerico = inject(DialogoGenericoComponent);

  ngOnInit(): void {
    this.rt.paramMap.subscribe(
      {
        next:(param)=>{
          this.id =param.get("id");
          
          if(this.id != null){  
            this.getByidClientes()
            
          }else{
              this.dialogoGenerico.abrirDialogo("Error en el sistema. Intente más tarde");
           //alert("Error en el sistema vuelva a intertalo")
          }
        }
      }
    )
  }

//Inyecciones
sr = inject(ClientesService);
fr = inject(FormBuilder);
rt = inject(ActivatedRoute);
route = inject(Router)
ps = inject(PedidoService)

//Coleccion de datos para el formulario
tipos: string[] = ["nombre","apellido","dni","numero","domicilio","altura"];
tiposPlace: string[] = [];
id? : string | null | undefined;
cliente : Clientes ={
  dni:"",nombre: "",
  apellido: "",
  numero: "",
  domicilio:"",
  altura: "",
  metodoPago:""
};
dniAux : string = '';

 //Reactive form
 formulario = this.fr.nonNullable.group(
  {
    dni: ["",[Validators.required,Validators.minLength(8)]],
    nombre: ["",[Validators.required,Validators.minLength(2)]],
    apellido: ["",[Validators.required, Validators.minLength(3)]],
    numero: ["",[Validators.required, Validators.minLength(2)]],
    domicilio:["",[Validators.required, Validators.minLength(2)]],
    altura: ["",[Validators.required, Validators.minLength(2)]],
    metodoPago:["",[Validators.required]]
  }
)

eventSubmit() {
  if(this.formulario.invalid) return;
  
  const dni : string | undefined = this.formulario.get('dni')?.value;
  const dniActual = this.dniAux;


  if(dni === dniActual){

    this.putclientes();
    this.route.navigateByUrl('clientes')

  }
  else{

  this.sr.verificarDniExistente(dni).subscribe(
    {

      next: (existe)=>{
        if(existe){
            this.dialogoGenerico.abrirDialogo("El DNI ya existe. Ingrese uno diferente");
          //alert('El DNI ya Existe. Ingrese uno Diferente')
        }else{
          this.putclientes();
          this.route.navigateByUrl('clientes');
        }
      },
      error: (e : Error)=>{
        console.log(e.message);
        this.dialogoGenerico.abrirDialogo("Error al verificar el DNI");
        //alert('Error al verificar el DNI')
      }
    }
  )

  }
}

getByidClientes(){
  this.sr.obtenerClienteXDni(this.id).subscribe(
    {
      next:(value)=>{      
        this.dniAux = value.dni
        this.cliente = value;   
        if (this.cliente) {
          this.formulario.setValue({
            dni: this.cliente.dni,
            nombre: this.cliente.nombre,
            apellido: this.cliente.apellido,
            numero: this.cliente.numero,
            domicilio: this.cliente.domicilio,
            altura: this.cliente.altura,
            metodoPago: this.cliente.metodoPago
          });
        } 
      },
      error: (err:Error) => {
        console.error('Error al obtener el cliente:', err.message);
         
      }
    }
  )
}


actualizarPedidosRelacionados() {
  const clienteActualizado = this.formulario.getRawValue(); // Datos del cliente actualizado

  // Obtiene los pedidos relacionados con este cliente
  this.ps.obtenerPedidosPorCliente(this.id).subscribe({
    next: (pedidos) => {
      pedidos.forEach((pedido) => {
        // Actualiza los datos del cliente dentro de cada pedido
        pedido.cliente = clienteActualizado;

        // Llama al servicio para actualizar el pedido en el backend
        this.ps.updatePedido(pedido.id, pedido).subscribe({
          next: () => {
            console.log(`Pedido ${pedido.id} actualizado con éxito`);
          },
          error: (err: Error) => {
            console.error(`Error al actualizar el pedido ${pedido.id}:`, err.message);
          }
        });
      });
    },
    error: (err: Error) => {
      console.error("Error al obtener los pedidos relacionados:", err.message);
    }
  });
}


putclientes() {
  // Actualizar el cliente

  if (!this.id) {
    console.error("ID inválido para actualizar el cliente.");
    this.dialogoGenerico.abrirDialogo('Error al actualizar el cliente. Intente nuevamente.');
    return;
  }


  this.sr.editarCliente(this.id, this.formulario.getRawValue()).subscribe({
    next: (clienteActualizado) => {
      this.dialogoGenerico.abrirDialogo('Se actualizó el cliente con éxito.');

      // Obtener los pedidos vinculados a este cliente
      this.ps.obtenerPedidosPorCliente(this.id).subscribe({
        next: (pedidos) => {
          pedidos.forEach((pedido) => {
            // Actualizar el cliente en el pedido
            pedido.cliente = clienteActualizado;

            // Enviar el pedido actualizado al servidor
            this.ps.updatePedido(pedido.id, pedido).subscribe({
              next: () => {
                console.log(`Pedido ${pedido.id} actualizado en el servidor.`);
              },
              error: (err : Error) => {
                console.error(`Error al actualizar el pedido ${pedido.id}:`, err);
              },
            });
          });
        },
        error: (err : Error) => {
          console.error('Error al obtener los pedidos asociados:', err);
        },
      });
    },
    error: (err) => {
      console.error('Error al actualizar el cliente:', err);
      this.dialogoGenerico.abrirDialogo('Error al actualizar el cliente. Intente nuevamente.');
    },
  });
}




}
