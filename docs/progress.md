# Progreso

Este documento registra el avance confirmado de la implementación.

Última actualización: 23 de noviembre de 2026.

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

## Refinamiento de la portada pública

- Se reorganizó la navegación principal para que las secciones y el estado activo sean fáciles de reconocer.
- Se reemplazaron frases técnicas o ambiguas por mensajes centrados en lo que entiende el cliente: diagnóstico claro, precio acordado y seguimiento de la reparación.
- La sección de seguimiento ahora explica una reparación con pasos, precio enviado, aprobación pendiente y tiempo estimado.
- El servicio de equipos usados se presenta como `Celulares de medio uso` y enlaza directamente con los equipos publicados.
- Se ajustaron tipografías, alturas, espacios y proporciones del hero, la sección de servicios, la estación fotográfica y el pie de página.
- Las fotografías de diagnóstico e intervención se orientaron en espejo para integrarlas mejor con la composición.
- Se corrigió el recorrido automático de la estación para evitar que su bloque cambie de altura al comenzar una nueva vuelta.
- Se mantuvieron controles por teclado, enlace para saltar contenido y compatibilidad con movimiento reducido.

## Catálogo público de celulares

- Se creó la vista pública `#celulares-disponibles`, cargada de forma diferida desde `App.tsx`.
- La portada enlaza al catálogo mediante la acción `Ver disponibles` de la tarjeta `Celulares de medio uso`.
- Cada equipo muestra fotografía, disponibilidad, precio en bolivianos, memoria, almacenamiento, color, estado estético, batería, garantía, accesorios y componentes revisados.
- El catálogo muestra tanto equipos disponibles como reservados y siempre ordena primero los disponibles.
- Las consultas se preparan para WhatsApp con el modelo, código y precio del equipo seleccionado.
- La navegación del catálogo coloca a la izquierda la acción `Volver al menú principal` con una flecha orientada hacia atrás.
- El encabezado final usa el mensaje `Celulares listos para una nueva vida` y un recuento breve de disponibles y reservados.
- En escritorio se muestran dos tarjetas por fila. Una cantidad impar conserva el mismo ancho y no estira la última tarjeta.
- Se agregó separación clara entre tarjetas y se igualó su altura por fila para alinear las acciones inferiores aunque los nombres ocupen distintas líneas.
- Se redujeron el espacio superior, la escala del encabezado y el tamaño visual de las imágenes para mejorar la proporción general.
- La vista se adapta a tablet y móvil sin perder la jerarquía de estado, precio ni acción.

## Panel administrativo frontend

- El panel privado conserva únicamente los módulos de celulares usados y pantallas.
- Ambos módulos permiten registrar, buscar, filtrar, revisar y vender existencias durante la sesión.
- Se eliminaron resumen, técnicos, ventas, órdenes y clientes junto con su navegación, componentes, estilos y datos demo exclusivos.
- La navegación adaptable presenta solo Celulares y Pantallas.
- La compilación y el análisis estático finalizan sin errores ni advertencias.
- La guía de uso y las limitaciones actuales están registradas en `docs/frontend-administration.md`.

## Próxima etapa

- Implementar la auditoría de accesibilidad y color registrada en `docs/admin-accessibility-color-audit.md`.
- Conectar los inventarios de celulares y pantallas a la API NestJS y MySQL.
- Sustituir el estado temporal por repositorios y servicios del backend.
- Implementar autenticación, permisos, CAPTCHA, límite de intentos, recuperación de contraseña y registro de accesos.
- Generar comprobantes y reportes persistentes desde datos reales.
