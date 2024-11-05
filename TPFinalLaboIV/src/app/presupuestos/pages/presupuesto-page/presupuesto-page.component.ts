import { Component } from '@angular/core';
import { PedidosListComponent } from "../../../pedidos/components/pedidos-list/pedidos-list.component";

@Component({
  selector: 'app-presupuesto-page',
  standalone: true,
  imports: [PedidosListComponent],
  templateUrl: './presupuesto-page.component.html',
  styleUrl: './presupuesto-page.component.css'
})
export class PresupuestoPageComponent {

}
