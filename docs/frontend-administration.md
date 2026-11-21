# Panel administrativo frontend

El panel administrativo de ZION TECH está implementado en React y Vite. Los módulos comparten información durante la sesión del navegador, por lo que una orden creada puede consultarse desde clientes y técnicos, y una venta actualiza inventario y caja. Al recargar la página se restauran los datos iniciales; la persistencia definitiva se incorporará con el backend.

## Acceso local

Desde la carpeta `frontend/`:

```powershell
npm.cmd run dev
```

Abrir `http://localhost:5173/#inventario`.

El proyecto raíz no contiene un `package.json`. Los comandos de npm deben ejecutarse dentro de `frontend/` para el cliente o de `backend/` para el servidor.

## Módulos disponibles

### Resumen

- Presenta equipos activos, equipos listos, clientes registrados y saldos por cobrar.
- Muestra la distribución de órdenes por etapa.
- Permite abrir las órdenes que requieren una próxima acción.
- Resume los cobros por servicios, celulares y pantallas.

### Celulares

- Registra una unidad con modelo, memoria, color, estado, batería, precio, costo, IMEI privado, garantía, componentes y fotografía.
- Permite buscar y filtrar por disponibilidad.
- Muestra ficha, características, estado de componentes y notas internas.
- Registra la venta, vincula o crea el cliente, marca la unidad como vendida y añade el movimiento a caja.

### Pantallas

- Registra marca, modelo, compatibilidad, tecnología, marco, panel original, calidad, stock, precio, costo, proveedor, garantía, ubicación y fotografía.
- Busca por marca, modelo, compatibilidad o código.
- Registra ventas por cantidad, descuenta existencias y añade el movimiento a caja.
- Mantiene proveedor, costo y ubicación como información privada del panel.

### Técnicos

- Registra nombre, especialidad y turno del técnico.
- Permite buscar rápidamente por nombre, especialidad u horario.
- Mantiene los trabajos y gastos dentro del módulo de órdenes para no mezclar tareas.

### Planilla de servicios

- Se encuentra debajo del listado de órdenes.
- Reúne orden, técnico, trabajo, modelo, cobrado y gasto.
- Permite crear el trabajo sin conocer todavía el gasto.
- Añade o corrige el gasto después desde el icono de la misma fila.

### Ventas y caja

- Reúne cobros de reparaciones y ventas de productos.
- Filtra movimientos por servicio, celular o pantalla.
- Separa cobros, costos de productos vendidos y margen de productos.
- Conserva las notas capturadas al vender productos.
- Permite imprimir la vista o guardarla como reporte PDF desde el navegador.

### Órdenes

- Registra cliente, teléfono, equipo, falla, accesorios y verificación inicial.
- Adjunta hasta cinco fotografías JPG, PNG o WebP de hasta 3 MB cada una.
- Permite varios trabajos con técnico, precio, costo de repuesto y estado.
- Conserva las versiones de presupuesto y registra aprobación o rechazo.
- Registra cobros parciales, saldo, diagnóstico, ubicación y siguiente paso.
- Impide avanzar a reparación sin aprobación, entregar con trabajos incompletos o entregar con saldo pendiente.
- Permite archivar y restaurar órdenes mediante eliminación lógica.

### Clientes

- Registra datos de contacto evitando teléfonos duplicados.
- Reúne automáticamente las órdenes asociadas por teléfono.
- Muestra historial, saldos, técnicos, estados y próximos pasos.
- Permite iniciar una orden con el nombre y teléfono ya completados.
- Incluye acceso directo a WhatsApp y notas internas.

## Integración entre módulos

El flujo administrativo es:

1. Registrar o seleccionar un cliente.
2. Crear su orden de reparación.
3. Asignar trabajos y técnicos.
4. Crear y aprobar una versión de presupuesto.
5. Registrar anticipos o saldo en caja.
6. Actualizar el avance de cada trabajo.
7. Completar el gasto del trabajo cuando ya se conozca.
8. Entregar el equipo cuando los trabajos estén terminados y el saldo sea cero.

Las ventas de celulares y pantallas siguen un flujo paralelo: seleccionan una unidad, registran cliente y pago, descuentan inventario y crean el movimiento de caja.

## Diseño adaptable y accesibilidad

- Los siete módulos se verificaron entre 320 y 1440 píxeles sin desbordamiento horizontal.
- La navegación inferior móvil puede desplazarse y centra el módulo activo.
- Los diálogos aceptan cierre con Escape y mantienen el foco dentro del formulario.
- Los campos obligatorios, importes, stock, teléfonos, IMEI y archivos tienen validaciones en el cliente.
- Los estilos de impresión generan una versión limpia del reporte de ventas.

## Validación técnica

Desde `frontend/`:

```powershell
npm.cmd run build
npm.cmd run lint
node scripts/verify-workshop.mjs
```

La prueba de navegador recorre registros, órdenes, presupuestos, cobros, fotografías, gastos, ventas, stock, archivo lógico, reporte PDF y adaptación de los siete módulos.

## Límites de esta etapa

- Los datos viven únicamente en memoria y se reinician al recargar.
- Las imágenes cargadas son temporales en el navegador.
- El botón de impresión usa el diálogo de impresión del navegador.
- No existe todavía almacenamiento MySQL ni API NestJS conectada a estos módulos.
- El acceso, CAPTCHA, permisos, recuperación de contraseña, límite de intentos y auditoría deben implementarse y validarse en el backend.
