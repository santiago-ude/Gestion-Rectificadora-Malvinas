import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogContent, MatDialogActions],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {

  @Output() confirmDelete = new EventEmitter<boolean>();

  constructor(
    private dialogRef: MatDialogRef<ModalConfirmacionComponent>,
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
