/**
 * Carga los componentes comunes (header y footer) en todas las páginas
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando carga de componentes');

    // Obtener la URL actual
    const currentUrl = window.location.href;
    console.log('URL actual:', currentUrl);

    // Determinar si estamos en una página dentro de la carpeta 'pages'
    const isInPagesFolder = currentUrl.includes('/pages/');
    console.log('¿Está en carpeta pages?:', isInPagesFolder);

    // Definir las rutas de los componentes
    let headerFile, footerFile;

    if (isInPagesFolder) {
        // Estamos en una página dentro de la carpeta 'pages'
        headerFile = '../components/header-pages.html';
        footerFile = '../components/footer-pages.html';
    } else {
        // Estamos en la página principal o en otra ubicación
        headerFile = 'components/header.html';
        footerFile = 'components/footer.html';
    }

    console.log('Archivo de header:', headerFile);
    console.log('Archivo de footer:', footerFile);

    // Verificar si los elementos placeholder existen
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    console.log('Header placeholder encontrado:', headerPlaceholder ? 'Sí' : 'No');
    console.log('Footer placeholder encontrado:', footerPlaceholder ? 'Sí' : 'No');

    // Cargar el header si existe el placeholder
    if (headerPlaceholder) {
        console.log('Cargando header desde:', headerFile);

        fetch(headerFile)
            .then(response => {
                console.log('Respuesta del header:', response.status);
                return response.text();
            })
            .then(data => {
                console.log('Datos del header recibidos, longitud:', data.length);
                headerPlaceholder.innerHTML = data;

                // Activar el enlace actual en el menú
                highlightCurrentPage();

                // Inicializar el toggle de tema después de cargar el header
                initThemeToggle();
            })
            .catch(error => console.error('Error al cargar el header:', error));
    } else {
        console.error('No se encontró el elemento header-placeholder');
    }

    // Cargar el footer si existe el placeholder
    if (footerPlaceholder) {
        console.log('Cargando footer desde:', footerFile);

        fetch(footerFile)
            .then(response => {
                console.log('Respuesta del footer:', response.status);
                return response.text();
            })
            .then(data => {
                console.log('Datos del footer recibidos, longitud:', data.length);
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error al cargar el footer:', error));
    } else {
        console.error('No se encontró el elemento footer-placeholder');
    }
});

/**
 * Resalta el enlace de navegación de la página actual
 */
function highlightCurrentPage() {
    // Obtener el nombre del archivo actual
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html'; // Si es la raíz, asumimos index.html

    // Determinar si estamos en la página principal
    const isHomePage = currentPath === '/' ||
                       currentPath.endsWith('/index.html') ||
                       currentPath.endsWith('/');

    // Seleccionar todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const hrefFile = href.split('/').pop();

        // Marcar como activo si:
        // 1. Es la página de inicio y estamos en la raíz
        // 2. El nombre del archivo coincide con el enlace
        if ((hrefFile === 'index.html' && isHomePage) ||
            (currentFile === hrefFile && !isHomePage)) {
            link.classList.add('active');
        }
    });

    // Para depuración: console.log('Current page:', currentFile, 'Is home page:', isHomePage);
}

/**
 * Inicializa el toggle de tema oscuro/claro
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Actualizar el icono según el tema actual
        updateThemeIcon();

        // Agregar evento de click
        themeToggle.addEventListener('click', function() {
            // Obtener el estado actual del tema
            const isDarkMode = document.body.classList.contains('dark-mode');

            // Cambiar el tema
            if (isDarkMode) {
                document.documentElement.removeAttribute('data-theme');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkModeEnabled', 'false');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkModeEnabled', 'true');
            }

            // Actualizar el icono
            updateThemeIcon();
        });
    }
}

/**
 * Actualiza el icono del toggle de tema según el tema actual
 */
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}
