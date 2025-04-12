/**
 * MARDUK ECOSYSTEM - BÚSQUEDA AVANZADA
 * Módulo para la funcionalidad de búsqueda mejorada con IA
 * 
 * Este archivo contiene las funciones necesarias para implementar
 * una búsqueda avanzada con sugerencias personalizadas utilizando IA.
 */

// Clase principal para la búsqueda avanzada
class AdvancedSearch {
  constructor() {
    // Inicializar propiedades
    this.searchHistory = [];
    this.popularSearches = [
      'expediente judicial',
      'audiencia virtual',
      'notificación electrónica',
      'firma digital',
      'consulta de procesos'
    ];
    
    // Cargar historial de búsqueda desde localStorage
    this._loadSearchHistory();
    
    // Inicializar componentes de búsqueda
    this._initSearchComponents();
    
    console.log('Sistema de búsqueda avanzada inicializado');
  }
  
  /**
   * Inicializa los componentes de búsqueda en la página
   * @private
   */
  _initSearchComponents() {
    // Buscar todos los formularios de búsqueda
    const searchForms = document.querySelectorAll('form:has(input[type="search"])');
    
    searchForms.forEach(form => {
      // Obtener el input de búsqueda
      const searchInput = form.querySelector('input[type="search"]');
      if (!searchInput) return;
      
      // Crear contenedor para sugerencias
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'search-suggestions';
      suggestionsContainer.style.display = 'none';
      form.appendChild(suggestionsContainer);
      
      // Añadir eventos
      searchInput.addEventListener('input', this._handleSearchInput.bind(this));
      searchInput.addEventListener('focus', this._handleSearchFocus.bind(this));
      searchInput.addEventListener('blur', () => {
        // Retraso para permitir clic en sugerencias
        setTimeout(() => {
          suggestionsContainer.style.display = 'none';
        }, 200);
      });
      
      // Prevenir envío de formulario vacío
      form.addEventListener('submit', (e) => {
        if (!searchInput.value.trim()) {
          e.preventDefault();
        } else {
          this._addToSearchHistory(searchInput.value);
        }
      });
    });
    
    // Añadir estilos CSS para las sugerencias
    this._addSuggestionStyles();
  }
  
  /**
   * Maneja el evento de entrada en el campo de búsqueda
   * @param {Event} event - Evento de input
   * @private
   */
  async _handleSearchInput(event) {
    const searchInput = event.target;
    const searchTerm = searchInput.value.trim();
    const form = searchInput.closest('form');
    const suggestionsContainer = form.querySelector('.search-suggestions');
    
    // Limpiar y ocultar sugerencias si el término de búsqueda es muy corto
    if (searchTerm.length < 2) {
      suggestionsContainer.style.display = 'none';
      return;
    }
    
    // Generar sugerencias
    const suggestions = await this._generateSuggestions(searchTerm);
    
    // Mostrar sugerencias
    this._displaySuggestions(suggestionsContainer, suggestions, searchInput);
  }
  
  /**
   * Maneja el evento de focus en el campo de búsqueda
   * @param {Event} event - Evento de focus
   * @private
   */
  async _handleSearchFocus(event) {
    const searchInput = event.target;
    const searchTerm = searchInput.value.trim();
    const form = searchInput.closest('form');
    const suggestionsContainer = form.querySelector('.search-suggestions');
    
    // Si hay un término de búsqueda, mostrar sugerencias
    if (searchTerm.length >= 2) {
      const suggestions = await this._generateSuggestions(searchTerm);
      this._displaySuggestions(suggestionsContainer, suggestions, searchInput);
    } 
    // Si no hay término, mostrar historial y búsquedas populares
    else {
      const combinedSuggestions = [
        ...this.searchHistory.slice(0, 3).map(item => ({ 
          text: item.term, 
          type: 'history',
          icon: '<i class="fas fa-history"></i>'
        })),
        ...this.popularSearches.slice(0, 5).map(term => ({ 
          text: term, 
          type: 'popular',
          icon: '<i class="fas fa-fire"></i>'
        }))
      ];
      
      this._displaySuggestions(suggestionsContainer, combinedSuggestions, searchInput);
    }
  }
  
