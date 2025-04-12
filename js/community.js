/**
 * MARDUK ECOSYSTEM - COMMUNITY FUNCTIONALITY
 * JavaScript for community page functionality
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunity();
    
    // Listen for role changes to update community features
    document.addEventListener('userRoleChanged', function(event) {
        updateCommunityByRole(event.detail.role);
    });
});

/**
 * Initialize community components
 */
function initializeCommunity() {
    // Get current role from localStorage
    const currentRole = localStorage.getItem('mardukUserRole') || 'funcionario';
    
    // Initialize tabs
    initializeTabs();
    
    // Update community elements based on role
    updateCommunityByRole(currentRole);
    
    // Set up event listeners for community features
    setupEventListeners();
}

/**
 * Initialize tabs
 */
function initializeTabs() {
    // Get active tab from localStorage or use default
    const activeTab = localStorage.getItem('mardukCommunityTab') || 'forosTab';
    
    // Activate the tab
    const tabElement = document.querySelector(`[data-bs-target="#${activeTab}"]`);
    if (tabElement) {
        const tab = new bootstrap.Tab(tabElement);
        tab.show();
    }
    
    // Add event listeners to save active tab
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabLinks.forEach(link => {
        link.addEventListener('shown.bs.tab', event => {
            const targetTab = event.target.getAttribute('data-bs-target').replace('#', '');
            localStorage.setItem('mardukCommunityTab', targetTab);
        });
    });
}

/**
 * Set up event listeners for community features
 */
function setupEventListeners() {
    // Forum items click events
    setupForumItemsClicks();
    
    // Event registration buttons
    setupEventRegistration();
    
    // Resource category selection
    setupResourceCategories();
    
    // Mentorship application buttons
    setupMentorshipButtons();
}

/**
 * Set up forum items click events
 */
function setupForumItemsClicks() {
    const forumItems = document.querySelectorAll('.list-group-item[href="#"]');
    forumItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would navigate to the forum or topic
            // For this demo, we'll just show an alert
            const forumName = this.querySelector('h3') ? this.querySelector('h3').textContent : 'Foro seleccionado';
            showNotification(`Navegando a: ${forumName}`, 'info');
        });
    });
}

/**
 * Set up event registration buttons
 */
function setupEventRegistration() {
    const registrationButtons = document.querySelectorAll('[id$="Tab"] button:contains("Inscribirme")');
    registrationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get event name from closest container
            const eventItem = this.closest('[id$="Tab"] div');
            const eventName = eventItem.querySelector('h3, h2') ? 
                             eventItem.querySelector('h3, h2').textContent : 
                             'el evento';
            
            // Show registration confirmation
            showConfirmDialog(
                `Inscripción a Evento`,
                `¿Desea inscribirse a ${eventName}?`,
                () => {
                    // Success action
                    showNotification(`¡Inscripción exitosa a ${eventName}!`, 'success');
                    this.textContent = 'Inscrito';
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-success');
                    this.disabled = true;
                    
                    // In a real app, would register via API
                    // Add to user's calendar
                    addXpPoints(50, 'Inscripción a evento');
                }
            );
        });
    });
}

/**
 * Set up resource categories selection
 */
function setupResourceCategories() {
    const resourceCategories = document.querySelectorAll('#recursosTab .card-body button');
    resourceCategories.forEach(button => {
        button.addEventListener('click', function() {
            // In a real application, this would filter resources
            const categoryName = this.closest('.card').querySelector('h3') ? 
                                 this.closest('.card').querySelector('h3').textContent : 
                                 'la categoría';
            
            showNotification(`Explorando recursos de ${categoryName}`, 'info');
        });
    });
}

/**
 * Set up mentorship application buttons
 */
