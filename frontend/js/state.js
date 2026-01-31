// Estado global de la aplicacion

const AppState = {
    pets: [],
    adoptionRequests: [],
    currentView: 'adoption', // 'adoption', 'happy', 'about', 'contact', 'requests'
    searchQuery: '',
    requestsFilter: 'all', // 'all', 'pending', 'reviewing', 'approved', 'rejected'
    isLoggedIn: false,
    selectedPhotos: [],
    selectedVideos: [],
    editingPetId: null,
    adoptionPresentationVideo: null,
    captchaAnswer: null
};

// Credenciales de admin (en produccion esto estaria en el backend)
const ADMIN_CREDENTIALS = {
    user: 'admin',
    password: 'uskar2024'
};

// Exponer globalmente
window.AppState = AppState;
window.ADMIN_CREDENTIALS = ADMIN_CREDENTIALS;
