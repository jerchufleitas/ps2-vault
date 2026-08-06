# 🚀 Guía Completa & Manual Operativo: Impeccable Skills en Google Antigravity

---

## 📌 ¿Qué es Impeccable?

**Impeccable** es una suite avanzada de auditoría, diseño visual y patrones ergonómicos creada por Peter Akaus (`pbakaus/impeccable`). Está diseñada para elevar la calidad estética, la coherencia cromática y el rendimiento de la UI a un nivel profesional.

Con la integración realizada en **PS2 Vault**, Antigravity ahora cuenta con capacidades avanzadas de detección de antipatrones de diseño, validación de accesibilidad (contraste WCAG), auditoría de layouts en tiempo real y composición de sistemas de diseño.

---

## 🛠️ Estado de Instalación & Repositorio

- **Submódulo Git**: `.impeccable` vinculado en la rama `feature/impeccable-design-skills`.
- **Skill Antigravity en PC**: Instalada en `C:\Users\User\.gemini\antigravity\skills\impeccable`.
- **Monorepo en GitHub**: Repositorio `jerchufleitas/ps2-vault` creado automáticamente y sincronizado:
  - 🌿 Branch Principal: [`main`](https://github.com/jerchufleitas/ps2-vault/tree/main)
  - 🌿 Branch de Feature: [`feature/impeccable-design-skills`](https://github.com/jerchufleitas/ps2-vault/tree/feature/impeccable-design-skills)

---

## 🎯 Capacidades & Funciones Principales de Impeccable

### 1. 🔍 Detector de Antipatrones (`scripts/detector/`)
Analiza el código fuente CSS/Tailwind y el HTML renderizado para detectar errores comunes antes de salir a producción:
- **Hardcoded Colors**: Identifica el uso de colores hexadecimales fuera de los tokens oficiales (`#070A10`, `#00E5FF`, `#0070D1`).
- **Magic Margin / Padding**: Detecta espaciados inconsistentes que rompen la grilla rítmica.
- **Responsive Collisions**: Audita puntos de quiebre donde los elementos pueden superponerse o romperse en mobile.

### 2. 🎨 Análisis de Contraste y Accesibilidad (`screenshot-contrast.mjs`)
- Verifica que el texto cian neón (`#00E5FF`) y blanco mantenga una relación de contraste mínima de `4.5:1` sobre el fondo `#070A10`.

### 3. 📐 Catálogo de Composición (`composition-catalog.mjs`)
- Regula la jerarquía tipográfica, el uso de cajas de componentes y las transiciones micro-animadas para mantener el aspecto premium estilo Stitch.

### 4. ⚡ Live Verification & Framework Adapters (`scripts/live/`)
- Soporte en tiempo real para Vite y React, asegurando que las actualizaciones HMR no generen parpadeos o saltos de layout.

---

## 💡 Sugerencias de Uso Adaptadas a PS2 Vault

### 1. Auditoría del Deslizador de Carátulas (Grid Zoom Slider)
- **Desafío**: Al cambiar entre `3x` y `7x` columnas, el ratio de aspecto de las carátulas de juegos debe mantenerse firme sin distorsión.
- **Uso de Impeccable**: Ejecutar la auditoría estática de layouts para asegurar que `aspect-[3/4]` o `aspect-poster` conserve la proporción oficial de la caja de DVD de PS2.

### 2. Estandarización de Tokens de Estado (Punto Neón)
- **Antes**: Distintos componentes usaban colores verdosos y rojos arbitrarios (`bg-green-500`, `bg-red-600`).
- **Con Impeccable**: Centralización en tokens con glow neón (`#00E676` Funciona, `#FF5252` No Funciona, `#FFD700` Sin Probar).

### 3. Vista Ficha Técnica (GameDetailView)
- **Uso de Impeccable**: Validar las filas de especificaciones borderless sin usar divisores pesados de 2px, logrando máxima limpieza visual.

---

## 📊 Ejemplo Comparativo (Antes vs. Después)

| Elemento | Antes de Impeccable | Después con Impeccable |
| :--- | :--- | :--- |
| **Grid Cards** | Tarjetas con bordes pesados y badges flotantes gigantes | Fichas borderless minimalistas con punto de estado neón en esquina inferior |
| **Grilla de Juegos** | Tamaño fijo de 4 columnas independientemente de la pantalla | Deslizador dinámico (3x a 7x) con respuesta fluida y breakpoints adaptativos |
| **Left Sidebar** | Filtros desordenados sin jerarquía explícita | Categorías organizadas con encabezado `GÉNEROS` neón y bloque de estadísticas integradas |
| **Top Bar** | Buscador estándar sin acentos de marca | Marca oficial `PS 2` con tipografía limpia y controles unificados |

---

## 🚀 Próximos Comandos Recomendados

Para ejecutar inspecciones con la suite en el proyecto:
```bash
# Auditar antipatrones en componentes React
node .impeccable/scripts/detector/cli/main.mjs --target=src/components

# Verificar contrastes de color del tema oscuro
node .impeccable/scripts/detector/engines/visual/screenshot-contrast.mjs
```
