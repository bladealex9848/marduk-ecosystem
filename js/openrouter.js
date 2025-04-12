/**
 * MARDUK ECOSYSTEM - INTEGRACIÓN CON OPENROUTER
 * Módulo para la integración con la API de OpenRouter para acceso a modelos de IA
 *
 * Este archivo contiene las funciones necesarias para conectar con OpenRouter
 * y utilizar sus modelos de IA en diferentes partes de la aplicación.
 */

// Importar configuración de modelos y variables de entorno
import OPENROUTER_MODELS_CONFIG from './config/openrouter-models.js';
import envLoader from './config/env.js';

// Configuración base de OpenRouter
const OPENROUTER_CONFIG = {
  apiKey: 'demo', // Valor por defecto, se reemplazará con el valor del .env
  baseUrl: 'https://openrouter.ai/api/v1',
  defaultModel: OPENROUTER_MODELS_CONFIG.default_model,
  fastModel: OPENROUTER_MODELS_CONFIG.fast_models,
  availableModels: OPENROUTER_MODELS_CONFIG.models,
  temperature: OPENROUTER_MODELS_CONFIG.temperature
};

/**
 * Clase principal para la integración con OpenRouter
 */
class OpenRouterService {
  constructor(config = OPENROUTER_CONFIG) {
    this.config = config;
    this.currentModel = config.defaultModel;
    this.initialized = false;

    // Inicializar el servicio
    this._initialize();
  }

  /**
   * Inicializa el servicio cargando la configuración y la API key
   * @private
   */
  async _initialize() {
    try {
      // Cargar variables de entorno
      const env = await envLoader.load();

      // Actualizar API key desde el archivo .env
      this.config.apiKey = env.OPENROUTER_API_KEY || this.config.apiKey;

      // Verificar si hay un modelo guardado en localStorage
      const savedModel = localStorage.getItem('mardukAIModel');
      if (savedModel && this.isValidModel(savedModel)) {
        this.currentModel = savedModel;
      }

      this.initialized = true;
      console.log('OpenRouter Service inicializado con modelo:', this.currentModel);
    } catch (error) {
      console.error('Error al inicializar OpenRouter Service:', error);
    }
  }

  /**
   * Cambia el modelo de IA actual
   * @param {string} modelId - ID del modelo a utilizar
   */
  setModel(modelId) {
    if (this.isValidModel(modelId)) {
      this.currentModel = modelId;
      localStorage.setItem('mardukAIModel', modelId);
      console.log('Modelo cambiado a:', modelId);
      return true;
    }
    console.error('Modelo no válido:', modelId);
    return false;
  }

  /**
   * Verifica si un modelo es válido
   * @param {string} modelId - ID del modelo a verificar
   * @returns {boolean} - true si el modelo es válido
   */
  isValidModel(modelId) {
    // Verificar en la lista de modelos disponibles
    return this.config.availableModels.some(model => model.id === modelId);
  }

  /**
   * Obtiene información detallada de un modelo
   * @param {string} modelId - ID del modelo
   * @returns {Object|null} - Información del modelo o null si no existe
   */
  getModelInfo(modelId) {
    return this.config.availableModels.find(model => model.id === modelId) || null;
  }

  /**
   * Obtiene modelos filtrados por especialidad
   * @param {string} specialty - Especialidad a filtrar (general, multimodal, coding, creative)
   * @returns {Array} - Lista de modelos filtrados
   */
  getModelsBySpecialty(specialty) {
    if (!specialty) return this.config.availableModels;
    return this.config.availableModels.filter(model => model.specialty === specialty);
  }

  /**
   * Obtiene modelos filtrados por capacidad
   * @param {string} capability - Capacidad a filtrar
   * @returns {Array} - Lista de modelos filtrados
   */
  getModelsByCapability(capability) {
    if (!capability) return this.config.availableModels;
    return this.config.availableModels.filter(model =>
      model.capabilities && model.capabilities.includes(capability)
    );
  }

  /**
   * Obtiene la lista de modelos disponibles
   * @returns {Array} - Lista de modelos disponibles
   */
  getAvailableModels() {
    return this.config.availableModels;
  }

  /**
   * Obtiene el modelo actual
   * @returns {string} - ID del modelo actual
   */
  getCurrentModel() {
    return this.currentModel;
  }

