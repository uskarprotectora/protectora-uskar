// Componente Pet Form - Formulario de crear/editar mascota

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Nuevo Animal';
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';

    AppState.selectedPhotos = [];
    AppState.selectedVideos = [];
    AppState.editingPetId = null;

    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';
    document.getElementById('existingMedia').style.display = 'none';
    document.getElementById('existingPhotos').innerHTML = '';
    document.getElementById('existingVideos').innerHTML = '';
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';

    document.getElementById('petModal').classList.add('active');
}

function openEditModal(id) {
    const pet = AppState.pets.find(p => p._id === id);
    if (!pet) return;

    document.getElementById('modalTitle').textContent = 'Editar Animal';
    document.getElementById('petId').value = pet._id;
    document.getElementById('petName').value = pet.name;
    document.getElementById('petType').value = pet.type;
    document.getElementById('petBreed').value = pet.breed;
    document.getElementById('petBirthDate').value = pet.birthDate ? pet.birthDate.substring(0, 7) : '';
    document.getElementById('petWeight').value = pet.weight ?? '';
    document.getElementById('petSize').value = pet.size || '';
    document.getElementById('petGender').value = pet.gender;
    document.getElementById('petNeutered').checked = pet.neutered || false;
    document.getElementById('petVaccinated').checked = pet.vaccinated || false;
    document.getElementById('petChipped').checked = pet.chipped || false;
    document.getElementById('petDescription').value = pet.description || '';
    document.getElementById('petStatus').value = pet.status;
    document.getElementById('petSponsors').value = pet.sponsors || 0;

    AppState.selectedPhotos = [];
    AppState.selectedVideos = [];
    AppState.editingPetId = pet._id;

    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';

    renderExistingMedia(pet);
    document.getElementById('petModal').classList.add('active');
}

function closeModal() {
    document.getElementById('petModal').classList.remove('active');

    AppState.selectedPhotos = [];
    AppState.selectedVideos = [];
    AppState.editingPetId = null;

    document.getElementById('photoPreviewGrid').innerHTML = '';
    document.getElementById('videoPreviewList').innerHTML = '';
    document.getElementById('existingMedia').style.display = 'none';
    document.getElementById('petPhotos').value = '';
    document.getElementById('petVideos').value = '';
}

function handleFormSubmit(e) {
    e.preventDefault();

    const birthDateVal = document.getElementById('petBirthDate').value;
    const weightVal = document.getElementById('petWeight').value;
    const sizeVal = document.getElementById('petSize').value;

    const petData = {
        name: document.getElementById('petName').value,
        type: document.getElementById('petType').value,
        breed: document.getElementById('petBreed').value,
        gender: document.getElementById('petGender').value,
        neutered: document.getElementById('petNeutered').checked,
        vaccinated: document.getElementById('petVaccinated').checked,
        chipped: document.getElementById('petChipped').checked,
        description: document.getElementById('petDescription').value,
        status: document.getElementById('petStatus').value,
        sponsors: parseInt(document.getElementById('petSponsors').value) || 0,
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    };

    if (birthDateVal) petData.birthDate = birthDateVal + '-01';
    if (weightVal !== '') petData.weight = parseFloat(weightVal);
    if (sizeVal) petData.size = sizeVal;

    savePet(petData);
}

// File Upload Functions
function setupFileUploads() {
    const photoInput = document.getElementById('petPhotos');
    const videoInput = document.getElementById('petVideos');
    const photoUploadArea = document.getElementById('photoUploadArea');
    const videoUploadArea = document.getElementById('videoUploadArea');

    photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        AppState.selectedPhotos = [...AppState.selectedPhotos, ...files].slice(0, 10);
        renderPhotoPreview();
    });

    videoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        AppState.selectedVideos = [...AppState.selectedVideos, ...files].slice(0, 5);
        renderVideoPreview();
    });

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
        AppState.selectedPhotos = [...AppState.selectedPhotos, ...files].slice(0, 10);
        renderPhotoPreview();
    });

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
        AppState.selectedVideos = [...AppState.selectedVideos, ...files].slice(0, 5);
        renderVideoPreview();
    });
}

