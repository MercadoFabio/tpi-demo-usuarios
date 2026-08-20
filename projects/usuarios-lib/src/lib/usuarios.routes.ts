import { Routes } from '@angular/router';

import { UsuarioDetalleComponent, UsuariosListadoComponent } from './usuarios-lib';

export const usuariosRoutes: Routes = [
  {
    path: '',
    component: UsuariosListadoComponent,
  },
  {
    path: ':id',
    component: UsuarioDetalleComponent,
  },
];
