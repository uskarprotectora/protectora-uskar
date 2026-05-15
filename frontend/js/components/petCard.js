// Componente Pet Card - Tarjeta de mascota

function createPetCard(pet) {
    const emoji = pet.type === 'dog' ? '🐕' : '🐱';
    const typeText = pet.type === 'dog' ? t('pet.dog').toUpperCase() : t('pet.cat').toUpperCase();
    const badgeClass = pet.type === 'dog' ? 'badge-dog' : 'badge-cat';
    const genderText = pet.gender === 'male' ? t('pet.male') : t('pet.female');
    const sizeText = {
        small: t('pet.size.small'),
        medium: t('pet.size.medium'),
        large: t('pet.size.large')
    };
    const statusText = {
        active: t('pet.scheduled') === 'RESERVED' ? 'Available' : 'Disponible',
        scheduled: t('pet.scheduled'),
        inactive: t('pet.adopted')
    };
    const gradients = [
        'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)',
        'linear-gradient(135deg, #d7ccc8 0%, #bcaaa4 100%)',
        'linear-gradient(135deg, #e8ddd5 0%, #c4a98a 100%)',
        'linear-gradient(135deg, #ded4c8 0%, #a1887f 100%)',
        'linear-gradient(135deg, #d7ccc8 0%, #8d6e63 100%)'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const mainPhoto = pet.photos && pet.photos.length > 0
        ? pet.photos.find(p => p.isMain) || pet.photos[0]
        : null;

    const photoUrl = mainPhoto ? getMediaUrl(mainPhoto.url) : null;
    const imageContent = photoUrl
        ? `<img src="${sanitizeAttr(photoUrl)}" alt="${sanitizeAttr(pet.name)}" class="pet-image" onerror="this.parentElement.innerHTML='<div class=\\'pet-image placeholder-img\\' style=\\'background: ${randomGradient};\\'>${emoji}</div>'">`
        : `<div class="pet-image placeholder-img" style="background: ${randomGradient};">${emoji}</div>`;

    return `
        <div class="pet-card" data-id="${sanitizeAttr(pet._id)}">
            <div class="pet-image-container">
                ${imageContent}
                <div class="pet-badge ${badgeClass}">
                    <span>${emoji}</span>
                    <span>${typeText}</span>
                </div>
                <div class="status-badge status-${pet.status}">${statusText[pet.status] || 'Disponible'}</div>
                ${pet.urgent ? '<div class="urgent-badge">' + t('pet.urgent') + '</div>' : ''}
                ${AppState.isLoggedIn && AppState.currentView === 'adoption' ? '<div class="reorder-buttons"><button class="reorder-btn reorder-up" title="Mover arriba">▲</button><button class="reorder-btn reorder-down" title="Mover abajo">▼</button></div>' : ''}
            </div>
            <div class="pet-info">
                <div class="pet-header">
                    <div>
                        <h3 class="pet-name">${sanitizeHtml(pet.name)}</h3>
                        <p class="pet-breed">${sanitizeHtml(pet.breed)}</p>
                    </div>
                    ${pet.birthDate ? `<div class="pet-age">${formatAge(pet.birthDate)}</div>` : ''}
                </div>
                <p class="pet-description">
                    ${sanitizeHtml(pet.description) || 'Este adorable animal busca un hogar lleno de amor.'}
                </p>
                <div class="pet-details">
                    ${pet.size ? `<div class="detail-item">
                        <div class="detail-label">${t('profile.size')}</div>
                        <div class="detail-value">${sizeText[pet.size] || pet.size}</div>
                    </div>` : ''}
                    ${pet.weight != null ? `<div class="detail-item">
                        <div class="detail-label">${t('profile.weight')}</div>
                        <div class="detail-value">${pet.weight} kg</div>
                    </div>` : ''}
                    <div class="detail-item">
                        <div class="detail-label">${I18n.getCurrentLang() === 'es' ? 'Género' : 'Gender'}</div>
                        <div class="detail-value">${genderText}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">${I18n.getCurrentLang() === 'es' ? 'Salud' : 'Health'}</div>
                        <div class="detail-value">${pet.neutered ? '✂️' : ''}${pet.vaccinated ? '💉' : ''}${pet.chipped ? '📟' : ''}${!pet.neutered && !pet.vaccinated && !pet.chipped ? '-' : ''}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">${I18n.getCurrentLang() === 'es' ? 'Padrinos' : 'Sponsors'}</div>
                        <div class="detail-value">${pet.sponsors || 0}</div>
                    </div>
                </div>
                <div class="pet-actions">
                    ${AppState.currentView === 'adoption' ? '<button class="action-btn adopt-btn">' + t('profile.adopt') + '</button>' : '<span class="adopted-badge">🏠 ' + t('pet.adopted') + '</span>'}
                    ${AppState.isLoggedIn ? '<button class="action-btn edit-btn admin-only visible">' + t('profile.edit') + '</button>' : ''}
                    ${AppState.isLoggedIn && AppState.adminInfo && AppState.adminInfo.role === 'admin' ? '<button class="action-btn delete-btn admin-only visible">' + t('profile.delete') + '</button>' : ''}
                </div>
            </div>
        </div>
    `;
}

function renderPets() {
    const petsGrid = document.getElementById('petsGrid');

    if (AppState.pets.length === 0) {
        const isEnglish = I18n.getCurrentLang() === 'en';
        const emptyMessage = AppState.currentView === 'adoption'
            ? {
                title: isEnglish ? 'No animals for adoption' : 'No hay animales en adopción',
                text: isEnglish ? 'Currently we have no animals available' : 'Actualmente no tenemos animales disponibles'
              }
            : {
                title: isEnglish ? 'No happy endings yet' : 'No hay finales felices aún',
                text: isEnglish ? 'We will share adoption stories soon' : 'Pronto compartiremos historias de adopción'
              };

        petsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${AppState.currentView === 'adoption' ? '🐾' : '🏠'}</div>
                <h3 class="empty-title">${emptyMessage.title}</h3>
                <p class="empty-text">${emptyMessage.text}</p>
            </div>
        `;
        return;
    }

    petsGrid.innerHTML = AppState.pets.map(pet => createPetCard(pet)).join('');
    attachPetCardListeners();
}

function attachPetCardListeners() {
    document.querySelectorAll('.pet-card').forEach(card => {
        const petId = card.dataset.id;

        card.addEventListener('click', () => {
            viewProfile(petId);
        });

        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const adoptBtn = card.querySelector('.adopt-btn');

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

        if (adoptBtn) {
            adoptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const pet = AppState.pets.find(p => p._id === petId);
                openAdoptionFormModal(pet);
            });
        }

        const reorderUpBtn = card.querySelector('.reorder-up');
        const reorderDownBtn = card.querySelector('.reorder-down');

        if (reorderUpBtn) {
            reorderUpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                reorderPet(petId, 'up');
            });
        }

        if (reorderDownBtn) {
            reorderDownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                reorderPet(petId, 'down');
            });
        }
    });
}

// Exponer globalmente
window.createPetCard = createPetCard;
window.renderPets = renderPets;
