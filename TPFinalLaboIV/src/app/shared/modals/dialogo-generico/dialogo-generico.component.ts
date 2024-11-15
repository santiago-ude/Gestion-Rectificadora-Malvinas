import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-generico',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './dialogo-generico.component.html',
  styleUrl: './dialogo-generico.component.css'
})
export class DialogoGenericoComponent {
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: { message: string },
      public dialogRef: MatDialogRef<DialogoGenericoComponent>
  ) {}

  matDialog = inject(MatDialog);

  abrirDialogo(mensaje: string){
    this.matDialog.open(DialogoGenericoComponent, {
      data: {
        message: mensaje
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
