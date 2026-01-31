// Componente Adoption Form - Formulario de adopcion

function openAdoptionFormModal(pet = null) {
    const adoptionForm = document.getElementById('adoptionForm');
    adoptionForm.reset();

    document.getElementById('childrenAgesGroup').style.display = 'none';
    document.getElementById('otherPetsGroup').style.display = 'none';
    document.getElementById('adoptLandlordAllows').checked = true;

    AppState.adoptionPresentationVideo = null;
    document.getElementById('adoptVideoPreview').innerHTML = '';
    document.getElementById('adoptPresentationVideo').value = '';

    generateCaptcha();

    if (pet) {
        document.getElementById('adoptionPetId').value = pet._id;
        document.getElementById('adoptionPetName').value = pet.name;
        document.getElementById('adoptPetNameInput').value = pet.name;

        const emoji = pet.type === 'dog' ? '🐕' : '🐱';
        const typeText = pet.type === 'dog' ? 'Perro' : 'Gato';

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

    document.getElementById('adoptionFormModal').classList.add('active');
}

function openAdoptionFormModalFromProfile(petId) {
    const pet = AppState.pets.find(p => p._id === petId);
    closeProfileModal();
    openAdoptionFormModal(pet);
}

function closeAdoptionFormModal() {
    document.getElementById('adoptionFormModal').classList.remove('active');
    AppState.adoptionPresentationVideo = null;
    document.getElementById('adoptVideoPreview').innerHTML = '';
}

function renderAdoptionVideoPreview() {
    const preview = document.getElementById('adoptVideoPreview');
    if (!AppState.adoptionPresentationVideo) {
        preview.innerHTML = '';
        return;
    }

    const url = URL.createObjectURL(AppState.adoptionPresentationVideo);
    preview.innerHTML = `
        <div class="adopt-video-preview-item">
            <video src="${url}" controls></video>
            <div class="adopt-video-info">
                <div class="adopt-video-name">${AppState.adoptionPresentationVideo.name}</div>
                <div class="adopt-video-size">${(AppState.adoptionPresentationVideo.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button type="button" class="video-delete-btn" onclick="removeAdoptionVideo()">Eliminar</button>
        </div>
    `;
}

function removeAdoptionVideo() {
    AppState.adoptionPresentationVideo = null;
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

    AppState.captchaAnswer = result;
    document.getElementById('captchaQuestion').textContent = `¿Cuanto es ${num1} ${operation} ${num2}?`;
    document.getElementById('captchaAnswer').value = '';
}

function validateCaptcha() {
    const userAnswer = parseInt(document.getElementById('captchaAnswer').value);
    return userAnswer === AppState.captchaAnswer;
}

async function handleAdoptionFormSubmit(e) {
    e.preventDefault();

    if (!validateCaptcha()) {
        showToast('Respuesta incorrecta. Por favor, resuelve la operacion matematica.', 'error');
        generateCaptcha();
        return;
    }

    const petNameInput = document.getElementById('adoptPetNameInput').value;
    const petNameHidden = document.getElementById('adoptionPetName').value;

    const adoptionData = {
        petId: document.getElementById('adoptionPetId').value || null,
        petName: petNameInput || petNameHidden || null,
        fullName: document.getElementById('adoptFullName').value,
        email: document.getElementById('adoptEmail').value,
        phone: document.getElementById('adoptPhone').value,
        age: parseInt(document.getElementById('adoptAge').value),
        address: document.getElementById('adoptAddress').value,
        city: document.getElementById('adoptCity').value,
        housingType: document.getElementById('adoptHousingType').value,
        hasGarden: document.getElementById('adoptHasGarden').checked,
        ownerOrRenter: document.getElementById('adoptOwnerOrRenter').value,
        landlordAllowsPets: document.getElementById('adoptLandlordAllows').checked,
        familyMembers: parseInt(document.getElementById('adoptFamilyMembers').value),
        hasChildren: document.getElementById('adoptHasChildren').checked,
        childrenAges: document.getElementById('adoptChildrenAges').value || '',
        allAgree: document.getElementById('adoptAllAgree').checked,
        hasOtherPets: document.getElementById('adoptHasOtherPets').checked,
        otherPetsDescription: document.getElementById('adoptOtherPetsDesc').value || '',
        previousPetExperience: document.getElementById('adoptPreviousExperience').value || '',
        whyAdopt: document.getElementById('adoptWhyAdopt').value,
        hoursAlone: parseInt(document.getElementById('adoptHoursAlone').value),
        vacationPlan: document.getElementById('adoptVacationPlan').value || '',
        commitmentAware: document.getElementById('adoptCommitment').checked
    };

    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(adoptionData));

        if (AppState.adoptionPresentationVideo) {
            formData.append('presentationVideo', AppState.adoptionPresentationVideo);
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

function setupAdoptionFormListeners() {
    document.getElementById('openAdoptionFormBtn').addEventListener('click', () => {
        openAdoptionFormModal(null);
    });

    document.getElementById('closeAdoptionFormModal').addEventListener('click', closeAdoptionFormModal);
    document.getElementById('cancelAdoptionBtn').addEventListener('click', closeAdoptionFormModal);
    document.getElementById('adoptionForm').addEventListener('submit', handleAdoptionFormSubmit);

    document.getElementById('adoptionFormModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('adoptionFormModal')) closeAdoptionFormModal();
    });

    document.getElementById('adoptHasChildren').addEventListener('change', (e) => {
        document.getElementById('childrenAgesGroup').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('adoptHasOtherPets').addEventListener('change', (e) => {
        document.getElementById('otherPetsGroup').style.display = e.target.checked ? 'block' : 'none';
    });

    const adoptVideoInput = document.getElementById('adoptPresentationVideo');
    const adoptVideoUploadArea = document.getElementById('adoptVideoUploadArea');

    adoptVideoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            AppState.adoptionPresentationVideo = e.target.files[0];
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
            AppState.adoptionPresentationVideo = file;
            renderAdoptionVideoPreview();
        }
    });
}

// Exponer globalmente
window.openAdoptionFormModal = openAdoptionFormModal;
window.openAdoptionFormModalFromProfile = openAdoptionFormModalFromProfile;
window.closeAdoptionFormModal = closeAdoptionFormModal;
window.removeAdoptionVideo = removeAdoptionVideo;
window.generateCaptcha = generateCaptcha;
window.handleAdoptionFormSubmit = handleAdoptionFormSubmit;
window.setupAdoptionFormListeners = setupAdoptionFormListeners;
