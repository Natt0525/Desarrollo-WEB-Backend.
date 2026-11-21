# Plan de implementación

## Etapa 1: frontend funcional

Estado: completada.

- Portada pública y experiencia visual de ZION TECH.
- Acceso visible al área administrativa y pantalla de login demostrativa.
- Panel adaptable con resumen, celulares, pantallas, técnicos, ventas, órdenes y clientes.
- Formularios, validaciones, relaciones entre módulos, archivo lógico y reporte imprimible.
- Pruebas automatizadas del recorrido principal y de tamaños de pantalla.

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
