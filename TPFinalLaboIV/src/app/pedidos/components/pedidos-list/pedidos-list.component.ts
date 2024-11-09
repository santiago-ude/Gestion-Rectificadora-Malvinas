import { Component, inject } from '@angular/core';
import { PedidoService } from '../../service/pedidos.service';
import { Pedidos } from '../../interface/pedidos';
import jsPDF from 'jspdf';
import { RouterModule } from '@angular/router';
import {  CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterModule, DatePipe, FormsModule, CommonModule],
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']
})
export class PedidosListComponent {
  ts = inject(PedidoService);

  listaPedidos: Pedidos[] = [];
  pedidosFiltrados: Pedidos[] = [];
  estadoSeleccionado: string = '';
  fechaInicio: string = ''; 
  fechaFin: string = ''; 

  ngOnInit(): void {
    this.listarPedidos();
  }

  listarPedidos() {
    this.ts.getPedidos().subscribe({
      next: (pedidos: Pedidos[]) => {
        this.listaPedidos = pedidos;
        this.pedidosFiltrados = pedidos; // Inicializa con todos los pedidos
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }

  filtrarPorEstado(estado: 'activo' | 'entregado' | 'atrasado') {
    this.pedidosFiltrados = this.listaPedidos.filter(pedido => pedido.estado === estado);
  }

  filtrarPorFechaEntrada(fechaInicio: string, fechaFin: string) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    this.pedidosFiltrados = this.listaPedidos.filter(pedido => {
      const fechaEntrada = new Date(pedido.fechaEntrada);
      return fechaEntrada >= inicio && fechaEntrada <= fin;
    });
  }

  resetearFiltros() {
    this.pedidosFiltrados = [...this.listaPedidos]; // Restaura la lista original
  }

  eliminarPedidos(id: string | null | undefined) {
    this.ts.deletePedido(id).subscribe({
      next: () => {
        alert("Pedido Eliminado.");
        this.listarPedidos();
      },
      error: (e: Error) => {
        console.log(e.message);
      }
    });
  }


  exportarPedidoPDF(pedido: Pedidos): void {
    const doc = new jsPDF();
    doc.setFont("helvetica", "italic");
    doc.text(`RETIFICADORA MALVINAS`, 10, 10);
    doc.text(`Pedido de Cliente: ${pedido.cliente.nombre} ${pedido.cliente.apellido}`, 10, 20);
    doc.text(`DNI: ${pedido.cliente.dni}`, 10, 30);
    doc.text(`Fecha de Entrada: ${pedido.fechaEntrada}`, 10, 40);
    doc.text(`Fecha de Salida Estimada: ${pedido.fechaSalidaEstimada}`, 10, 50);
    doc.text(`Estado: ${pedido.estado}`, 10, 60);
    doc.text(`Marca Auto: ${pedido.marcaAuto}`, 10, 70);
    doc.text(`Modelo Auto: ${pedido.modeloAuto}`, 10, 80);
    doc.text(`Número de Serie: ${pedido.numeroSerie}`, 10, 90);
    doc.text(`Descripción: ${pedido.descripcion}`, 10, 100);

    if (pedido.presupuesto) {
      const totalPresupuesto = pedido.presupuesto.items.reduce((acc, item) => acc + item.precioFinal, 0);
      doc.text(`Presupuesto Total: ${totalPresupuesto}`, 10, 110);
    }

    doc.save(`pedido_${pedido.id}.pdf`);
  }
}