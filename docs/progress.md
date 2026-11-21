# Progreso

Este documento registra el avance confirmado de la implementación.

## Experiencia visual e interacción 3D

- Se sustituyó la dirección editorial inicial por una identidad tecnológica en azul eléctrico, blanco y negro mate.
- Se creó un modelo tridimensional ficticio de un celular Android con Three.js.
- El modelo incluye pantalla OLED, capa táctil, vidrio, batería, cámaras, placa principal, módulo USB-C, altavoz, motor de vibración, cables flex, marco y tapa trasera.
- El teléfono puede abrirse por capas, volver a montarse, girarse por arrastre y seleccionar componentes desde el modelo o desde una lista.
- La pieza seleccionada se destaca en azul y muestra su nombre, material y función.
- Se añadieron deslices horizontales y animaciones ligadas al scroll con GSAP ScrollTrigger.
- La experiencia se adaptó a escritorio y móvil, con soporte para movimiento reducido.
- Se guardaron capturas de revisión en `frontend/design-previews/`.
- La compilación y el lint del frontend finalizan correctamente.

## Portada fotográfica de anatomía

- Se reemplazó el celular 3D como protagonista de la portada por una estación de diagnóstico basada en fotografías reales de desmontaje.
- La estación recorre cuatro estados: apertura, aislamiento, diagnóstico y extracción de placa.
- La interfaz conserva lectura técnica, navegación por teclado, recorrido automático pausado por interacción y soporte para movimiento reducido.
- La dirección visual se equilibró con fondos claros, una sola señal azul y secciones de menor densidad.
- Las fotografías de referencia mantienen atribución y enlace a la guía original de iFixit.

## Panel administrativo frontend

- Se completaron los módulos de resumen, celulares usados, pantallas, técnicos, ventas, órdenes y clientes.
- Los módulos comparten datos durante la sesión: las órdenes actualizan el historial del cliente y la producción del técnico; las ventas actualizan inventario y caja.
- Se añadieron formularios validados para celulares, pantallas, técnicos, clientes, órdenes, trabajos, presupuestos y cobros.
- Las órdenes admiten varias tareas, versiones de presupuesto, fotografías de recepción, pagos parciales, control de entrega y archivo lógico reversible.
- Las comisiones se calculan sobre el importe cobrado menos el costo del repuesto y conservan el porcentaje aprobado para cada trabajo.
- Las ventas de celulares y pantallas registran cliente, costo, margen, notas y movimiento de inventario.
- La caja puede imprimirse o guardarse como reporte PDF desde el navegador.
- Se verificaron los siete módulos entre 320 y 1440 píxeles sin desbordamiento horizontal.
- La compilación y el análisis estático finalizan sin errores ni advertencias.
- La prueba automatizada de navegador completa 12 comprobaciones funcionales y de adaptación.
- La guía de uso y las limitaciones actuales están registradas en `docs/frontend-administration.md`.

## Próxima etapa

- Conectar el panel a la API NestJS y MySQL para conservar clientes, órdenes, inventario, ventas, cobros y comisiones.
- Sustituir el estado temporal por repositorios y servicios del backend.
- Implementar autenticación, permisos, CAPTCHA, límite de intentos, recuperación de contraseña y registro de accesos.
- Generar comprobantes y reportes persistentes desde datos reales.
