# Panel administrativo frontend

El panel privado de ZION TECH conserva únicamente dos módulos: Celulares y Pantallas. Los datos se mantienen durante la sesión del navegador y vuelven a sus valores iniciales al recargar; la persistencia definitiva se incorporará con el backend.

## Acceso local

Desde `frontend/`:

```powershell
npm.cmd run dev
```

Abrir `http://localhost:5173/#inventario`.

## Celulares

- Registra modelo, memoria, color, estado, batería, precio, costo, IMEI privado, garantía, componentes y fotografía.
- Permite buscar y filtrar por disponibilidad.
- Muestra la ficha técnica y las notas internas de cada unidad.
- Registra la venta y marca la unidad como vendida durante la sesión.

## Pantallas

- Registra marca, modelo, compatibilidad, tecnología, marco, panel original, stock, precio y costo.
- Conserva proveedor, cobertura y ubicación como información privada.
- Permite buscar por marca, modelo, código o tecnología.
- Registra ventas por cantidad y descuenta las existencias durante la sesión.

## Diseño adaptable

- La navegación administrativa contiene solamente Celulares y Pantallas.
- En escritorio se presenta como barra lateral.
- En móvil se convierte en una barra inferior de dos opciones.
- Los formularios compartidos mantienen cierre con Escape y control del foco.

## Validación

```powershell
npm.cmd run build
npm.cmd run lint
```

## Accesibilidad y color pendientes

La auditoría de Celulares y Pantallas, la paleta propuesta y el orden de corrección están registrados en `docs/admin-accessibility-color-audit.md`.

## Límites actuales

- No existe todavía persistencia MySQL ni conexión con la API NestJS.
- Las imágenes cargadas son temporales en el navegador.
- Las ventas actualizan el inventario de la sesión, pero todavía no generan comprobantes persistentes.
- La autenticación definitiva, CAPTCHA, permisos y recuperación de contraseña siguen pendientes del backend.
