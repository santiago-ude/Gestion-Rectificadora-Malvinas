import { Component, inject, OnInit } from '@angular/core';
import { Clientes } from '../../interface/clientes';
import { ClientesService } from '../../service/clientes.service';
import { FormsModule, NgModel } from '@angular/forms';

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
  clienteEncontrado?:Clientes;
  n:number=-2;

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
  
  sr = inject(ClientesService)

  getClientesList(){
    this.sr.obtenerClientes().subscribe(
      {
        next:(value)=>{
          this.clientes = value;
          this.clientes = this.clientes.sort((a, b) => parseInt(a.dni) - parseInt(b.dni));
        }
      }
    )
  }

}
