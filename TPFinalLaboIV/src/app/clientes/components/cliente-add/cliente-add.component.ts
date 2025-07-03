import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../service/clientes.service';
import { DialogoGenericoComponent } from "../../../shared/modals/dialogo-generico/dialogo-generico.component";

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
  dialogoGenerico = inject(DialogoGenericoComponent);

  //Coleccion de datos para el formulario
  tipos: string[] = ["nombre", "apellido", "dni", "numero", "domicilio", "altura"];
  tiposPlace: string[] = ["Nombre", "Apellido", "DNI", "Número", "Domicilio", "Altura"];

  //Acciones en la pantalla
  dentroImg: boolean = false;
  dentroH2: boolean = false;

  onMouseOver() {
    this.dentroImg = true;
  }
  onMouseLeave() {
    this.dentroImg = false
  }

  h2Mouseover() {
    this.dentroH2 = true
  }
  h2Mouseleave() {
    this.dentroH2 = false;
  }
  //



  //Reactive form
  formulario = this.fr.nonNullable.group(
    {
      dni: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      nombre: ["", [Validators.required, Validators.minLength(2)]],
      apellido: ["", [Validators.required, Validators.minLength(3)]],
      numero: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      domicilio: ["", [Validators.required, Validators.minLength(2)]],
      altura: ["", [Validators.required, Validators.minLength(2)]],
      metodoPago: ["", [Validators.required]]
    }
  )



  //EJECUTA EL EVENTO PARA AGREGAR EL CLIENTE
  eventSubmit() {

    if (this.formulario.invalid) return; //NO SE EJECUTA SI EL FORMULARIO ES INVALIDO


    // Convertir todos los valores string a minúsculas
    Object.keys(this.formulario.controls).forEach((campo) => {
      const control = this.formulario.get(campo);
      if (control && typeof control.value === 'string') {
        control.setValue(control.value.toLowerCase(), { emitEvent: false });
      }
    });

    
    const dni: string | undefined = this.formulario.get('dni')?.value; //ALMACENA EL DNI EN UN AUXILIAR PARA VERIFICAR QUE NO EXISTA

    this.sr.verificarDniExistente(dni).subscribe(
      {

        next: (existe) => {
          if (existe) {
            //alert('El DNI ya Existe. Ingrese uno Diferente')
            this.dialogoGenerico.abrirDialogo("El DNI ya existe. Ingrese uno diferente");
          } else {
            this.postCliente(); //SI NO EXISTE, EJECUTA EL METODO POST
            this.formulario.reset() //RESETEA EL FORMULARIO
          }
        },
        error: (e: Error) => {
          console.log(e.message);
          this.dialogoGenerico.abrirDialogo("Error al verificar el DNI");
          alert('Error al verificar el DNI')
        }
      }

    )
  }


  //METODO PARA EJECUTAR LA POST REQUEST 
  postCliente() {
    this.sr.agregarCliente(this.formulario.getRawValue()).subscribe(
      {
        next: () => {
          //alert("Se agrego correctamente")
          this.dialogoGenerico.abrirDialogo("Se agrego correctamente");
        },
        error: (error: Error) => {
          this.dialogoGenerico.abrirDialogo("Se ha producido un error desconocido");
          //error no tiene un metodo toString, mensaje de error generico
          //alert(error);
        }
      }
    )
  }

}
