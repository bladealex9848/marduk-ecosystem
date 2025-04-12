/**
 * MARDUK ECOSYSTEM - NAVEGACIÓN MEJORADA
 * Módulo para mejorar la navegación entre páginas con IA
 * 
 * Este archivo contiene las funciones necesarias para implementar
 * una navegación más fluida y predictiva utilizando IA.
 */

// Clase principal para la navegación mejorada
class EnhancedNavigation {
  constructor() {
    // Inicializar propiedades
    this.navigationHistory = [];
    this.prefetchedPages = new Set();
    this.isTransitioning = false;
    
    // Cargar historial de navegación desde sessionStorage
    this._loadNavigationHistory();
    
    // Inicializar componentes de navegación
    this._initNavigation();
    
    console.log('Sistema de navegación mejorada inicializado');
  }
  
  /**
   * Inicializa los componentes de navegación en la página
   * @private
   */
  _initNavigation() {
    // Interceptar clics en enlaces internos
    document.addEventListener('click', this._handleLinkClick.bind(this));
    
    // Registrar la página actual en el historial
    this._addToNavigationHistory(window.location.pathname);
    
    // Prefetch de páginas probables
    this._prefetchLikelyPages();
    
    // Añadir estilos para transiciones
    this._addNavigationStyles();
    
    // Inicializar indicador de carga
    this._initLoadingIndicator();
  }
  
  /**
   * Maneja el clic en enlaces
   * @param {Event} event - Evento de clic
   * @private
   */
  _handleLinkClick(event) {
    // Verificar si es un enlace
    const link = event.target.closest('a');
    if (!link) return;
    
    // Verificar si es un enlace interno
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;
    
    // Verificar si es un enlace a una página HTML
    if (!href.endsWith('.html') && !href.endsWith('/')) return;
    
    // Prevenir comportamiento por defecto
    event.preventDefault();
    
    // Navegar a la página con transición
    this.navigateTo(href);
  }
  
  /**
   * Navega a una página con transición suave
   * @param {string} url - URL de destino
   */
  navigateTo(url) {
    // Evitar navegación durante una transición
    if (this.isTransitioning) return;
    
    // Marcar como en transición
    this.isTransitioning = true;
    
    // Mostrar indicador de carga
    this._showLoadingIndicator();
    
    // Añadir clase de transición saliente
    document.body.classList.add('page-transition-out');
    
    // Esperar a que termine la animación
    setTimeout(() => {
      // Añadir al historial
      this._addToNavigationHistory(url);
      
      // Navegar a la página
      window.location.href = url;
    }, 300);
  }
  
  /**
   * Prefetch de páginas que probablemente se visitarán
   * @private
   */
  _prefetchLikelyPages() {
    // Obtener todos los enlaces en la página
    const links = Array.from(document.querySelectorAll('a[href]'));
    
    // Filtrar enlaces internos HTML
    const internalLinks = links.filter(link => {
      const href = link.getAttribute('href');
      return href && 
             !href.startsWith('#') && 
             !href.startsWith('http') && 
             !href.startsWith('mailto:') &&
             (href.endsWith('.html') || href.endsWith('/'));
    });
    
    // Ordenar por probabilidad (enlaces en el menú principal tienen prioridad)
    const priorityLinks = internalLinks
      .filter(link => link.closest('.navbar-nav'))
      .map(link => link.getAttribute('href'));
    
    // Prefetch de enlaces prioritarios
    priorityLinks.forEach(href => {
      if (!this.prefetchedPages.has(href)) {
        this._prefetchPage(href);
      }
    });
    
    // Predecir siguiente página con IA si está disponible
    this._predictNextPages();
  }
  
  /**
   * Realiza prefetch de una página
   * @param {string} url - URL de la página
   * @private
   */
  _prefetchPage(url) {
    // Evitar prefetch de la página actual
    if (url === window.location.pathname) return;
    
    // Marcar como prefetched
    this.prefetchedPages.add(url);
    
    // Crear link de prefetch
    const linkElement = document.createElement('link');
    linkElement.rel = 'prefetch';
    linkElement.href = url;
    
    // Añadir al DOM
    document.head.appendChild(linkElement);
    
    console.log('Prefetch de página:', url);
  }
  
