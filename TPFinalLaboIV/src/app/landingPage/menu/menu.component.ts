import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgClass, CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  listaMenu:Array<string> = ["Clientes","Agregar Cliente","Presupuestos","Pedidos", "Agregar Pedido", "Calendario"]

  //Para hacer dinamico el nav
  dentroA:boolean [] = [false,false,false,false,false,false];
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

  //Importo
  @Input()
  estilosClass: string="";



}
