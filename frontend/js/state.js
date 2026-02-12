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

// Las credenciales se cargan desde un archivo externo (credentials.js)
// Ese archivo NO debe estar en el repositorio
// Si ADMIN_CREDENTIALS no esta definido, se usan valores por defecto que no funcionaran
if (typeof ADMIN_CREDENTIALS === 'undefined') {
    console.warn('Credenciales no encontradas. Crea el archivo credentials.js con las credenciales de admin.');
    window.ADMIN_CREDENTIALS = {
        user: '',
        password: ''
    };
}

// Exponer globalmente
window.AppState = AppState;
