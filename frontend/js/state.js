// Estado global de la aplicacion

const AppState = {
    pets: [],
    adoptionRequests: [],
    formSubmissions: [],
    currentView: 'adoption', // 'adoption', 'happy', 'about', 'contact', 'requests', 'forms'
    currentHelpAction: null, // Para marcar que boton de ayuda esta activo
    searchQuery: '',
    requestsFilter: 'all', // 'all', 'pending', 'reviewing', 'approved', 'rejected'
    formsFilter: 'all', // 'all', 'volunteer', 'foster', 'sponsorship', 'invoice_contribution'
    isLoggedIn: false,
    adminInfo: null, // Informacion del admin autenticado
    selectedPhotos: [],
    selectedVideos: [],
    editingPetId: null,
    adoptionPresentationVideo: null,
    captchaAnswer: null
};

// Exponer globalmente
window.AppState = AppState;
