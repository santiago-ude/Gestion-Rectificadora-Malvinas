import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ModalDescuentosComponent } from '../modal-descuentos/modal-descuentos.component';
import { ThemeService } from '../../services/tema.service';

@Component({
  selector: 'app-modal-opciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-opciones.component.html',
  styleUrl: './modal-opciones.component.css'
})
export class ModalOpcionesComponent {
  dialogRef = inject(MatDialogRef<ModalOpcionesComponent>);
  dialog = inject(MatDialog);

  // Cierra este modal y abre el de descuentos
  abrirDescuentos() {
    this.dialogRef.close(); // cerrar el modal actual
    setTimeout(() => {
      this.dialog.open(ModalDescuentosComponent, {
        width: '25vw',
        height: '60vh',
        maxWidth: '65vw',
      });
    }, 200); // delay breve para que se cierre visualmente antes de abrir el otro
  }

  cerrar() {
    this.dialogRef.close();
  }

  constructor(private themeService: ThemeService) {}

  cambiarTema() {
    this.themeService.cambiarTema();
  }
}