  /**
   * Genera sugerencias basadas en el término de búsqueda
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} - Promesa con las sugerencias
   * @private
   */
  async _generateSuggestions(searchTerm) {
    // Combinar diferentes fuentes de sugerencias
    const suggestions = [];
    
    // 1. Añadir coincidencias del historial
    const historyMatches = this.searchHistory
      .filter(item => item.term.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 2)
      .map(item => ({
        text: item.term,
        type: 'history',
        icon: '<i class="fas fa-history"></i>'
      }));
    
    suggestions.push(...historyMatches);
    
    // 2. Añadir coincidencias de búsquedas populares
    const popularMatches = this.popularSearches
      .filter(term => term.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 2)
      .map(term => ({
        text: term,
        type: 'popular',
        icon: '<i class="fas fa-fire"></i>'
      }));
    
    suggestions.push(...popularMatches);
    
    // 3. Generar sugerencias con IA si está disponible
    if (window.openRouterService) {
      try {
        const aiSuggestions = await window.openRouterService.generateSearchSuggestions(searchTerm, 3);
        
        const formattedAiSuggestions = aiSuggestions.map(suggestion => ({
          text: suggestion,
          type: 'ai',
          icon: '<i class="fas fa-robot"></i>'
        }));
        
        suggestions.push(...formattedAiSuggestions);
      } catch (error) {
        console.error('Error al generar sugerencias con IA:', error);
      }
    }
    
    return suggestions;
  }
  
  /**
   * Muestra las sugerencias en el contenedor
   * @param {HTMLElement} container - Contenedor de sugerencias
   * @param {Array} suggestions - Lista de sugerencias
   * @param {HTMLInputElement} searchInput - Campo de búsqueda
   * @private
   */
  _displaySuggestions(container, suggestions, searchInput) {
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Si no hay sugerencias, ocultar contenedor
    if (suggestions.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    // Crear elementos para cada sugerencia
    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'search-suggestion-item';
      suggestionItem.innerHTML = `
        <span class="suggestion-icon">${suggestion.icon}</span>
        <span class="suggestion-text">${suggestion.text}</span>
      `;
      
      // Añadir evento de clic
      suggestionItem.addEventListener('click', () => {
        searchInput.value = suggestion.text;
        container.style.display = 'none';
        
        // Simular envío del formulario
        const form = searchInput.closest('form');
        if (form) {
          this._addToSearchHistory(suggestion.text);
          form.dispatchEvent(new Event('submit'));
        }
      });
      
      container.appendChild(suggestionItem);
    });
    
