/**
 * MARDUK ECOSYSTEM - CARGADOR DE VARIABLES DE ENTORNO
 * 
 * Este archivo se encarga de cargar las variables de entorno desde el archivo .env
 * y proporcionarlas a la aplicación de manera segura.
 */

class EnvLoader {
  constructor() {
    this.env = {};
    this.loaded = false;
  }

  /**
   * Carga las variables de entorno desde el archivo .env
   * @returns {Promise<Object>} - Objeto con las variables de entorno
   */
  async load() {
    if (this.loaded) {
      return this.env;
    }

    try {
      // Intentar cargar el archivo .env
      const response = await fetch('/.env');
      
      if (!response.ok) {
        console.warn('No se pudo cargar el archivo .env. Usando valores por defecto.');
        this._setDefaultValues();
        return this.env;
      }
      
      const envText = await response.text();
      this._parseEnvFile(envText);
      
      this.loaded = true;
      console.log('Variables de entorno cargadas correctamente');
    } catch (error) {
      console.error('Error al cargar variables de entorno:', error);
      this._setDefaultValues();
    }
    
    return this.env;
  }
  
  /**
   * Parsea el contenido del archivo .env
   * @param {string} envText - Contenido del archivo .env
   * @private
   */
  _parseEnvFile(envText) {
    const lines = envText.split('\n');
    
    for (const line of lines) {
      // Ignorar líneas vacías o comentarios
      if (!line || line.trim().startsWith('#')) {
        continue;
      }
      
      // Buscar pares clave=valor
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        
        // Eliminar comillas si existen
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        this.env[key] = value;
      }
    }
  }
  
  /**
   * Establece valores por defecto para las variables de entorno
   * @private
   */
  _setDefaultValues() {
    this.env = {
      OPENROUTER_API_KEY: 'demo'
    };
    
    this.loaded = true;
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
}

// Crear una instancia global
const envLoader = new EnvLoader();

// Exportar la instancia
export default envLoader;
