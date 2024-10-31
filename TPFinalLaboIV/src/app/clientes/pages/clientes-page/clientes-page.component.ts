import { Component } from '@angular/core';
import { ClienteAddComponent } from "../../components/cliente-add/cliente-add.component";

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [ClienteAddComponent],
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.css'
})
export class ClientesPageComponent {

}
