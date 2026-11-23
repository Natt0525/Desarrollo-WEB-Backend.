# Plan de implementación

## Etapa 1: frontend funcional

Estado: completada.

- Portada pública adaptable y experiencia visual de ZION TECH basada en un flujo real de diagnóstico y reparación.
- Estación fotográfica de cuatro etapas con controles accesibles, recorrido automático y soporte para movimiento reducido.
- Catálogo público de celulares de medio uso con equipos disponibles y reservados, orden por disponibilidad y consulta por WhatsApp.
- Acceso visible al área administrativa y pantalla de login demostrativa.
- Panel privado enfocado actualmente en los módulos de celulares y pantallas.
- Formularios, búsqueda, filtros, validaciones y venta temporal durante la sesión.
- Revisión visual en distintos tamaños de pantalla, análisis estático y compilación de producción.

## Etapa 2: backend y persistencia

Estado: pendiente.

- Modelar la base de datos MySQL.
- Implementar módulos, servicios y controladores en NestJS.
- Conectar clientes, órdenes, trabajos, presupuestos, inventarios, ventas, pagos y comisiones.
- Almacenar fotografías y comprobantes de forma segura.
- Reemplazar los datos temporales del frontend por llamadas a la API.
- Documentar la API con Swagger o Scalar.

## Etapa 3: autenticación y seguridad

Estado: pendiente.

- Crear usuarios, roles y permisos para propietaria y técnicos.
- Cifrar contraseñas y medir su fortaleza.
- Incorporar CAPTCHA, máximo de tres intentos y bloqueo temporal.
- Implementar recuperación de contraseña.
- Registrar accesos y salidas con usuario, IP, navegador, fecha y hora.

## Etapa 4: entrega y despliegue

Estado: pendiente.

- Ejecutar pruebas integrales con frontend, API y base de datos.
- Preparar Docker y una implementación de Kubernetes.
- Crear el repositorio Git cuando se autorice y publicar la aplicación.
- Registrar en la documentación las direcciones definitivas de código y despliegue.