  /**
   * Obtiene el nombre del modelo actual
   * @returns {string} - Nombre del modelo actual
   */
  getCurrentModelName() {
    const model = this.config.availableModels.find(m => m.id === this.currentModel);
    return model ? model.name : this.currentModel;
  }

  /**
   * Realiza una solicitud a la API de OpenRouter
   * @param {string} prompt - Texto de entrada para el modelo
   * @param {Object} options - Opciones adicionales
   * @returns {Promise} - Promesa con la respuesta
   */
  async generateCompletion(prompt, options = {}) {
    try {
      // Esperar a que el servicio esté inicializado
      if (!this.initialized) {
        console.log('Esperando inicialización de OpenRouter Service...');
        await new Promise(resolve => {
          const checkInitialized = () => {
            if (this.initialized) {
              resolve();
            } else {
              setTimeout(checkInitialized, 100);
            }
          };
          checkInitialized();
        });
      }

      // Mostrar indicador de carga
      this._showLoadingIndicator();

      // Determinar el modelo a usar
      let modelId = options.modelId || this.currentModel;

      // Si se solicita respuesta rápida, usar el modelo rápido
      if (options.fast === true) {
        modelId = this.config.fastModel;
      }

      const maxTokens = options.maxTokens || 500;
      const temperature = options.temperature || this.config.temperature;

      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin, // Requerido por OpenRouter
          'X-Title': 'Marduk Ecosystem' // Nombre de tu aplicación
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: options.systemPrompt || 'Eres un asistente útil en el ecosistema Marduk para la transformación judicial.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: temperature,
          stream: options.stream || false
        })
      });

      // Ocultar indicador de carga
      this._hideLoadingIndicator();

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la solicitud a OpenRouter:', errorData);
        throw new Error(`Error en la solicitud a OpenRouter: ${errorData.error?.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      // Ocultar indicador de carga en caso de error
      this._hideLoadingIndicator();

      console.error('Error al generar completación:', error);
      throw error;
    }
  }

  /**
   * Genera sugerencias de búsqueda basadas en un texto de entrada
   * @param {string} inputText - Texto de entrada
   * @param {number} numSuggestions - Número de sugerencias a generar
   * @returns {Promise<Array>} - Promesa con las sugerencias
   */
  async generateSearchSuggestions(inputText, numSuggestions = 5) {
    if (!inputText || inputText.trim().length < 2) {
      return [];
    }

    try {
      const prompt = `Genera ${numSuggestions} sugerencias de búsqueda relacionadas con "${inputText}" en el contexto de un sistema judicial. Devuelve solo las sugerencias separadas por saltos de línea, sin numeración ni texto adicional.`;

      const response = await this.generateCompletion(prompt, {
        maxTokens: 150,
        temperature: 0.3,
        systemPrompt: 'Eres un asistente especializado en generar sugerencias de búsqueda relevantes para un sistema judicial.'
      });

      // Procesar la respuesta para obtener las sugerencias como array
      return response.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, numSuggestions);
    } catch (error) {
      console.error('Error al generar sugerencias de búsqueda:', error);
      return [];
    }
  }

  /**
   * Genera recomendaciones personalizadas basadas en el historial del usuario
   * @param {Array} userHistory - Historial de interacciones del usuario
   * @param {number} numRecommendations - Número de recomendaciones a generar
   * @returns {Promise<Array>} - Promesa con las recomendaciones
   */
  async generatePersonalizedRecommendations(userHistory, numRecommendations = 3) {
    try {
      // Convertir el historial a un formato adecuado para el prompt
      const historyText = userHistory.map(item =>
        `- ${item.type}: ${item.content} (${item.timestamp})`
      ).join('\n');

      const prompt = `Basado en el siguiente historial de usuario, genera ${numRecommendations} recomendaciones personalizadas para herramientas o recursos judiciales que podrían ser útiles:\n\n${historyText}\n\nPara cada recomendación, proporciona: título, descripción breve y razón de la recomendación.`;

      const response = await this.generateCompletion(prompt, {
        maxTokens: 500,
        temperature: 0.7,
        systemPrompt: 'Eres un asistente especializado en recomendar herramientas y recursos judiciales basados en el comportamiento del usuario.'
      });

      // Procesar la respuesta para estructurar las recomendaciones
      // Este es un procesamiento simple, podría mejorarse con regex más robustos
      const recommendations = [];
      const sections = response.split(/\d+\.\s+/).filter(s => s.trim().length > 0);

      for (const section of sections) {
        const lines = section.split('\n').filter(l => l.trim().length > 0);
        if (lines.length >= 1) {
          const title = lines[0].replace(/^[^a-zA-Z0-9]+/, '').trim();
          const description = lines.length > 1 ? lines[1].trim() : '';
          const reason = lines.length > 2 ? lines.slice(2).join(' ').trim() : '';

          recommendations.push({ title, description, reason });
        }
      }

      return recommendations;
    } catch (error) {
      console.error('Error al generar recomendaciones personalizadas:', error);
      return [];
    }
  }

  /**
   * Analiza un texto para extraer entidades y conceptos relevantes
   * @param {string} text - Texto a analizar
   * @returns {Promise<Object>} - Promesa con el análisis
   */
  async analyzeText(text) {
    try {
      const prompt = `Analiza el siguiente texto relacionado con el ámbito judicial y extrae las entidades relevantes (personas, organizaciones, lugares), conceptos clave, y posibles acciones recomendadas:\n\n"${text}"\n\nFormato de respuesta: JSON con las siguientes claves: entities, concepts, actions`;

      const response = await this.generateCompletion(prompt, {
        maxTokens: 500,
        temperature: 0.3,
        systemPrompt: 'Eres un asistente especializado en análisis de texto jurídico. Responde siempre en formato JSON válido.'
      });

      // Intentar parsear la respuesta como JSON
      try {
        // Extraer solo la parte JSON de la respuesta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }

        // Si no se encuentra un objeto JSON completo, intentar parsear toda la respuesta
        return JSON.parse(response);
      } catch (parseError) {
        console.error('Error al parsear la respuesta JSON:', parseError);
        // Devolver un objeto estructurado manualmente
        return {
          entities: [],
          concepts: [],
          actions: [],
          rawResponse: response
        };
      }
    } catch (error) {
      console.error('Error al analizar texto:', error);
      return {
        entities: [],
        concepts: [],
        actions: [],
        error: error.message
      };
    }
  }

  /**
   * Muestra un indicador de carga durante las solicitudes usando SweetAlert2
   * @private
   */
  _showLoadingIndicator() {
    // Verificar si SweetAlert2 está disponible
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Consultando IA...',
        html: `<div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>
              <p class="mt-3 mb-0">Procesando tu solicitud</p>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      // Fallback si SweetAlert2 no está disponible
      // Verificar si ya existe un indicador de carga
      let loader = document.getElementById('ai-loading-indicator');

      if (!loader) {
        // Crear el indicador de carga con Bootstrap
        loader = document.createElement('div');
        loader.id = 'ai-loading-indicator';
        loader.className = 'toast show';
        loader.setAttribute('role', 'alert');
        loader.setAttribute('aria-live', 'assertive');
        loader.setAttribute('aria-atomic', 'true');
        loader.innerHTML = `
          <div class="toast-header">
            <strong class="me-auto">Marduk IA</strong>
            <small>Ahora</small>
          </div>
          <div class="toast-body d-flex align-items-center">
            <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <span>Consultando IA...</span>
          </div>
        `;

        // Estilos para el indicador
        loader.style.position = 'fixed';
        loader.style.top = '20px';
        loader.style.right = '20px';
        loader.style.zIndex = '9999';

        // Añadir al DOM
        document.body.appendChild(loader);
      } else {
        // Mostrar el indicador existente
        loader.classList.add('show');
      }
    }
  }

  /**
   * Oculta el indicador de carga
   * @private
   */
  _hideLoadingIndicator() {
    // Verificar si SweetAlert2 está disponible
    if (typeof Swal !== 'undefined') {
      Swal.close();
    } else {
      // Fallback si SweetAlert2 no está disponible
      const loader = document.getElementById('ai-loading-indicator');
      if (loader) {
        loader.classList.remove('show');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }
    }
  }
}

// Crear una instancia global del servicio
const openRouterService = new OpenRouterService();

// Exportar la instancia para uso en otros archivos
export default openRouterService;

// También hacer disponible globalmente para compatibilidad con código existente
window.openRouterService = openRouterService;
