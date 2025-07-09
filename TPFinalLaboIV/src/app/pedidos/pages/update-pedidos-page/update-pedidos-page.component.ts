import { Component } from '@angular/core';
import { PedidosUpdateComponent } from '../../components/pedidos-update/pedidos-update.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-pedidos-page',
  standalone: true,
  imports: [PedidosUpdateComponent, CommonModule],
  templateUrl: './update-pedidos-page.component.html',
  styleUrl: './update-pedidos-page.component.css'
})
export class UpdatePedidosPageComponent {

}
