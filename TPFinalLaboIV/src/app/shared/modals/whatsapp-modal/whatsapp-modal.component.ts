import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-whatsapp-modal',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [],
  templateUrl: './whatsapp-modal.component.html',
  styleUrl: './whatsapp-modal.component.css'
})
export class WhatsappModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { enlace: string, clienteNombre: string },
    private dialogRef: MatDialogRef<WhatsappModalComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // Abre el enlace de WhatsApp
  openWhatsapp(): void {
    window.open(this.data.enlace, '_blank'); // Abre el enlace en una nueva pestaña
    this.dialogRef.close();
  }
}