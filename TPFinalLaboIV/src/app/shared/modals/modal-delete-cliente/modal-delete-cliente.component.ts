import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-delete-cliente',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './modal-delete-cliente.component.html',
  styleUrls: ['./modal-delete-cliente.component.css'],
})
export class ModalDeleteClienteComponent {
  @Output() confirmDelete = new EventEmitter<boolean>();

  constructor(
    private dialogRef: MatDialogRef<ModalDeleteClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  confirmar() {
    this.confirmDelete.emit(true);
    this.dialogRef.close(true);
  }

  cancelar() {
    this.confirmDelete.emit(false);
    this.dialogRef.close(false);
  }
}
