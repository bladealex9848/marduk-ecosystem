/**
 * MARDUK ECOSYSTEM - BÚSQUEDA INTELIGENTE CON IA
 *
 * Este archivo contiene la lógica para la búsqueda inteligente con IA en la página de soluciones.
 * Permite buscar soluciones existentes y generar nuevas fichas de solución cuando no se encuentran resultados.
 */

// Variables globales
let sitemapData = null;
let apiKey = null;
let aiSearchEnabled = false;

// Elementos del DOM (se inicializarán cuando el DOM esté cargado)
let searchInput;
let searchButton;
let searchResults;
let aiStatusIndicator;

// Modelo de IA a utilizar (rápido y eficiente)
const AI_MODEL = "meta-llama/llama-4-scout:free";

/**
 * Inicializa la búsqueda inteligente cuando el DOM esté cargado
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Inicializando búsqueda inteligente con IA...');

    // Inicializar elementos del DOM
    initializeElements();

    // Cargar el sitemap
    await loadSitemap();

    // Verificar API key y habilitar búsqueda con IA
    await checkApiKeyAndEnableAI();

    // Configurar eventos
    setupEventListeners();
});

/**
 * Inicializa los elementos del DOM necesarios para la búsqueda
 */
function initializeElements() {
    // Elementos principales
    searchInput = document.getElementById('solutionSearch');
    searchButton = document.querySelector('.search-button');

    // Crear contenedor de resultados si no existe
    if (!document.getElementById('searchResults')) {
        searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.className = 'search-results-container d-none';
        searchInput.parentNode.appendChild(searchResults);
    } else {
        searchResults = document.getElementById('searchResults');
    }

    // Crear indicador de estado de IA
    if (!document.getElementById('aiStatusIndicator')) {
        const searchContainer = document.querySelector('.position-relative');
        aiStatusIndicator = document.createElement('div');
        aiStatusIndicator.id = 'aiStatusIndicator';
        aiStatusIndicator.className = 'ai-status-indicator';
        aiStatusIndicator.innerHTML = '<i class="fas fa-robot"></i>';
        aiStatusIndicator.title = 'Búsqueda con IA no disponible';
        searchContainer.appendChild(aiStatusIndicator);

        // Agregar estilos para el indicador
        const style = document.createElement('style');
        style.textContent = `
            .ai-status-indicator {
                position: absolute;
                top: 50%;
                right: 60px;
                transform: translateY(-50%);
                font-size: 1.2rem;
                color: var(--text-muted);
                cursor: pointer;
                transition: color 0.3s ease;
            }
            .ai-status-indicator.enabled {
                color: var(--bs-primary);
            }
            .ai-status-indicator.disabled {
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    } else {
        aiStatusIndicator = document.getElementById('aiStatusIndicator');
    }
}

/**
 * Carga el sitemap desde el archivo JSON
 */
async function loadSitemap() {
    try {
        const response = await fetch('../js/sitemap.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el sitemap: ${response.status}`);
        }

        sitemapData = await response.json();
        console.log('Sitemap cargado correctamente:', sitemapData.siteName);
    } catch (error) {
        console.error('Error al cargar el sitemap:', error);
        showToast('Error al cargar el mapa del sitio', 'error');
    }
}

/**
 * Verifica si hay una API key válida y habilita la búsqueda con IA
 */
async function checkApiKeyAndEnableAI() {
    try {
        // Esperar a que se carguen las variables de entorno
        await waitForEnvVariables();

        // Verificar si hay una API key en las variables de entorno
        if (window.ENV && window.ENV.OPENROUTER_API_KEY &&
            window.ENV.OPENROUTER_API_KEY !== 'DEMO_MODE' &&
            window.ENV.OPENROUTER_API_KEY !== 'demo' &&
            window.ENV.OPENROUTER_API_KEY !== 'tu-api-key-aquí') {

            apiKey = window.ENV.OPENROUTER_API_KEY;
            console.log('API key encontrada en variables de entorno');
            enableAISearch();
        }
        // Verificar si hay una API key en localStorage
        else if (localStorage.getItem('OPENROUTER_API_KEY') &&
                 localStorage.getItem('OPENROUTER_API_KEY') !== 'demo' &&
                 localStorage.getItem('OPENROUTER_API_KEY') !== 'tu-api-key-aquí') {

            apiKey = localStorage.getItem('OPENROUTER_API_KEY');
            console.log('API key encontrada en localStorage');
            enableAISearch();
        }
        // Verificar si el servicio global de OpenRouter está disponible
        else if (window.openRouterService && window.openRouterService.isConfigured()) {
            console.log('Servicio global de OpenRouter disponible');
            apiKey = 'using-global-service'; // Valor especial para indicar que usamos el servicio global
            enableAISearch();
        }
        // Si no hay API key, mostrar botón para configurarla
        else {
            console.log('No se encontró API key válida');
            disableAISearch();
        }
    } catch (error) {
        console.error('Error al verificar API key:', error);
        disableAISearch();
    }
}

