import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pedidos } from '../../../pedidos/interface/pedidos';

@Component({
  selector: 'app-pedidos-cercanos-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pedidos-cercanos-modal.component.html',
  styleUrl: './pedidos-cercanos-modal.component.css'
})
export class PedidosCercanosModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pedidos: Pedidos[] },
    private dialogRef: MatDialogRef<PedidosCercanosModalComponent>
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}
