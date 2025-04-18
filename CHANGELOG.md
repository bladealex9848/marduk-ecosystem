# Registro de Cambios

Todos los cambios notables en el proyecto Marduk Ecosystem serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.6.5] - 2025-04-15

### Añadido
- Mensajes de bienvenida personalizados para cada tipo de perfil
- Notificaciones toast con tareas pendientes específicas para cada rol
- Elementos visuales con colores específicos para cada perfil (bordes, iconos, badges)
- Información de "Acerca de mí" coherente y personalizada para cada rol

### Cambiado
- Mejora en la presentación de las áreas "Mi Perfil" y "Mi Progreso Judicial" con colores específicos
- Optimización del espacio en la sección de perfil para evitar barras de desplazamiento innecesarias
- Ajuste de altura en las cajas de impacto para mantener un tamaño uniforme
- Limpieza de elementos coloreados previos para evitar duplicados

### Corregido
- Error de importación en openrouter.js que causaba fallos en la consola
- Problema de duplicación de badges "Personalizado" en objetivos
- Problemas de visibilidad en los colores de perfiles de ciudadano y estudiante
- Extensión excesiva de la sección "Acerca de mí" que desplazaba el contenido

## [1.6.4] - 2025-04-14

### Añadido
- Gráficos interactivos específicos para cada perfil usando Chart.js
- Sección de "Análisis de Actividad" con gráficos de línea y circular
- Estilos inmunes a cambios de modo claro/oscuro para secciones principales
- Documentación detallada sobre configuración del archivo .env y permisos
- Guías de uso para cada página principal del sitio

### Cambiado
- Estructura completa del proyecto en README.md con descripción de cada archivo
- Mejora en la visibilidad del nivel de usuario con clase profile-level
- Fechas en CHANGELOG actualizadas según análisis de archivos del proyecto
- Colores de gráficos adaptados al esquema de color de cada rol

### Corregido
- Problemas de visibilidad de texto en modo claro
- Inconsistencias en la presentación de datos entre diferentes roles
- Errores en la navegación entre perfiles

## [1.6.3] - 2025-04-14

### Añadido
- Personalización completa de perfiles por rol (Funcionario, Ciudadano, Administrador, Desarrollador, Investigador, Estudiante)
- Fotos aleatorias de perfil usando randomuser.me
- Fichas interactivas para cambiar entre diferentes perfiles
- Sección de soluciones recomendadas específicas para cada rol
- Actividad reciente personalizada según el tipo de usuario

### Cambiado
- Colores y estilos adaptados a cada rol en todas las secciones del perfil
- Mejora en la presentación de métricas de impacto con colores específicos
- Objetivos y recursos personalizados para cada tipo de usuario
- Estructura del proyecto documentada en README.md con glosario de funciones

### Corregido
- Problemas de visualización en la sección de perfil en modo oscuro
- Inconsistencias en la presentación de datos entre diferentes roles
- Errores en la navegación entre perfiles

## [1.6.2] - 2025-04-14

### Añadido
- Documentación completa del proyecto con README.md y CHANGELOG.md
- Mejora en la presentación visual de soluciones generadas con IA
- Línea de tiempo de evolución para soluciones generadas
- Sección "Recomendado para" en soluciones generadas

### Cambiado
- Refactorización del manejo de estilos y funcionalidad de vista en solutions.html
- Mejora en la presentación de etiquetas con iconos
- Diseño más atractivo y minimalista para soluciones generadas
- Optimización de la generación de contenido coherente

### Corregido
- Error en la función setupViewToggles
- Problemas con la generación de nombres genéricos
- Errores en la visualización de tarjetas en modo oscuro

## [1.6.1] - 2025-04-13

### Añadido
- Opción para generar soluciones personalizadas incluso cuando hay resultados
- Redondeo de porcentajes de relevancia en resultados de búsqueda
- Mejora en la categorización de soluciones basada en la consulta

### Cambiado
- Refactorización del manejo de mensajes de notificación y estilos en la búsqueda
- Mejora en la navegación en la búsqueda de soluciones generadas por IA
- Actualización de estilos de botones en community.html