/**
 * Espera a que se carguen las variables de entorno
 */
async function waitForEnvVariables() {
    return new Promise(resolve => {
        // Verificar si ENV ya está disponible
        if (window.ENV && window.ENV.OPENROUTER_API_KEY) {
            console.log('Variables de entorno ya cargadas');
            resolve();
            return;
        }

        // Si no está disponible, esperar a que se cargue
        console.log('Esperando a que se carguen las variables de entorno...');

        // Intentar cargar manualmente si está disponible la función
        if (typeof window.loadEnvVariables === 'function') {
            window.loadEnvVariables().then(() => {
                console.log('Variables de entorno cargadas manualmente');
                resolve();
            }).catch(error => {
                console.error('Error al cargar variables de entorno:', error);
                resolve(); // Resolver de todos modos para continuar
            });
        } else {
            // Esperar a que ENV esté disponible (máximo 5 segundos)
            let attempts = 0;
            const maxAttempts = 10; // 10 intentos * 500ms = 5 segundos

            const checkEnv = () => {
                attempts++;

                if (window.ENV && window.ENV.OPENROUTER_API_KEY) {
                    console.log(`Variables de entorno detectadas (intento ${attempts})`);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.log(`Tiempo de espera agotado después de ${attempts} intentos. Continuando sin API key.`);
                    resolve();
                } else {
                    console.log(`Esperando variables de entorno... (intento ${attempts}/${maxAttempts})`);
                    setTimeout(checkEnv, 500);
                }
            };
            checkEnv();
        }
    });
}

/**
 * Habilita la búsqueda con IA
 */
function enableAISearch() {
    aiSearchEnabled = true;
    aiStatusIndicator.classList.add('enabled');
    aiStatusIndicator.classList.remove('disabled');
    aiStatusIndicator.title = 'Búsqueda con IA habilitada';
    console.log('Búsqueda con IA habilitada');
    showToast('Búsqueda inteligente con IA habilitada', 'success');
}

/**
 * Deshabilita la búsqueda con IA
 */
function disableAISearch() {
    aiSearchEnabled = false;
    aiStatusIndicator.classList.add('disabled');
    aiStatusIndicator.classList.remove('enabled');
    aiStatusIndicator.title = 'Haga clic para configurar la API key de IA';
    console.log('Búsqueda con IA deshabilitada');
}

/**
 * Configura los eventos para la búsqueda
 */
function setupEventListeners() {
    // Evento de búsqueda al hacer clic en el botón
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    // Evento de búsqueda al presionar Enter en el input
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Evento para configurar API key al hacer clic en el indicador
    if (aiStatusIndicator) {
        aiStatusIndicator.addEventListener('click', function() {
            if (!aiSearchEnabled) {
                showApiKeyConfigModal();
            }
        });
    }
}

/**
 * Maneja la búsqueda de soluciones
 */
async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    console.log(`Realizando búsqueda: "${query}"`);

    // Mostrar indicador de carga
    showLoadingIndicator();

    try {
        // Primero buscar en el sitemap
        const results = searchInSitemap(query);

        // Si hay resultados, mostrarlos
        if (results.length > 0) {
            showSearchResults(results, query);
            hideLoadingIndicator();
            return;
        }

        // Si no hay resultados y la búsqueda con IA está habilitada, generar solución con IA
        if (aiSearchEnabled) {
            console.log('No se encontraron resultados en el sitemap, generando solución con IA...');
            await generateSolutionWithAI(query);
        } else {
            // Si la búsqueda con IA no está habilitada, mostrar mensaje de no resultados
            showNoResultsMessage(query);
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showToast('Error en la búsqueda: ' + error.message, 'error');
    } finally {
        hideLoadingIndicator();
    }
}

/**
 * Busca en el sitemap las soluciones que coinciden con la consulta
 * @param {string} query - Consulta de búsqueda
 * @returns {Array} - Resultados de la búsqueda
 */
