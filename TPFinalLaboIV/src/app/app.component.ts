import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageComponent } from './landingPage/page/page.component';
import { ClienteAddComponent } from "./clientes/components/cliente-add/cliente-add.component";
import { ClientesPageComponent } from "./clientes/pages/clientes-page/clientes-page.component";
import { FooterComponent } from "./landingPage/footer/footer.component";
import { MenuComponent } from "./landingPage/menu/menu.component";
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageComponent, FooterComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Cambiado a styleUrls (en plural)
})
export class AppComponent {
  title = 'TPFinalLaboIV';
}
