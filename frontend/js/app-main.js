// App Main - Inicializacion y gestion de eventos principal
// Las URLs de API se definen en api.js (API_URL, ADOPTIONS_API_URL)

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadPets();
    loadStats();
    setupMainEventListeners();
    setupAuthListeners();
    setupPetFormListeners();
    setupAdoptionFormListeners();
    setupHelpListeners();
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

    // Botones de vista (Adopcion / Finales Felices / Quienes Somos / Contactanos)
    document.querySelectorAll('.filter-btn[data-filter="view"]').forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn));
    });

    // Boton Ver Solicitudes (admin)
    document.getElementById('viewAdoptionRequestsBtn').addEventListener('click', () => {
        document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
        AppState.currentView = 'requests';
        renderAdoptionRequestsView();
    });

    // Cerrar modal de perfil
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);

    // Cerrar modales al hacer clic en overlay
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('profileModal')) closeProfileModal();
    });
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

    // Mostrar/ocultar boton de agregar animal
    const addPetBtn = document.getElementById('addPetBtn');

    if (AppState.currentView === 'adoption') {
        contentTitle.textContent = 'Nuestros Animales';
        contentSubtitle.textContent = 'Conoce a los animales que buscan un hogar';
        contentHeader.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        if (AppState.isLoggedIn) addPetBtn.classList.add('visible');
        loadPets();
    } else if (AppState.currentView === 'happy') {
        contentTitle.textContent = 'Finales Felices';
        contentSubtitle.textContent = 'Animales que ya encontraron su familia';
        contentHeader.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        addPetBtn.classList.remove('visible');
        loadPets();
    } else if (AppState.currentView === 'about') {
        contentHeader.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderAboutPage();
    } else if (AppState.currentView === 'contact') {
        contentHeader.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderContactPage();
    }
}

// Exponer globalmente
window.handleViewChange = handleViewChange;
window.initializeApp = initializeApp;
