import { Component } from '@angular/core';
import { ClienteUpdateComponent } from "../../components/cliente-update/cliente-update.component";

@Component({
  selector: 'app-update-page',
  standalone: true,
  imports: [ClienteUpdateComponent],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css'
})
export class UpdatePageComponent {

}
