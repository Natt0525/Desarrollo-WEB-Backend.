# Estructura del código

El proyecto separa la documentación, las referencias visuales, el frontend y el backend en directorios independientes.

## Frontend

`frontend/src/App.tsx` controla únicamente el cambio entre la portada pública, el acceso administrativo y el espacio de trabajo privado.

- `assets/`: imágenes utilizadas por la interfaz, agrupadas por finalidad.
- `features/public/home/`: portada pública, contenido editorial y anatomía fotográfica.
- `features/admin/`: acceso, módulos administrativos y estado temporal de demostración.
- `features/shared/phone-explorer/`: modelo 3D reutilizable por cualquier área de la aplicación.
- `styles/site.css`: estilos de la portada y del acceso que comparten el mismo marco visual.
- `index.css`: variables, tipografías y reglas base del documento.

`features/admin/AdminWorkspace.tsx` es la entrada al panel privado y coordina la navegación entre celulares, pantallas, técnicos, ventas, órdenes y clientes. Cada módulo especializado conserva sus componentes y estilos en su propia carpeta.

## Backend

`backend/src/` mantiene por ahora la estructura inicial de NestJS. Los futuros dominios deberán incorporarse como módulos independientes —autenticación, clientes, órdenes, inventario y ventas— cuando se conecten la API y MySQL.

## Convenciones

- Los nombres de carpetas representan capacidades del negocio, no páginas circunstanciales.
- Un recurso reutilizado por áreas públicas y privadas pertenece a `features/shared/`.
- Los datos editoriales se mantienen fuera de los componentes cuando pueden declararse como configuración.
- Los módulos administrativos comparten únicamente formularios, estilos base y el almacén temporal ubicados en `features/admin/shared/`.
- Las imágenes de `assets/` y las referencias de `references/` no deben eliminarse durante refactorizaciones estructurales.
