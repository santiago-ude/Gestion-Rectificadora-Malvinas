import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrModalComponent } from '../../shared/modals/qr-modal/qr-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  dentroP1: boolean = false;

  constructor(private dialog: MatDialog) {}

  onMouseOverP1() {
    this.dentroP1 = true;
  }

  onMouseLeaverP1() {
    this.dentroP1 = false;
  }

  openModal() {
    this.dialog.open(QrModalComponent, {
      width: '400px',
      height: '400px'
    });
  }
}
