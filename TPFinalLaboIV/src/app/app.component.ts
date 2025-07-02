import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageComponent } from './landingPage/page/page.component';
import { ClienteAddComponent } from "./clientes/components/cliente-add/cliente-add.component";
import { ClientesPageComponent } from "./clientes/pages/clientes-page/clientes-page.component";
import { FooterComponent } from "./landingPage/footer/footer.component";
import { MenuComponent } from "./landingPage/menu/menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Cambiado a styleUrls (en plural)
})
export class AppComponent {
  title = 'TPFinalLaboIV';
}
