import { Component } from '@angular/core';
import { PedidosListComponent } from "../../components/pedidos-list/pedidos-list.component";

@Component({
  selector: 'app-list-pedidos-page',
  standalone: true,
  imports: [PedidosListComponent],
  templateUrl: './list-pedidos-page.component.html',
  styleUrl: './list-pedidos-page.component.css'
})
export class ListPedidosPageComponent {

}
