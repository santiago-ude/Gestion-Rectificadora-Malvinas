import { Component } from '@angular/core';
import { PedidosAddComponent } from '../../components/pedidos-add/pedidos-add.component';
@Component({
  selector: 'app-pedidos-page',
  standalone: true,
  imports: [PedidosAddComponent],
  templateUrl: './pedidos-page.component.html',
  styleUrl: './pedidos-page.component.css'
})
export class PedidosPageComponent {

}
