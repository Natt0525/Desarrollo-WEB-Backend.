# Escenarios de prueba

Los escenarios actuales cubren únicamente los módulos administrativos de Celulares y Pantallas.

## Celulares

1. Registrar una unidad con IMEI de 15 dígitos, costo, precio y estado.
2. Buscarla por marca, modelo o código.
3. Abrir su ficha y revisar la información privada.
4. Registrar una venta con cliente, teléfono y precio válido.
5. Comprobar que la unidad quede marcada como vendida.

## Pantallas

1. Registrar una pantalla con compatibilidad, tecnología, stock, costo, precio y proveedor.
2. Filtrar por LCD, Incell o AMOLED.
3. Abrir la ficha y comprobar proveedor, cobertura y ubicación.
4. Vender una o varias unidades sin superar el stock disponible.
5. Comprobar el descuento exacto de existencias.

## Diseño adaptable

1. Revisar ambos módulos a 1440, 1024, 768, 390 y 320 píxeles.
2. Comprobar que la navegación muestre únicamente Celulares y Pantallas.
3. Confirmar que no exista desplazamiento horizontal de la página.
4. Confirmar que no aparezcan errores de ejecución ni errores en consola.

## Comandos

```powershell
npm.cmd run build
npm.cmd run lint
```
