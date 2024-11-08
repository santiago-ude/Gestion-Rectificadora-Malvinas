import { ClienteListComponent } from './clientes/components/cliente-list/cliente-list.component';
import { Routes } from '@angular/router';
import { PresupuestosListComponent } from './presupuestos/components/presupuestos-list/presupuestos-list.component';
import { ClienteAddComponent } from './clientes/components/cliente-add/cliente-add.component';
import { MenuComponent } from './landingPage/menu/menu.component';
import { CuerpoComponent } from './landingPage/cuerpo/cuerpo.component';
import { PedidosPageComponent } from './pedidos/pages/pedidos-page/pedidos-page.component';
import { UpdatePageComponent } from './pedidos/pages/update-page/update-page.component';

export const routes: Routes = [
    {path: 'presupuestos', component: PresupuestosListComponent},
    {path: 'crearCliente', component: ClienteAddComponent},
    {path: 'clientes', component: ClienteListComponent},
    {path: 'pedidos', component: PedidosPageComponent},
    {path: "pedidos/update/:id", component: UpdatePageComponent},
    {path: '', component: CuerpoComponent},
    {path: '**', redirectTo: ''},
    
];
