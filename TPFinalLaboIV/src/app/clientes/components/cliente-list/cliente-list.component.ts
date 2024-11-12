import { Component, EventEmitter, inject, OnInit, Output, OutputEmitterRef } from '@angular/core';
import { Clientes } from '../../interface/clientes';
import { ClientesService } from '../../service/clientes.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClienteUpdateComponent } from '../cliente-update/cliente-update.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
        alert("No está cargado dicho DNI");
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



}
