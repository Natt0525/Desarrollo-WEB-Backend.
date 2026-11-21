# Proyecto Celus

Aplicación para la gestión de un taller de celulares, con una portada pública en React y un backend en NestJS.

## Estructura principal

```text
proyectos celus/
├── backend/                 API NestJS
├── docs/                    Requisitos, decisiones y escenarios de prueba
├── frontend/                Aplicación React/Vite
├── references/              Material de consulta; no forma parte del código productivo
│   ├── ifixit-galaxy-s10/   Guía, capturas y fotografías de desmontaje
│   ├── source-documents/    Documentos originales recibidos
│   ├── test-evidence/       Capturas y evidencias de revisión
│   └── visual-style/        Referencias de estilo, color y composición
└── AGENTS.md                Reglas de trabajo del repositorio
```

## Frontend

El código de `frontend/src/features/` se organiza por área funcional:

```text
features/
├── public/home/             Portada, contenido y anatomía fotográfica
├── shared/phone-explorer/   Modelo 3D reutilizable
└── admin/
    ├── AdminWorkspace.tsx   Entrada y navegación del panel
    ├── auth/                Acceso administrativo
    ├── screens/             Inventario y venta de pantallas
    ├── clients/             Gestión de clientes
    ├── technicians/         Gestión de técnicos
    ├── operations/          Órdenes, trabajos y libro de ventas
    └── shared/              Formularios, datos demo y estilos compartidos
```

`frontend/src/App.tsx` coordina la portada, el login y el panel privado. Los estilos generales están en `frontend/src/styles/`. Los recursos visuales consumidos por la aplicación permanecen en `frontend/src/assets/`. Las capturas de validación están en `frontend/design-previews/` y las utilidades de revisión en `frontend/scripts/`.

La estructura detallada está documentada en `docs/code-structure.md`.

## Comandos de validación

Desde `frontend/`:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

Desde `backend/`:

```powershell
npm.cmd run start:dev
npm.cmd run build
npm.cmd run lint
npm.cmd run test
```
