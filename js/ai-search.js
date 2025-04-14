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
 * Genera una solución de demostración personalizada basada en la consulta
 * @param {string} query - Consulta del usuario
 * @returns {Object} - Solución generada
 */
function generateDemoSolution(query) {
    console.log('Generando solución de demostración personalizada para:', query);

    // Extraer palabras clave de la consulta
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);

    // Determinar categoría basada en palabras clave
    let category = 'ai-tools'; // Categoría por defecto
    if (keywords.some(word => ['caso', 'casos', 'expediente', 'expedientes', 'seguimiento'].includes(word))) {
        category = 'case-management';
    } else if (keywords.some(word => ['investigación', 'buscar', 'búsqueda', 'jurídico', 'legal'].includes(word))) {
        category = 'legal-research';
    } else if (keywords.some(word => ['documento', 'documentos', 'automatización', 'plantilla'].includes(word))) {
        category = 'document-automation';
    } else if (keywords.some(word => ['ia', 'inteligencia', 'artificial', 'machine', 'learning', 'agente', 'agentes', 'orquestación'].includes(word))) {
        category = 'ai-tools';
    } else if (keywords.some(word => ['acceso', 'justicia', 'ciudadano', 'ciudadanos', 'público'].includes(word))) {
        category = 'access-justice';
    } else if (keywords.some(word => ['educación', 'aprendizaje', 'formación', 'capacitación'].includes(word))) {
        category = 'legal-education';
    }

    // Generar nombre basado en la consulta
    let name = 'Sistema ';
    if (query.length > 5) {
        // Capitalizar primera letra de cada palabra
        name = query.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        // Limitar longitud
        if (name.length > 50) {
            name = name.substring(0, 47) + '...';
        }
    } else {
        name += 'Judicial Inteligente';
    }

    // Generar descripción basada en la consulta
    let description = `Solución para ${query}`;
    if (description.length > 100) {
        description = description.substring(0, 97) + '...';
    }

    // Generar etiquetas basadas en palabras clave
    const tags = [];
    keywords.forEach(keyword => {
        if (keyword.length > 3 && tags.length < 5 && !tags.includes(keyword)) {
            tags.push(keyword);
        }
    });

    // Agregar etiquetas adicionales según la categoría
    switch (category) {
        case 'case-management':
            tags.push('gestión', 'casos', 'expedientes');
            break;
        case 'legal-research':
            tags.push('investigación', 'jurídica', 'búsqueda');
            break;
        case 'document-automation':
            tags.push('documentos', 'automatización', 'plantillas');
            break;
        case 'ai-tools':
            tags.push('inteligencia artificial', 'automatización', 'asistencia');
            break;
        case 'access-justice':
            tags.push('acceso', 'justicia', 'ciudadanos');
            break;
        case 'legal-education':
            tags.push('educación', 'formación', 'capacitación');
            break;
    }

    // Eliminar duplicados y limitar a 5 etiquetas
    const uniqueTags = [...new Set(tags)].slice(0, 5);

    return {
        name: name,
        description: description,
        category: category,
        level: 1, // Nivel 1: Idea
        type: 'community',
        tags: uniqueTags,
        fullDescription: `Esta solución responde a la necesidad de ${query}. Proporciona herramientas y funcionalidades adaptadas al contexto judicial, mejorando la eficiencia y calidad del trabajo de los profesionales del derecho. Implementa tecnologías modernas para resolver problemas específicos del ámbito judicial.`,
        features: [
            `Funcionalidad principal para ${query}`,
            'Interfaz intuitiva y fácil de usar',
            'Integración con sistemas judiciales existentes',
            'Seguridad y confidencialidad de la información',
            'Adaptabilidad a diferentes contextos judiciales'
        ],
        benefits: [
            'Mejora de la eficiencia en procesos judiciales',
            'Reducción de tiempos y costos operativos',
            'Mayor precisión y calidad en el trabajo judicial',
            'Acceso más fácil a la información relevante'
        ],
        useCases: [
            `Aplicación en casos de ${query}`,
            'Uso por parte de profesionales del derecho',
            'Implementación en juzgados y tribunales'
        ],
        implementation: `La implementación de esta solución requiere un análisis detallado de los requisitos específicos relacionados con ${query}. Se recomienda un enfoque iterativo, comenzando con un prototipo funcional que pueda ser evaluado por usuarios finales. La solución puede desarrollarse utilizando tecnologías web modernas para la interfaz de usuario y servicios backend robustos para la lógica de negocio.`
    };
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
