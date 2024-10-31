import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgClass],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  listaMenu:Array<string> = ["Menu","Clientes","Servicios","Productos","Pedidos"]

  //Para hacer dinamico el nav
  dentroA:boolean [] = [false,false,false,false,false];
  onMouseOverA(i:number){
    this.dentroA[i] = true;
  }
  onMouseLeaveA(i:number){
    this.dentroA[i] = false;
  }

  //Para hacer dinamico el titulo
  dentroH1:boolean = false;
  onMouseOverH1(){
    this.dentroH1 = true;
  }
  onMouseLeaverH1(){
    this.dentroH1 = false;
  }
  //

  //Para hacer dinamico el login
  dentroButton:boolean  = false;
  onMouseOver(){
    return this.dentroButton = true;
  }

  onMouseLeave(){
    return this.dentroButton = false;
  }
  //

}
