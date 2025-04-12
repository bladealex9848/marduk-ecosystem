/**
 * Script para probar la carga de modelos
 */

import OPENROUTER_MODELS_CONFIG from '../js/config/openrouter-models.js';

console.log('Modelos cargados:', OPENROUTER_MODELS_CONFIG);

document.addEventListener('DOMContentLoaded', function() {
    const modelsList = document.createElement('div');
    modelsList.className = 'mt-3 p-3 bg-light rounded';
    modelsList.innerHTML = '<h5>Modelos disponibles:</h5>';
    
    if (OPENROUTER_MODELS_CONFIG && OPENROUTER_MODELS_CONFIG.models) {
        const ul = document.createElement('ul');
        OPENROUTER_MODELS_CONFIG.models.forEach(model => {
            const li = document.createElement('li');
            li.textContent = `${model.name} (${model.id})`;
            ul.appendChild(li);
        });
        modelsList.appendChild(ul);
    } else {
        modelsList.innerHTML += '<p class="text-danger">No se pudieron cargar los modelos</p>';
    }
    
    document.body.appendChild(modelsList);
});