function setupMentorshipButtons() {
    const mentorshipButtons = document.querySelectorAll('#mentoriasTab button:contains("Solicitar mentoría")');
    mentorshipButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get mentor name
            const mentorCard = this.closest('.card');
            const mentorName = mentorCard.querySelector('h3') ? 
                               mentorCard.querySelector('h3').textContent : 
                               'el mentor';
            
            // Show confirmation dialog
            showConfirmDialog(
                `Solicitud de Mentoría`,
                `¿Desea solicitar mentoría con ${mentorName}?`,
                () => {
                    // Success action
                    showNotification(`Solicitud enviada a ${mentorName}`, 'success');
                    this.textContent = 'Solicitud enviada';
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-secondary');
                    this.disabled = true;
                    
                    // In a real app, would send request via API
                    addXpPoints(25, 'Solicitud de mentoría');
                }
            );
        });
    });
}

/**
 * Update community elements based on role
 * @param {string} role - The user role
 */
function updateCommunityByRole(role) {
    console.log('Updating community for role:', role);
    
    // Define role-specific recommendations
    const recommendations = {
        funcionario: [
            'Foros recomendados para funcionarios',
            'Eventos para funcionarios judiciales'
        ],
        ciudadano: [
            'Recursos útiles para ciudadanos',
            'Guías de acceso a la justicia'
        ],
        administrador: [
            'Foros técnicos de administración',
            'Actualizaciones de infraestructura'
        ],
        desarrollador: [
            'Repositorios de código del ecosistema',
            'Documentación de APIs y frameworks'
        ]
    };
    
    // Update recommended section if it exists
    const recommendedSection = document.querySelector('.community-recommendations');
    if (recommendedSection) {
        const items = recommendedSection.querySelectorAll('li');
        const roleRecs = recommendations[role] || recommendations.funcionario;
        
        items.forEach((item, index) => {
            if (index < roleRecs.length) {
                item.textContent = roleRecs[index];
            }
        });
    }
}

/**
 * Show notification toast
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, info, warning, error)
 */
function showNotification(message, type = 'info') {
    // Define colors based on type
    const bgColors = {
        success: 'bg-success',
        info: 'bg-primary',
        warning: 'bg-warning',
        error: 'bg-danger'
    };
    
    // Define icons based on type
    const icons = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-exclamation-circle'
    };
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast ${bgColors[type]} text-white`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '1100';
    
    notification.innerHTML = `
        <div class="toast-header ${bgColors[type]} text-white">
            <i class="fa-solid ${icons[type]} me-2"></i>
            <strong class="me-auto">Marduk</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(notification, { delay: 5000 });
    toast.show();
    
    // Remove from DOM after hiding
    notification.addEventListener('hidden.bs.toast', function() {
        notification.remove();
    });
}

/**
 * Show confirmation dialog
 * @param {string} title - The dialog title
 * @param {string} message - The dialog message
 * @param {Function} confirmCallback - The callback to execute when confirmed
 */
function showConfirmDialog(title, message, confirmCallback) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'confirmModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'confirmModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Initialize modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Add confirm action
    document.getElementById('confirmBtn').addEventListener('click', function() {
        modalInstance.hide();
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
    });
    
    // Remove from DOM after hiding
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

/**
 * Add XP points to user (for gamification)
 * @param {number} points - The number of points to add
 * @param {string} reason - The reason for adding points
 */
function addXpPoints(points, reason) {
    // In a real application, this would update the user's XP via API
    // For this demo, we'll just show a notification
    showNotification(`+${points} XP: ${reason}`, 'success');
    
    // Dispatch an event that other components can listen for
    const event = new CustomEvent('xpEarned', { 
        detail: { points: points, reason: reason } 
    });
    document.dispatchEvent(event);
}

// Extend jQuery-like functionality for selectors with contains
if (typeof Element.prototype.matches !== 'function') {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

NodeList.prototype.filter = function(selector) {
    return Array.from(this).filter(el => el.matches(selector));
};

// Add contains selector functionality
NodeList.prototype.filter = function(criteria) {
    return Array.from(this).filter(element => {
        if (typeof criteria === 'string' && criteria.includes(':contains(')) {
            const text = criteria.match(/:contains\((.*?)\)/)[1].replace(/["']/g, '');
            return element.textContent.includes(text);
        } else {
            return element.matches(criteria);
        }
    });
};