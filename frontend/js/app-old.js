const BASE_URL = window.API_BASE_URL || '';
const API_URL = BASE_URL + '/api/pets';
const ADOPTIONS_API_URL = BASE_URL + '/api/adoptions';

// Estado
let pets = [];
let adoptionRequests = [];
let currentView = 'adoption'; // 'adoption', 'happy', 'about', 'contact', 'requests'
let searchQuery = '';
let requestsFilter = 'all'; // 'all', 'pending', 'reviewing', 'approved', 'rejected'
let isLoggedIn = false;
let selectedPhotos = [];
let selectedVideos = [];
let editingPetId = null;
let adoptionPresentationVideo = null;
let captchaAnswer = null;

// Credenciales de admin (en produccion esto estaria en el backend)
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'uskar2024';

// Elementos DOM
const petsGrid = document.getElementById('petsGrid');
const searchInput = document.getElementById('searchInput');
const petModal = document.getElementById('petModal');
const profileModal = document.getElementById('profileModal');
const helpModal = document.getElementById('helpModal');
const loginModal = document.getElementById('loginModal');
const aboutModal = document.getElementById('aboutModal');
const adoptionFormModal = document.getElementById('adoptionFormModal');
const petForm = document.getElementById('petForm');
const loginForm = document.getElementById('loginForm');
const adoptionForm = document.getElementById('adoptionForm');
const modalTitle = document.getElementById('modalTitle');
const loginBtn = document.getElementById('loginBtn');

// Contenido de Ayuda
const helpContent = {
    donaciones: {
        title: 'Donaciones',
        icon: '💝',
        content: `
            <div class="help-section">
                <p class="help-intro">Tu donacion nos ayuda a cuidar de los animales que mas lo necesitan. Cada euro cuenta para alimentacion, cuidados veterinarios y refugio.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🏦</div>
                        <h4>Transferencia Bancaria</h4>
                        <p>IBAN: ES00 0000 0000 0000 0000 0000</p>
                        <p>Concepto: Donacion Uskar</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">💳</div>
                        <h4>Bizum</h4>
                        <p>Numero: 000 000 000</p>
                        <p>Concepto: Donacion</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🎁</div>
                        <h4>Donaciones en Especie</h4>
                        <p>Aceptamos pienso, mantas, medicamentos y material veterinario.</p>
                    </div>
                </div>
            </div>
        `
    },
    voluntariado: {
        title: 'Voluntariado',
        icon: '🤝',
        content: `
            <div class="help-section">
                <p class="help-intro">Hay muchas formas de colaborar con nosotros. Tu tiempo y habilidades pueden marcar la diferencia.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🏠</div>
                        <h4>Casa de Acogida</h4>
                        <p>Ofrece un hogar temporal a un animal mientras encuentra familia definitiva.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🚗</div>
                        <h4>Transporte</h4>
                        <p>Ayudaños a llevar animales al veterinario o a sus nuevos hogares.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">📸</div>
                        <h4>Fotografia</h4>
                        <p>Toma fotos profesionales de nuestros animales para facilitar su adopcion.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🧹</div>
                        <h4>Tareas en el Refugio</h4>
                        <p>Ayuda con limpieza, paseos y socializacion de animales.</p>
                    </div>
                </div>

                <div class="help-cta">
                    <p style="margin-bottom: 16px; color: #78350f;">Contactaños para mas informacion sobre como ser voluntario.</p>
                </div>
            </div>
        `
    },
    teaming: {
        title: 'Teaming',
        icon: '👥',
        content: `
            <div class="help-section">
                <p class="help-intro">Con solo 1 euro al mes puedes ayudarnos a seguir salvando vidas. Teaming es una plataforma de microdonaciones que no cobra comisiones.</p>

                <div class="help-highlight">
                    <div class="help-highlight-icon">⭐</div>
                    <h3>Solo 1 euro al mes</h3>
                    <p>Un pequeno gesto que marca una gran diferencia</p>
                </div>

                <div class="help-cards">
                    <div class="help-card full-width">
                        <div class="help-card-icon">💡</div>
                        <h4>Como funciona Teaming?</h4>
                        <ol class="help-list">
                            <li>Entra en nuestra pagina de Teaming</li>
                            <li>Registrate con tu email</li>
                            <li>Configura tu donacion mensual de 1 euro</li>
                            <li>Listo! Ya estas ayudando cada mes</li>
                        </ol>
                    </div>
                </div>

                <div class="help-cta">
                    <button class="btn btn-primary btn-large">Unirme al Teaming</button>
                </div>
            </div>
        `
    },
    apadrina: {
        title: 'Apadrina un Animal',
        icon: '❤️',
        content: `
            <div class="help-section">
                <p class="help-intro">Algunos de nuestros animales son dificiles de adoptar por su edad o condicion de salud. Apadrinarlos es darles la oportunidad de vivir dignamente.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🐕</div>
                        <h4>Apadrinamiento Basico</h4>
                        <p><strong>10 euros/mes</strong></p>
                        <p>Cubre alimentacion basica del animal.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">💊</div>
                        <h4>Apadrinamiento Completo</h4>
                        <p><strong>25 euros/mes</strong></p>
                        <p>Alimentacion + cuidados veterinarios.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🌟</div>
                        <h4>Apadrinamiento Premium</h4>
                        <p><strong>50 euros/mes</strong></p>
                        <p>Cuidado integral + tratamientos especiales.</p>
                    </div>
                </div>

                <div class="help-benefits">
                    <h4>Beneficios del apadrinamiento:</h4>
                    <ul class="help-list">
                        <li>Recibiras fotos y actualizaciones de tu ahijado</li>
                        <li>Podras visitarlo en el refugio</li>
                        <li>Certificado de apadrinamiento</li>
                        <li>Desgravacion fiscal</li>
                    </ul>
                </div>
            </div>
        `
    }
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadPets();
    loadStats();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
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
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value;
        loadPets();
    }, 300));

    // Botones de vista (Adopcion / Finales Felices / Quienes Somos / Contactanos)
    document.querySelectorAll('.filter-btn[data-filter="view"]').forEach(btn => {
        btn.addEventListener('click', () => handleViewChange(btn));
    });

    // Boton Formulario de Adopcion en sidebar
    document.getElementById('openAdoptionFormBtn').addEventListener('click', () => {
        openAdoptionFormModal(null);
    });

    // Boton Ver Solicitudes (admin)
    document.getElementById('viewAdoptionRequestsBtn').addEventListener('click', () => {
        // Desactivar otros botones de vista
        document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
        currentView = 'requests';
        renderAdoptionRequestsView();
    });

    // Botones de ayuda
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', () => openHelpModal(btn.dataset.action));
    });

    // Boton Agregar Animal
    document.getElementById('addPetBtn').addEventListener('click', () => openAddModal());

    // Boton Iniciar Sesion / Cerrar Sesion
    loginBtn.addEventListener('click', () => {
        if (isLoggedIn) {
            logout();
        } else {
            openLoginModal();
        }
    });

    // Login modal
    document.getElementById('closeLoginModal').addEventListener('click', closeLoginModal);
    document.getElementById('cancelLoginBtn').addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeLoginModal();
    });

    // Botones cerrar modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('closeProfileModal').addEventListener('click', closeProfileModal);
    document.getElementById('closeHelpModal').addEventListener('click', closeHelpModal);
    document.getElementById('closeAdoptionFormModal').addEventListener('click', closeAdoptionFormModal);
    document.getElementById('cancelAdoptionBtn').addEventListener('click', closeAdoptionFormModal);

    // Envio de formularios
    petForm.addEventListener('submit', handleFormSubmit);
    adoptionForm.addEventListener('submit', handleAdoptionFormSubmit);

    // Checkboxes condicionales en formulario de adopcion
    document.getElementById('adoptHasChildren').addEventListener('change', (e) => {
        document.getElementById('childrenAgesGroup').style.display = e.target.checked ? 'block' : 'none';
    });
    document.getElementById('adoptHasOtherPets').addEventListener('change', (e) => {
        document.getElementById('otherPetsGroup').style.display = e.target.checked ? 'block' : 'none';
    });

    // Video de presentacion en formulario de adopcion
    const adoptVideoInput = document.getElementById('adoptPresentationVideo');
    const adoptVideoUploadArea = document.getElementById('adoptVideoUploadArea');

    adoptVideoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            adoptionPresentationVideo = e.target.files[0];
            renderAdoptionVideoPreview();
        }
    });

    adoptVideoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        adoptVideoUploadArea.classList.add('dragover');
    });

    adoptVideoUploadArea.addEventListener('dragleave', () => {
        adoptVideoUploadArea.classList.remove('dragover');
    });

    adoptVideoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        adoptVideoUploadArea.classList.remove('dragover');
        const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('video/'));
        if (file) {
            adoptionPresentationVideo = file;
            renderAdoptionVideoPreview();
        }
    });

    // File uploads
    setupFileUploads();

    // Cerrar modales al hacer clic en overlay
    petModal.addEventListener('click', (e) => {
        if (e.target === petModal) closeModal();
    });
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
    });
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) closeHelpModal();
    });
    adoptionFormModal.addEventListener('click', (e) => {
        if (e.target === adoptionFormModal) closeAdoptionFormModal();
    });
}

// Funciones API
async function loadPets() {
    try {
        let url = API_URL + '?';

        // Filtrar por vista (adopcion = active/scheduled, finales felices = inactive/adopted)
        if (currentView === 'adoption') {
            url += `status=active&`;
        } else if (currentView === 'happy') {
            url += `status=inactive&`;
        }

        if (searchQuery) {
            url += `search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        pets = await response.json();
        renderPets();
    } catch (error) {
        console.error('Error cargando animales:', error);
        showToast('Error al cargar animales', 'error');
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        document.getElementById('totalPets').textContent = stats.total;
        document.getElementById('totalDogs').textContent = stats.dogs;
        document.getElementById('totalCats').textContent = stats.cats;
    } catch (error) {
        console.error('Error cargando estadisticas:', error);
    }
}

async function savePet(petData) {
    const petId = document.getElementById('petId').value;
    const isEdit = !!petId;

    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(petData));

        // Append photos
        selectedPhotos.forEach(photo => {
            formData.append('photos', photo);
        });

        // Append videos
        selectedVideos.forEach(video => {
            formData.append('videos', video);
        });

        const response = await fetch(
            isEdit ? `${API_URL}/${petId}` : API_URL,
            {
                method: isEdit ? 'PUT' : 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        showToast(isEdit ? 'Animal actualizado correctamente' : 'Animal agregado correctamente', 'success');
        closeModal();
        loadPets();
        loadStats();
    } catch (error) {
        showToast(error.message || 'Error al guardar', 'error');
    }
}

async function deletePet(id) {
    if (!confirm('Estas seguro de que quieres eliminar este animal?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar');

        showToast('Animal eliminado correctamente', 'success');
        loadPets();
        loadStats();
    } catch (error) {
        showToast('Error al eliminar animal', 'error');
    }
}

// Funciones de Renderizado
function renderPets() {
    if (pets.length === 0) {
        const emptyMessage = currentView === 'adoption'
            ? { title: 'No hay animales en adopcion', text: 'Actualmente no tenemos animales disponibles' }
            : { title: 'No hay finales felices aun', text: 'Pronto compartiremos historias de adopcion' };

        petsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${currentView === 'adoption' ? '🐾' : '🏠'}</div>
                <h3 class="empty-title">${emptyMessage.title}</h3>
                <p class="empty-text">${emptyMessage.text}</p>
            </div>
        `;
        return;
    }

    petsGrid.innerHTML = pets.map(pet => createPetCard(pet)).join('');

    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.pet-card').forEach(card => {
        const petId = card.dataset.id;

        // Click en la tarjeta abre el perfil
        card.addEventListener('click', () => {
            viewProfile(petId);
        });

        // Botones de admin (solo si esta logueado)
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(petId);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deletePet(petId);
            });
        }

        const adoptBtn = card.querySelector('.adopt-btn');
        if (adoptBtn) {
            adoptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pet = pets.find(p => p._id === petId);
                openAdoptionFormModal(pet);
            });
        }
    });
}

function createPetCard(pet) {
    const emoji = pet.type === 'dog' ? '🐕' : '🐱';
    const typeText = pet.type === 'dog' ? 'PERRO' : 'GATO';
    const badgeClass = pet.type === 'dog' ? 'badge-dog' : 'badge-cat';
    const genderText = pet.gender === 'male' ? 'Macho' : 'Hembra';
    const statusText = {
        active: 'Disponible',
        scheduled: 'Reservado',
        inactive: 'Adoptado'
    };
    const gradients = [
        'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)',
        'linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 100%)',
        'linear-gradient(135deg, #e8ddd5 0%, #c4a98a 100%)',
        'linear-gradient(135deg, #ded4c8 0%, #a1887f 100%)',
        'linear-gradient(135deg, #d7ccc8 0%, #8d6e63 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    // Get main photo or first photo
    const mainPhoto = pet.photos && pet.photos.length > 0
        ? pet.photos.find(p => p.isMain) || pet.photos[0]
        : null;

    const imageContent = mainPhoto
        ? `<img src="${mainPhoto.url}" alt="${pet.name}" class="pet-image">`
        : `<div class="pet-image placeholder-img" style="background: ${randomGradient};">${emoji}</div>`;

    return `
        <div class="pet-card" data-id="${pet._id}">
            <div class="pet-image-container">
                ${imageContent}
                <div class="pet-badge ${badgeClass}">
                    <span>${emoji}</span>
                    <span>${typeText}</span>
                </div>
                <div class="status-badge status-${pet.status}">${statusText[pet.status] || 'Disponible'}</div>
            </div>
            <div class="pet-info">
                <div class="pet-header">
                    <div>
                        <h3 class="pet-name">${pet.name}</h3>
                        <p class="pet-breed">${pet.breed}</p>
                    </div>
                    <div class="pet-age">${pet.age} ${pet.age === 1 ? 'año' : 'años'}</div>
                </div>
                <p class="pet-description">
                    ${pet.description || 'Este adorable animal busca un hogar lleno de amor.'}
                </p>
                <div class="pet-details">
                    <div class="detail-item">
                        <div class="detail-label">Peso</div>
                        <div class="detail-value">${pet.weight} kg</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Genero</div>
                        <div class="detail-value">${genderText}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Padrinos</div>
                        <div class="detail-value">${pet.sponsors || 0}</div>
                    </div>
                </div>
                <div class="pet-actions">
                    ${currentView === 'adoption' ? '<button class="action-btn adopt-btn">Adoptame</button>' : '<span class="adopted-badge">🏠 Adoptado</span>'}
                    ${isLoggedIn ? '<button class="action-btn edit-btn admin-only visible">Editar</button>' : ''}
                    ${isLoggedIn ? '<button class="action-btn delete-btn admin-only visible">Eliminar</button>' : ''}
                </div>
            </div>
        </div>
    `;
}

function renderProfile(pet) {
    const emoji = pet.type === 'dog' ? '🐕' : '🐱';
    const typeText = pet.type === 'dog' ? 'Perro' : 'Gato';
    const genderText = pet.gender === 'male' ? 'Macho' : 'Hembra';
    const statusText = {
        active: 'Disponible',
        scheduled: 'Reservado',
        inactive: 'Adoptado'
    };
    const statusColor = {
        active: '#166534',
        scheduled: '#92400e',
        inactive: '#64748b'
    };

    // Get main photo or first photo
    const mainPhoto = pet.photos && pet.photos.length > 0
        ? pet.photos.find(p => p.isMain) || pet.photos[0]
        : null;

    const profileImage = mainPhoto
        ? `<img src="${mainPhoto.url}" alt="${pet.name}" class="profile-image-img">`
        : `<div class="profile-image">${emoji}</div>`;

    return `
        <div class="profile-header">
            ${profileImage}
            <div class="profile-info">
                <h2 class="profile-name">${pet.name}</h2>
                <p class="profile-breed">${pet.breed}</p>
                <div class="profile-badges">
                    <span class="profile-badge type">${typeText.toUpperCase()}</span>
                    <span class="profile-badge status" style="background: ${statusColor[pet.status]}20; color: ${statusColor[pet.status]}">
                        ${statusText[pet.status] || 'Disponible'}
                    </span>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h3 class="profile-section-title">Sobre mi</h3>
            <p class="profile-description">${pet.description || 'Este adorable animal busca un hogar lleno de amor. Ven a conocerlo!'}</p>
        </div>

        ${pet.photos && pet.photos.length > 1 ? `
        <div class="profile-section">
            <h3 class="profile-section-title">Galeria de Fotos</h3>
            <div class="profile-gallery">
                ${pet.photos.map((photo, index) => `
                    <div class="profile-gallery-item ${photo.isMain ? 'is-main' : ''}" onclick="openGalleryPhoto('${photo.url}')">
                        <img src="${photo.url}" alt="Foto ${index + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${pet.videos && pet.videos.length > 0 ? `
        <div class="profile-section">
            <h3 class="profile-section-title">Videos</h3>
            <div class="profile-videos">
                ${pet.videos.map((video, index) => `
                    <div class="profile-video-item">
                        <video src="${video.url}" controls></video>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="profile-section">
            <h3 class="profile-section-title">Detalles</h3>
            <div class="profile-details-grid">
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Edad</div>
                    <div class="profile-detail-value">${pet.age} ${pet.age === 1 ? 'año' : 'años'}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Peso</div>
                    <div class="profile-detail-value">${pet.weight} kg</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Genero</div>
                    <div class="profile-detail-value">${genderText}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Padrinos</div>
                    <div class="profile-detail-value">${pet.sponsors || 0}</div>
                </div>
            </div>
        </div>

        ${pet.status === 'inactive' ? `
        <div class="profile-section">
            <h3 class="profile-section-title">🏠 Final Feliz</h3>
            <p class="profile-description">Este animal ya encontro su familia para siempre. Gracias a personas como tu, cada dia mas animales encuentran un hogar.</p>
            <div class="profile-cta">
                <button class="btn btn-secondary" onclick="openHelpModal('donaciones')">
                    💝 Hacer una donacion
                </button>
            </div>
        </div>
        ` : `
        <div class="profile-section">
            <h3 class="profile-section-title">Quieres adoptarme?</h3>
            <p class="profile-description">Si estas interesado en darme un hogar, contacta con la protectora. Estaremos encantados de conocerte y contarte mas sobre mi.</p>
            <div class="profile-cta">
                <button class="btn btn-primary btn-large" onclick="openAdoptionFormModalFromProfile('${pet._id}')">
                    ❤️ Quiero Adoptar
                </button>
                <button class="btn btn-secondary" onclick="openHelpModal('apadrina')">
                    🌟 Apadrinar
                </button>
            </div>
        </div>
        `}

        ${isLoggedIn ? `
        <div class="profile-section profile-admin">
            <h3 class="profile-section-title">Administracion</h3>
            <div class="profile-cta">
                <button class="btn btn-secondary" onclick="closeProfileModal(); openEditModal('${pet._id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="background: #991b1b; color: white; border-color: #991b1b;" onclick="closeProfileModal(); deletePet('${pet._id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
        ` : ''}
    `;
}

// Funciones de Manejo
function handleViewChange(btn) {
    const viewValue = btn.dataset.value;

    document.querySelectorAll('[data-filter="view"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = viewValue;

    // Actualizar titulo segun la vista
    const contentTitle = document.querySelector('.content-title');
    const contentSubtitle = document.querySelector('.content-subtitle');
    const contentHeader = document.querySelector('.content-header');

    // Mostrar/ocultar boton de agregar animal
    const addPetBtn = document.getElementById('addPetBtn');

    if (currentView === 'adoption') {
        contentTitle.textContent = 'Nuestros Animales';
        contentSubtitle.textContent = 'Conoce a los animales que buscan un hogar';
        contentHeader.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        if (isLoggedIn) addPetBtn.classList.add('visible');
        loadPets();
    } else if (currentView === 'happy') {
        contentTitle.textContent = 'Finales Felices';
        contentSubtitle.textContent = 'Animales que ya encontraron su familia';
        contentHeader.style.display = 'flex';
        petsGrid.classList.remove('full-width-view');
        addPetBtn.classList.remove('visible');
        loadPets();
    } else if (currentView === 'about') {
        contentHeader.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderAboutPage();
    } else if (currentView === 'contact') {
        contentHeader.style.display = 'none';
        petsGrid.classList.add('full-width-view');
        addPetBtn.classList.remove('visible');
        renderContactPage();
    }
}

function renderAboutPage() {
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">🐾</div>
                <h1>Protectora de Animales Uskar</h1>
                <p>Rescatando vidas, creando familias desde 2010</p>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Mision</h2>
                <p>Somos una organizacion sin animo de lucro dedicada al rescate, rehabilitacion y busqueda de hogares para animales abandonados y maltratados. Trabajamos incansablemente para darles una segunda oportunidad.</p>
            </div>

            <div class="about-section-content">
                <h2>Que Hacemos</h2>
                <div class="about-cards-grid">
                    <div class="about-card-item">
                        <span class="about-card-icon">🚑</span>
                        <h3>Rescate</h3>
                        <p>Rescatamos animales en situacion de abandono o maltrato.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">💊</span>
                        <h3>Cuidados</h3>
                        <p>Proporcionamos atencion veterinaria y rehabilitacion.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">🏠</span>
                        <h3>Adopcion</h3>
                        <p>Buscamos familias responsables para cada animal.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">📢</span>
                        <h3>Concienciacion</h3>
                        <p>Educamos sobre tenencia responsable de animales.</p>
                    </div>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Historia</h2>
                <p>La Protectora de Animales Uskar nacio en 2010 de la mano de un pequeño grupo de voluntarios apasionados por el bienestar animal. Lo que comenzo como una iniciativa local para ayudar a los animales abandonados de nuestra comunidad, se ha convertido en una organizacion consolidada que ha salvado miles de vidas.</p>
                <p>A lo largo de estos años, hemos crecido gracias al apoyo incondicional de nuestros voluntarios, colaboradores y adoptantes.</p>
            </div>
        </div>
    `;
}

function renderContactPage() {
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">📞</div>
                <h1>Contactanos</h1>
                <p>Estamos aqui para ayudarte</p>
            </div>

            <div class="contact-grid">
                <div class="contact-card">
                    <span class="contact-icon">📍</span>
                    <h3>Direccion</h3>
                    <p>Calle Example 123</p>
                    <p>Ciudad, CP 00000</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">📞</span>
                    <h3>Telefono</h3>
                    <p>Lunes a Domingo</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">✉️</span>
                    <h3>Email</h3>
                    <p>info@protectorauskar.org</p>
                    <p>adopciones@protectorauskar.org</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">🕐</span>
                    <h3>Horario</h3>
                    <p>Lunes a Domingo</p>
                    <p>10:00 - 18:00</p>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Redes Sociales</h2>
                <div class="social-links">
                    <a href="#" class="social-link">📘 Facebook</a>
                    <a href="#" class="social-link">📸 Instagram</a>
                    <a href="#" class="social-link">🐦 Twitter</a>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Como llegar</h2>
                <div class="map-placeholder">
                    <span>🗺️</span>
                    <p>Mapa de ubicacion</p>
                </div>
            </div>
        </div>
    `;
}

// Vista de Solicitudes de Adopcion (Admin)
async function renderAdoptionRequestsView() {
    const contentHeader = document.querySelector('.content-header');
    const addPetBtn = document.getElementById('addPetBtn');

    contentHeader.style.display = 'none';
    addPetBtn.classList.remove('visible');
    petsGrid.classList.add('full-width-view');

    // Mostrar loading
    petsGrid.innerHTML = '<div class="loading-state"><span>⏳</span><p>Cargando solicitudes...</p></div>';

    try {
        const response = await fetch(ADOPTIONS_API_URL);
        adoptionRequests = await response.json();
        renderRequestsTable();
    } catch (error) {
        petsGrid.innerHTML = '<div class="error-state"><span>❌</span><p>Error al cargar solicitudes</p></div>';
    }
}

function renderRequestsTable() {
    const statusLabels = {
        pending: 'Pendiente',
        reviewing: 'En revision',
        approved: 'Aprobada',
        rejected: 'Rechazada'
    };

    const statusColors = {
        pending: '#f59e0b',
        reviewing: '#3b82f6',
        approved: '#10b981',
        rejected: '#ef4444'
    };

    // Filtrar solicitudes
    let filteredRequests = adoptionRequests;
    if (requestsFilter !== 'all') {
        filteredRequests = adoptionRequests.filter(r => r.status === requestsFilter);
    }

    const statsHtml = `
        <div class="requests-stats">
            <div class="stat-chip ${requestsFilter === 'all' ? 'active' : ''}" onclick="filterRequests('all')">
                <span>Todas</span>
                <span class="stat-count">${adoptionRequests.length}</span>
            </div>
            <div class="stat-chip ${requestsFilter === 'pending' ? 'active' : ''}" onclick="filterRequests('pending')">
                <span>Pendientes</span>
                <span class="stat-count">${adoptionRequests.filter(r => r.status === 'pending').length}</span>
            </div>
            <div class="stat-chip ${requestsFilter === 'reviewing' ? 'active' : ''}" onclick="filterRequests('reviewing')">
                <span>En revision</span>
                <span class="stat-count">${adoptionRequests.filter(r => r.status === 'reviewing').length}</span>
            </div>
            <div class="stat-chip ${requestsFilter === 'approved' ? 'active' : ''}" onclick="filterRequests('approved')">
                <span>Aprobadas</span>
                <span class="stat-count">${adoptionRequests.filter(r => r.status === 'approved').length}</span>
            </div>
            <div class="stat-chip ${requestsFilter === 'rejected' ? 'active' : ''}" onclick="filterRequests('rejected')">
                <span>Rechazadas</span>
                <span class="stat-count">${adoptionRequests.filter(r => r.status === 'rejected').length}</span>
            </div>
        </div>
    `;

    if (filteredRequests.length === 0) {
        petsGrid.innerHTML = `
            <div class="requests-view">
                <div class="requests-header">
                    <h1>📊 Solicitudes de Adopcion</h1>
                    <p>Gestiona las solicitudes recibidas</p>
                </div>
                ${statsHtml}
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3 class="empty-title">No hay solicitudes</h3>
                    <p class="empty-text">${requestsFilter === 'all' ? 'Aun no se han recibido solicitudes de adopcion' : 'No hay solicitudes con este estado'}</p>
                </div>
            </div>
        `;
        return;
    }

    const tableRows = filteredRequests.map(request => {
        const date = new Date(request.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        return `
            <tr class="request-row" onclick="viewRequestDetails('${request._id}')">
                <td class="request-date">${date}</td>
                <td class="request-name">${request.fullName}</td>
                <td class="request-email">${request.email}</td>
                <td class="request-phone">${request.phone}</td>
                <td class="request-pet">${request.petName || 'General'}</td>
                <td>
                    <span class="request-status" style="background: ${statusColors[request.status]}20; color: ${statusColors[request.status]}">
                        ${statusLabels[request.status]}
                    </span>
                </td>
                <td class="request-actions">
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${request._id}', 'reviewing')" title="En revision">📝</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${request._id}', 'approved')" title="Aprobar">✅</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${request._id}', 'rejected')" title="Rechazar">❌</button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteRequest('${request._id}')" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    petsGrid.innerHTML = `
        <div class="requests-view">
            <div class="requests-header">
                <h1>📊 Solicitudes de Adopcion</h1>
                <p>Gestiona las solicitudes recibidas</p>
            </div>
            ${statsHtml}
            <div class="requests-table-container">
                <table class="requests-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Telefono</th>
                            <th>Animal</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function filterRequests(status) {
    requestsFilter = status;
    renderRequestsTable();
}

async function changeRequestStatus(requestId, newStatus) {
    try {
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            const statusLabels = {
                pending: 'pendiente',
                reviewing: 'en revision',
                approved: 'aprobada',
                rejected: 'rechazada'
            };
            showToast(`Solicitud marcada como ${statusLabels[newStatus]}`, 'success');
            renderAdoptionRequestsView();
        }
    } catch (error) {
        showToast('Error al actualizar estado', 'error');
    }
}

async function deleteRequest(requestId) {
    if (!confirm('¿Eliminar esta solicitud permanentemente?')) return;

    try {
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showToast('Solicitud eliminada', 'success');
            renderAdoptionRequestsView();
        }
    } catch (error) {
        showToast('Error al eliminar solicitud', 'error');
    }
}

async function viewRequestDetails(requestId) {
    try {
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`);
        const request = await response.json();

        const statusLabels = {
            pending: 'Pendiente',
            reviewing: 'En revision',
            approved: 'Aprobada',
            rejected: 'Rechazada'
        };

        const date = new Date(request.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const detailsHtml = `
            <div class="request-details">
                <div class="request-details-header">
                    <h3>Solicitud de ${request.fullName}</h3>
                    <span class="request-status-large status-${request.status}">${statusLabels[request.status]}</span>
                </div>
                <p class="request-date-detail">Recibida el ${date}</p>

                ${request.petName ? `
                <div class="detail-section">
                    <h4>🐾 Animal de interes</h4>
                    <p><strong>${request.petName}</strong></p>
                </div>
                ` : ''}

                ${request.presentationVideo && request.presentationVideo.url ? `
                <div class="detail-section">
                    <h4>🎥 Video de Presentacion</h4>
                    <div class="request-video-container">
                        <video src="${request.presentationVideo.url}" controls></video>
                    </div>
                </div>
                ` : ''}

                <div class="detail-section">
                    <h4>👤 Datos Personales</h4>
                    <div class="detail-grid">
                        <div><span>Nombre:</span> ${request.fullName}</div>
                        <div><span>Edad:</span> ${request.age} años</div>
                        <div><span>Email:</span> ${request.email}</div>
                        <div><span>Telefono:</span> ${request.phone}</div>
                        <div><span>Direccion:</span> ${request.address}</div>
                        <div><span>Ciudad:</span> ${request.city}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🏠 Vivienda</h4>
                    <div class="detail-grid">
                        <div><span>Tipo:</span> ${request.housingType}</div>
                        <div><span>Propiedad:</span> ${request.ownerOrRenter === 'propietario' ? 'Propietario' : 'Alquiler'}</div>
                        <div><span>Jardin/Terraza:</span> ${request.hasGarden ? 'Si' : 'No'}</div>
                        ${request.ownerOrRenter === 'alquiler' ? `<div><span>Propietario permite:</span> ${request.landlordAllowsPets ? 'Si' : 'No'}</div>` : ''}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>👨‍👩‍👧‍👦 Familia</h4>
                    <div class="detail-grid">
                        <div><span>Miembros:</span> ${request.familyMembers}</div>
                        <div><span>Niños:</span> ${request.hasChildren ? 'Si' + (request.childrenAges ? ' (' + request.childrenAges + ')' : '') : 'No'}</div>
                        <div><span>Todos de acuerdo:</span> ${request.allAgree ? 'Si' : 'No'}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🐕 Experiencia</h4>
                    <div class="detail-grid">
                        <div><span>Otras mascotas:</span> ${request.hasOtherPets ? 'Si' : 'No'}</div>
                        ${request.otherPetsDescription ? `<div class="full-width"><span>Descripcion:</span> ${request.otherPetsDescription}</div>` : ''}
                        ${request.previousPetExperience ? `<div class="full-width"><span>Experiencia previa:</span> ${request.previousPetExperience}</div>` : ''}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>❤️ Motivacion</h4>
                    <div class="detail-grid">
                        <div class="full-width"><span>Por que quiere adoptar:</span><br>${request.whyAdopt}</div>
                        <div><span>Horas solo:</span> ${request.hoursAlone}h/dia</div>
                        ${request.vacationPlan ? `<div><span>Plan vacaciones:</span> ${request.vacationPlan}</div>` : ''}
                    </div>
                </div>

                <div class="request-details-actions">
                    <button class="btn btn-secondary" onclick="changeRequestStatus('${request._id}', 'reviewing'); closeProfileModal();">📝 En Revision</button>
                    <button class="btn btn-primary" onclick="changeRequestStatus('${request._id}', 'approved'); closeProfileModal();">✅ Aprobar</button>
                    <button class="btn btn-secondary" style="background: #ef4444; border-color: #ef4444; color: white;" onclick="changeRequestStatus('${request._id}', 'rejected'); closeProfileModal();">❌ Rechazar</button>
                </div>
            </div>
        `;

        document.getElementById('profileContent').innerHTML = detailsHtml;
        document.querySelector('#profileModal .modal-title').textContent = '📋 Detalles de Solicitud';
        profileModal.classList.add('active');

    } catch (error) {
        showToast('Error al cargar detalles', 'error');
    }
}

// About Modal
function openAboutModal() {
    aboutModal.classList.add('active');
}

function closeAboutModal() {
    aboutModal.classList.remove('active');
}

function handleFormSubmit(e) {
    e.preventDefault();

    const petData = {
        name: document.getElementById('petName').value,
        type: document.getElementById('petType').value,
        breed: document.getElementById('petBreed').value,
        age: parseInt(document.getElementById('petAge').value),
        weight: parseFloat(document.getElementById('petWeight').value),
        gender: document.getElementById('petGender').value,
        description: document.getElementById('petDescription').value,
        status: document.getElementById('petStatus').value,
        sponsors: parseInt(document.getElementById('petSponsors').value) || 0,
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    };

    console.log('Built petData:', petData);
    savePet(petData);
}

// Funciones de Modal
function openAddModal() {
    modalTitle.textContent = 'Nuevo Animal';
    petForm.reset();
    document.getElementById('petId').value = '';

    // Reset file selections
    selectedPhotos = [];
    selectedVideos = [];
    editingPetId = null;

    // Clear preview containers
    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';
    document.getElementById('existingMedia').style.display = 'none';
    document.getElementById('existingPhotos').innerHTML = '';
    document.getElementById('existingVideos').innerHTML = '';

    // Reset file inputs
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';

    petModal.classList.add('active');
}

function openEditModal(id) {
    const pet = pets.find(p => p._id === id);
    if (!pet) return;

    modalTitle.textContent = 'Editar Animal';
    document.getElementById('petId').value = pet._id;
    document.getElementById('petName').value = pet.name;
    document.getElementById('petType').value = pet.type;
    document.getElementById('petBreed').value = pet.breed;
    document.getElementById('petAge').value = pet.age;
    document.getElementById('petWeight').value = pet.weight;
    document.getElementById('petGender').value = pet.gender;
    document.getElementById('petDescription').value = pet.description || '';
    document.getElementById('petStatus').value = pet.status;
    document.getElementById('petSponsors').value = pet.sponsors || 0;

    // Reset new file selections
    selectedPhotos = [];
    selectedVideos = [];
    editingPetId = pet._id;

    // Clear new file preview containers
    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';

    // Reset file inputs
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';

    // Show existing media
    renderExistingMedia(pet);

    petModal.classList.add('active');
}

function closeModal() {
    petModal.classList.remove('active');

    // Clear file selections
    selectedPhotos = [];
    selectedVideos = [];
    editingPetId = null;

    // Clear preview containers
    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';
    document.getElementById('existingMedia').style.display = 'none';

    // Reset file inputs
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';
}

function viewProfile(id) {
    const pet = pets.find(p => p._id === id);
    if (!pet) return;

    document.getElementById('profileContent').innerHTML = renderProfile(pet);
    profileModal.classList.add('active');
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

function openHelpModal(action) {
    const content = helpContent[action];
    if (!content) return;

    document.getElementById('helpModalTitle').innerHTML = `${content.icon} ${content.title}`;
    document.getElementById('helpContent').innerHTML = content.content;
    helpModal.classList.add('active');
}

function closeHelpModal() {
    helpModal.classList.remove('active');
}

// Funciones del Formulario de Adopcion
function openAdoptionFormModal(pet = null) {
    adoptionForm.reset();

    // Reset checkboxes y campos condicionales
    document.getElementById('childrenAgesGroup').style.display = 'none';
    document.getElementById('otherPetsGroup').style.display = 'none';
    document.getElementById('adoptLandlordAllows').checked = true;

    // Reset video
    adoptionPresentationVideo = null;
    document.getElementById('adoptVideoPreview').innerHTML = '';
    document.getElementById('adoptPresentationVideo').value = '';

    // Generar nuevo CAPTCHA
    generateCaptcha();

    if (pet) {
        document.getElementById('adoptionPetId').value = pet._id;
        document.getElementById('adoptionPetName').value = pet.name;
        document.getElementById('adoptPetNameInput').value = pet.name;

        const emoji = pet.type === 'dog' ? '🐕' : '🐱';
        const typeText = pet.type === 'dog' ? 'Perro' : 'Gato';

        // Obtener foto principal
        const mainPhoto = pet.photos && pet.photos.length > 0
            ? pet.photos.find(p => p.isMain) || pet.photos[0]
            : null;

        const photoHtml = mainPhoto
            ? `<img src="${mainPhoto.url}" alt="${pet.name}" class="pet-thumb">`
            : `<div class="pet-thumb">${emoji}</div>`;

        document.getElementById('petInterestDisplay').innerHTML = `
            <div class="pet-info-row">
                ${photoHtml}
                <div class="pet-details">
                    <h4>${pet.name}</h4>
                    <p>${typeText} - ${pet.breed} - ${pet.age} ${pet.age === 1 ? 'año' : 'años'}</p>
                </div>
            </div>
        `;
    } else {
        document.getElementById('adoptionPetId').value = '';
        document.getElementById('adoptionPetName').value = '';
        document.getElementById('adoptPetNameInput').value = '';
        document.getElementById('petInterestDisplay').innerHTML = '<span>Solicitud general de adopcion</span>';
    }

    adoptionFormModal.classList.add('active');
}

function openAdoptionFormModalFromProfile(petId) {
    const pet = pets.find(p => p._id === petId);
    closeProfileModal();
    openAdoptionFormModal(pet);
}

function closeAdoptionFormModal() {
    adoptionFormModal.classList.remove('active');
    adoptionPresentationVideo = null;
    document.getElementById('adoptVideoPreview').innerHTML = '';
}

function renderAdoptionVideoPreview() {
    const preview = document.getElementById('adoptVideoPreview');
    if (!adoptionPresentationVideo) {
        preview.innerHTML = '';
        return;
    }

    const url = URL.createObjectURL(adoptionPresentationVideo);
    preview.innerHTML = `
        <div class="adopt-video-preview-item">
            <video src="${url}" controls></video>
            <div class="adopt-video-info">
                <div class="adopt-video-name">${adoptionPresentationVideo.name}</div>
                <div class="adopt-video-size">${(adoptionPresentationVideo.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button type="button" class="video-delete-btn" onclick="removeAdoptionVideo()">Eliminar</button>
        </div>
    `;
}

function removeAdoptionVideo() {
    adoptionPresentationVideo = null;
    document.getElementById('adoptPresentationVideo').value = '';
    document.getElementById('adoptVideoPreview').innerHTML = '';
}

// CAPTCHA Functions
function generateCaptcha() {
    const operations = ['+', '-', 'x'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, result;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            result = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 20) + 10;
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 - num2;
            break;
        case 'x':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 * num2;
            break;
    }

    captchaAnswer = result;
    document.getElementById('captchaQuestion').textContent = `¿Cuanto es ${num1} ${operation} ${num2}?`;
    document.getElementById('captchaAnswer').value = '';
}

function validateCaptcha() {
    const userAnswer = parseInt(document.getElementById('captchaAnswer').value);
    return userAnswer === captchaAnswer;
}

async function handleAdoptionFormSubmit(e) {
    e.preventDefault();

    // Validar CAPTCHA
    if (!validateCaptcha()) {
        showToast('Respuesta incorrecta. Por favor, resuelve la operacion matematica.', 'error');
        generateCaptcha();
        return;
    }

    // Usar el nombre del input o el preseleccionado
    const petNameInput = document.getElementById('adoptPetNameInput').value;
    const petNameHidden = document.getElementById('adoptionPetName').value;

    const adoptionData = {
        petId: document.getElementById('adoptionPetId').value || null,
        petName: petNameInput || petNameHidden || null,

        // Datos personales
        fullName: document.getElementById('adoptFullName').value,
        email: document.getElementById('adoptEmail').value,
        phone: document.getElementById('adoptPhone').value,
        age: parseInt(document.getElementById('adoptAge').value),
        address: document.getElementById('adoptAddress').value,
        city: document.getElementById('adoptCity').value,

        // Vivienda
        housingType: document.getElementById('adoptHousingType').value,
        hasGarden: document.getElementById('adoptHasGarden').checked,
        ownerOrRenter: document.getElementById('adoptOwnerOrRenter').value,
        landlordAllowsPets: document.getElementById('adoptLandlordAllows').checked,

        // Familia
        familyMembers: parseInt(document.getElementById('adoptFamilyMembers').value),
        hasChildren: document.getElementById('adoptHasChildren').checked,
        childrenAges: document.getElementById('adoptChildrenAges').value || '',
        allAgree: document.getElementById('adoptAllAgree').checked,

        // Experiencia
        hasOtherPets: document.getElementById('adoptHasOtherPets').checked,
        otherPetsDescription: document.getElementById('adoptOtherPetsDesc').value || '',
        previousPetExperience: document.getElementById('adoptPreviousExperience').value || '',

        // Adopcion
        whyAdopt: document.getElementById('adoptWhyAdopt').value,
        hoursAlone: parseInt(document.getElementById('adoptHoursAlone').value),
        vacationPlan: document.getElementById('adoptVacationPlan').value || '',
        commitmentAware: document.getElementById('adoptCommitment').checked
    };

    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(adoptionData));

        // Añadir video si existe
        if (adoptionPresentationVideo) {
            formData.append('presentationVideo', adoptionPresentationVideo);
        }

        const response = await fetch(ADOPTIONS_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        showToast('Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.', 'success');
        closeAdoptionFormModal();
    } catch (error) {
        showToast(error.message || 'Error al enviar la solicitud', 'error');
    }
}

// Funciones de Login
function openLoginModal() {
    loginForm.reset();
    loginModal.classList.add('active');
}

function closeLoginModal() {
    loginModal.classList.remove('active');
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPassword').value;

    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        updateUIForLogin();
        closeLoginModal();
        showToast('Sesion iniciada correctamente', 'success');
        loadPets(); // Recargar para mostrar botones de admin
    } else {
        showToast('Usuario o contrasena incorrectos', 'error');
    }
}

function logout() {
    isLoggedIn = false;
    updateUIForLogin();
    showToast('Sesion cerrada', 'success');
    loadPets(); // Recargar para ocultar botones de admin
}

function updateUIForLogin() {
    // Actualizar boton de login
    if (isLoggedIn) {
        loginBtn.innerHTML = '<span>🔓</span><span>Cerrar Sesion</span>';
        loginBtn.classList.add('logged-in');
    } else {
        loginBtn.innerHTML = '<span>👤</span><span>Iniciar Sesion</span>';
        loginBtn.classList.remove('logged-in');
    }

    // Mostrar/ocultar boton de agregar animal
    const addPetBtn = document.getElementById('addPetBtn');
    const viewRequestsBtn = document.getElementById('viewAdoptionRequestsBtn');

    if (isLoggedIn) {
        addPetBtn.classList.add('visible');
        viewRequestsBtn.classList.add('visible');
    } else {
        addPetBtn.classList.remove('visible');
        viewRequestsBtn.classList.remove('visible');
        // Si estaba viendo solicitudes, volver a adopcion
        if (currentView === 'requests') {
            currentView = 'adoption';
            document.querySelector('[data-value="adoption"]').classList.add('active');
            loadPets();
        }
    }
}

// Funciones de Utilidad
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function exportData() {
    const dataStr = JSON.stringify(pets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animales_protectora_uskar.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Datos exportados correctamente', 'success');
}

// File Upload Functions
function setupFileUploads() {
    const photoInput = document.getElementById('petPhotos');
    const videoInput = document.getElementById('petVideos');
    const photoUploadArea = document.getElementById('photoUploadArea');
    const videoUploadArea = document.getElementById('videoUploadArea');

    // Photo input change
    photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        selectedPhotos = [...selectedPhotos, ...files].slice(0, 10);
        renderPhotoPreview();
    });

    // Video input change
    videoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        selectedVideos = [...selectedVideos, ...files].slice(0, 5);
        renderVideoPreview();
    });

    // Drag and drop for photos
    photoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        photoUploadArea.classList.add('dragover');
    });

    photoUploadArea.addEventListener('dragleave', () => {
        photoUploadArea.classList.remove('dragover');
    });

    photoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        photoUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        selectedPhotos = [...selectedPhotos, ...files].slice(0, 10);
        renderPhotoPreview();
    });

    // Drag and drop for videos (accepts both images and videos)
    videoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        videoUploadArea.classList.add('dragover');
    });

    videoUploadArea.addEventListener('dragleave', () => {
        videoUploadArea.classList.remove('dragover');
    });

    videoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        videoUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(f =>
            f.type.startsWith('video/') || f.type.startsWith('image/')
        );
        selectedVideos = [...selectedVideos, ...files].slice(0, 5);
        renderVideoPreview();
    });
}

function renderPhotoPreview() {
    const grid = document.getElementById('photoPreviewGrid');
    grid.innerHTML = selectedPhotos.map((file, index) => {
        const url = URL.createObjectURL(file);
        return `
            <div class="photo-preview-item ${index === 0 ? 'is-main' : ''}" data-index="${index}">
                <img src="${url}" alt="Preview">
                ${index === 0 ? '<span class="photo-main-badge">Principal</span>' : ''}
                <div class="photo-preview-overlay">
                    ${index !== 0 ? `<button class="photo-preview-btn" onclick="setMainPhoto(${index})">Hacer principal</button>` : ''}
                    <button class="photo-preview-btn delete-btn" onclick="removePhoto(${index})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderVideoPreview() {
    const list = document.getElementById('videoPreviewList');
    list.innerHTML = selectedVideos.map((file, index) => {
        const url = URL.createObjectURL(file);
        const isVideo = file.type.startsWith('video/');
        const mediaElement = isVideo
            ? `<video src="${url}"></video>`
            : `<img src="${url}" alt="${file.name}">`;
        return `
            <div class="video-preview-item" data-index="${index}">
                ${mediaElement}
                <div class="video-preview-info">
                    <div class="video-preview-name">${file.name}</div>
                    <div class="video-preview-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
                <button class="video-delete-btn" onclick="removeVideo(${index})">Eliminar</button>
            </div>
        `;
    }).join('');
}

function setMainPhoto(index) {
    if (index > 0 && index < selectedPhotos.length) {
        const photo = selectedPhotos.splice(index, 1)[0];
        selectedPhotos.unshift(photo);
        renderPhotoPreview();
    }
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    renderPhotoPreview();
}

function removeVideo(index) {
    selectedVideos.splice(index, 1);
    renderVideoPreview();
}

function renderExistingMedia(pet) {
    const container = document.getElementById('existingMedia');
    const photosContainer = document.getElementById('existingPhotos');
    const videosContainer = document.getElementById('existingVideos');

    if ((pet.photos && pet.photos.length > 0) || (pet.videos && pet.videos.length > 0)) {
        container.style.display = 'block';

        // Render existing photos
        if (pet.photos && pet.photos.length > 0) {
            photosContainer.innerHTML = `
                <h5>Fotos actuales</h5>
                <div class="photo-preview-grid">
                    ${pet.photos.map((photo, index) => `
                        <div class="photo-preview-item ${photo.isMain ? 'is-main' : ''}" data-index="${index}">
                            <img src="${photo.url}" alt="Foto ${index + 1}">
                            ${photo.isMain ? '<span class="photo-main-badge">Principal</span>' : ''}
                            <div class="photo-preview-overlay">
                                ${!photo.isMain ? `<button class="photo-preview-btn" onclick="setExistingMainPhoto('${pet._id}', ${index})">Hacer principal</button>` : ''}
                                <button class="photo-preview-btn delete-btn" onclick="deleteExistingPhoto('${pet._id}', ${index})">Eliminar</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            photosContainer.innerHTML = '';
        }

        // Render existing videos
        if (pet.videos && pet.videos.length > 0) {
            videosContainer.innerHTML = `
                <h5>Videos actuales</h5>
                <div class="video-preview-list">
                    ${pet.videos.map((video, index) => `
                        <div class="video-preview-item" data-index="${index}">
                            <video src="${video.url}" controls></video>
                            <div class="video-preview-info">
                                <div class="video-preview-name">Video ${index + 1}</div>
                            </div>
                            <button class="video-delete-btn" onclick="deleteExistingVideo('${pet._id}', ${index})">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            videosContainer.innerHTML = '';
        }
    } else {
        container.style.display = 'none';
    }
}

async function setExistingMainPhoto(petId, photoIndex) {
    try {
        const response = await fetch(`${API_URL}/${petId}/main-photo/${photoIndex}`, {
            method: 'PUT'
        });
        if (response.ok) {
            const updatedPet = await response.json();
            // Update in local array
            const index = pets.findIndex(p => p._id === petId);
            if (index !== -1) pets[index] = updatedPet;
            renderExistingMedia(updatedPet);
            showToast('Foto principal actualizada', 'success');
        }
    } catch (error) {
        showToast('Error al actualizar foto principal', 'error');
    }
}

async function deleteExistingPhoto(petId, photoIndex) {
    if (!confirm('Eliminar esta foto?')) return;
    try {
        const response = await fetch(`${API_URL}/${petId}/photo/${photoIndex}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const updatedPet = await response.json();
            const index = pets.findIndex(p => p._id === petId);
            if (index !== -1) pets[index] = updatedPet;
            renderExistingMedia(updatedPet);
            showToast('Foto eliminada', 'success');
        }
    } catch (error) {
        showToast('Error al eliminar foto', 'error');
    }
}

async function deleteExistingVideo(petId, videoIndex) {
    if (!confirm('Eliminar este video?')) return;
    try {
        const response = await fetch(`${API_URL}/${petId}/video/${videoIndex}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const updatedPet = await response.json();
            const index = pets.findIndex(p => p._id === petId);
            if (index !== -1) pets[index] = updatedPet;
            renderExistingMedia(updatedPet);
            showToast('Video eliminado', 'success');
        }
    } catch (error) {
        showToast('Error al eliminar video', 'error');
    }
}

// Gallery lightbox function
function openGalleryPhoto(url) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${url}" alt="Foto">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.remove();
        }
    });
    document.body.appendChild(lightbox);
}

// Hacer funciones globales para los botones del perfil
window.showToast = showToast;
window.openHelpModal = openHelpModal;
window.openEditModal = openEditModal;
window.deletePet = deletePet;
window.closeProfileModal = closeProfileModal;
window.setMainPhoto = setMainPhoto;
window.removePhoto = removePhoto;
window.removeVideo = removeVideo;
window.setExistingMainPhoto = setExistingMainPhoto;
window.deleteExistingPhoto = deleteExistingPhoto;
window.deleteExistingVideo = deleteExistingVideo;
window.openGalleryPhoto = openGalleryPhoto;
window.openAdoptionFormModal = openAdoptionFormModal;
window.openAdoptionFormModalFromProfile = openAdoptionFormModalFromProfile;
window.closeAdoptionFormModal = closeAdoptionFormModal;
window.filterRequests = filterRequests;
window.changeRequestStatus = changeRequestStatus;
window.deleteRequest = deleteRequest;
window.viewRequestDetails = viewRequestDetails;
window.removeAdoptionVideo = removeAdoptionVideo;
window.generateCaptcha = generateCaptcha;
