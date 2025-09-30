import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ProductoCardComponent } from './components/producto-card/producto-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProductoCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  titulo: string = 'Iniciar Sesión';
  fechaActual: Date = new Date();

  // Estado de la app
  mostrarLogin: boolean = true;
  autenticado: boolean = false;
  usuarioActual: string = '';

  // Simulación de usuarios registrados (en memoria)
  usuarios: { email: string, password: string, nombre: string, apellido: string }[] = [];

  // Formularios reactivos
  registroForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  loginSubmitted = false;
  loginError = '';

  // Productos (solo si autenticado)
  productos: string[] = [];
  nuevoProducto: string = '';

  // Para edición de productos
  editandoIndex: number | null = null;
  productoEditado: string = '';

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // Cargar usuarios de localStorage si existen
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      this.usuarios = JSON.parse(usuariosGuardados);
    }
    // Cargar productos de localStorage si existen
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      this.productos = JSON.parse(productosGuardados);
    } else {
      // Si no hay productos guardados, inicializar con algunos por defecto
      this.productos = [
        'Laptop HP',
        'Mouse Inalámbrico',
        'Teclado Mecánico',
        'Monitor 24"'
      ];
      localStorage.setItem('productos', JSON.stringify(this.productos));
    }
    // Restaurar estado de autenticación y vista
    const auth = localStorage.getItem('autenticado');
    const usuario = localStorage.getItem('usuarioActual');
    const mostrarLogin = localStorage.getItem('mostrarLogin');
    const titulo = localStorage.getItem('titulo');
    if (auth === 'true') {
      this.autenticado = true;
    }
    if (usuario) {
      this.usuarioActual = usuario;
    }
    if (mostrarLogin !== null) {
      this.mostrarLogin = mostrarLogin === 'true';
    }
    if (titulo) {
      this.titulo = titulo;
    }
  }

  get f() { return this.registroForm.controls; }
  get lf() { return this.loginForm.controls; }

  // Registro
  onSubmit() {
    this.submitted = true;
    if (this.registroForm.valid) {
      // Guardar usuario en memoria y en localStorage
      this.usuarios.push({
        email: this.f['email'].value,
        password: this.f['password'].value,
        nombre: this.f['nombre'].value,
        apellido: this.f['apellido'].value
      });
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      this.registroForm.reset();
      this.submitted = false;
      this.mostrarLogin = true;
      this.titulo = 'Iniciar Sesión';
      // Guardar estado
      localStorage.setItem('mostrarLogin', 'true');
      localStorage.setItem('titulo', 'Iniciar Sesión');
    }
  }

  // Login
  onLogin() {
    this.loginSubmitted = true;
    this.loginError = '';
    // Recargar usuarios de localStorage antes de validar
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
      this.usuarios = JSON.parse(usuariosGuardados);
    }
    if (this.loginForm.valid) {
      const user = this.usuarios.find(u => u.email === this.lf['email'].value && u.password === this.lf['password'].value);
      if (user) {
        this.autenticado = true;
        this.usuarioActual = user.nombre;
        this.titulo = 'Productos';
        // Guardar estado
        localStorage.setItem('autenticado', 'true');
        localStorage.setItem('usuarioActual', user.nombre);
        localStorage.setItem('mostrarLogin', 'false');
        localStorage.setItem('titulo', 'Productos');
      } else {
        this.loginError = 'Usuario o contraseña incorrectos';
      }
    }
  }

  // Alternar entre login y registro
  irARegistro() {
    this.mostrarLogin = false;
    this.titulo = 'Registro de Usuario';
    this.submitted = false;
    this.registroForm.reset();
    // Guardar estado
    localStorage.setItem('mostrarLogin', 'false');
    localStorage.setItem('titulo', 'Registro de Usuario');
  }
  irALogin() {
    this.mostrarLogin = true;
    this.titulo = 'Iniciar Sesión';
    this.loginSubmitted = false;
    this.loginForm.reset();
    this.loginError = '';
    // Guardar estado
    localStorage.setItem('mostrarLogin', 'true');
    localStorage.setItem('titulo', 'Iniciar Sesión');
  }

  // Productos

  agregarProducto() {
    if (this.nuevoProducto.trim() !== '') {
      this.productos.push(this.nuevoProducto.trim());
      localStorage.setItem('productos', JSON.stringify(this.productos));
      this.nuevoProducto = '';
    }
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(this.productos));
  }

  editarProducto(index: number) {
    this.editandoIndex = index;
    this.productoEditado = this.productos[index];
  }

  guardarEdicionProducto(index: number) {
    if (this.productoEditado.trim() !== '') {
      this.productos[index] = this.productoEditado.trim();
      localStorage.setItem('productos', JSON.stringify(this.productos));
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.editandoIndex = null;
    this.productoEditado = '';
  }

  logout() {
    this.autenticado = false;
    this.usuarioActual = '';
    this.irALogin();
    // Limpiar estado de autenticación
    localStorage.setItem('autenticado', 'false');
    localStorage.removeItem('usuarioActual');
    localStorage.setItem('mostrarLogin', 'true');
    localStorage.setItem('titulo', 'Iniciar Sesión');
  }
}