  /**
   * Predice las siguientes páginas que el usuario podría visitar
   * @private
   */
  async _predictNextPages() {
    // Verificar si OpenRouter está disponible
    if (!window.openRouterService) return;
    
    // Si el historial es muy corto, no predecir
    if (this.navigationHistory.length < 2) return;
    
    try {
      // Preparar historial para la IA
      const historyText = this.navigationHistory
        .slice(-5)
        .map(item => item.path)
        .join(' -> ');
      
      // Prompt para la IA
      const prompt = `Basado en este historial de navegación: "${historyText}", predice las 2 páginas más probables que el usuario visitará a continuación. Responde solo con las rutas, separadas por comas, sin explicaciones adicionales.`;
      
      // Obtener predicción
      const response = await window.openRouterService.generateCompletion(prompt, {
        maxTokens: 50,
        temperature: 0.3,
        systemPrompt: 'Eres un asistente especializado en predecir patrones de navegación web. Responde de forma concisa.'
      });
      
      // Procesar respuesta
      const predictedPages = response
        .split(',')
        .map(page => page.trim())
        .filter(page => page.length > 0);
      
      // Prefetch de páginas predichas
      predictedPages.forEach(page => {
        // Normalizar ruta
        let normalizedPath = page;
        if (!normalizedPath.startsWith('/')) {
          normalizedPath = '/' + normalizedPath;
        }
        
        // Prefetch
        if (!this.prefetchedPages.has(normalizedPath)) {
          this._prefetchPage(normalizedPath);
        }
      });
    } catch (error) {
      console.error('Error al predecir páginas:', error);
    }
  }
  
  /**
   * Añade una página al historial de navegación
   * @param {string} path - Ruta de la página
   * @private
   */
  _addToNavigationHistory(path) {
    // Añadir al historial
    this.navigationHistory.push({
      path,
      timestamp: new Date().toISOString()
    });
    
    // Limitar a 20 elementos
    if (this.navigationHistory.length > 20) {
      this.navigationHistory = this.navigationHistory.slice(-20);
    }
    
    // Guardar en sessionStorage
    this._saveNavigationHistory();
  }
  
  /**
   * Carga el historial de navegación desde sessionStorage
   * @private
   */
  _loadNavigationHistory() {
    try {
      const savedHistory = sessionStorage.getItem('mardukNavigationHistory');
      if (savedHistory) {
        this.navigationHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('Error al cargar historial de navegación:', error);
      this.navigationHistory = [];
    }
  }
  
  /**
   * Guarda el historial de navegación en sessionStorage
   * @private
   */
  _saveNavigationHistory() {
    try {
      sessionStorage.setItem('mardukNavigationHistory', JSON.stringify(this.navigationHistory));
    } catch (error) {
      console.error('Error al guardar historial de navegación:', error);
    }
  }
  
  /**
   * Añade estilos CSS para las transiciones de navegación
   * @private
   */
  _addNavigationStyles() {
    // Verificar si ya existe el estilo
    if (document.getElementById('navigation-styles')) return;
    
    // Crear elemento de estilo
    const styleElement = document.createElement('style');
    styleElement.id = 'navigation-styles';
    
    // Definir estilos
    styleElement.textContent = `
      body {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
      
      body.page-transition-out {
        opacity: 0.5;
      }
      
      .nav-loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 50%, var(--primary) 100%);
        background-size: 200% 100%;
        animation: loading-animation 1.5s infinite;
        z-index: 9999;
        display: none;
      }
      
      @keyframes loading-animation {
        0% { background-position: 100% 0; }
        100% { background-position: 0 0; }
      }
    `;
    
    // Añadir al DOM
    document.head.appendChild(styleElement);
  }
  
  /**
   * Inicializa el indicador de carga
   * @private
   */
  _initLoadingIndicator() {
    // Verificar si ya existe
    if (document.getElementById('nav-loading-indicator')) return;
    
    // Crear indicador
    const indicator = document.createElement('div');
    indicator.id = 'nav-loading-indicator';
    indicator.className = 'nav-loading-indicator';
    
    // Añadir al DOM
    document.body.appendChild(indicator);
  }
  
  /**
   * Muestra el indicador de carga
   * @private
   */
  _showLoadingIndicator() {
    const indicator = document.getElementById('nav-loading-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }
  
  /**
   * Oculta el indicador de carga
   * @private
   */
  _hideLoadingIndicator() {
    const indicator = document.getElementById('nav-loading-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }
  
  /**
   * Añade transición de entrada cuando la página se carga
   */
  pageLoaded() {
    // Añadir clase de transición entrante
    document.body.classList.remove('page-transition-out');
    
    // Ocultar indicador de carga
    this._hideLoadingIndicator();
    
    // Marcar como no en transición
    this.isTransitioning = false;
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Crear instancia global
  window.enhancedNavigation = new EnhancedNavigation();
  
  // Marcar página como cargada
  setTimeout(() => {
    if (window.enhancedNavigation) {
      window.enhancedNavigation.pageLoaded();
    }
  }, 100);
});
