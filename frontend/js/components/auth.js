// Componente de Autenticacion (Login/Logout)

function openLoginModal() {
    document.getElementById('loginForm').reset();
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    if (user === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.password) {
        AppState.isLoggedIn = true;
        updateUIForLogin();
        closeLoginModal();
        showToast('Sesion iniciada correctamente', 'success');
        loadPets();
    } else {
        showToast('Usuario o contrasena incorrectos', 'error');
    }
}

function logout() {
    AppState.isLoggedIn = false;
    updateUIForLogin();
    showToast('Sesion cerrada', 'success');
    loadPets();
}

function updateUIForLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const addPetBtn = document.getElementById('addPetBtn');
    const viewRequestsBtn = document.getElementById('viewAdoptionRequestsBtn');

    if (AppState.isLoggedIn) {
        loginBtn.innerHTML = '<span>🔓</span><span>Cerrar Sesion</span>';
        loginBtn.classList.add('logged-in');
        addPetBtn.classList.add('visible');
        viewRequestsBtn.classList.add('visible');
    } else {
        loginBtn.innerHTML = '<span>👤</span><span>Iniciar Sesion</span>';
        loginBtn.classList.remove('logged-in');
        addPetBtn.classList.remove('visible');
        viewRequestsBtn.classList.remove('visible');

        if (AppState.currentView === 'requests') {
            AppState.currentView = 'adoption';
            document.querySelector('[data-value="adoption"]').classList.add('active');
            loadPets();
        }
    }
}

function setupAuthListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');

    loginBtn.addEventListener('click', () => {
        if (AppState.isLoggedIn) {
            logout();
        } else {
            openLoginModal();
        }
    });

    document.getElementById('closeLoginModal').addEventListener('click', closeLoginModal);
    document.getElementById('cancelLoginBtn').addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeLoginModal();
    });
}

// Exponer globalmente
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.handleLogin = handleLogin;
window.logout = logout;
window.updateUIForLogin = updateUIForLogin;
window.setupAuthListeners = setupAuthListeners;