### Corregido
- Error de sintaxis en la función generateSolutionContent
- Problemas con la navegación predictiva
- Error de SVG en el CSS

## [1.6.0] - 2025-04-12

### Añadido
- Mejora en la búsqueda inteligente con palabras clave
- Implementación de búsqueda por coincidencias parciales
- Generación de nombres creativos para soluciones con IA
- Implementación de sistema de pestañas para organizar contenido

### Cambiado
- Refactorización de carga de modelos y configuración de entorno
- Mejora en el manejo de errores al generar contenido con IA
- Optimización de la visualización de características y beneficios

### Corregido
- Errores al mostrar y guardar soluciones generadas por IA en localStorage
- Problemas con la carga de la API key desde .env
- Manejo incorrecto de mensajes de notificación

## [1.5.1] - 2025-03-20

### Añadido
- Filtrado de modelos gratuitos y de OpenRouter al cargar desde la API
- Implementación de scripts para obtener y proporcionar la API key de forma segura
- Protección de archivos sensibles y configuración de seguridad adicional

### Cambiado
- Mejora en la obtención del token de autenticación
- Optimización de la carga de la API key desde .env
- Actualización de archivos .htaccess para mayor seguridad

### Corregido
- Problemas con la asignación de la variable 'loadApiModelsBtn'
- Errores en la carga de modelos desde la API
- Manejo incorrecto de errores de autenticación

## [1.5.0] - 2025-03-05

### Añadido
- Sistema de búsqueda avanzada con IA
- Generación de soluciones personalizadas mediante IA
- Implementación de sitemap.json para mejorar la navegación
- Inicialización mejorada de la página de soluciones

### Cambiado
- Mejora en la visualización de resultados de búsqueda
- Optimización del rendimiento de la API de OpenRouter
- Actualización de la interfaz de usuario para búsqueda

### Corregido
- Problemas con la carga de variables de entorno
- Errores en la generación de contenido con IA
- Inconsistencias en la visualización de resultados

## [1.4.0] - 2025-01-10

### Añadido
- Integración completa con OpenRouter API
- Implementación de carga segura de variables de entorno
- Sistema de pruebas para modelos de IA
- Funcionalidad de búsqueda en solutions.html

### Cambiado
- Mejora en la estructura de archivos del proyecto
- Optimización de la carga de recursos
- Actualización de la interfaz de usuario para pruebas de IA

### Corregido
- Problemas con la carga de modelos de IA
- Errores en la visualización de resultados de pruebas
- Inconsistencias en el manejo de API keys

## [1.3.0] - 2024-11-15

### Añadido
- Implementación de sistema de niveles para soluciones
- Visualización de proceso de evolución en fichas de soluciones
- Mejora en la sección de métricas y contribuciones

### Cambiado
- Rediseño de la página de soluciones con vista de cuadrícula y lista
- Optimización de carga de imágenes
- Actualización de la interfaz de usuario para soluciones

## [1.2.0] - 2024-09-30

### Añadido
- Página de pruebas de IA con modelos locales
- Integración inicial con OpenRouter API
- Implementación de sistema de búsqueda básico

### Corregido
- Problemas de visualización en Safari
- Inconsistencias en el modo oscuro
- Errores en la carga de recursos

## [1.1.0] - 2025-04-12

### Añadido
- Sección de comunidad con tabs para diferentes categorías
- Implementación de perfiles de usuario
- Sistema de valoraciones para soluciones
- Integración con Bootstrap 5 para mejorar la interfaz de usuario
- Páginas de soporte y contribución

### Cambiado
- Mejora en la visualización de tarjetas de soluciones
- Optimización del rendimiento en dispositivos móviles
- Actualización de estilos y componentes visuales
- Correcciones específicas de CSS en fixes.css

## [1.0.0] - 2025-04-11

### Añadido
- Lanzamiento inicial del Marduk Ecosystem
- Implementación de la página principal con diseño responsive
- Creación de la sección de soluciones judiciales
- Integración de modo oscuro/claro con persistencia en localStorage
- Sistema de navegación mejorada con prefetch de páginas
- Implementación inicial del sistema de gamificación
- Desarrollo del panel de control (dashboard)
