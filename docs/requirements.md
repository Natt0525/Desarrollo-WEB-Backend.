# Requisitos

Este documento reúne los requisitos funcionales y técnicos proporcionados para la aplicación.

## Órdenes de reparación

- Registrar el nombre y teléfono del cliente.
- Registrar la marca y el modelo del equipo.
- Registrar la falla reportada y los accesorios entregados.
- Adjuntar fotografías del estado de recepción.
- Permitir datos pendientes de verificación cuando el equipo no enciende.
- Permitir varios trabajos en una misma orden.
- Asignar cada trabajo a un técnico.
- Registrar diagnóstico, precio aprobado, anticipo, saldo, ubicación del equipo y siguiente paso.
- Conservar la versión anterior de un presupuesto cuando cambie y registrar la nueva respuesta del cliente.
- Dar seguimiento desde la recepción hasta la entrega o devolución sin reparar.

## Técnicos y registro de servicios

- Permitir registrar y buscar técnicos por nombre, especialidad o turno.
- Mantener el módulo de técnicos limitado a los datos del personal.
- Permitir varios trabajos en una orden y asignar cada uno a un técnico.
- Permitir registrar un trabajo antes de conocer el gasto o costo del repuesto.
- Permitir añadir o corregir el gasto posteriormente desde la planilla de órdenes.
- Mostrar en la planilla la orden, el técnico, el trabajo, el modelo, lo cobrado y el gasto.
- Mantener como regla interna que el técnico recibe el 50% de la ganancia, sin mostrar controles para modificarla.

## Celulares usados

- Mostrar públicamente cada unidad con cinco fotografías, precio, estado y disponibilidad.
- Indicar si se cambió el glass, la pantalla o la batería.
- Conservar de forma privada el IMEI y las fotografías internas.
- Permitir comparar la información privada del equipo si vuelve por un reclamo.

## Pantallas

- Permitir buscar por marca o modelo compatible.
- Mostrar fotografías, precio y disponibilidad.
- Mostrar si la pantalla es LCD, Incell o AMOLED.
- Indicar si tiene marco o no tiene marco.
- Indicar si conserva el panel original con el glass cambiado.
- Mostrar en el área privada el proveedor y la cobertura de garantía.

## Vitrina pública y dispositivos

- Dar prioridad visual a fotografías, precio y disponibilidad.
- Mostrar una forma visible de llamar o consultar por WhatsApp.
- Funcionar desde una computadora y desde un dispositivo móvil.
- Facilitar en el mostrador la búsqueda rápida de órdenes y el registro de información.

## Aplicación y datos

- Incluir por lo menos un menú.
- Incluir por lo menos un CRUD con eliminación lógica de registros.
- Implementar el frontend en React con Vite.
- Implementar el backend en NestJS.
- Utilizar MySQL como base de datos.
- Agregar validaciones a los campos de entrada.
- Incluir por lo menos un reporte en PDF.
- Incluir por lo menos un gráfico estadístico.

## Autenticación y seguridad

- Clasificar la contraseña de un usuario nuevo como débil, intermedia o fuerte.
- Guardar la contraseña de forma encriptada.
- Incorporar autenticación de usuarios, login y permisos.
- Incorporar un CAPTCHA para ingresar al sistema.
- Limitar los intentos de inicio de sesión a tres.
- Bloquear temporalmente el ingreso después de tres intentos fallidos.
- Permitir volver a ingresar después de un tiempo determinado.
- Gestionar el olvido y la recuperación de contraseña.
- Registrar un log de acceso con usuario, IP, evento de ingreso o salida, navegador, fecha y hora.

## Documentación, publicación y despliegue

- Documentar la API con Swagger o Scalar.
- Subir la aplicación a GitHub.
- Enviar la dirección de GitHub al Inbox de Telegram.
- Publicar la aplicación en un sitio gratuito.
- Añadir la dirección de la aplicación publicada al mensaje de GitHub.
- Mostrar una implementación sobre Docker.
- Mostrar una implementación sobre Kubernetes.
- La incorporación de un agente inteligente es opcional.
