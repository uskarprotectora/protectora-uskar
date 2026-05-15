// App Main - Inicializacion y gestion de eventos principal
// Las URLs de API se definen en api.js (API_URL, ADOPTIONS_API_URL)

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Inicializar sistema de idiomas
    I18n.init();

    // Cargar los modales HTML antes de configurar los listeners
    await loadModals();

    // Aplicar traducciones a los modales cargados
    I18n.applyTranslations();

    // Inicializar autenticacion (restaurar sesion si existe token valido)
    await initAuth();

    loadPets();
    loadStats();
    setupMainEventListeners();
    setupAuthListeners();
    setupPetFormListeners();
    setupAdoptionFormListeners();
    setupHelpListeners();
    setupLanguageListeners();

    // Escuchar cambios de idioma para actualizar contenido dinamico
    window.addEventListener('languageChanged', function() {
        // Recargar la vista actual con el nuevo idioma
        if (AppState.currentView === 'adoption' || AppState.currentView === 'happy') {
            updateViewTitles();
            loadPets();
        } else if (AppState.currentView === 'about') {
            renderAboutPage();
        } else if (AppState.currentView === 'contact') {
            renderContactPage();
        }
        // Actualizar select de filtro de edad
        updateAgeFilterOptions();
    });
}

// Cargar todos los modales HTML en el contenedor
async function loadModals() {
    const modalsContainer = document.getElementById('modals-container');
    const modalPaths = [
        'components/modals/login-modal.html',
        'components/modals/profile-modal.html',
        'components/modals/pet-modal.html',
        'components/modals/adoption-form-modal.html',
        'components/modals/help-modal.html'
    ];

    try {
        const htmls = await ComponentLoader.loadMultiple(modalPaths);
        modalsContainer.innerHTML = htmls.join('');
    } catch (error) {
        console.error('Error cargando modales:', error);
    }
}

// Event Listeners principales
function setupMainEventListeners() {
    // Menu toggle para movil
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Cerrar menu al hacer click en un enlace de la sidebar
        sidebar.querySelectorAll('.filter-btn, .adoption-form-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }

    // Busqueda
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        AppState.searchQuery = e.target.value;
        loadPets();
    }, 300));

    // Filtro de edad
    const ageRangeFilter = document.getElementById('ageRangeFilter');
    if (ageRangeFilter) {
        ageRangeFilter.addEventListener('change', (e) => {
            AppState.ageRange = e.target.value;
            loadPets();
        });
    }

    // Botones de vista (Adopcion / Finales Felices / Quienes Somos / Contactanos)
    document.querySelectorAll('.filter-btn[data-filter="view"]').forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn));
    });

    // Boton Ver Solicitudes de Adopción (admin)
    document.getElementById('viewAdoptionRequestsBtn').addEventListener('click', () => {
        document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.help-btn').forEach(b => b.classList.remove('active'));
        AppState.currentView = 'requests';
        var filtersBar = document.getElementById('filtersBar');
        if (filtersBar) filtersBar.style.display = 'none';
        renderAdoptionRequestsView();
    });

    // Boton Ver Otros Formularios (admin)
    document.getElementById('viewFormsBtn').addEventListener('click', () => {
        document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.help-btn').forEach(b => b.classList.remove('active'));
        AppState.currentView = 'forms';
        var filtersBar = document.getElementById('filtersBar');
        if (filtersBar) filtersBar.style.display = 'none';
        renderFormsView();
    });

    // Cerrar modal de perfil
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);

    // Cerrar modales al hacer clic en overlay
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('profileModal')) closeProfileModal();
    });
}

// Configurar listeners del selector de idioma
function setupLanguageListeners() {
    const langSelect = document.getElementById('langSelect');

    if (langSelect) {
        // Establecer el valor actual
        langSelect.value = I18n.getCurrentLang();

        // Cambiar idioma al seleccionar
        langSelect.addEventListener('change', function() {
            I18n.setLang(this.value);
        });
    }
}

// Actualizar titulos de la vista actual
function updateViewTitles() {
    const contentTitle = document.querySelector('.content-title');
    const contentSubtitle = document.querySelector('.content-subtitle');

    if (AppState.currentView === 'adoption') {
        contentTitle.textContent = t('content.title');
        contentSubtitle.textContent = t('content.subtitle');
    } else if (AppState.currentView === 'happy') {
        contentTitle.textContent = t('content.happyTitle');
        contentSubtitle.textContent = t('content.happySubtitle');
    }
}

// Actualizar opciones del filtro de edad
function updateAgeFilterOptions() {
    const ageFilter = document.getElementById('ageRangeFilter');
    if (ageFilter) {
        ageFilter.options[0].text = t('filter.allAges');
        ageFilter.options[1].text = t('filter.puppy');
        ageFilter.options[2].text = t('filter.young');
        ageFilter.options[3].text = t('filter.adult');
        ageFilter.options[4].text = t('filter.senior');
    }
}

// Manejo de cambio de vista
function handleViewChange(btn) {
    const viewValue = btn.dataset.value;

    document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    AppState.currentView = viewValue;

    // Actualizar titulo segun la vista
    const contentTitle = document.querySelector('.content-title');
    const contentSubtitle = document.querySelector('.content-subtitle');
    const contentHeader = document.querySelector('.content-header');
    const petsGrid = document.getElementById('petsGrid');
    const filtersBar = document.getElementById('filtersBar');

    // Mostrar/ocultar boton de agregar animal
    const addPetBtn = document.getElementById('addPetBtn');

    if (AppState.currentView === 'adoption') {
        contentTitle.textContent = t('content.title');
        contentSubtitle.textContent = t('content.subtitle');
        contentHeader.style.display = 'flex';
        if (filtersBar) filtersBar.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        if (AppState.isLoggedIn) addPetBtn.classList.add('visible');
        loadPets();
    } else if (AppState.currentView === 'happy') {
        contentTitle.textContent = t('content.happyTitle');
        contentSubtitle.textContent = t('content.happySubtitle');
        contentHeader.style.display = 'flex';
        if (filtersBar) filtersBar.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        addPetBtn.classList.remove('visible');
        loadPets();
    } else if (AppState.currentView === 'about') {
        contentHeader.style.display = 'none';
        if (filtersBar) filtersBar.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderAboutPage();
    } else if (AppState.currentView === 'contact') {
        contentHeader.style.display = 'none';
        if (filtersBar) filtersBar.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderContactPage();
    }
}

// Exponer globalmente
window.handleViewChange = handleViewChange;
window.initializeApp = initializeApp;
