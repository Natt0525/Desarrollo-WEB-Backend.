# Estructura del código

El proyecto separa la documentación, las referencias visuales, el frontend y el backend en directorios independientes.

## Frontend

`frontend/src/App.tsx` controla el cambio entre la portada pública, el catálogo público de celulares, el acceso administrativo y el espacio de trabajo privado. Las vistas secundarias se cargan de forma diferida.

- `assets/`: imágenes utilizadas por la interfaz, agrupadas por finalidad.
- `features/public/inicio/`: portada pública, contenido editorial y anatomía fotográfica.
- `features/public/celulares/`: catálogo público, datos publicados y estilos exclusivos de los celulares de medio uso.
- `features/admin/acceso/`: acceso administrativo demostrativo.
- `features/admin/celulares/`: tipos, datos iniciales, campos y panel de celulares.
- `features/admin/pantallas/`: tipos, datos iniciales, campos y panel de pantallas.
- `features/admin/compartido/`: navegación, formulario, formatos y estado temporal reutilizable.
- `features/admin/estilos/`: estilos del panel separados de la lógica de negocio.
- `features/shared/phone-explorer/`: motor visual 3D aislado, sin reglas del negocio.
- `styles/site.css`: estilos de la portada y del acceso que comparten el mismo marco visual.
- `index.css`: variables, tipografías y reglas base del documento.

`features/admin/PanelAdmin.tsx` solo decide qué módulo mostrar. Cada módulo conserva sus tipos, datos de demostración y campos de formulario en archivos independientes. Los componentes compartidos no conocen los detalles de celulares ni de pantallas.

### Dónde realizar cada cambio

| Necesidad | Archivo o carpeta |
| --- | --- |
| Cambiar el contenido de la portada | `features/public/inicio/contenidoInicio.ts` |
| Cambiar la composición de la portada | `features/public/inicio/PaginaInicio.tsx` |
| Cambiar las etapas fotográficas | `features/public/inicio/AnatomiaReparacion.tsx` |
| Cambiar los equipos del catálogo público | `features/public/celulares/datosCelularesPublicos.ts` |
| Cambiar la composición o los textos del catálogo | `features/public/celulares/CatalogoCelulares.tsx` |
| Cambiar la apariencia del catálogo | `features/public/celulares/catalogoCelulares.css` |
| Añadir un módulo administrativo | `features/admin/PanelAdmin.tsx` y `features/admin/compartido/NavegacionAdmin.tsx` |
| Cambiar datos iniciales de celulares | `features/admin/celulares/datosCelulares.ts` |
| Cambiar campos del formulario de celulares | `features/admin/celulares/camposCelular.ts` |
| Cambiar reglas o interfaz de celulares | `features/admin/celulares/CelularesPanel.tsx` |
| Cambiar datos iniciales de pantallas | `features/admin/pantallas/datosPantallas.ts` |
| Cambiar campos del formulario de pantallas | `features/admin/pantallas/camposPantalla.ts` |
| Cambiar reglas o interfaz de pantallas | `features/admin/pantallas/PantallasPanel.tsx` |
| Cambiar moneda, códigos, teléfono o imágenes | `features/admin/compartido/formatos.ts` |
| Reemplazar datos temporales por API | `features/admin/compartido/estadoTemporal.ts` |
| Cambiar apariencia del panel | `features/admin/estilos/` |

## Backend

`backend/src/` mantiene por ahora la estructura inicial de NestJS. Los futuros dominios deberán incorporarse como módulos independientes —autenticación, clientes, órdenes, inventario y ventas— cuando se conecten la API y MySQL.

## Convenciones

- Los nombres de carpetas y de la lógica del negocio están en español.
- Los nombres técnicos de librerías externas y las clases CSS heredadas pueden permanecer en inglés para evitar romper sus contratos.
- Un recurso reutilizado por áreas públicas y privadas pertenece a `features/shared/`.
- Los datos editoriales se mantienen fuera de los componentes cuando pueden declararse como configuración.
- Los módulos administrativos comparten únicamente navegación, formularios, formatos y el almacén temporal ubicados en `features/admin/compartido/`.
- Los archivos `datos*.ts` contienen demostraciones reemplazables por la API; los archivos `modelo.ts` contienen los tipos del dominio.
- Las imágenes de `assets/` y las referencias de `references/` no deben eliminarse durante refactorizaciones estructurales.
