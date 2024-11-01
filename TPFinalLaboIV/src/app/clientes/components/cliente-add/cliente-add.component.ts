import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cliente-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-add.component.html',
  styleUrl: './cliente-add.component.css'
})
export class ClienteAddComponent {
eventSubmit() {
throw new Error('Method not implemented.');
}
  tipos: string[] = ["nombre","apellido","dni","numero","domicilio","altura"];
  tiposPlace: string[] = ["Nombre","Apellido","DNI","Número","Domicilio","Altura"];
  

  fr = inject(FormBuilder);
  formulario = this.fr.nonNullable.group(
    {
      dni: ["",[Validators.required,Validators.minLength(11),Validators.maxLength(11)]],
      nombre: ["",[Validators.required,Validators.minLength(2)]],
      apellido: ["",[Validators.required]],
      numero: ["",[Validators.required]],
      domicilio:["",[Validators.required]],
      altura: ["",[Validators.required]]
    }
  )

}
