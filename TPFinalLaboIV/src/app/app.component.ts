import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageComponent } from './landingPage/page/page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TPFinalLaboIV';
}
