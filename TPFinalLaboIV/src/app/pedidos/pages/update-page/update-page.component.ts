import { Component } from '@angular/core';
import { PedidosUpdateComponent } from '../../components/pedidos-update/pedidos-update.component';

@Component({
  selector: 'app-update-page',
  standalone: true,
  imports: [PedidosUpdateComponent],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css'
})
export class UpdatePageComponent {

}