function searchInSitemap(query) {
    if (!sitemapData) {
        return [];
    }

    const results = [];
    const queryLower = query.toLowerCase();

    // Buscar en las soluciones
    const solutionsSection = sitemapData.mainSections.find(section => section.id === 'solutions');
    if (solutionsSection && solutionsSection.subsections) {
        solutionsSection.subsections.forEach(category => {
            if (category.solutions) {
                category.solutions.forEach(solution => {
                    // Verificar si la solución coincide con la consulta
                    if (solution.name.toLowerCase().includes(queryLower) ||
                        solution.description.toLowerCase().includes(queryLower) ||
                        (solution.tags && solution.tags.some(tag => tag.toLowerCase().includes(queryLower)))) {

                        results.push({
                            type: 'solution',
                            category: category.name,
                            categoryId: category.id,
                            solution: solution
                        });
                    }
                });
            }
        });
    }

    // Buscar en la comunidad (foros relacionados)
    const communitySection = sitemapData.mainSections.find(section => section.id === 'community');
    if (communitySection && communitySection.subsections) {
        const forumsSection = communitySection.subsections.find(subsection => subsection.id === 'forums');
        if (forumsSection && forumsSection.categories) {
            forumsSection.categories.forEach(category => {
                if (category.forums) {
                    category.forums.forEach(forum => {
                        if (forum.name.toLowerCase().includes(queryLower) ||
                            forum.description.toLowerCase().includes(queryLower)) {

                            results.push({
                                type: 'forum',
                                category: category.name,
                                categoryId: category.id,
                                forum: forum
                            });
                        }
                    });
                }
            });
        }
    }

    return results;
}

/**
 * Muestra los resultados de la búsqueda
 * @param {Array} results - Resultados de la búsqueda
 * @param {string} query - Consulta de búsqueda
 */
function showSearchResults(results, query) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('d-none');

    // Crear encabezado de resultados
    const header = document.createElement('div');
    header.className = 'search-results-header p-3 border-bottom';
    header.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Resultados para "${query}"</h6>
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
    `;
    searchResults.appendChild(header);

    // Agregar evento para cerrar resultados
    header.querySelector('.btn-close').addEventListener('click', function() {
        searchResults.classList.add('d-none');
    });

    // Crear lista de resultados
    const resultsList = document.createElement('div');
    resultsList.className = 'search-results-list';

    // Agrupar resultados por tipo
    const solutionResults = results.filter(result => result.type === 'solution');
    const forumResults = results.filter(result => result.type === 'forum');

    // Mostrar soluciones
    if (solutionResults.length > 0) {
        const solutionsHeader = document.createElement('div');
        solutionsHeader.className = 'search-results-group-header p-2 bg-light';
        solutionsHeader.innerHTML = '<h6 class="mb-0">Soluciones</h6>';
        resultsList.appendChild(solutionsHeader);

        solutionResults.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.className = 'search-result-item p-3 border-bottom d-block text-decoration-none';
            resultItem.href = `solutions.html?category=${result.categoryId}&id=${result.solution.id}`;

            // Determinar el nivel de la solución
            const levelClass = getLevelClass(result.solution.level);
            const levelText = getLevelText(result.solution.level);

            resultItem.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="flex-shrink-0 me-3">
                        <span class="badge ${levelClass}">${levelText}</span>
                    </div>
                    <div>
                        <h6 class="mb-1">${result.solution.name}</h6>
                        <p class="mb-1 small text-muted">${result.solution.description}</p>
                        <div class="d-flex align-items-center small">
                            <span class="text-muted me-2">${result.category}</span>
                            <span class="badge bg-secondary">${result.solution.type}</span>
                        </div>
                    </div>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });
    }

    // Mostrar foros
    if (forumResults.length > 0) {
        const forumsHeader = document.createElement('div');
        forumsHeader.className = 'search-results-group-header p-2 bg-light';
        forumsHeader.innerHTML = '<h6 class="mb-0">Foros de discusión</h6>';
        resultsList.appendChild(forumsHeader);

        forumResults.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.className = 'search-result-item p-3 border-bottom d-block text-decoration-none';
            resultItem.href = `discussions.html?category=${result.categoryId}&id=${result.forum.id}`;

            resultItem.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="flex-shrink-0 me-3">
                        <i class="fas fa-comments text-primary"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${result.forum.name}</h6>
                        <p class="mb-1 small text-muted">${result.forum.description}</p>
                        <div class="small text-muted">${result.category}</div>
                    </div>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });
    }

    searchResults.appendChild(resultsList);
}

/**
 * Genera una solución con IA cuando no se encuentran resultados
 * @param {string} query - Consulta de búsqueda
 */
async function generateSolutionWithAI(query) {
    try {
        // Verificar si la búsqueda con IA está habilitada
        if (!aiSearchEnabled) {
            console.log('La búsqueda con IA no está habilitada');
            showToast('La búsqueda con IA no está habilitada', 'warning');
            showNoResultsMessage(query);
            return;
        }

        // Verificar si tenemos una API key o el servicio global
        if (!apiKey) {
            console.log('No hay una API key configurada');
            showToast('No hay una API key configurada', 'error');
            showApiKeyConfigModal();
            return;
        }

        // Mostrar mensaje de generación
        showToast('Generando solución con IA...', 'info');

        // Generar solución con IA
        const solution = await generateSolutionContent(query);

        // Verificar si la solución es válida
        if (!solution || !solution.name || !solution.description) {
            throw new Error('La solución generada no es válida');
        }

        // Crear ID único para la solución
        const solutionId = 'ai-' + Date.now();

        // Mostrar mensaje de éxito
        showToast('Solución generada correctamente', 'success');

        // Redirigir a la página de la solución generada
        navigateToGeneratedSolution(solutionId, solution);
    } catch (error) {
        console.error('Error al generar solución con IA:', error);
        showToast('Error al generar solución: ' + error.message, 'error');
        showNoResultsMessage(query);
    }
}

/**
 * Genera el contenido de la solución utilizando la API de OpenRouter
 * @param {string} query - Consulta de búsqueda
 * @returns {Object} - Solución generada
 */
async function generateSolutionContent(query) {
    // Verificar que tenemos una API key
    if (!apiKey) {
        throw new Error('No hay una API key configurada');
    }

    console.log('Generando solución con API key:', apiKey.substring(0, 5) + '...');

    try {
        // Crear prompt para la IA
        const prompt = `
