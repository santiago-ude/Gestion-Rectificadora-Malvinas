import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../service/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from '../../interface/clientes';

@Component({
  selector: 'app-cliente-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-update.component.html',
  styleUrl: './cliente-update.component.css'
})
export class ClienteUpdateComponent implements OnInit {
  ngOnInit(): void {
    this.rt.paramMap.subscribe(
      {
        next:(param)=>{
          this.id =param.get("id");
          
          if(this.id != null){  
            this.getByidClientes()
            
          }else{
           alert("Error en el sistema vuelva a intertalo") 
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

 //Reactive form
 formulario = this.fr.nonNullable.group(
  {
    dni: ["",[Validators.required,Validators.minLength(7)]],
    nombre: ["",[Validators.required,Validators.minLength(2)]],
    apellido: ["",[Validators.required]],
    numero: ["",[Validators.required]],
    domicilio:["",[Validators.required]],
    altura: ["",[Validators.required]],
    metodoPago:["",[Validators.required]]
  }
)

eventSubmit() {
  if(this.formulario.invalid) return;
  this.putclientes();
  this.route.navigateByUrl('clientes');

}

getByidClientes(){
  this.sr.obtenerClienteXDni(this.id).subscribe(
    {
      next:(value)=>{      
        
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

putclientes(){
  this.sr.editarCliente(this.id,this.formulario.getRawValue()).subscribe(
    {
      next:(value)=>{
        alert("Se actualizo con exito")
      }
    }
  )
}



}
