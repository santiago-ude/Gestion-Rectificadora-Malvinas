import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.css']
})
export class QrModalComponent implements OnInit {
  qrCodeDataUrl: string | undefined;
  whatsappLink: string = 'https://wa.me/5492236834480';

  constructor(private dialogRef: MatDialogRef<QrModalComponent>) {}

  ngOnInit() {
    this.generarQR();
  }

  generarQR() {
    QRCode.toDataURL(this.whatsappLink, { width: 200, errorCorrectionLevel: 'M' }, (err, url) => {
      if (err) throw err;
      this.qrCodeDataUrl = url;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
