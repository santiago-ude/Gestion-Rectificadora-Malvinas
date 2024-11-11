import { Component, EventEmitter, inject, OnInit, Output, OutputEmitterRef } from '@angular/core';
import { Clientes } from '../../interface/clientes';
import { ClientesService } from '../../service/clientes.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [FormsModule],
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
  clienteEncontrado?:Clientes;
  n:number=-2;

  //Buscar Por ID
  buscarClienteXDNI(dni:string, event:KeyboardEvent){
    if(event.key === "Enter"){
      this.n= this.clientes.findIndex((c)=>c.dni==dni);
      if(this.n==-1){
        alert("No esta cargado dicho DNI");
        
      }
      this.clienteEncontrado = this.clientes[this.n];
    }
 
  }
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
  filtrarClientes() {
    const filtroLowerCase = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes
      .filter(cliente =>
        cliente.nombre.toLowerCase().includes(filtroLowerCase) ||
        cliente.apellido.toLowerCase().includes(filtroLowerCase)
      )
      .sort((a, b) => parseInt(a.dni) - parseInt(b.dni));
  }

  enviarModificacion() {
    if(this.n>=0){
      this.rt.navigate([`clientes/update/${this.clientes[this.n].id}`])
    }
  }
  
  resetearFiltros() {
    this.clientesFiltrados = [...this.clientes]; // Restaura la lista original
    this.filtro = ''; 
  }

}
