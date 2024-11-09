import { Component } from '@angular/core';
import { ClienteAddComponent } from "../../../clientes/components/cliente-add/cliente-add.component";
import { ClienteListComponent } from "../../../clientes/components/cliente-list/cliente-list.component";
import { PedidosListComponent } from "../../components/pedidos-list/pedidos-list.component";

@Component({
  selector: 'app-list-pedidos-page',
  standalone: true,
  imports: [ClienteAddComponent, ClienteListComponent, PedidosListComponent],
  templateUrl: './list-pedidos-page.component.html',
  styleUrl: './list-pedidos-page.component.css'
})
export class ListPedidosPageComponent {

}
