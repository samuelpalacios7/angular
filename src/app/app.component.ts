import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoCardComponent } from './components/producto-card/producto-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductoCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titulo: string = 'Mi Lista de Productos';
  fechaActual: Date = new Date();
  
  productos: string[] = [
    'Laptop HP',
    'Mouse Inalámbrico',
    'Teclado Mecánico',
    'Monitor 24"'
  ];
  
  nuevoProducto: string = '';
  mostrarLista: boolean = true;

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

  agregarProducto() {
    if (this.nuevoProducto.trim() !== '') {
      this.productos.push(this.nuevoProducto.trim());
      this.nuevoProducto = '';
    }
  }
}