Actúa como un experto en soluciones judiciales. Necesito que generes una solución para el siguiente problema o consulta:

"${query}"

Utiliza el siguiente formato JSON para tu respuesta:

{
  "name": "Nombre de la solución",
  "description": "Descripción breve de la solución (máximo 2 líneas)",
  "category": "Una de estas categorías: case-management, legal-research, document-automation, ai-tools, access-justice, legal-education",
  "level": "Un número del 1 al 5 que indique el nivel de madurez (1: Idea, 2: Prototipo, 3: Beta, 4: Producción, 5: Consolidada)",
  "type": "community",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "fullDescription": "Descripción detallada de la solución (3-5 párrafos)",
  "features": ["Característica 1", "Característica 2", "Característica 3", "Característica 4", "Característica 5"],
  "benefits": ["Beneficio 1", "Beneficio 2", "Beneficio 3", "Beneficio 4"],
  "useCases": ["Caso de uso 1", "Caso de uso 2", "Caso de uso 3"],
  "implementation": "Descripción de cómo se implementaría esta solución (2-3 párrafos)"
}

Asegúrate de que la solución sea relevante para el ámbito judicial y que pueda ser implementada con tecnología actual. La solución debe ser innovadora y aportar valor al sistema judicial.
`;

        // Verificar si estamos usando el servicio de OpenRouter global
        if (window.openRouterService && typeof window.openRouterService.generateCompletion === 'function') {
            console.log('Usando servicio global de OpenRouter');
            try {
                const completion = await window.openRouterService.generateCompletion(prompt, AI_MODEL);
                console.log('Respuesta recibida del servicio global de OpenRouter');

                // Extraer el JSON de la respuesta
                const jsonMatch = completion.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No se pudo extraer el JSON de la respuesta');
                }

                const solution = JSON.parse(jsonMatch[0]);
                return solution;
            } catch (error) {
                console.error('Error al usar el servicio global de OpenRouter:', error);
                throw new Error('Error al generar contenido: ' + error.message);
            }
        } else {
            console.log('Usando solicitud directa a la API de OpenRouter');
            // Hacer solicitud directa a la API de OpenRouter
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Marduk Ecosystem'
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error en la API de OpenRouter: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Extraer el JSON de la respuesta
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No se pudo extraer el JSON de la respuesta');
            }

            const solution = JSON.parse(jsonMatch[0]);
            return solution;
        }
    } catch (error) {
        console.error('Error al generar contenido con IA:', error);
        throw new Error('Error al generar contenido: ' + error.message);
    }
}

/**
 * Navega a la página de la solución generada
 * @param {string} solutionId - ID de la solución generada
 * @param {Object} solution - Datos de la solución generada
 */
function navigateToGeneratedSolution(solutionId, solution) {
    // Guardar la solución en localStorage para recuperarla en la página de destino
    localStorage.setItem(`ai-solution-${solutionId}`, JSON.stringify(solution));

    // Redirigir a la página de la solución
    window.location.href = `solutions.html?category=${solution.category}&id=${solutionId}&ai=true`;
}

/**
 * Muestra un mensaje cuando no se encuentran resultados
 * @param {string} query - Consulta de búsqueda
 */
function showNoResultsMessage(query) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('d-none');

    // Crear encabezado de resultados
    const header = document.createElement('div');
    header.className = 'search-results-header p-3 border-bottom';
    header.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Resultados para "${query}"</h6>
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
    `;
    searchResults.appendChild(header);

    // Agregar evento para cerrar resultados
    header.querySelector('.btn-close').addEventListener('click', function() {
        searchResults.classList.add('d-none');
    });

    // Crear mensaje de no resultados
    const noResults = document.createElement('div');
    noResults.className = 'p-4 text-center';

    if (aiSearchEnabled) {
        noResults.innerHTML = `
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h5>No se encontraron resultados</h5>
            <p class="text-muted mb-3">No encontramos soluciones para "${query}"</p>
            <button class="btn btn-primary" id="generateAiSolution">
                <i class="fas fa-robot me-2"></i>Generar solución con IA
            </button>
        `;

        // Agregar evento para generar solución con IA
        setTimeout(() => {
            const generateButton = document.getElementById('generateAiSolution');
            if (generateButton) {
                generateButton.addEventListener('click', () => generateSolutionWithAI(query));
            }
        }, 100);
    } else {
        noResults.innerHTML = `
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h5>No se encontraron resultados</h5>
            <p class="text-muted mb-3">No encontramos soluciones para "${query}"</p>
            <p class="text-muted">Activa la búsqueda con IA para generar soluciones personalizadas</p>
            <button class="btn btn-outline-primary" id="configureAiSearch">
                <i class="fas fa-cog me-2"></i>Configurar búsqueda con IA
            </button>
        `;

        // Agregar evento para configurar búsqueda con IA
        setTimeout(() => {
            const configButton = document.getElementById('configureAiSearch');
            if (configButton) {
                configButton.addEventListener('click', showApiKeyConfigModal);
            }
        }, 100);
    }

    searchResults.appendChild(noResults);
}

