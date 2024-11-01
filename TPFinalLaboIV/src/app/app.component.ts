import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/navbar/navbar.component';
import { PresupuestoAddComponent } from "./presupuestos/components/presupuesto-add/presupuesto-add.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, PresupuestoAddComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TPFinalLaboIV';
}
