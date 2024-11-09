import { Component } from '@angular/core';
import { PedidosListComponent } from "../../../pedidos/components/pedidos-list/pedidos-list.component";
import { PresupuestosListComponent } from "../../components/presupuestos-list/presupuestos-list.component";

@Component({
  selector: 'app-presupuesto-page',
  standalone: true,
  imports: [PedidosListComponent, PresupuestosListComponent],
  templateUrl: './presupuesto-page.component.html',
  styleUrl: './presupuesto-page.component.css'
})
export class PresupuestoPageComponent {

}
