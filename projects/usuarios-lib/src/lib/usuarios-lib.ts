import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Usuario {
  readonly id: number;
  readonly nombre: string;
  readonly rol: string;
}

const USUARIOS: readonly Usuario[] = [
  { id: 1, nombre: 'Ana García', rol: 'Administradora' },
  { id: 2, nombre: 'Bruno Pérez', rol: 'Docente' },
  { id: 3, nombre: 'Carla López', rol: 'Estudiante' },
];

@Injectable({ providedIn: 'root' })
export class UsuariosStore {
  readonly usuarios = signal<readonly Usuario[]>(USUARIOS);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'demo-usuarios-listado',
  template: `
    <section aria-labelledby="usuarios-title">
      <p class="eyebrow">Feature library · Equipo Usuarios</p>
      <h1 id="usuarios-title">Usuarios</h1>
      <p>Estado encapsulado en la librería. El Shell no conoce sus componentes internos.</p>
      <ul>
        @for (usuario of store.usuarios(); track usuario.id) {
          <li><strong>{{ usuario.nombre }}</strong><span>{{ usuario.rol }}</span></li>
        }
      </ul>
    </section>
  `,
  styles: `
    .eyebrow { color: #075985; font-size: .8rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    ul { display: grid; gap: .75rem; list-style: none; max-inline-size: 42rem; padding: 0; }
    li { align-items: center; background: white; border: 1px solid #d9e2ec; border-radius: .5rem; display: flex; justify-content: space-between; padding: 1rem; }
    span { color: #475569; }
  `,
})
export class UsuariosListadoComponent {
  readonly store = inject(UsuariosStore);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'demo-usuarios-detalle',
  template: `
    <section aria-labelledby="detalle-title">
      <p class="eyebrow">Feature library · Equipo Usuarios</p>
      <h1 id="detalle-title">Detalle de usuario</h1>
      @if (usuario(); as usuario) {
        <p><strong>{{ usuario.nombre }}</strong> · {{ usuario.rol }}</p>
      } @else {
        <p>Usuario no encontrado.</p>
      }
    </section>
  `,
  styles: `.eyebrow { color: #075985; font-size: .8rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }`,
})
export class UsuarioDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(UsuariosStore);
  readonly usuario = computed(() => this.store.usuarios().find((item) => item.id === Number(this.route.snapshot.paramMap.get('id'))));
}
