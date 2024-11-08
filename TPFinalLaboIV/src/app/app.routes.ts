import { ClienteListComponent } from './clientes/components/cliente-list/cliente-list.component';
import { Routes } from '@angular/router';
import { PresupuestosListComponent } from './presupuestos/components/presupuestos-list/presupuestos-list.component';
import { ClienteAddComponent } from './clientes/components/cliente-add/cliente-add.component';
import { MenuComponent } from './landingPage/menu/menu.component';
import { CuerpoComponent } from './landingPage/cuerpo/cuerpo.component';

export const routes: Routes = [
    {path: 'presupuestos', component: PresupuestosListComponent},
    {path: 'crearCliente', component: ClienteAddComponent},
    {path: 'clientes', component: ClienteListComponent},
    {path: '', component: CuerpoComponent},
    {path: '**', redirectTo: ''},
    
];
