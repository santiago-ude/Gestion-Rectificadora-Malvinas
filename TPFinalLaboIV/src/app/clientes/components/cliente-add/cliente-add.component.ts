import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../service/clientes.service';

@Component({
  selector: 'app-cliente-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './cliente-add.component.html',
  styleUrl: './cliente-add.component.css'
})
export class ClienteAddComponent {

 
 //Inyecciones
  sr = inject(ClientesService);
  fr = inject(FormBuilder);

  //Coleccion de datos para el formulario
  tipos: string[] = ["nombre","apellido","dni","numero","domicilio","altura"];
  tiposPlace: string[] = ["Nombre","Apellido","DNI","Número","Domicilio","Altura"];
  
  //Acciones en la pantalla
  dentroImg:boolean =false;
  dentroH2:boolean =false;

  onMouseOver(){
    this.dentroImg=true;
  }
  onMouseLeave() {
    this.dentroImg=false
   }

   h2Mouseover(){
    this.dentroH2=true
   }
   h2Mouseleave(){
    this.dentroH2=false;
   }
   //

  //Reactive form
  formulario = this.fr.nonNullable.group(
    {
      dni: ["",[Validators.required,Validators.minLength(8), Validators.maxLength(8)]],
      nombre: ["",[Validators.required,Validators.minLength(2)]],
      apellido: ["",[Validators.required]],
      numero: ["",[Validators.required]],
      domicilio:["",[Validators.required]],
      altura: ["",[Validators.required]],
      metodoPago:["",[Validators.required]]
    }
  )

  eventSubmit() {
    console.log(this.formulario.status);
    
    if(this.formulario.invalid)return;
    console.log(this.formulario.getRawValue());
    
    this.postCliente();
    this.formulario.reset();
  }
  
  postCliente(){
    this.sr.agregarCliente(this.formulario.getRawValue()).subscribe(
      {
        next:()=>{
        alert("Se agrego correctamente")
        },
        error:(error:Error)=>{
          alert(error);
        }
      }
    )
  }

}
