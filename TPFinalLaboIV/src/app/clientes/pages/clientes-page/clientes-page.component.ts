import { Component } from '@angular/core';
import { ClienteAddComponent } from "../../components/cliente-add/cliente-add.component";
import { ClienteListComponent } from "../../components/cliente-list/cliente-list.component";

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [ClienteAddComponent, ClienteListComponent],
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.css'
})
export class ClientesPageComponent {

}
