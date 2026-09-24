## 🚀 Tecnologías y Arquitectura Utilizadas

La solución fue desarrollada desde cero aplicando principios **SOLID**, **Clean Code** y las últimas características estables del ecosistema de desarrollo:

*   **Angular 18+ (v22 Core):** Arquitectura basada enteramente en componentes **Standalone** reutilizables para eliminar la sobrecarga de módulos tradicionales.
*   **Reactividad Nativa Zoneless:** Implementación de **Signals de Angular** (`signal`, `computed`, `input`) para gestionar el estado de la UI con un rendimiento óptimo.
*   **Server-Side Rendering (SSR) e Hidratación:** Configuración avanzada para renderizado inicial del lado del servidor, mejorando la velocidad de carga (LCP) y la indexación.
*   **Formularios Reactivos Avanzados:** Validaciones de negocio estrictas en tiempo real con cálculo automático y reactivo de fechas (Fecha de Revisión exactamente un año después de la de Liberación).
*   **Suite de Pruebas Unitarias Aisladas (Jest + ts-jest):** Configuración de pruebas ultrarrápidas basadas en contextos de inyección síncronos en memoria (`runInInjectionContext`), eludiendo bloqueos asíncronos y logrando una cobertura superior al 95%.

---

## 🛠️ Requisitos Previos

Antes de arrancar el proyecto, asegúrate de tener instalado en tu sistema operativo:

*   [Node.js](https://nodejs.org) (Versión 18 o superior recomendada)
*   [Angular CLI](https://angular.dev) de forma global (`npm install -g @angular/cli`)

---

## 💻 Comandos del Proyecto

Ejecuta los siguientes comandos desde la terminal de Windows en la carpeta raíz de tu proyecto:

### 1. Instalación de Dependencias
Descarga e instala todos los paquetes necesarios del ecosistema de Angular y los entornos de pruebas unitarias:
```bash
npm install
```

### 2. Levantar el Proyecto en Desarrollo
Inicia el servidor local con soporte para renderizado en el servidor (SSR) e hidratación reactiva:
```bash
ng serve
```
Una vez compilado con éxito, abre tu navegador web favorito e ingresa a la siguiente URL:
👉 **http://localhost:4200**

> 💡 **Nota Importante:** Recuerda tener corriendo en paralelo la API local suministrada en el puerto `3002` para que el servicio de Angular pueda mapear, listar y destruir los registros de las tarjetas y cuentas reales del banco.

### 3. Ejecutar la Suite de Pruebas Unitarias con Cobertura (Coverage)
Para ejecutar todos los casos de prueba automatizados en Jest y generar la tabla de porcentaje de cobertura global en tu consola:
```bash
npm run test:coverage
```

### 4. Limpieza de Caché Física del Compilador
Si experimentas bloqueos de memoria intermedia o renderizados fantasmas en tu terminal debido al Server-Side Rendering de Node, ejecuta este comando para purgar los temporales:
```bash
rmdir /s /q .angular
```

---

## 📂 Estructura Principal del Código

El código de la aplicación se organiza bajo un enfoque de arquitectura limpia orientada a dominios y responsabilidades del negocio:

```text
src/app/
├── core/
│   └── services/
│       └── api.service.ts          # Clase base de configuración HTTP
├── features/
│   └── products/
│       ├── components/             # Tabla interactiva y formularios reactivos
│       ├── models/                 # Modelos e interfaces de productos financieros
│       ├── pages/                  # Tablero (Dashboard) inteligente orquestador
│       └── services/               # Servicio de consumo de la API bancaria
└── shared/
    └── components/                 # Modales y menús contextuales reutilizables
```

---
