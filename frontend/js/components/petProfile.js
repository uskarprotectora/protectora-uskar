// Componente Pet Profile - Perfil detallado de mascota

function renderProfile(pet) {
    const emoji = pet.type === 'dog' ? '🐕' : '🐱';
    const typeText = pet.type === 'dog' ? 'Perro' : 'Gato';
    const genderText = pet.gender === 'male' ? 'Macho' : 'Hembra';
    const sizeText = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };
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

    const mainPhoto = pet.photos && pet.photos.length > 0
        ? pet.photos.find(p => p.isMain) || pet.photos[0]
        : null;

    const mainPhotoUrl = mainPhoto ? getMediaUrl(mainPhoto.url) : null;
    const profileImage = mainPhotoUrl
        ? `<img src="${sanitizeAttr(mainPhotoUrl)}" alt="${sanitizeAttr(pet.name)}" class="profile-image-img" onerror="this.outerHTML='<div class=\\'profile-image\\'>${emoji}</div>'">`
        : `<div class="profile-image">${emoji}</div>`;

    return `
        <div class="profile-header">
            ${profileImage}
            <div class="profile-info">
                <h2 class="profile-name">${sanitizeHtml(pet.name)}</h2>
                <p class="profile-breed">${sanitizeHtml(pet.breed)}</p>
                <div class="profile-badges">
                    <span class="profile-badge type">${typeText.toUpperCase()}</span>
                    <span class="profile-badge status" style="background: ${statusColor[pet.status]}20; color: ${statusColor[pet.status]}">
                        ${statusText[pet.status] || 'Disponible'}
                    </span>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h3 class="profile-section-title">Sobre mí</h3>
            <p class="profile-description">${sanitizeHtml(pet.description) || 'Este adorable animal busca un hogar lleno de amor. Ven a conocerlo!'}</p>
        </div>

        ${pet.photos && pet.photos.length > 1 ? `
        <div class="profile-section">
            <h3 class="profile-section-title">Galeria de Fotos</h3>
            <div class="profile-gallery">
                ${pet.photos.map((photo, index) => {
                    const photoUrl = getMediaUrl(photo.url);
                    return `
                    <div class="profile-gallery-item ${photo.isMain ? 'is-main' : ''}" onclick="openGalleryPhoto('${sanitizeAttr(photoUrl)}')">
                        <img src="${sanitizeAttr(photoUrl)}" alt="Foto ${index + 1}">
                    </div>
                `}).join('')}
            </div>
        </div>
        ` : ''}

        ${pet.videos && pet.videos.length > 0 ? `
        <div class="profile-section">
            <h3 class="profile-section-title">Videos</h3>
            <div class="profile-videos">
                ${pet.videos.map((video, index) => {
                    const videoUrl = getMediaUrl(video.url);
                    return `
                    <div class="profile-video-item">
                        <video src="${videoUrl}" controls></video>
                    </div>
                `}).join('')}
            </div>
        </div>
        ` : ''}

        <div class="profile-section">
            <h3 class="profile-section-title">Detalles</h3>
            <div class="profile-details-grid">
                ${pet.size ? `<div class="profile-detail-item">
                    <div class="profile-detail-label">Tamaño</div>
                    <div class="profile-detail-value">${sizeText[pet.size] || pet.size}</div>
                </div>` : ''}
                ${pet.birthDate ? `<div class="profile-detail-item">
                    <div class="profile-detail-label">Edad</div>
                    <div class="profile-detail-value">${formatAge(pet.birthDate)}</div>
                </div>` : ''}
                ${pet.weight != null ? `<div class="profile-detail-item">
                    <div class="profile-detail-label">Peso</div>
                    <div class="profile-detail-value">${pet.weight} kg</div>
                </div>` : ''}
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Género</div>
                    <div class="profile-detail-value">${genderText}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Castrado</div>
                    <div class="profile-detail-value">${pet.neutered ? 'Si' : 'No'}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Vacunado</div>
                    <div class="profile-detail-value">${pet.vaccinated ? 'Si' : 'No'}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">Chipado</div>
                    <div class="profile-detail-value">${pet.chipped ? 'Si' : 'No'}</div>
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
            <p class="profile-description">Este animal ya encontró su familia para siempre. Gracias a personas como tú, cada día más animales encuentran un hogar.</p>
            <div class="profile-cta">
                <button class="btn btn-secondary" onclick="openHelpModal('donaciones')">
                    💝 Hacer una donación
                </button>
            </div>
        </div>
        ` : `
        <div class="profile-section">
            <h3 class="profile-section-title">¿Quieres adoptarme?</h3>
            <p class="profile-description">Si estas interesado en darme un hogar, contacta con la protectora. Estaremos encantados de conocerte y contarte mas sobre mi.</p>
            <div class="profile-cta">
                <button class="btn btn-primary btn-large" onclick="openAdoptionFormModalFromProfile('${sanitizeAttr(pet._id)}')">
                    ❤️ Quiero Adoptar
                </button>
                <button class="btn btn-secondary" onclick="openHelpModal('apadrina')">
                    🌟 Apadrinar
                </button>
            </div>
        </div>
        `}

        ${AppState.isLoggedIn ? `
        <div class="profile-section profile-admin">
            <h3 class="profile-section-title">Administración</h3>
            <div class="profile-cta">
                <button class="btn btn-secondary" onclick="closeProfileModal(); openEditModal('${sanitizeAttr(pet._id)}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-secondary" style="background: #991b1b; color: white; border-color: #991b1b;" onclick="closeProfileModal(); deletePet('${sanitizeAttr(pet._id)}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
        ` : ''}
    `;
}

function viewProfile(id) {
    const pet = AppState.pets.find(p => p._id === id);
    if (!pet) return;

    document.getElementById('profileContent').innerHTML = renderProfile(pet);
    document.getElementById('profileModal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function openGalleryPhoto(url) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${sanitizeAttr(url)}" alt="Foto">
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

// Exponer globalmente
window.renderProfile = renderProfile;
window.viewProfile = viewProfile;
window.closeProfileModal = closeProfileModal;
window.openGalleryPhoto = openGalleryPhoto;
