import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DescuentoConfigService } from '../../services/descuentos-config.service';

@Component({
  selector: 'app-modal-descuentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-descuentos.component.html',
  styleUrl: './modal-descuentos.component.css'
})
export class ModalDescuentosComponent {
  configService = inject(DescuentoConfigService);
  dialogRef = inject(MatDialogRef<ModalDescuentosComponent>);

  descuentos = this.configService.getTodos();

  actualizarDescuento(metodo: string, valor: number) {
    this.configService.setDescuento(metodo, valor);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
