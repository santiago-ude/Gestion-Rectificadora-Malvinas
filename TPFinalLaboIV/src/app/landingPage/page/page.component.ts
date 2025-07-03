import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MenuComponent, FooterComponent, RouterOutlet],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {}