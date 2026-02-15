// Server-Side Authentication Component

var AUTH_API_URL = (window.API_BASE_URL || '') + '/api/auth';
var TOKEN_KEY = 'adminToken';
var TOKEN_EXPIRY_KEY = 'tokenExpiresAt';

// Initialize auth state from stored token
async function initAuth() {
    var token = localStorage.getItem(TOKEN_KEY);
    var expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !expiresAt) {
        AppState.isLoggedIn = false;
        updateUIForLogin();
        return;
    }

    // Check if token is expired
    if (Date.now() > parseInt(expiresAt)) {
        clearAuthData();
        AppState.isLoggedIn = false;
        updateUIForLogin();
        return;
    }

    // Verify token with server
    try {
        var response = await fetch(AUTH_API_URL + '/verify', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.ok) {
            var data = await response.json();
            AppState.isLoggedIn = true;
            AppState.adminInfo = data.admin;
        } else {
            clearAuthData();
            AppState.isLoggedIn = false;
        }
    } catch (error) {
        console.error('Auth verification error:', error);
        // Keep token if network error (offline support)
        AppState.isLoggedIn = true;
    }

    updateUIForLogin();
}

function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
    var token = getAuthToken();
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    }
    return {};
}

function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    AppState.adminInfo = null;
}

function openLoginModal() {
    document.getElementById('loginForm').reset();
    var errorEl = document.getElementById('loginError');
    if (errorEl) errorEl.classList.add('hidden');
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();

    var username = document.getElementById('loginUser').value;
    var password = document.getElementById('loginPassword').value;
    var submitBtn = document.getElementById('loginSubmitBtn');
    var errorEl = document.getElementById('loginError');

    // Disable button while loading
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando...';
    }

    try {
        var response = await fetch(AUTH_API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error de autenticacion');
        }

        // Store token
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(TOKEN_EXPIRY_KEY, data.expiresAt.toString());

        AppState.isLoggedIn = true;
        AppState.adminInfo = data.admin;

        updateUIForLogin();
        closeLoginModal();
        showToast('Sesion iniciada correctamente', 'success');
        loadPets();
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message;
            errorEl.classList.remove('hidden');
        } else {
            showToast(error.message, 'error');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesion';
        }
    }
}

async function logout() {
    try {
        var token = getAuthToken();
        if (token) {
            // Notify server (optional, for logging)
            fetch(AUTH_API_URL + '/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).catch(function() {});
        }
    } finally {
        clearAuthData();
        AppState.isLoggedIn = false;
        updateUIForLogin();
        showToast('Sesion cerrada', 'success');
        loadPets();
    }
}

function updateUIForLogin() {
    var loginBtn = document.getElementById('loginBtn');
    var addPetBtn = document.getElementById('addPetBtn');
    var viewRequestsBtn = document.getElementById('viewAdoptionRequestsBtn');
    var viewFormsBtn = document.getElementById('viewFormsBtn');
    var apadrinaBtn = document.getElementById('apadrinaBtn');

    if (AppState.isLoggedIn) {
        loginBtn.innerHTML = '<span>🔓</span><span>Cerrar Sesion</span>';
        loginBtn.classList.add('logged-in');
        addPetBtn.classList.add('visible');
        viewRequestsBtn.classList.add('visible');
        if (viewFormsBtn) viewFormsBtn.classList.add('visible');
        if (apadrinaBtn) apadrinaBtn.classList.add('visible');
    } else {
        loginBtn.innerHTML = '<span>👤</span><span>Iniciar Sesion</span>';
        loginBtn.classList.remove('logged-in');
        addPetBtn.classList.remove('visible');
        viewRequestsBtn.classList.remove('visible');
        if (viewFormsBtn) viewFormsBtn.classList.remove('visible');
        if (apadrinaBtn) apadrinaBtn.classList.remove('visible');

        if (AppState.currentView === 'requests' || AppState.currentView === 'forms') {
            AppState.currentView = 'adoption';
            var activeViewBtn = document.querySelector('[data-value="adoption"]');
            if (activeViewBtn) activeViewBtn.classList.add('active');
            loadPets();
        }
    }
}

function setupAuthListeners() {
    var loginBtn = document.getElementById('loginBtn');
    var loginModal = document.getElementById('loginModal');
    var loginForm = document.getElementById('loginForm');

    loginBtn.addEventListener('click', function() {
        if (AppState.isLoggedIn) {
            logout();
        } else {
            openLoginModal();
        }
    });

    document.getElementById('closeLoginModal').addEventListener('click', closeLoginModal);
    document.getElementById('cancelLoginBtn').addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) closeLoginModal();
    });
}

// Expose globally
window.initAuth = initAuth;
window.getAuthToken = getAuthToken;
window.getAuthHeaders = getAuthHeaders;
window.clearAuthData = clearAuthData;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.handleLogin = handleLogin;
window.logout = logout;
window.updateUIForLogin = updateUIForLogin;
window.setupAuthListeners = setupAuthListeners;