    // Mostrar contenedor
    container.style.display = 'block';
  }
  
  /**
   * Añade un término al historial de búsqueda
   * @param {string} term - Término de búsqueda
   * @private
   */
  _addToSearchHistory(term) {
    term = term.trim();
    if (!term) return;
    
    // Eliminar duplicados
    this.searchHistory = this.searchHistory.filter(item => item.term !== term);
    
    // Añadir al principio
    this.searchHistory.unshift({
      term,
      timestamp: new Date().toISOString()
    });
    
    // Limitar a 20 elementos
    if (this.searchHistory.length > 20) {
      this.searchHistory = this.searchHistory.slice(0, 20);
    }
    
    // Guardar en localStorage
    this._saveSearchHistory();
  }
  
  /**
   * Carga el historial de búsqueda desde localStorage
   * @private
   */
  _loadSearchHistory() {
    try {
      const savedHistory = localStorage.getItem('mardukSearchHistory');
      if (savedHistory) {
        this.searchHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.error('Error al cargar historial de búsqueda:', error);
      this.searchHistory = [];
    }
  }
  
  /**
   * Guarda el historial de búsqueda en localStorage
   * @private
   */
  _saveSearchHistory() {
    try {
      localStorage.setItem('mardukSearchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error al guardar historial de búsqueda:', error);
    }
  }
  
  /**
   * Añade estilos CSS para las sugerencias
   * @private
   */
  _addSuggestionStyles() {
    // Verificar si ya existe el estilo
    if (document.getElementById('search-suggestion-styles')) return;
    
    // Crear elemento de estilo
    const styleElement = document.createElement('style');
    styleElement.id = 'search-suggestion-styles';
    
    // Definir estilos
    styleElement.textContent = `
      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #fff;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
        margin-top: 5px;
      }
      
      .search-suggestion-item {
        padding: 10px 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background-color 0.2s ease;
      }
      
      .search-suggestion-item:hover {
        background-color: #f5f8ff;
      }
      
      .suggestion-icon {
        margin-right: 10px;
        color: #6b7280;
        width: 20px;
        text-align: center;
      }
      
      .suggestion-text {
        flex: 1;
      }
      
      [data-theme="dark"] .search-suggestions {
        background-color: #1e1e1e;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      }
      
      [data-theme="dark"] .search-suggestion-item:hover {
        background-color: #2d2d2d;
      }
      
      [data-theme="dark"] .suggestion-icon {
        color: #a0a0a0;
      }
    `;
    
    // Añadir al DOM
    document.head.appendChild(styleElement);
  }
  
  /**
   * Realiza una búsqueda avanzada
   * @param {string} query - Consulta de búsqueda
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultados de la búsqueda
   */
  async search(query, options = {}) {
    // Añadir al historial
    this._addToSearchHistory(query);
    
    // Implementar lógica de búsqueda avanzada
    // Por ahora, redirigir a la página de soluciones con el parámetro de búsqueda
    const currentPage = window.location.pathname;
    let targetURL;
    
    if (currentPage.includes('/pages/')) {
      targetURL = `solutions.html?search=${encodeURIComponent(query)}`;
    } else {
      targetURL = `pages/solutions.html?search=${encodeURIComponent(query)}`;
    }
    
    // Si se especifica redirect=false, no redirigir
    if (options.redirect !== false) {
      window.location.href = targetURL;
      return null;
    }
    
    // Si no se redirige, devolver resultados simulados
    return {
      query,
      results: [],
      message: 'Búsqueda simulada (sin redirección)'
    };
  }
  
  /**
   * Obtiene recomendaciones personalizadas basadas en el historial
   * @param {number} count - Número de recomendaciones
   * @returns {Promise<Array>} - Recomendaciones personalizadas
   */
  async getPersonalizedRecommendations(count = 3) {
    if (!window.openRouterService) {
      return this._getFallbackRecommendations(count);
    }
    
    try {
      // Preparar historial para la IA
      const userHistory = this.searchHistory.map(item => ({
        type: 'búsqueda',
        content: item.term,
        timestamp: item.timestamp
      }));
      
      // Obtener recomendaciones de la IA
      return await window.openRouterService.generatePersonalizedRecommendations(userHistory, count);
    } catch (error) {
      console.error('Error al obtener recomendaciones personalizadas:', error);
      return this._getFallbackRecommendations(count);
    }
  }
  
  /**
   * Obtiene recomendaciones de respaldo cuando la IA no está disponible
   * @param {number} count - Número de recomendaciones
   * @returns {Array} - Recomendaciones de respaldo
   * @private
   */
  _getFallbackRecommendations(count) {
    const fallbackRecommendations = [
      {
        title: 'Sistema de Gestión de Expedientes Judiciales',
        description: 'Gestiona tus expedientes judiciales de forma eficiente',
        reason: 'Herramienta esencial para profesionales del derecho'
      },
      {
        title: 'Asistente de Redacción Jurídica',
        description: 'Crea documentos legales con ayuda de IA',
        reason: 'Mejora la calidad y eficiencia de tus escritos'
      },
      {
        title: 'Calendario de Audiencias',
        description: 'Organiza y recibe recordatorios de tus audiencias',
        reason: 'Nunca pierdas una fecha importante'
      },
      {
        title: 'Biblioteca Jurídica Digital',
        description: 'Accede a leyes, jurisprudencia y doctrina',
        reason: 'Mantente actualizado con la normativa vigente'
      },
      {
        title: 'Notificaciones Electrónicas',
        description: 'Recibe notificaciones judiciales en tiempo real',
        reason: 'Agiliza tus procesos judiciales'
      }
    ];
    
    return fallbackRecommendations.slice(0, count);
  }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  // Crear instancia global
  window.advancedSearch = new AdvancedSearch();
});
