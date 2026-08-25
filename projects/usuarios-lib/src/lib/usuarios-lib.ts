import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injectable, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Usuario {
  readonly id: number;
  readonly nombre: string;
  readonly rol: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosStore {
  private readonly http = inject(HttpClient);
  readonly usuarios = signal<readonly Usuario[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<readonly Usuario[]>('/api/v1/usuarios').subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron obtener los usuarios. Asegurate de haber iniciado sesión con la cookie HttpOnly.');
        this.loading.set(false);
      },
    });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'demo-usuarios-listado',
  template: `
    <section aria-labelledby="usuarios-title" class="usuarios-container">
      <div class="header-actions">
        <div>
          <p class="eyebrow">Feature library · Equipo Usuarios</p>
          <h1 id="usuarios-title">Listado de Usuarios (PostgreSQL)</h1>
          <p class="subtitle">Datos consultados en tiempo real al Microservicio de Usuarios vía Spring Boot BFF.</p>
        </div>
        <button type="button" class="btn-refresh" (click)="store.load()">
          🔄 Consultar API (/api/v1/usuarios)
        </button>
      </div>

      @if (store.loading()) {
        <div class="status-msg info">⏳ Consultando microservicio de usuarios...</div>
      }

      @if (store.error(); as err) {
        <div class="status-msg error">⚠️ {{ err }}</div>
      }

      @if (!store.loading() && store.usuarios().length === 0 && !store.error()) {
        <div class="status-msg empty">No hay usuarios disponibles. Iniciá sesión para consultar la base de datos.</div>
      }

      <ul class="user-list">
        @for (usuario of store.usuarios(); track usuario.id) {
          <li class="user-item">
            <div class="user-info">
              <span class="user-badge">#{{ usuario.id }}</span>
              <div>
                <strong class="user-name">{{ usuario.nombre }}</strong>
                <span class="user-id">Registro en PostgreSQL: ID {{ usuario.id }}</span>
              </div>
            </div>
            <span class="user-role">{{ usuario.rol }}</span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .usuarios-container { max-inline-size: 48rem; padding: 1.5rem 0; }
    .header-actions { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    .eyebrow { color: #0369a1; font-size: .8rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 0.25rem; }
    .subtitle { color: #475569; font-size: 0.9rem; margin-top: 0.25rem; }
    .btn-refresh { background-color: #0284c7; color: white; border: none; border-radius: 0.375rem; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: background-color 0.15s; }
    .btn-refresh:hover { background-color: #0369a1; }
    .status-msg { padding: 0.75rem 1rem; border-radius: 0.375rem; margin-bottom: 1rem; font-size: 0.9rem; }
    .status-msg.info { background-color: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; }
    .status-msg.error { background-color: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
    .status-msg.empty { background-color: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; }
    .user-list { display: grid; gap: .75rem; list-style: none; padding: 0; margin: 0; }
    .user-item { align-items: center; background: white; border: 1px solid #cbd5e1; border-radius: .5rem; display: flex; justify-content: space-between; padding: 1rem 1.25rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .user-info { display: flex; align-items: center; gap: 1rem; }
    .user-badge { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 9999px; background-color: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.875rem; }
    .user-name { display: block; color: #0f172a; font-size: 1rem; }
    .user-id { display: block; color: #64748b; font-size: 0.75rem; }
    .user-role { background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
  `,
})
export class UsuariosListadoComponent implements OnInit {
  readonly store = inject(UsuariosStore);

  ngOnInit(): void {
    this.store.load();
  }
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
