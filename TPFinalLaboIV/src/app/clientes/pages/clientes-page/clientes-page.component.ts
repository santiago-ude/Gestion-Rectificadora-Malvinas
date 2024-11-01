import { Component, input } from '@angular/core';
import { ClienteAddComponent } from "../../components/cliente-add/cliente-add.component";
import { ClienteListComponent } from "../../components/cliente-list/cliente-list.component";
import { MenuComponent } from "../../../landingPage/menu/menu.component";


@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [ClienteAddComponent, ClienteListComponent, MenuComponent],
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.css'
})
export class ClientesPageComponent {

}
