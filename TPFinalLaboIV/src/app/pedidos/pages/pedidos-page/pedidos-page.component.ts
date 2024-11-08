import { Component } from '@angular/core';
import { PedidosListComponent } from '../../components/pedidos-list/pedidos-list.component';
import { PedidosAddComponent } from '../../components/pedidos-add/pedidos-add.component';
@Component({
  selector: 'app-pedidos-page',
  standalone: true,
  imports: [PedidosListComponent, PedidosAddComponent],
  templateUrl: './pedidos-page.component.html',
  styleUrl: './pedidos-page.component.css'
})
export class PedidosPageComponent {

}
