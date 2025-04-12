/**
 * MARDUK ECOSYSTEM - GESTOR DE TEMAS
 * 
 * Este archivo se encarga de gestionar el tema claro/oscuro de la aplicación,
 * detectando las preferencias del sistema y permitiendo al usuario cambiar manualmente.
 */

class ThemeManager {
  constructor() {
    // Temas disponibles
    this.themes = {
      light: 'light',
      dark: 'dark'
    };
    
    // Tema actual
    this.currentTheme = this.themes.light;
    
    // Inicializar
    this.init();
  }
  
  /**
   * Inicializa el gestor de temas
   */
  init() {
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('darkModeEnabled');
    
    // Verificar preferencia del sistema
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determinar tema inicial
    if (savedTheme === 'true' || (prefersDarkMode && savedTheme !== 'false')) {
      this.setTheme(this.themes.dark);
    } else {
      this.setTheme(this.themes.light);
    }
    
    // Escuchar cambios en las preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('darkModeEnabled') === null) {
        this.setTheme(e.matches ? this.themes.dark : this.themes.light);
      }
    });
    
    // Inicializar botón de cambio de tema cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
      this.initThemeToggle();
    });
  }
  
  /**
   * Establece el tema de la aplicación
   * @param {string} theme - Tema a establecer ('light' o 'dark')
   */
  setTheme(theme) {
    // Validar tema
    if (theme !== this.themes.light && theme !== this.themes.dark) {
      console.error('Tema no válido:', theme);
      return;
    }
    
    // Actualizar tema actual
    this.currentTheme = theme;
    
    // Aplicar tema
    if (theme === this.themes.dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkModeEnabled', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkModeEnabled', 'false');
    }
    
    // Actualizar botón de cambio de tema
    this.updateThemeToggle();
    
    // Disparar evento de cambio de tema
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }
  
  /**
   * Alterna entre tema claro y oscuro
   */
  toggleTheme() {
    const newTheme = this.currentTheme === this.themes.dark ? this.themes.light : this.themes.dark;
    this.setTheme(newTheme);
  }
  
  /**
   * Inicializa el botón de cambio de tema
   */
  initThemeToggle() {
    // Verificar si ya existe el botón
    let themeToggle = document.getElementById('darkModeToggle');
    
    // Si no existe, crearlo
    if (!themeToggle) {
      // Buscar contenedor para el botón
      const userMenu = document.querySelector('.d-flex.align-items-center');
      if (!userMenu) return;
      
      // Crear botón
      themeToggle = document.createElement('button');
      themeToggle.id = 'darkModeToggle';
      themeToggle.className = 'btn btn-link text-light position-relative p-1 me-3';
      themeToggle.setAttribute('title', 'Cambiar modo oscuro/claro');
      
      // Determinar icono inicial
      const isDarkMode = this.currentTheme === this.themes.dark;
      themeToggle.innerHTML = `<i class="fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}"></i>`;
      
      // Insertar antes del primer elemento
      userMenu.insertBefore(themeToggle, userMenu.firstChild);
    }
    
    // Añadir evento de clic
    themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Actualizar estado inicial
    this.updateThemeToggle();
  }
  
  /**
   * Actualiza el estado del botón de cambio de tema
   */
  updateThemeToggle() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const icon = toggle.querySelector('i');
    if (icon) {
      if (this.currentTheme === this.themes.dark) {
        icon.className = 'fas fa-sun';
        toggle.setAttribute('title', 'Cambiar a modo claro');
        toggle.setAttribute('aria-label', 'Cambiar a modo claro');
      } else {
        icon.className = 'fas fa-moon';
        toggle.setAttribute('title', 'Cambiar a modo oscuro');
        toggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
      }
    }
  }
  
  /**
   * Obtiene el tema actual
   * @returns {string} - Tema actual ('light' o 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Verifica si el tema actual es oscuro
   * @returns {boolean} - true si el tema actual es oscuro
   */
  isDarkMode() {
    return this.currentTheme === this.themes.dark;
  }
}

// Crear instancia global
const themeManager = new ThemeManager();

// Exportar instancia
export default themeManager;

// También hacer disponible globalmente
window.themeManager = themeManager;
