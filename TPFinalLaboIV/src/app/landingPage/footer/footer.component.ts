import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  dentroP1:boolean = false;
  onMouseOverP1(){
    this.dentroP1 = true;
  }
  onMouseLeaverP1(){
    this.dentroP1 = false;
  }
}
