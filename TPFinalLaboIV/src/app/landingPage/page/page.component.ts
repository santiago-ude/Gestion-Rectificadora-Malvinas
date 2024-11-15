import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { CuerpoComponent } from "../cuerpo/cuerpo.component";
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent, CuerpoComponent, FooterComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {

}