function renderPhotoPreview() {
    const grid = document.getElementById('photoPreviewGrid');
    grid.innerHTML = AppState.selectedPhotos.map((file, index) => {
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
    list.innerHTML = AppState.selectedVideos.map((file, index) => {
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
    if (index > 0 && index < AppState.selectedPhotos.length) {
        const photo = AppState.selectedPhotos.splice(index, 1)[0];
        AppState.selectedPhotos.unshift(photo);
        renderPhotoPreview();
    }
}

function removePhoto(index) {
    AppState.selectedPhotos.splice(index, 1);
    renderPhotoPreview();
}

function removeVideo(index) {
    AppState.selectedVideos.splice(index, 1);
    renderVideoPreview();
}

function renderExistingMedia(pet) {
    const container = document.getElementById('existingMedia');
    const photosContainer = document.getElementById('existingPhotos');
    const videosContainer = document.getElementById('existingVideos');

    if ((pet.photos && pet.photos.length > 0) || (pet.videos && pet.videos.length > 0)) {
        container.style.display = 'block';

        if (pet.photos && pet.photos.length > 0) {
            photosContainer.innerHTML = `
                <h5>Fotos actuales</h5>
                <div class="photo-preview-grid">
                    ${pet.photos.map((photo, index) => {
                        const photoUrl = getMediaUrl(photo.url);
                        return `
                        <div class="photo-preview-item ${photo.isMain ? 'is-main' : ''}" data-index="${index}">
                            <img src="${photoUrl}" alt="Foto ${index + 1}">
                            ${photo.isMain ? '<span class="photo-main-badge">Principal</span>' : ''}
                            <div class="photo-preview-overlay">
                                ${!photo.isMain ? `<button class="photo-preview-btn" onclick="setExistingMainPhoto('${pet._id}', ${index})">Hacer principal</button>` : ''}
                                <button class="photo-preview-btn delete-btn" onclick="deleteExistingPhoto('${pet._id}', ${index})">Eliminar</button>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            `;
        } else {
            photosContainer.innerHTML = '';
        }

        if (pet.videos && pet.videos.length > 0) {
            videosContainer.innerHTML = `
                <h5>Videos actuales</h5>
                <div class="video-preview-list">
                    ${pet.videos.map((video, index) => {
                        const videoUrl = getMediaUrl(video.url);
                        return `
                        <div class="video-preview-item" data-index="${index}">
                            <video src="${videoUrl}" controls></video>
                            <div class="video-preview-info">
                                <div class="video-preview-name">Video ${index + 1}</div>
                            </div>
                            <button class="video-delete-btn" onclick="deleteExistingVideo('${pet._id}', ${index})">Eliminar</button>
                        </div>
                    `}).join('')}
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
            const index = AppState.pets.findIndex(p => p._id === petId);
            if (index !== -1) AppState.pets[index] = updatedPet;
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
            const index = AppState.pets.findIndex(p => p._id === petId);
            if (index !== -1) AppState.pets[index] = updatedPet;
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
            const index = AppState.pets.findIndex(p => p._id === petId);
            if (index !== -1) AppState.pets[index] = updatedPet;
            renderExistingMedia(updatedPet);
            showToast('Video eliminado', 'success');
        }
    } catch (error) {
        showToast('Error al eliminar video', 'error');
    }
}

function setupPetFormListeners() {
    document.getElementById('addPetBtn').addEventListener('click', () => openAddModal());
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('petForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('petModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('petModal')) closeModal();
    });

    setupFileUploads();
}

// Exponer globalmente
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.setMainPhoto = setMainPhoto;
window.removePhoto = removePhoto;
window.removeVideo = removeVideo;
window.setExistingMainPhoto = setExistingMainPhoto;
window.deleteExistingPhoto = deleteExistingPhoto;
window.deleteExistingVideo = deleteExistingVideo;
window.setupPetFormListeners = setupPetFormListeners;
