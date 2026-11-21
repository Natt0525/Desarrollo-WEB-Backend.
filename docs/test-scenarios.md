# Escenarios de prueba

Estos escenarios cubren el panel administrativo frontend implementado. Se ejecutan con datos iniciales que se conservan al navegar y se reinician al recargar la página.

## Flujo de orden de reparación

1. Registrar un técnico con nombre, especialidad y turno; comprobar que aparezca en el buscador.
2. Registrar un cliente con teléfono válido.
3. Crear una orden desde el expediente del cliente y comprobar que nombre y teléfono estén precargados.
4. Añadir un trabajo, asignarlo al técnico y registrar su precio sin exigir el gasto.
5. Comprobar que el sistema cree una versión de presupuesto.
6. Aprobar el presupuesto y registrar un anticipo.
7. Verificar que el cobro aparezca en ventas y caja.
8. Adjuntar una fotografía válida y comprobar su vista previa.
9. Verificar que el trabajo aparezca en la planilla de órdenes.
10. Intentar entregar con trabajos pendientes y comprobar el bloqueo.
11. Terminar los trabajos, cobrar el saldo y entregar.
12. Archivar y restaurar la orden.

## Planilla de servicios

1. Comprobar que cada fila muestre orden, técnico, trabajo, modelo y cobrado.
2. Crear un trabajo sin gasto registrado.
3. Añadir el gasto posteriormente desde el icono de la fila.
4. Editar un gasto ya registrado y conservar el resto de la orden.

## Venta de celular

1. Registrar una unidad con IMEI de 15 dígitos, costo, precio y estado.
2. Abrir la ficha y registrar la venta con cliente, teléfono, pago y notas.
3. Comprobar que la unidad quede como vendida.
4. Comprobar que el cliente quede registrado o vinculado.
5. Comprobar que la venta aparezca en caja con su costo y margen.

## Venta de pantalla

1. Registrar una pantalla con compatibilidad, tecnología, stock, costo, precio y proveedor.
2. Vender más de una unidad sin superar el stock disponible.
3. Comprobar el descuento exacto de existencias.
4. Comprobar que la venta aparezca en caja con cantidad, costo y notas.

## Reporte y diseño adaptable

1. Filtrar la caja por tipo de movimiento.
2. Abrir la impresión y generar un PDF.
3. Recorrer los siete módulos a 1440, 1024, 768, 390 y 320 píxeles.
4. Comprobar que no exista desplazamiento horizontal de la página.
5. Comprobar que la navegación móvil permita llegar a todos los módulos.
6. Confirmar que no aparezcan errores de ejecución ni errores en consola.

## Comandos de verificación

Desde `frontend/`:

```powershell
npm.cmd run build
npm.cmd run lint
node scripts/verify-workshop.mjs
```
