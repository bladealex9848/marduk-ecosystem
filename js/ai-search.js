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
    console.log('Inicializando elementos del DOM para la búsqueda inteligente');

    // Elementos principales
    searchInput = document.getElementById('solutionSearch');
    searchButton = document.querySelector('.search-button');

    console.log('Elementos principales:');
    console.log('- searchInput:', searchInput ? 'encontrado' : 'no encontrado');
    console.log('- searchButton:', searchButton ? 'encontrado' : 'no encontrado');

    // Si no se encuentra el botón de búsqueda, crearlo
    if (!searchButton && searchInput) {
        console.log('Creando botón de búsqueda');
        searchButton = document.createElement('button');
        searchButton.className = 'btn position-absolute top-50 end-0 translate-middle-y me-3 search-button';
        searchButton.innerHTML = '<i class="fa-solid fa-search text-white"></i>';
        searchInput.parentNode.appendChild(searchButton);
    }

    // Crear contenedor de resultados si no existe
    if (!document.getElementById('searchResults')) {
        console.log('Creando contenedor de resultados');
        searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.className = 'search-results-container mt-3';

        if (searchInput && searchInput.parentNode) {
            const parentDiv = searchInput.parentNode.parentNode;
            parentDiv.appendChild(searchResults);
        } else {
            // Si no se encuentra el input, insertar al principio de la página
            const mainContent = document.querySelector('main') || document.body;
            mainContent.insertBefore(searchResults, mainContent.firstChild);
        }
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
    console.log('Configurando eventos para la búsqueda inteligente');

    // Evento de búsqueda al hacer clic en el botón
    if (searchButton) {
        console.log('Botón de búsqueda encontrado, configurando evento de clic');
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón de búsqueda clickeado');
            handleSearch();
        });
    } else {
        console.warn('Botón de búsqueda no encontrado');
    }

    // Evento de búsqueda al presionar Enter en el input
    if (searchInput) {
        console.log('Input de búsqueda encontrado, configurando evento de tecla');
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Tecla Enter presionada en el input de búsqueda');
                handleSearch();
            }
        });
    } else {
        console.warn('Input de búsqueda no encontrado');
    }

    // Evento para configurar API key al hacer clic en el indicador
    if (aiStatusIndicator) {
        console.log('Indicador de estado de IA encontrado, configurando evento de clic');
        aiStatusIndicator.addEventListener('click', function() {
            if (!aiSearchEnabled) {
                showApiKeyConfigModal();
            }
        });
    } else {
        console.warn('Indicador de estado de IA no encontrado');
    }

    // Agregar evento global para la búsqueda
    console.log('Configurando evento global para la búsqueda');
    window.performAiSearch = function(query) {
        if (searchInput) {
            searchInput.value = query;
        }
        handleSearch();
    };
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

        // Si hay resultados, mostrarlos o navegar directamente
        if (results.length > 0) {
            console.log(`Se encontraron ${results.length} resultados para "${query}"`);

            // Si solo hay un resultado, navegar directamente a él
            if (results.length === 1) {
                const result = results[0];
                console.log('Navegando directamente al único resultado:', result);

                if (result.type === 'solution') {
                    // Navegar a la solución
                    const appId = result.solution.id;
                    console.log(`Navegando a la solución con ID: ${appId}`);

                    // Usar la función global showAppDetail si está disponible
                    if (window.showAppDetail && typeof window.showAppDetail === 'function') {
                        console.log('Usando función global showAppDetail');
                        window.showAppDetail(appId);
                    } else {
                        // Redirigir a la página de la solución
                        const url = `solutions.html?app=${appId}`;
                        console.log(`Redirigiendo a: ${url}`);
                        window.location.href = url;
                    }
                } else if (result.type === 'forum') {
                    // Navegar al foro
                    const url = `discussions.html?category=${result.categoryId}&id=${result.forum.id}`;
                    console.log(`Redirigiendo a: ${url}`);
                    window.location.href = url;
                }
            } else {
                // Si hay más de un resultado, mostrar la lista
                showSearchResults(results, query);
            }

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
        console.warn('No hay datos de sitemap disponibles para la búsqueda');
        return [];
    }

    const results = [];
    const queryLower = query.toLowerCase().trim();
    console.log(`Buscando "${queryLower}" en el sitemap...`);

    // Dividir la consulta en palabras clave para búsqueda más flexible
    const keywords = queryLower.split(/\s+/).filter(word => word.length > 2);
    console.log(`Palabras clave para búsqueda: ${keywords.join(', ')}`);

    // Buscar en las soluciones
    const solutionsSection = sitemapData.mainSections.find(section => section.id === 'solutions');
    if (solutionsSection && solutionsSection.subsections) {
        console.log(`Buscando en ${solutionsSection.subsections.length} categorías de soluciones`);

        // Primero buscar coincidencias exactas en el nombre
        const exactMatches = [];

        solutionsSection.subsections.forEach(category => {
            if (category.solutions) {
                category.solutions.forEach(solution => {
                    // Verificar si hay una coincidencia exacta en el nombre
                    if (solution.name.toLowerCase() === queryLower) {
                        console.log(`Coincidencia exacta encontrada: ${solution.name}`);
                        exactMatches.push({
                            type: 'solution',
                            category: category.name,
                            categoryId: category.id,
                            solution: solution,
                            exactMatch: true
                        });
                    }
                });
            }
        });

        // Si hay coincidencias exactas, devolver solo esas
        if (exactMatches.length > 0) {
            console.log(`Se encontraron ${exactMatches.length} coincidencias exactas`);
            return exactMatches;
        }

        // Si no hay coincidencias exactas, buscar coincidencias parciales
        solutionsSection.subsections.forEach(category => {
            if (category.solutions) {
                category.solutions.forEach(solution => {
                    // Verificar si la solución coincide con la consulta
                    let matchFound = false;
                    let matchScore = 0;
                    let matchDetails = [];

                    const solutionName = solution.name.toLowerCase();
                    const solutionDesc = solution.description.toLowerCase();
                    const solutionFullDesc = solution.fullDescription ? solution.fullDescription.toLowerCase() : '';
                    const solutionFeatures = solution.features ? solution.features.map(f => f.toLowerCase()) : [];
                    const solutionTags = solution.tags ? solution.tags.map(t => t.toLowerCase()) : [];

                    // Buscar coincidencia exacta de la consulta completa
                    // Buscar en el nombre (mayor prioridad)
                    if (solutionName.includes(queryLower)) {
                        matchFound = true;
                        matchScore += 10;
                        matchDetails.push('nombre');
                    }

                    // Buscar en la descripción corta
                    if (solutionDesc.includes(queryLower)) {
                        matchFound = true;
                        matchScore += 5;
                        matchDetails.push('descripción');
                    }

                    // Buscar en la descripción completa (si existe)
                    if (solutionFullDesc && solutionFullDesc.includes(queryLower)) {
                        matchFound = true;
                        matchScore += 8;
                        matchDetails.push('descripción completa');
                    }

                    // Buscar en las características (si existen)
                    if (solutionFeatures.some(feature => feature.includes(queryLower))) {
                        matchFound = true;
                        matchScore += 7;
                        matchDetails.push('características');
                    }

                    // Buscar en las etiquetas (si existen)
                    if (solutionTags.some(tag => tag.includes(queryLower))) {
                        matchFound = true;
                        matchScore += 6;
                        matchDetails.push('etiquetas');
                    }

                    // Si no se encontró coincidencia exacta, buscar por palabras clave
                    if (!matchFound && keywords.length > 0) {
                        // Contar cuántas palabras clave coinciden en cada campo
                        let nameMatches = 0;
                        let descMatches = 0;
                        let fullDescMatches = 0;
                        let featureMatches = 0;
                        let tagMatches = 0;

                        // Verificar coincidencias en el nombre
                        keywords.forEach(keyword => {
                            if (solutionName.includes(keyword)) nameMatches++;
                        });

                        // Verificar coincidencias en la descripción
                        keywords.forEach(keyword => {
                            if (solutionDesc.includes(keyword)) descMatches++;
                        });

                        // Verificar coincidencias en la descripción completa
                        if (solutionFullDesc) {
                            keywords.forEach(keyword => {
                                if (solutionFullDesc.includes(keyword)) fullDescMatches++;
                            });
                        }

                        // Verificar coincidencias en las características
                        if (solutionFeatures.length > 0) {
                            keywords.forEach(keyword => {
                                if (solutionFeatures.some(feature => feature.includes(keyword))) featureMatches++;
                            });
                        }

                        // Verificar coincidencias en las etiquetas
                        if (solutionTags.length > 0) {
                            keywords.forEach(keyword => {
                                if (solutionTags.some(tag => tag.includes(keyword))) tagMatches++;
                            });
                        }

                        // Calcular puntuación basada en coincidencias de palabras clave
                        const keywordMatchScore = (nameMatches * 10 + descMatches * 5 + fullDescMatches * 8 + featureMatches * 7 + tagMatches * 6) / keywords.length;

                        // Si hay suficientes coincidencias de palabras clave, considerar como coincidencia
                        if (keywordMatchScore > 0) {
                            matchFound = true;
                            matchScore = keywordMatchScore;

                            // Agregar detalles de dónde se encontraron las coincidencias
                            if (nameMatches > 0) matchDetails.push(`nombre (${nameMatches}/${keywords.length})`);
                            if (descMatches > 0) matchDetails.push(`descripción (${descMatches}/${keywords.length})`);
                            if (fullDescMatches > 0) matchDetails.push(`descripción completa (${fullDescMatches}/${keywords.length})`);
                            if (featureMatches > 0) matchDetails.push(`características (${featureMatches}/${keywords.length})`);
                            if (tagMatches > 0) matchDetails.push(`etiquetas (${tagMatches}/${keywords.length})`);
                        }
                    }

                    // Si se encontró alguna coincidencia, agregar a los resultados
                    if (matchFound) {
                        console.log(`Coincidencia parcial encontrada en ${solution.name} (puntuación: ${matchScore}, detalles: ${matchDetails.join(', ')})`);
                        results.push({
                            type: 'solution',
                            category: category.name,
                            categoryId: category.id,
                            solution: solution,
                            matchScore: matchScore,
                            matchDetails: matchDetails
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

    // Ordenar resultados por puntuación de coincidencia (de mayor a menor)
    results.sort((a, b) => {
        // Si ambos tienen puntuación, ordenar por puntuación
        if (a.matchScore && b.matchScore) {
            return b.matchScore - a.matchScore;
        }
        // Si solo uno tiene puntuación, ese va primero
        if (a.matchScore) return -1;
        if (b.matchScore) return 1;
        // Si ninguno tiene puntuación, mantener el orden original
        return 0;
    });

    console.log(`Se encontraron ${results.length} resultados ordenados por relevancia`);

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
            // Usar el formato correcto de URL para las soluciones
            resultItem.href = `solutions.html?app=${result.solution.id}`;

            // Determinar el nivel de la solución
            const levelClass = getLevelClass(result.solution.level);
            const levelText = getLevelText(result.solution.level);

            // Preparar información de coincidencia si existe
            let matchInfo = '';
            if (result.matchScore && result.matchDetails) {
                matchInfo = `
                    <div class="match-info mt-1">
                        <small class="text-success">Coincidencia en: ${result.matchDetails.join(', ')}</small>
                    </div>
                `;
            }

            resultItem.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="flex-shrink-0 me-3">
                        <span class="badge ${levelClass}">${levelText}</span>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${result.solution.name}</h6>
                        <p class="mb-1 small text-muted">${result.solution.description}</p>
                        <div class="d-flex align-items-center small">
                            <span class="text-muted me-2">${result.category}</span>
                            <span class="badge bg-secondary me-2">${result.solution.type}</span>
                            ${result.matchScore ? `<span class="badge bg-success">Relevancia: ${Math.round(Math.min(100, result.matchScore * 10))}%</span>` : ''}
                        </div>
                        ${matchInfo}
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

    // Si no hay resultados, mostrar mensaje
    if (solutionResults.length === 0 && forumResults.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results p-4 text-center';
        noResultsDiv.innerHTML = `
            <p class="mb-3">No se encontraron resultados para "${query}"</p>
        `;
        resultsList.appendChild(noResultsDiv);
    }

    // Siempre mostrar opción para generar con IA si está habilitada
    if (aiSearchEnabled) {
        const aiSuggestion = document.createElement('div');
        aiSuggestion.className = 'ai-suggestion p-3 border rounded mt-3 mb-3';

        // Personalizar mensaje según si hay resultados o no
        const message = (solutionResults.length === 0 && forumResults.length === 0) ?
            `No encontramos soluciones existentes. ¿Quieres generar una nueva solución con IA?` :
            `¿No encuentras lo que buscas? Puedes generar una nueva solución personalizada con IA.`;

        aiSuggestion.innerHTML = `
            <h6 class="mb-2"><i class="fas fa-robot me-2"></i>Generar solución con IA</h6>
            <p class="small mb-3">${message}</p>
            <button class="btn btn-primary generate-solution-btn">Generar solución personalizada</button>
        `;

        // Agregar evento de clic
        aiSuggestion.querySelector('.generate-solution-btn').addEventListener('click', function() {
            searchResults.classList.add('d-none');
            generateSolutionWithAI(query);
        });

        resultsList.appendChild(aiSuggestion);
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
        console.log('Generando solución para la consulta:', query);
        const solution = await generateSolutionContent(query);

        // Verificar si la solución es válida
        if (!solution || !solution.name || !solution.description) {
            console.error('La solución generada no es válida:', solution);
            throw new Error('La solución generada no es válida');
        }

        console.log('Solución generada correctamente:', solution);

        // Asegurarse de que la categoría sea válida
        if (!solution.category || solution.category.includes('Una de estas categorías:')) {
            console.log('Corrigiendo categoría inválida:', solution.category);
            solution.category = 'ai-tools'; // Categoría por defecto
        }

        // Crear ID único para la solución
        const solutionId = 'ai-' + Date.now();

        // Guardar la solución en localStorage
        const solutionKey = `ai-solution-${solutionId}`;
        const solutionJson = JSON.stringify(solution);

        console.log(`Guardando solución en localStorage con clave: ${solutionKey}`);
        localStorage.setItem(solutionKey, solutionJson);

        // Verificar que se guardó correctamente
        const savedSolution = localStorage.getItem(solutionKey);
        if (!savedSolution) {
            console.error('Error: No se pudo guardar la solución en localStorage');
            throw new Error('No se pudo guardar la solución generada');
        }

        // Mostrar mensaje de éxito
        showToast('Solución generada correctamente', 'success');

        // Redirigir a la página de la solución generada
        console.log('Redirigiendo a la página de la solución generada...');

        // Usar la función global de solutions.js si está disponible
        if (window.showAiGeneratedSolution) {
            console.log('Usando función global showAiGeneratedSolution');
            window.showAiGeneratedSolution(solutionId);
        } else {
            // Redirigir a la página de la solución generada
            navigateToGeneratedSolution(solutionId, solution);
        }
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
                // Verificar si el servicio global está en modo de demostración
                if (window.openRouterService.isDemoMode && window.openRouterService.isDemoMode()) {
                    console.log('Servicio global en modo de demostración, intentando usar API key directamente');
                    // Si está en modo demo pero tenemos una API key, usar solicitud directa
                    if (apiKey && apiKey !== 'using-global-service' && apiKey !== 'demo' && apiKey !== 'DEMO_MODE') {
                        return await makeDirectApiRequest(prompt, apiKey, AI_MODEL);
                    }
                }

                // Usar el servicio global
                const completion = await window.openRouterService.generateCompletion(prompt, AI_MODEL);
                console.log('Respuesta recibida del servicio global de OpenRouter');

                // Extraer el JSON de la respuesta
                const jsonMatch = completion.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error('No se pudo extraer el JSON de la respuesta');
                }

                // Verificar si es una respuesta de demostración
                const solution = JSON.parse(jsonMatch[0]);
                if (solution.name === 'Nombre de la solución' && solution.description === 'Descripción breve de la solución (máximo 2 líneas)') {
                    console.log('Respuesta de demostración detectada, generando solución personalizada');
                    return generateDemoSolution(query);
                }

                return solution;
            } catch (error) {
                console.error('Error al usar el servicio global de OpenRouter:', error);

                // Si hay un error con el servicio global pero tenemos una API key, intentar solicitud directa
                if (apiKey && apiKey !== 'using-global-service' && apiKey !== 'demo' && apiKey !== 'DEMO_MODE') {
                    console.log('Intentando solicitud directa después de error en servicio global');
                    return await makeDirectApiRequest(prompt, apiKey, AI_MODEL);
                }

                // Si no tenemos API key válida, generar una solución de demostración personalizada
                console.log('Generando solución de demostración personalizada');
                return generateDemoSolution(query);
            }
        } else {
            console.log('Usando solicitud directa a la API de OpenRouter');
            // Hacer solicitud directa a la API de OpenRouter
            return await makeDirectApiRequest(prompt, apiKey, AI_MODEL);
        }
    } catch (error) {
        console.error('Error al generar contenido con IA:', error);
        throw new Error('Error al generar contenido: ' + error.message);
    }
}

/**
 * Realiza una solicitud directa a la API de OpenRouter
 * @param {string} prompt - Prompt para la IA
 * @param {string} apiKey - API key de OpenRouter
 * @param {string} model - Modelo de IA a utilizar
 * @returns {Object} - Solución generada
 */
async function makeDirectApiRequest(prompt, apiKey, model) {
    console.log('Realizando solicitud directa a la API de OpenRouter');
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Marduk Ecosystem'
            },
            body: JSON.stringify({
                model: model,
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
    } catch (error) {
        console.error('Error en solicitud directa a OpenRouter:', error);
        // Si hay un error con la solicitud directa, generar una solución de demostración personalizada
        return generateDemoSolution(prompt.split('"')[1]); // Extraer la consulta del prompt
    }
}

/**
 * Genera una solución personalizada basada en la consulta utilizando el modelo de IA
 * @param {string} query - Consulta del usuario
 * @returns {Object} - Solución generada
 */
async function generateDemoSolution(query) {
    console.log('Generando solución personalizada para:', query);

    try {
        // Intentar usar el servicio global de OpenRouter para generar una solución más personalizada
        if (window.openRouterService && typeof window.openRouterService.generateCompletion === 'function') {
            // Crear un prompt más específico para generar una solución coherente
            const prompt = `
Actúa como un experto en innovación judicial y tecnología legal. Necesito que diseñes una solución tecnológica detallada y coherente para el siguiente problema o necesidad:

"${query}"

Analiza la consulta en profundidad y genera una solución innovadora y realista que pueda implementarse en el ámbito judicial. Considera aspectos técnicos, legales y prácticos.

Responde en formato JSON con la siguiente estructura:
{
  "name": "[Nombre creativo y profesional para la solución, no más de 50 caracteres]",
  "description": "[Descripción concisa de la solución en 1-2 líneas]",
  "category": "[Una de estas categorías: case-management, legal-research, document-automation, ai-tools, access-justice, legal-education]",
  "level": 1,
  "type": "community",
  "tags": ["[5 etiquetas relevantes relacionadas con la solución]"],
  "fullDescription": "[Descripción detallada de la solución en 3-5 párrafos, explicando cómo funciona y qué problemas resuelve]",
  "features": ["[5 características específicas y detalladas de la solución]"],
  "benefits": ["[4 beneficios concretos que aporta la solución al sistema judicial]"],
  "useCases": ["[3 casos de uso específicos donde la solución sería útil]"],
  "implementation": "[Descripción de cómo se implementaría esta solución en 2-3 párrafos, incluyendo tecnologías específicas y fases de desarrollo]"
}

Asegúrate de que todos los campos sean coherentes entre sí y estén directamente relacionados con la consulta original. La solución debe ser innovadora pero realista, considerando las tecnologías actuales disponibles.
`;

            try {
                console.log('Intentando generar solución personalizada con el servicio de OpenRouter');
                const completion = await window.openRouterService.generateCompletion(prompt, AI_MODEL);

                // Extraer el JSON de la respuesta
                const jsonMatch = completion.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        const solution = JSON.parse(jsonMatch[0]);

                        // Verificar si es una respuesta de plantilla
                        if (solution.name === 'Nombre de la solución' ||
                            solution.name.includes('[Nombre') ||
                            solution.description.includes('[Descripción')) {
                            console.log('Respuesta de plantilla detectada, usando generación de respaldo');
                            return generateFallbackSolution(query);
                        }

                        // Asegurarse de que la categoría sea válida
                        const validCategories = ['case-management', 'legal-research', 'document-automation', 'ai-tools', 'access-justice', 'legal-education'];
                        if (!validCategories.includes(solution.category)) {
                            solution.category = determineCategory(query);
                        }

                        // Asegurarse de que el nivel sea válido
                        solution.level = 1; // Siempre nivel 1 (Idea) para soluciones generadas

                        // Limpiar y validar etiquetas
                        if (!solution.tags || !Array.isArray(solution.tags) || solution.tags.length === 0) {
                            solution.tags = generateTags(query, solution.category);
                        } else {
                            // Eliminar corchetes y comillas si existen
                            solution.tags = solution.tags.map(tag => {
                                if (typeof tag === 'string') {
                                    return tag.replace(/[\[\]"']/g, '').trim();
                                }
                                return tag;
                            }).filter(tag => tag && tag.length > 0);
                        }

                        console.log('Solución personalizada generada correctamente:', solution);
                        return solution;
                    } catch (parseError) {
                        console.error('Error al parsear JSON de la respuesta:', parseError);
                    }
                }
            } catch (error) {
                console.error('Error al generar solución personalizada con OpenRouter:', error);
            }
        }
    } catch (error) {
        console.error('Error en generación de solución personalizada:', error);
    }

    // Si llegamos aquí, usar la generación de respaldo
    return generateFallbackSolution(query);
}

/**
 * Genera una solución de respaldo cuando no se puede usar el modelo de IA
 * @param {string} query - Consulta del usuario
 * @returns {Object} - Solución generada
 */
function generateFallbackSolution(query) {
    console.log('Generando solución de respaldo para:', query);

    // Determinar categoría basada en palabras clave
    const category = determineCategory(query);

    // Generar nombre basado en la consulta
    let name = generateName(query);

    // Generar descripción basada en la consulta
    let description = generateDescription(query);

    // Generar etiquetas basadas en palabras clave
    const uniqueTags = generateTags(query, category);

    // Generar características basadas en la categoría y la consulta
    const features = generateFeatures(query, category);

    // Generar beneficios basados en la categoría
    const benefits = generateBenefits(category);

    // Generar casos de uso basados en la consulta y categoría
    const useCases = generateUseCases(query, category);

    // Generar descripción completa
    const fullDescription = generateFullDescription(query, category);

    // Generar implementación
    const implementation = generateImplementation(query, category);

    return {
        name: name,
        description: description,
        category: category,
        level: 1, // Nivel 1: Idea
        type: 'community',
        tags: uniqueTags,
        fullDescription: fullDescription,
        features: features,
        benefits: benefits,
        useCases: useCases,
        implementation: implementation
    };
}

/**
 * Genera un nombre creativo para la solución basado en la consulta
 * @param {string} query - Consulta del usuario
 * @returns {string} - Nombre generado
 */
function generateName(query) {
    console.log('Generando nombre para:', query);

    // Extraer palabras clave de la consulta
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);

    // Prefijos según el tipo de solución
    const prefixes = [
        'Sistema', 'Plataforma', 'Herramienta', 'Asistente', 'Solución',
        'LegalTech', 'JurisTech', 'JusticeTech', 'LexTech', 'JudicialTech'
    ];

    // Sufijos para complementar el nombre
    const suffixes = [
        'Judicial', 'Legal', 'Jurídico', 'Inteligente', 'Digital',
        'Pro', 'Plus', 'AI', 'Smart', 'Connect'
    ];

    // Si la consulta es muy corta o no tiene palabras clave significativas
    if (keywords.length < 2 || query.length < 10) {
        // Generar un nombre genérico pero profesional
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return `${randomPrefix} ${randomSuffix}`;
    }

    // Intentar extraer sustantivos y verbos importantes (palabras más largas)
    const importantWords = keywords.filter(word => word.length > 4)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .slice(0, 3); // Tomar hasta 3 palabras importantes

    // Si tenemos palabras importantes, crear un nombre basado en ellas
    if (importantWords.length > 0) {
        // Elegir un prefijo aleatorio si hay pocas palabras importantes
        if (importantWords.length === 1) {
            const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            return `${randomPrefix} ${importantWords[0]}`;
        }

        // Combinar palabras importantes
        const combinedName = importantWords.join(' ');

        // Limitar longitud
        if (combinedName.length > 40) {
            return combinedName.substring(0, 37) + '...';
        }

        return combinedName;
    }

    // Si no se pudo generar un nombre basado en palabras importantes
    // Tomar las primeras palabras de la consulta y capitalizarlas
    const simpleName = query.split(' ')
        .slice(0, 4) // Tomar hasta 4 palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Limitar longitud
    if (simpleName.length > 40) {
        return simpleName.substring(0, 37) + '...';
    }

    return simpleName;
}

/**
 * Determina la categoría más adecuada basada en palabras clave
 * @param {string} query - Consulta del usuario
 * @returns {string} - Categoría determinada
 */
function determineCategory(query) {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(word => word.length > 2);

    // Mapeo de palabras clave a categorías con pesos
    const categoryKeywords = {
        'case-management': ['caso', 'casos', 'expediente', 'expedientes', 'seguimiento', 'gestión', 'administración', 'workflow', 'flujo', 'proceso', 'procesos', 'trámite', 'trámites'],
        'legal-research': ['investigación', 'buscar', 'búsqueda', 'jurídico', 'legal', 'jurisprudencia', 'doctrina', 'normativa', 'leyes', 'sentencias', 'precedentes', 'análisis'],
        'document-automation': ['documento', 'documentos', 'automatización', 'plantilla', 'plantillas', 'generación', 'redacción', 'formulario', 'formularios', 'contrato', 'contratos', 'escrito', 'escritos'],
        'ai-tools': ['ia', 'inteligencia', 'artificial', 'machine', 'learning', 'agente', 'agentes', 'orquestación', 'predicción', 'automático', 'automática', 'algoritmo', 'algoritmos', 'modelo', 'modelos', 'asistente', 'asistentes', 'chatbot', 'robot'],
        'access-justice': ['acceso', 'justicia', 'ciudadano', 'ciudadanos', 'público', 'transparencia', 'inclusión', 'inclusivo', 'accesible', 'accesibilidad', 'derecho', 'derechos', 'servicio', 'servicios'],
        'legal-education': ['educación', 'aprendizaje', 'formación', 'capacitación', 'enseñanza', 'curso', 'cursos', 'entrenamiento', 'conocimiento', 'conocimientos', 'habilidad', 'habilidades', 'competencia', 'competencias']
    };

    // Contar coincidencias por categoría
    const categoryCounts = {};
    Object.keys(categoryKeywords).forEach(category => {
        categoryCounts[category] = 0;

        // Buscar coincidencias exactas de palabras clave
        keywords.forEach(keyword => {
            if (categoryKeywords[category].includes(keyword)) {
                categoryCounts[category] += 2; // Mayor peso para coincidencias exactas
            }
        });

        // Buscar coincidencias parciales en la consulta completa
        categoryKeywords[category].forEach(categoryKeyword => {
            if (queryLower.includes(categoryKeyword)) {
                categoryCounts[category] += 1;
            }
        });
    });

    // Encontrar la categoría con más coincidencias
    let maxCount = 0;
    let selectedCategory = 'ai-tools'; // Categoría por defecto

    Object.keys(categoryCounts).forEach(category => {
        if (categoryCounts[category] > maxCount) {
            maxCount = categoryCounts[category];
            selectedCategory = category;
        }
    });

    console.log('Categoría determinada:', selectedCategory, 'con puntuación:', maxCount);
    return selectedCategory;
}

/**
 * Genera una descripción concisa para la solución
 * @param {string} query - Consulta del usuario
 * @returns {string} - Descripción generada
 */
function generateDescription(query) {
    console.log('Generando descripción para:', query);

    // Plantillas de descripciones según el tipo de consulta
    const templates = [
        `Solución tecnológica que permite ${query.toLowerCase()}`,
        `Herramienta judicial diseñada para ${query.toLowerCase()}`,
        `Sistema inteligente que facilita ${query.toLowerCase()}`,
        `Plataforma especializada en ${query.toLowerCase()}`,
        `Asistente digital para ${query.toLowerCase()} en el ámbito judicial`
    ];

    // Seleccionar una plantilla aleatoria
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Limitar longitud
    if (template.length > 100) {
        return template.substring(0, 97) + '...';
    }

    return template;
}

/**
 * Genera etiquetas relevantes para la solución
 * @param {string} query - Consulta del usuario
 * @param {string} category - Categoría de la solución
 * @returns {Array} - Lista de etiquetas
 */
function generateTags(query, category) {
    console.log('Generando etiquetas para:', query, 'en categoría:', category);

    // Extraer palabras clave de la consulta
    const keywords = query.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['para', 'como', 'donde', 'cuando', 'porque', 'aunque', 'desde', 'hasta', 'entre', 'sobre', 'bajo', 'tras', 'mediante', 'durante', 'según', 'contra', 'hacia'].includes(word));

    // Etiquetas por defecto según la categoría
    const categoryTags = {
        'case-management': ['gestión', 'casos', 'expedientes', 'workflow', 'seguimiento'],
        'legal-research': ['investigación', 'jurídica', 'búsqueda', 'análisis', 'legal'],
        'document-automation': ['documentos', 'automatización', 'plantillas', 'generación', 'formularios'],
        'ai-tools': ['inteligencia artificial', 'automatización', 'asistencia', 'predicción', 'análisis'],
        'access-justice': ['acceso', 'justicia', 'ciudadanos', 'transparencia', 'derechos'],
        'legal-education': ['educación', 'formación', 'capacitación', 'aprendizaje', 'conocimiento']
    };

    // Combinar palabras clave de la consulta con etiquetas de la categoría
    const allTags = [...keywords, ...categoryTags[category] || categoryTags['ai-tools']];

    // Eliminar duplicados y limitar a 5 etiquetas
    const uniqueTags = [...new Set(allTags)].slice(0, 5);

    return uniqueTags;
}

/**
 * Genera características específicas para la solución
 * @param {string} query - Consulta del usuario
 * @param {string} category - Categoría de la solución
 * @returns {Array} - Lista de características
 */
function generateFeatures(query, category) {
    console.log('Generando características para:', query, 'en categoría:', category);

    // Características comunes a todas las soluciones
    const commonFeatures = [
        'Interfaz intuitiva y fácil de usar',
        'Integración con sistemas judiciales existentes',
        'Seguridad y confidencialidad de la información',
        'Adaptabilidad a diferentes contextos judiciales',
        'Actualizaciones automáticas de contenido y funcionalidades'
    ];

    // Características específicas por categoría
    const categoryFeatures = {
        'case-management': [
            'Seguimiento en tiempo real del estado de los casos',
            'Gestión integral de expedientes digitales',
            'Notificaciones automáticas de cambios y plazos',
            'Calendario integrado de audiencias y vencimientos',
            'Asignación inteligente de tareas y recursos'
        ],
        'legal-research': [
            'Búsqueda avanzada en bases de datos jurídicas',
            'Análisis semántico de jurisprudencia y doctrina',
            'Recomendaciones personalizadas de precedentes relevantes',
            'Visualización de relaciones entre normativas y casos',
            'Alertas sobre cambios en la legislación aplicable'
        ],
        'document-automation': [
            'Generación automática de documentos legales',
            'Plantillas personalizables para diferentes tipos de escritos',
            'Control de versiones y trazabilidad de cambios',
            'Firma digital integrada con validez legal',
            'Extracción inteligente de datos de documentos escaneados'
        ],
        'ai-tools': [
            'Asistente virtual con capacidades de lenguaje natural',
            'Predicción de resultados basada en casos similares',
            'Análisis automático de documentos legales complejos',
            'Detección de patrones y anomalías en grandes volúmenes de datos',
            'Orquestación de agentes especializados para tareas complejas'
        ],
        'access-justice': [
            'Portal ciudadano para consulta de trámites judiciales',
            'Asistente virtual para orientación jurídica básica',
            'Formularios inteligentes para presentaciones sin abogado',
            'Traducción automática de términos legales a lenguaje sencillo',
            'Accesibilidad para personas con discapacidad'
        ],
        'legal-education': [
            'Contenido formativo interactivo y multimedia',
            'Simulaciones de casos prácticos y audiencias virtuales',
            'Evaluación continua de conocimientos y competencias',
            'Certificaciones digitales de habilidades adquiridas',
            'Comunidad de aprendizaje colaborativo'
        ]
    };

    // Seleccionar características específicas de la categoría
    const specificFeatures = categoryFeatures[category] || categoryFeatures['ai-tools'];

    // Crear una característica personalizada basada en la consulta
    const customFeature = `Funcionalidad especializada para ${query.toLowerCase()}`;

    // Combinar características (1 personalizada, 2 específicas, 2 comunes)
    const features = [
        customFeature,
        ...specificFeatures.slice(0, 2),
        ...commonFeatures.slice(0, 2)
    ];

    return features;
}

/**
 * Genera beneficios concretos de la solución
 * @param {string} category - Categoría de la solución
 * @returns {Array} - Lista de beneficios
 */
function generateBenefits(category) {
    console.log('Generando beneficios para categoría:', category);

    // Beneficios comunes a todas las soluciones
    const commonBenefits = [
        'Mejora de la eficiencia en procesos judiciales',
        'Reducción de tiempos y costos operativos',
        'Mayor precisión y calidad en el trabajo judicial',
        'Acceso más fácil a la información relevante'
    ];

    // Beneficios específicos por categoría
    const categoryBenefits = {
        'case-management': [
            'Reducción del 40% en tiempos de gestión de expedientes',
            'Eliminación de pérdidas de documentación física',
            'Mejora en la coordinación entre diferentes órganos judiciales',
            'Transparencia total en el seguimiento de casos'
        ],
        'legal-research': [
            'Reducción del 60% en tiempo de investigación jurídica',
            'Mayor exhaustividad en la búsqueda de precedentes',
            'Fundamentación más sólida de decisiones judiciales',
            'Actualización constante sobre cambios normativos'
        ],
        'document-automation': [
            'Reducción del 70% en tiempo de redacción de documentos',
            'Eliminación de errores comunes en escritos judiciales',
            'Estandarización de formatos y contenidos',
            'Trazabilidad completa de versiones y modificaciones'
        ],
        'ai-tools': [
            'Capacidad de procesar grandes volúmenes de información',
            'Identificación de patrones no evidentes para humanos',
            'Asistencia continua 24/7 sin fatiga ni sesgos',
            'Mejora continua mediante aprendizaje automático'
        ],
        'access-justice': [
            'Democratización del acceso a servicios judiciales',
            'Reducción de barreras para poblaciones vulnerables',
            'Mayor confianza ciudadana en el sistema judicial',
            'Descongestión de servicios de atención presencial'
        ],
        'legal-education': [
            'Formación práctica basada en casos reales',
            'Actualización continua de conocimientos jurídicos',
            'Desarrollo de habilidades prácticas para profesionales',
            'Estandarización de criterios y buenas prácticas'
        ]
    };

    // Seleccionar beneficios específicos de la categoría o usar los comunes si no hay específicos
    return categoryBenefits[category] || commonBenefits;
}

/**
 * Genera casos de uso específicos para la solución
 * @param {string} query - Consulta del usuario
 * @param {string} category - Categoría de la solución
 * @returns {Array} - Lista de casos de uso
 */
function generateUseCases(query, category) {
    console.log('Generando casos de uso para:', query, 'en categoría:', category);

    // Casos de uso genéricos por categoría
    const categoryCases = {
        'case-management': [
            'Gestión integral de expedientes en juzgados civiles',
            'Seguimiento de causas penales con múltiples imputados',
            'Coordinación entre diferentes instancias judiciales'
        ],
        'legal-research': [
            'Investigación jurídica para casos complejos de derecho mercantil',
            'Búsqueda de jurisprudencia en materia constitucional',
            'Análisis comparativo de normativa internacional'
        ],
        'document-automation': [
            'Generación automática de contratos personalizados',
            'Creación de escritos judiciales estandarizados',
            'Digitalización y procesamiento de expedientes históricos'
        ],
        'ai-tools': [
            'Asistencia en la toma de decisiones judiciales complejas',
            'Predicción de resultados en litigios basada en casos similares',
            'Análisis automático de grandes volúmenes de evidencia'
        ],
        'access-justice': [
            'Acceso a servicios judiciales para comunidades rurales',
            'Asistencia jurídica básica para personas sin recursos',
            'Orientación ciudadana sobre trámites judiciales comunes'
        ],
        'legal-education': [
            'Formación continua para jueces y magistrados',
            'Capacitación práctica para estudiantes de derecho',
            'Actualización profesional en nuevas áreas jurídicas'
        ]
    };

    // Seleccionar casos de uso de la categoría
    const genericCases = categoryCases[category] || categoryCases['ai-tools'];

    // Crear un caso de uso personalizado basado en la consulta
    const customCase = `Aplicación específica para ${query.toLowerCase()}`;

    // Combinar casos de uso (1 personalizado, 2 genéricos)
    return [customCase, ...genericCases.slice(0, 2)];
}

/**
 * Genera una descripción detallada de la solución
 * @param {string} query - Consulta del usuario
 * @param {string} category - Categoría de la solución
 * @returns {string} - Descripción completa
 */
function generateFullDescription(query, category) {
    console.log('Generando descripción completa para:', query, 'en categoría:', category);

    // Plantillas de párrafos iniciales según la categoría
    const firstParagraphTemplates = {
        'case-management': `Esta solución ofrece un sistema integral para la gestión y seguimiento de ${query.toLowerCase()} en el ámbito judicial. Permite administrar de manera eficiente todo el ciclo de vida de los expedientes, desde su creación hasta su archivo definitivo, garantizando la trazabilidad y seguridad de la información en todo momento.`,
        'legal-research': `Esta herramienta especializada facilita la investigación y análisis jurídico relacionado con ${query.toLowerCase()}. Mediante algoritmos avanzados de búsqueda y procesamiento de lenguaje natural, permite acceder rápidamente a jurisprudencia, doctrina y normativa relevante, optimizando significativamente el proceso de investigación legal.`,
        'document-automation': `Esta plataforma revoluciona la creación y gestión de documentos legales relacionados con ${query.toLowerCase()}. Mediante plantillas inteligentes y sistemas de automatización, permite generar documentos jurídicos precisos y personalizados en una fracción del tiempo que requeriría la redacción manual, manteniendo la calidad y rigor necesarios.`,
        'ai-tools': `Esta solución basada en inteligencia artificial está diseñada específicamente para ${query.toLowerCase()} en el contexto judicial. Utilizando algoritmos avanzados de machine learning y procesamiento de lenguaje natural, proporciona capacidades analíticas y predictivas que superan las limitaciones de los métodos tradicionales.`,
        'access-justice': `Esta plataforma democratiza el acceso a la justicia en el ámbito de ${query.toLowerCase()}, eliminando barreras geográficas, económicas y de conocimiento. Mediante una interfaz ciudadana intuitiva y herramientas de asistencia virtual, facilita la interacción con el sistema judicial a personas sin conocimientos jurídicos especializados.`,
        'legal-education': `Este sistema educativo innovador está enfocado en la formación y capacitación sobre ${query.toLowerCase()} para profesionales del ámbito jurídico. Combinando contenidos teóricos actualizados con ejercicios prácticos y simulaciones realistas, proporciona una experiencia de aprendizaje completa y adaptada a las necesidades actuales.`
    };

    // Plantillas de párrafos secundarios comunes
    const secondParagraphTemplates = [
        `La solución incorpora tecnologías de vanguardia como inteligencia artificial, blockchain y computación en la nube para garantizar un rendimiento óptimo incluso en entornos con grandes volúmenes de información. Su arquitectura modular permite una fácil integración con sistemas existentes y una escalabilidad progresiva según las necesidades de cada organización.`,
        `Desarrollada con un enfoque centrado en el usuario, esta herramienta prioriza la experiencia de uso intuitiva y la curva de aprendizaje rápida. Cuenta con interfaces adaptativas que se ajustan a diferentes perfiles de usuario, desde especialistas jurídicos hasta personal administrativo o ciudadanos sin formación legal, garantizando que todos puedan aprovechar sus funcionalidades de manera eficiente.`,
        `La seguridad y confidencialidad de la información son pilares fundamentales de esta solución, implementando estándares internacionales de protección de datos y cumpliendo con normativas como GDPR y regulaciones específicas del sector judicial. Todos los datos son cifrados y se mantiene un registro detallado de accesos y modificaciones para garantizar la integridad de la información.`
    ];

    // Plantillas de párrafos finales
    const finalParagraphTemplates = [
        `En resumen, esta solución representa un avance significativo en la modernización y digitalización del sistema judicial, especialmente en lo relacionado con ${query.toLowerCase()}. Su implementación no solo mejora la eficiencia operativa, sino que contribuye a un sistema de justicia más accesible, transparente y eficaz para todos los actores involucrados.`,
        `Esta herramienta responde a las crecientes demandas de innovación en el sector judicial, ofreciendo una alternativa tecnológica que optimiza recursos, reduce tiempos y mejora la calidad de los servicios relacionados con ${query.toLowerCase()}. Su diseño flexible permite adaptarse a diferentes contextos y escalas, desde pequeños despachos hasta grandes sistemas judiciales nacionales.`,
        `Al integrar esta solución en los procesos relacionados con ${query.toLowerCase()}, las instituciones judiciales pueden dar un salto cualitativo en su capacidad operativa y de servicio. Los beneficios se extienden a todos los participantes del ecosistema judicial: profesionales del derecho, personal administrativo, jueces y magistrados, y especialmente a los ciudadanos que interactúan con el sistema de justicia.`
    ];

    // Seleccionar plantillas aleatorias para cada párrafo
    const firstParagraph = firstParagraphTemplates[category] || firstParagraphTemplates['ai-tools'];
    const secondParagraph = secondParagraphTemplates[Math.floor(Math.random() * secondParagraphTemplates.length)];
    const finalParagraph = finalParagraphTemplates[Math.floor(Math.random() * finalParagraphTemplates.length)];

    // Combinar párrafos en una descripción completa
    return `${firstParagraph}\n\n${secondParagraph}\n\n${finalParagraph}`;
}

/**
 * Genera una descripción de la implementación de la solución
 * @param {string} query - Consulta del usuario
 * @param {string} category - Categoría de la solución
 * @returns {string} - Descripción de implementación
 */
function generateImplementation(query, category) {
    console.log('Generando implementación para:', query, 'en categoría:', category);

    // Plantillas de implementación por categoría
    const implementationTemplates = {
        'case-management': `La implementación de esta solución para ${query.toLowerCase()} se realizaría en fases progresivas, comenzando con un análisis detallado de los flujos de trabajo existentes y la identificación de puntos de mejora. Se desarrollaría una arquitectura basada en microservicios utilizando tecnologías como Java o .NET para el backend, bases de datos SQL Server o PostgreSQL para el almacenamiento, y frameworks modernos como React o Angular para la interfaz de usuario.\n\nEl despliegue se realizaría inicialmente en un entorno piloto con un grupo reducido de usuarios para validar funcionalidades y realizar ajustes. Posteriormente, se extendería a toda la organización, acompañado de un programa de capacitación para los diferentes perfiles de usuario. La migración de datos históricos se realizaría de manera progresiva, asegurando la integridad y consistencia de la información.`,
        'legal-research': `Para implementar esta herramienta de investigación jurídica especializada en ${query.toLowerCase()}, se comenzaría con la construcción de una base de conocimiento estructurada, incorporando fuentes oficiales de jurisprudencia, legislación y doctrina. Se utilizarían tecnologías de procesamiento de lenguaje natural (NLP) como BERT o GPT para el análisis semántico de textos jurídicos, junto con algoritmos de machine learning para mejorar progresivamente la relevancia de los resultados.\n\nLa arquitectura técnica se basaría en servicios cloud como AWS o Azure para garantizar escalabilidad, con Elasticsearch para el motor de búsqueda y Python para los componentes de IA. La interfaz de usuario se desarrollaría como una aplicación web responsive, optimizada tanto para uso en escritorio como en dispositivos móviles, facilitando la consulta desde cualquier ubicación.`,
        'document-automation': `La implementación de este sistema de automatización documental para ${query.toLowerCase()} comenzaría con el diseño de plantillas inteligentes basadas en el análisis de documentos existentes y requisitos legales. Se utilizarían tecnologías como Python con bibliotecas de procesamiento de texto y machine learning para la extracción y clasificación automática de información, junto con sistemas de generación de documentos como DocxTemplater o similares.\n\nEl sistema se integraría con servicios de firma digital que cumplan con los estándares legales aplicables, y se implementarían APIs para permitir la conexión con sistemas de gestión documental existentes. El despliegue se realizaría preferentemente en la nube para facilitar el acceso desde diferentes ubicaciones, con opciones de instalación on-premise para organizaciones con requisitos específicos de seguridad o privacidad.`,
        'ai-tools': `Para implementar esta solución de IA enfocada en ${query.toLowerCase()}, se adoptaría un enfoque de desarrollo iterativo basado en metodologías ágiles. La primera fase consistiría en el entrenamiento de modelos de machine learning utilizando datasets curados de información jurídica relevante, empleando frameworks como TensorFlow o PyTorch para el desarrollo de algoritmos de aprendizaje profundo.\n\nLa arquitectura del sistema se basaría en un diseño de microservicios desplegados en contenedores Docker orquestados con Kubernetes, facilitando la escalabilidad y el mantenimiento. Se implementarían interfaces de programación (APIs) RESTful para permitir la integración con sistemas externos, y se desarrollarían dashboards interactivos utilizando bibliotecas como D3.js para la visualización de resultados y análisis.`,
        'access-justice': `La implementación de esta plataforma de acceso a la justicia para ${query.toLowerCase()} seguiría un enfoque centrado en el usuario, comenzando con investigación de campo para identificar las necesidades reales de los ciudadanos y las barreras existentes. El desarrollo técnico se realizaría con tecnologías web estándar (HTML5, CSS3, JavaScript) priorizando la accesibilidad según pautas WCAG 2.1 y el diseño responsive para funcionar en cualquier dispositivo.\n\nSe implementarían chatbots basados en procesamiento de lenguaje natural para la asistencia inicial, con derivación a profesionales humanos cuando sea necesario. El despliegue se realizaría de manera progresiva, comenzando por regiones piloto y expandiendo gradualmente la cobertura, acompañado de campañas de difusión y capacitación para maximizar su adopción entre la población objetivo.`,
        'legal-education': `La implementación de esta solución educativa sobre ${query.toLowerCase()} comenzaría con el diseño curricular y la producción de contenidos por parte de expertos en la materia, combinando material teórico con casos prácticos y ejercicios interactivos. Se utilizaría un sistema de gestión de aprendizaje (LMS) como Moodle o Canvas, personalizado para adaptarse a las necesidades específicas de la formación jurídica.\n\nSe desarrollarían simulaciones y juegos de rol utilizando tecnologías de realidad virtual o aumentada para recrear situaciones prácticas como audiencias o negociaciones. La plataforma incorporaría herramientas de evaluación continua y análisis de aprendizaje (learning analytics) para monitorizar el progreso de los estudiantes y personalizar la experiencia educativa según sus necesidades individuales.`
    };

    // Seleccionar plantilla de implementación según la categoría
    return implementationTemplates[category] || implementationTemplates['ai-tools'];
}

/**
 * Navega a la página de la solución generada
 * @param {string} solutionId - ID de la solución generada
 * @param {Object} solution - Datos de la solución generada
 */
function navigateToGeneratedSolution(solutionId, solution) {
    // Guardar la solución en localStorage para recuperarla en la página de destino
    const solutionKey = `ai-solution-${solutionId}`;
    const solutionJson = JSON.stringify(solution);

    console.log(`Guardando solución en localStorage con clave: ${solutionKey}`);
    console.log('Contenido de la solución:', solutionJson.substring(0, 100) + '...');

    localStorage.setItem(solutionKey, solutionJson);

    // Verificar que se guardó correctamente
    const savedSolution = localStorage.getItem(solutionKey);
    if (!savedSolution) {
        console.error('Error: No se pudo guardar la solución en localStorage');
        showToast('Error al guardar la solución generada', 'error');
        return;
    }

    console.log('Solución guardada correctamente en localStorage');

    // Redirigir a la página de la solución
    const url = `solutions.html?category=${encodeURIComponent(solution.category)}&id=${solutionId}&ai=true`;
    console.log(`Redirigiendo a: ${url}`);

    // Usar setTimeout para asegurar que localStorage se actualice antes de la redirección
    setTimeout(() => {
        window.location.href = url;
    }, 100);
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
    // Convertir a número si es string
    const levelNum = parseInt(level) || 1;

    const levelClasses = {
        1: 'bg-secondary',
        2: 'bg-info',
        3: 'bg-primary',
        4: 'bg-success',
        5: 'bg-warning text-dark'
    };

    return levelClasses[levelNum] || 'bg-secondary';
}

/**
 * Obtiene el texto para el nivel de madurez de una solución
 * @param {number} level - Nivel de madurez (1-5)
 * @returns {string} - Texto descriptivo
 */
function getLevelText(level) {
    // Convertir a número si es string
    const levelNum = parseInt(level) || 1;

    const levelTexts = {
        1: 'Nivel 1: Idea',
        2: 'Nivel 2: Prototipo',
        3: 'Nivel 3: Beta',
        4: 'Nivel 4: Producción',
        5: 'Nivel 5: Consolidada'
    };

    return levelTexts[levelNum] || 'Nivel desconocido';
}

// Exportar funciones para uso global
window.getLevelClass = getLevelClass;
window.getLevelText = getLevelText;
