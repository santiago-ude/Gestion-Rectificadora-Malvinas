import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { MatDialog } from '@angular/material/dialog';
import { Pedidos } from '../../interface/pedidos';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import esLocale from '@fullcalendar/core/locales/es';
import { DialogoGenericoComponent } from '../../../shared/modals/dialogo-generico/dialogo-generico.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-pedidos-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterModule,MatTooltipModule],
  templateUrl: './pedidos-calendario.component.html',
  styleUrl: './pedidos-calendario.component.css',
})
export class CalendarioPedidosComponent implements OnInit {

  ts = inject(PedidoService);
  dialog = inject(MatDialog);

  pedidos: Pedidos[] = [];
  router = inject(Router);
  estadoFiltro: string = 'todos';
  clienteFiltro: string = '';
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [],
    eventClick: this.onEventClick.bind(this),
    eventDidMount: this.eventDidMount.bind(this),
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    }
  };

  ngOnInit() {
    this.ts.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargarEventos();
      },
      error: (e) => console.error(e.message)
    });
  }
  
  filtrarEventos(estado: string) {
  this.estadoFiltro = estado;
  this.cargarEventos(); // recargar eventos filtrados
  }

  
  cargarEventos() {
  const pedidosFiltrados = this.estadoFiltro === 'todos'
    ? this.pedidos
    : this.pedidos.filter(p => p.estado === this.estadoFiltro);

  this.calendarOptions.events = pedidosFiltrados.map(p => ({
    title: `${p.cliente.nombre} ${p.cliente.apellido} (${p.estado})`,
    start: p.fechaSalidaEstimada,
    color: p.estado === 'entregado' ? 'orange' : p.estado === 'activo' ? 'green' : 'red',
    extendedProps: {
      pedido: p,
      tooltip: `
        Cliente: ${p.cliente.nombre} ${p.cliente.apellido}
        Auto: ${p.marcaAuto} ${p.modeloAuto}
        Estado: ${p.estado}
        N° Serie: ${p.numeroSerie}
      `
    }
  }));
}

  onEventClick(arg: any) {
    const pedido: Pedidos = arg.event.extendedProps.pedido;

    const mensaje = `
      Cliente: ${pedido.cliente.nombre} ${pedido.cliente.apellido}
      \nAuto: ${pedido.marcaAuto} ${pedido.modeloAuto}
      \nEstado: ${pedido.estado}
      \nFecha Salida Estimada: ${new Date(pedido.fechaSalidaEstimada).toLocaleDateString()}
    `;
    this.dialog.open(DialogoGenericoComponent, {
      data: { message: mensaje }
      
    });
  }
 eventDidMount(info: any) {
  const tooltip = `
    Cliente: ${info.event.extendedProps.pedido.cliente.nombre} ${info.event.extendedProps.pedido.cliente.apellido}
    Auto: ${info.event.extendedProps.pedido.marcaAuto} ${info.event.extendedProps.pedido.modeloAuto}
    Estado: ${info.event.extendedProps.pedido.estado}
    N° Serie: ${info.event.extendedProps.pedido.numeroSerie}
  `;

  info.el.setAttribute('title', tooltip);
}
}
