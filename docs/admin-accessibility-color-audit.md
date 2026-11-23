# Auditoría de accesibilidad y color del panel administrativo

Estado: pendiente de implementación.

Fecha de revisión: 21 de noviembre de 2026.

Esta auditoría cubre únicamente los módulos administrativos de Celulares y Pantallas. La interfaz es visualmente consistente y adaptable, pero todavía no alcanza un nivel WCAG AA completo. Los cambios deben conservar la identidad tecnológica del proyecto y reducir la saturación visual sin sustituirla por un diseño distinto.

## Orden recomendado de implementación

1. Corregir el foco de los paneles laterales de detalle y venta.
2. Corregir la navegación móvil de Pantallas.
3. Comunicar semánticamente navegación, filtros y filas seleccionadas.
4. Aumentar la escala tipográfica y ajustar contrastes.
5. Mejorar errores de formulario, encabezados y estructura de inventarios.

## Problemas de prioridad alta

### Foco de paneles laterales

Los paneles de ficha y venta declaran `role="dialog"` y `aria-modal="true"`, pero no mueven el foco al abrirse, no encierran la tabulación, no restauran el foco al control de origen y no vuelven inerte el contenido de fondo.

El formulario compartido sí tiene ciclo y restauración, pero su foco inicial puede caer sobre el botón invisible del fondo. Debe enfocarse el título, el botón de cierre o el primer campo visible.

Archivos relacionados:

- `frontend/src/features/admin/celulares/CelularesPanel.tsx`
- `frontend/src/features/admin/pantallas/PantallasPanel.tsx`
- `frontend/src/features/admin/compartido/FormularioTaller.tsx`

### Tipografía operativa demasiado pequeña

Persisten textos entre 7.5 y 11 px en códigos, compatibilidad, stock, estados, proveedor, ubicación, filtros y acciones. La escala objetivo es:

- 16 px para campos y contenido principal en móvil.
- 14 px para etiquetas, estados y datos operativos.
- 12 px solamente para metadatos secundarios.
- No utilizar tamaños entre 7 y 11 px para información necesaria.

Archivos relacionados:

- `frontend/src/features/admin/estilos/panel-admin.css`
- `frontend/src/features/admin/estilos/pantallas.css`

### Navegación móvil de Pantallas — corregida el 23 de noviembre de 2026

La navegación ya conserva las dos opciones en los breakpoints móviles. Sigue pendiente contemplar `env(safe-area-inset-bottom)` para la barra de gestos.

### Estados seleccionados

Las clases `active` y `selected` comunican el estado solo visualmente. Aplicar:

- `aria-current="page"` al módulo actual.
- `aria-pressed` a los filtros.
- `aria-selected` cuando las filas adopten semántica de selección.
- Un indicador visible adicional al color, como marca, borde, texto o icono.

## Problemas de prioridad media

### Encabezados

“Inventario de celulares” y “Venta de pantallas” deben ser el `h1` de cada módulo. El modelo seleccionado debe ser `h2` y las secciones internas deben continuar la jerarquía sin saltos.

### Inventarios

Los inventarios tienen columnas y encabezados visuales, pero están construidos con botones y `span`. Evaluar una tabla semántica en escritorio que conserve la presentación de tarjetas en móvil. Si se mantiene una lista seleccionable, debe tener nombre, rol y estado de selección claros.

### Formularios y errores

Mantener abierto el formulario cuando exista un error, conservar sus valores, mostrar el mensaje junto al campo y conectarlo mediante `aria-invalid` y `aria-describedby`. Después de un envío fallido, enfocar el primer campo inválido o un resumen de errores enlazado.

### Objetivos táctiles

La mayoría de los controles principales alcanza 44 px. Deben ampliarse especialmente “Guardar notas”, las casillas de confirmación y cualquier enlace pequeño de “Ver ficha”.

### Iconos

Sustituir los glifos tipográficos de navegación por iconos SVG de una familia consistente. Los iconos decorativos junto a texto visible deben llevar `aria-hidden="true"`.

## Evaluación del color actual

El azul `#174DFF` sobre blanco alcanza aproximadamente 5.93:1 y cumple WCAG AA para texto normal. El problema principal es su saturación y uso simultáneo en navegación, botones, filtros, enlaces, bordes y selección.

Varios grises secundarios no alcanzan 4.5:1:

| Combinación | Contraste aproximado |
| --- | ---: |
| `#68707D` sobre `#E9EBEF` | 4.19:1 |
| `#737B87` sobre `#F5F6F8` | 3.95:1 |
| `#747C88` sobre `#F5F6F8` | 3.90:1 |
| `#727A86` sobre `#F5F6F8` | 4.01:1 |

Los bordes `#C5CAD2` sobre blanco alcanzan aproximadamente 1.65:1 y resultan demasiado tenues para delimitar algunos controles.

## Paleta propuesta

| Función | Color |
| --- | --- |
| Primario | `#2447B8` |
| Primario al pasar o presionar | `#1C3691` |
| Selección suave | `#E9EEFF` |
| Texto principal | `#151922` |
| Texto secundario | `#566170` |
| Fondo general | `#F1F3F6` |
| Superficie | `#FFFFFF` |
| Bordes decorativos | `#CBD2DC` |
| Bordes de controles | `#8792A2` |
| Éxito | `#17734A` |
| Advertencia | `#8A4B00` |
| Error | `#B42318` |

El primario propuesto alcanza aproximadamente 7.87:1 frente al blanco. Debe reservarse el azul sólido para la acción primaria y el módulo activo; las filas seleccionadas pueden utilizar el fondo azul claro con texto oscuro.

## Aspectos que deben conservarse

- Identidad visual coherente entre Celulares y Pantallas.
- Imágenes con textos alternativos descriptivos.
- Estados de stock acompañados por texto.
- Indicadores globales de foco visibles.
- Etiquetas visibles en formularios.
- Avisos dinámicos con `role="status"`.
- Soporte para `prefers-reduced-motion`.
- Altura adecuada de los botones e inputs principales.
- Navegación limitada a Celulares y Pantallas.

## Validación después de implementar

- Probar teclado completo y restauración de foco en todos los diálogos.
- Probar lector de pantalla en navegación, filtros, inventarios y formularios.
- Verificar contraste de texto 4.5:1 y componentes gráficos 3:1.
- Revisar anchos de 360, 390, 768, 1024 y 1280 px.
- Probar orientación horizontal y aumento de texto al 200 %.
- Ejecutar `npm.cmd run build` y `npm.cmd run lint` desde `frontend/`.
