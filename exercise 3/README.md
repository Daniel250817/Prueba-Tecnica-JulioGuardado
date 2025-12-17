# Algoritmo "Comelón" - Visualización Gantt

Aplicación para gestionar rangos de fechas con reglas de reemplazo y visualizarlos en un diagrama Gantt, desarrollada con React, TypeScript y Vite.

## Características

- Gestión de rangos de fechas [fecha_inicio, fecha_fin]
- Validación de rangos (fecha_inicio ≤ fecha_fin)
- Algoritmo "Comelón": un rango reemplaza a otro solo si lo abarca completamente
- Visualización tipo Gantt con barras horizontales
- Diferenciación visual de rangos (azul para normales, naranja para contenidos)
- Soporte para múltiples rangos sin solapamiento total
- Interfaz intuitiva con selector de fechas

## Arquitectura

El proyecto sigue principios de Clean Architecture y SOLID:

- **Singleton Pattern**: RangeService y GanttService
- **Separación de responsabilidades**: Componentes, hooks, servicios y tipos
- **TypeScript**: Tipado fuerte en toda la aplicación
- **Custom Hooks**: useRanges para separar lógica de presentación

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── GanttChart/     # Visualización del diagrama Gantt
│   ├── RangeForm/      # Formulario para agregar rangos
│   └── RangeList/      # Lista de rangos agregados
├── services/           # Servicios singleton
│   ├── RangeService.ts # Lógica del algoritmo "Comelón"
│   └── GanttService.ts # Cálculos para visualización Gantt
├── hooks/              # Custom hooks
│   └── useRanges.ts   # Gestión de estado de rangos
├── types/              # TypeScript interfaces
│   └── Range.ts        # DateRange interface
├── utils/              # Utilidades
│   └── dateUtils.ts    # Funciones de manipulación de fechas
└── styles/             # Estilos globales
    └── theme.css
```

## Requisitos

- Node.js 18+ (recomendado: 20.x LTS o superior)
- npm o yarn

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173` (o el puerto que Vite asigne).

## Build

```bash
npm run build
```

## Algoritmo "Comelón"

### Reglas de Reemplazo

1. **Un rango reemplaza a otro** si el nuevo rango abarca completamente al rango existente:
   - Ejemplo: Si existe `[01/01/2025, 05/01/2025]` y se agrega `[01/01/2025, 10/01/2025]`, el primero se elimina.

2. **Un rango no reemplaza** si está completamente contenido en otro:
   - Ejemplo: Si existe `[01/01/2025, 10/01/2025]` y se agrega `[03/01/2025, 07/01/2025]`, el nuevo se agrega pero se marca como contenido (color naranja).

3. **Múltiples rangos sin solapamiento total** pueden coexistir.

### Visualización

- **Barras azules**: Rangos normales que no están contenidos en otros
- **Barras naranjas**: Rangos contenidos en otros (no reemplazan)
- Cada rango se muestra en su propia fila ordenada por fecha de inicio
- El eje X representa el tiempo (fechas)
- El eje Y representa los diferentes rangos

## Ejemplo de Uso

1. Agregar rango: `[01/01/2025, 05/01/2025]` → Se muestra como barra azul
2. Agregar rango: `[08/01/2025, 15/01/2025]` → Se muestra como barra azul
3. Agregar rango: `[03/01/2025, 04/01/2025]` → Se muestra como barra naranja (contenido en el primero)
4. Agregar rango: `[01/01/2025, 20/01/2025]` → Reemplaza al primero y segundo, se muestra como barra azul

## Tecnologías

- React 19+
- TypeScript
- Vite
- React Icons

