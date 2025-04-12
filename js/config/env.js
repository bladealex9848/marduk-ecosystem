/**
 * MARDUK ECOSYSTEM - GESTOR DE VARIABLES DE ENTORNO
 * 
 * Este archivo se encarga de gestionar las variables de entorno para la aplicación,
 * permitiendo almacenarlas y recuperarlas de manera segura.
 */

class EnvManager {
  constructor() {
    this.env = {};
    this.loaded = false;
    this.storagePrefix = 'marduk_env_';
  }

  /**
   * Carga las variables de entorno
   * @returns {Promise<Object>} - Objeto con las variables de entorno
   */
  async load() {
    if (this.loaded) {
      return this.env;
    }

    try {
      // Cargar variables desde localStorage
      this._loadFromLocalStorage();
      
      // Si no hay API key, usar valor por defecto
      if (!this.env.OPENROUTER_API_KEY) {
        this.env.OPENROUTER_API_KEY = 'demo';
        console.warn('No se encontró API key. Usando valor por defecto.');
      } else {
        console.log('Variables de entorno cargadas correctamente');
      }
    } catch (error) {
      console.error('Error al cargar variables de entorno:', error);
      this.env.OPENROUTER_API_KEY = 'demo';
    }
    
    this.loaded = true;
    return this.env;
  }
  
  /**
   * Carga variables desde localStorage
   * @private
   */
  _loadFromLocalStorage() {
    // Buscar todas las claves que empiezan con el prefijo
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        const envKey = key.replace(this.storagePrefix, '');
        this.env[envKey] = localStorage.getItem(key);
      }
    }
    
    // Buscar específicamente la API key (para compatibilidad)
    const apiKey = localStorage.getItem('OPENROUTER_API_KEY');
    if (apiKey) {
      this.env.OPENROUTER_API_KEY = apiKey;
    }
  }

  /**
   * Establece una variable de entorno
   * @param {string} key - Nombre de la variable
   * @param {string} value - Valor de la variable
   * @param {boolean} persist - Si se debe guardar en localStorage
   */
  set(key, value, persist = true) {
    this.env[key] = value;
    
    // Guardar en localStorage si se solicita
    if (persist) {
      try {
        localStorage.setItem(`${this.storagePrefix}${key}`, value);
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
    }
  }
  
  /**
   * Obtiene el valor de una variable de entorno
   * @param {string} key - Nombre de la variable
   * @param {*} defaultValue - Valor por defecto si la variable no existe
   * @returns {string|*} - Valor de la variable o valor por defecto
   */
  get(key, defaultValue = '') {
    return this.env[key] !== undefined ? this.env[key] : defaultValue;
  }
  
  /**
   * Elimina una variable de entorno
   * @param {string} key - Nombre de la variable
   */
  remove(key) {
    delete this.env[key];
    
    try {
      localStorage.removeItem(`${this.storagePrefix}${key}`);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  }
  
  /**
   * Limpia todas las variables de entorno
   */
  clear() {
    this.env = {};
    
    try {
      // Eliminar solo las claves con el prefijo
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }
}

// Crear una instancia global
const envManager = new EnvManager();

// Exportar la instancia
export default envManager;
