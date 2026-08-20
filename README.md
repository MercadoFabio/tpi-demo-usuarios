# TPI Demo · Usuarios

Workspace Angular 22 que pertenece al equipo Usuarios. La aplicación bajo `src/` es su sandbox; `projects/usuarios-lib` es el único artefacto distribuible.

- Componentes standalone con `OnPush`.
- Estado encapsulado en `UsuariosStore`.
- Rutas públicas exportadas desde `public-api.ts`.
- Publicación automática a `@mercadofabio/usuarios-lib` mediante GitHub Packages.

Al llegar un cambio a `main`, el workflow compila, publica la librería y notifica a `tpi-demo-shell`.

La librería obtiene los datos desde `http://localhost:8081/api/usuarios` a través del BFF compartido.

```bash
npm start
npx ng build usuarios-lib
```