/**
 * Muestra un modal para configurar la API key
 */
function showApiKeyConfigModal() {
    Swal.fire({
        title: 'Configurar búsqueda con IA',
        html: `
            <p>Para habilitar la búsqueda inteligente con IA, necesitas configurar una API key de OpenRouter.</p>
            <div class="mb-3">
                <label for="api-key-input" class="form-label">OpenRouter API Key</label>
                <input type="password" class="form-control" id="api-key-input" placeholder="Ingresa tu API key">
                <div class="form-text">Obtén tu API key en <a href="https://openrouter.ai" target="_blank">OpenRouter.ai</a></div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const apiKeyInput = document.getElementById('api-key-input');
            return apiKeyInput.value;
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            // Guardar API key
            apiKey = result.value;
            localStorage.setItem('OPENROUTER_API_KEY', apiKey);

            // Habilitar búsqueda con IA
            enableAISearch();

            showToast('API key guardada correctamente', 'success');
        }
    });
}

/**
 * Muestra un indicador de carga durante la búsqueda
 */
function showLoadingIndicator() {
    // Cambiar el icono del botón de búsqueda
    if (searchButton) {
        searchButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        searchButton.disabled = true;
    }
}

/**
 * Oculta el indicador de carga
 */
function hideLoadingIndicator() {
    // Restaurar el icono del botón de búsqueda
    if (searchButton) {
        searchButton.innerHTML = '<i class="fa-solid fa-search"></i>';
        searchButton.disabled = false;
    }
}

/**
 * Obtiene la clase CSS para el nivel de madurez de una solución
 * @param {number} level - Nivel de madurez (1-5)
 * @returns {string} - Clase CSS
 */
function getLevelClass(level) {
    const levelClasses = {
        1: 'bg-secondary',
        2: 'bg-info',
        3: 'bg-primary',
        4: 'bg-success',
        5: 'bg-warning text-dark'
    };

    return levelClasses[level] || 'bg-secondary';
}

/**
 * Obtiene el texto para el nivel de madurez de una solución
 * @param {number} level - Nivel de madurez (1-5)
 * @returns {string} - Texto descriptivo
 */
function getLevelText(level) {
    const levelTexts = {
        1: 'Nivel 1: Idea',
        2: 'Nivel 2: Prototipo',
        3: 'Nivel 3: Beta',
        4: 'Nivel 4: Producción',
        5: 'Nivel 5: Consolidada'
    };

    return levelTexts[level] || 'Nivel desconocido';
}
