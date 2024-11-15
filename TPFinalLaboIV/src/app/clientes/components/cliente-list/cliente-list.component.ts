import { Component, EventEmitter, inject, OnInit, Output, OutputEmitterRef } from '@angular/core';
import { Clientes } from '../../interface/clientes';
import { ClientesService } from '../../service/clientes.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteUpdateComponent } from '../cliente-update/cliente-update.component';
import { PedidoService } from '../../../pedidos/service/pedidos.service';
import { UnaryFunction } from 'rxjs';
import { Pedidos } from '../../../pedidos/interface/pedidos';
import {MatButtonModule} from "@angular/material/button";
import {DialogoGenericoComponent} from "../../../shared/modals/dialogo-generico/dialogo-generico.component";

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit{


  ngOnInit(): void {
    this.getClientesList();
  } 
  clientes: Clientes[] = [];
  clientesFiltrados: Clientes[] = [];   
  filtro: string = '';     
  clientesEncontrados : Clientes[] = [] ;
  n:number=-2;
  dni:string ="";

 
  
  //Injecciones
  sr = inject(ClientesService)
  rt = inject(Router)
  pedidosService = inject(PedidoService);
  dialogoGenerico = inject(DialogoGenericoComponent);

  getClientesList(){
    this.sr.obtenerClientes().subscribe(
      {
        next:(value)=>{
          this.clientes = value;
          this.clientes = this.clientes.sort((a, b) => parseInt(a.dni) - parseInt(b.dni));
          this.clientesFiltrados = [...this.clientes];
        }
      }
    )
  }
   // Buscar por DNI
   buscarClienteXDNI(dni: string, event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.n = this.clientes.findIndex((c) => c.dni === dni);
      if (this.n === -1) {

      this.dialogoGenerico.abrirDialogo("No está cargado dicho DNI");

        //alert("No está cargado dicho DNI");
      }
      this.clientesEncontrados = this.n >= 0 ? [this.clientes[this.n]] : [];
    }
  }

  // Filtrar por Nombre o Apellido
  filtrarClientes() {
    const filtroLowerCase = this.filtro.toLowerCase();
    this.clientesEncontrados = this.clientes // Filtra la lista original de clientes
      .filter(cliente =>
        cliente.nombre.toLowerCase().includes(filtroLowerCase) ||
        cliente.apellido.toLowerCase().includes(filtroLowerCase)
      )
      .sort((a, b) => parseInt(a.dni) - parseInt(b.dni));
  }

  enviarModificacion(id : string  | undefined) {
      this.rt.navigate([`clientes/update/${id}`])
    
  }
  
  // Restablecer filtros
  resetearFiltros() {
    this.clientesFiltrados = [...this.clientes]; // Restaura la lista original
    this.filtro = '';
    this.clientesEncontrados = []; // Limpia los resultados encontrados
    this.dni = ''
  }


  confirmarYEliminarCliente(clienteId: string | null | undefined) {
    // Paso 1: Verificar si el cliente tiene pedidos asociados
    this.pedidosService.obtenerPedidosPorCliente(clienteId).subscribe({
      next: (pedidos : Pedidos[]) => {
      if (pedidos && pedidos.length > 0) {
        // Paso 2: Mostrar confirmación solo si hay pedidos asociados
        const confirmacion = window.confirm('Este cliente tiene pedidos asociados. ¿Deseas eliminarlo de todos modos?');
        if (confirmacion) {
          // Si el usuario confirma, eliminar el cliente
          this.eliminarCliente(clienteId);
        }
      } else {
        // Si no tiene pedidos asociados, eliminar el cliente directamente
        this.eliminarCliente(clienteId);
      }
    },
  error: (e : Error) => {console.log(e.message);}});
  }

  eliminarCliente(clienteId: string | null | undefined) {
    this.sr.borrarCliente(clienteId).subscribe({
      next: () => {
        //alert('Cliente eliminado correctamente.');
        this.dialogoGenerico.abrirDialogo("Cliente eliminado correctamente");

        // Aquí puedes añadir lógica para actualizar la lista de clientes
        this.clientes = this.clientes.filter(client => client.id !== clienteId);
        this.clientesFiltrados = this.clientesFiltrados.filter(client => client.id !== clienteId);
        this.clientesEncontrados = this.clientesEncontrados.filter(client => client.id !== clienteId);
      },
      error: (error) => console.error('Error al eliminar cliente:', error)
    });
  }
  
  // Esta función carga los clientes y la llamas en el ngOnInit
  cargarClientes() {
    this.sr.obtenerClientes().subscribe({
      next: (clientes) => this.clientes = clientes,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }
  



}
