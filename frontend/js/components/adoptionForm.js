// Componente Adoption Form - Formulario de adopción

// Estado del captcha
const captchaState = {
    answer1: null,
    answer2: null,
    answer3: null
};

function openAdoptionFormModal(pet = null) {
    const adoptionForm = document.getElementById('adoptionForm');
    adoptionForm.reset();

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

        const photoUrl = mainPhoto ? getMediaUrl(mainPhoto.url) : null;
        const photoHtml = photoUrl
            ? `<img src="${photoUrl}" alt="${pet.name}" class="pet-thumb" onerror="this.outerHTML='<div class=\\'pet-thumb\\'>${emoji}</div>'">`
            : `<div class="pet-thumb">${emoji}</div>`;

        const petInterestDisplay = document.getElementById('petInterestDisplay');
        petInterestDisplay.style.display = 'block';
        petInterestDisplay.innerHTML = `
            <div class="pet-info-row">
                ${photoHtml}
                <div class="pet-details">
                    <h4>${pet.name}</h4>
                    <p>${typeText} - ${pet.breed}${pet.birthDate ? ' - ' + formatAge(pet.birthDate) : ''}</p>
                </div>
            </div>
        `;
    } else {
        document.getElementById('adoptionPetId').value = '';
        document.getElementById('adoptionPetName').value = '';
        document.getElementById('adoptPetNameInput').value = '';
        document.getElementById('petInterestDisplay').style.display = 'none';
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

// CAPTCHA más complejo con múltiples preguntas
function generateCaptcha() {
    // Pregunta 1: Operación matemática
    const operations = ['+', '-', 'x'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, result1;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 15) + 5;
            num2 = Math.floor(Math.random() * 15) + 5;
            result1 = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 20) + 15;
            num2 = Math.floor(Math.random() * 10) + 1;
            result1 = num1 - num2;
            break;
        case 'x':
            num1 = Math.floor(Math.random() * 8) + 2;
            num2 = Math.floor(Math.random() * 8) + 2;
            result1 = num1 * num2;
            break;
    }
    captchaState.answer1 = result1;
    document.getElementById('captchaQuestion1').textContent = `¿Cuánto es ${num1} ${operation} ${num2}?`;

    // Pregunta 2: Pregunta sobre animales (texto)
    const animalQuestions = [
        { question: '¿Cuántas patas tiene un perro?', answer: '4' },
        { question: '¿Cuántas patas tiene un gato?', answer: '4' },
        { question: '¿Qué animal dice "guau"?', answer: 'perro' },
        { question: '¿Qué animal dice "miau"?', answer: 'gato' },
        { question: 'Escribe "adoptar" sin comillas:', answer: 'adoptar' },
        { question: 'Escribe "animal" sin comillas:', answer: 'animal' }
    ];
    const animalQ = animalQuestions[Math.floor(Math.random() * animalQuestions.length)];
    captchaState.answer2 = animalQ.answer.toLowerCase();
    document.getElementById('captchaQuestion2').textContent = animalQ.question;

    // Pregunta 3: Otra operación matemática diferente
    const num3 = Math.floor(Math.random() * 10) + 1;
    const num4 = Math.floor(Math.random() * 10) + 1;
    const num5 = Math.floor(Math.random() * 5) + 1;
    captchaState.answer3 = num3 + num4 + num5;
    document.getElementById('captchaQuestion3').textContent = `¿Cuánto es ${num3} + ${num4} + ${num5}?`;

    // Limpiar respuestas
    document.getElementById('captchaAnswer1').value = '';
    document.getElementById('captchaAnswer2').value = '';
    document.getElementById('captchaAnswer3').value = '';
}

function validateCaptcha() {
    const answer1 = parseInt(document.getElementById('captchaAnswer1').value);
    const answer2 = document.getElementById('captchaAnswer2').value.toLowerCase().trim();
    const answer3 = parseInt(document.getElementById('captchaAnswer3').value);

    if (answer1 !== captchaState.answer1) {
        return { valid: false, message: 'La primera respuesta de verificación es incorrecta.' };
    }
    if (answer2 !== captchaState.answer2) {
        return { valid: false, message: 'La segunda respuesta de verificación es incorrecta.' };
    }
    if (answer3 !== captchaState.answer3) {
        return { valid: false, message: 'La tercera respuesta de verificación es incorrecta.' };
    }

    return { valid: true };
}

// Validación personalizada del formulario
function validateAdoptionForm() {
    const errors = [];
    const fieldLabels = {
        'adoptPetNameInput': 'Nombre del animal',
        'adoptFullName': 'Nombre completo',
        'adoptBirthDate': 'Fecha de nacimiento',
        'adoptEmail': 'Correo electrónico',
        'adoptPhone': 'Teléfono',
        'adoptProfession': 'Profesión',
        'adoptCity': 'Ciudad',
        'adoptAddress': 'Dirección',
        'adoptHousingType': 'Tipo de vivienda',
        'adoptOwnerOrRenter': 'Propietario o alquiler',
        'adoptFamilyMembers': 'Miembros de la familia',
        'adoptAllAgree': 'Acuerdo de todos los miembros',
        'adoptWhyAdopt': 'Motivación para adoptar',
        'adoptHoursAlone': 'Horas solo',
        'adoptCommitment': 'Compromiso de adopción',
        'captchaAnswer1': 'Verificación (pregunta 1)',
        'captchaAnswer2': 'Verificación (pregunta 2)',
        'captchaAnswer3': 'Verificación (pregunta 3)',
        'adoptDataProtection': 'Política de protección de datos',
        'adoptFollowUpConsent': 'Consentimiento de seguimiento'
    };

    const requiredFields = [
        'adoptPetNameInput', 'adoptFullName', 'adoptBirthDate', 'adoptEmail',
        'adoptPhone', 'adoptProfession', 'adoptCity', 'adoptAddress',
        'adoptHousingType', 'adoptOwnerOrRenter', 'adoptFamilyMembers',
        'adoptWhyAdopt', 'adoptHoursAlone',
        'captchaAnswer1', 'captchaAnswer2', 'captchaAnswer3'
    ];

    const requiredCheckboxes = [
        'adoptAllAgree', 'adoptCommitment', 'adoptDataProtection', 'adoptFollowUpConsent'
    ];

    // Validar campos de texto/select
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && (!field.value || field.value.trim() === '')) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    // Validar checkboxes
    requiredCheckboxes.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.checked) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    // Validar fecha de nacimiento (mayor de 18 años)
    const birthDate = document.getElementById('adoptBirthDate').value;
    if (birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age < 18) {
            errors.push('Debes ser mayor de 18 años para adoptar');
        }
    }

    // Validar email
    const email = document.getElementById('adoptEmail').value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no tiene un formato válido');
    }

    return errors;
}

function showValidationErrors(errors) {
    const errorList = document.getElementById('validationErrorList');
    errorList.innerHTML = errors.map(error => `<li>${error}</li>`).join('');
    document.getElementById('validationErrorModal').classList.add('active');
}

function closeValidationErrorModal() {
    document.getElementById('validationErrorModal').classList.remove('active');
}

function openPrivacyPolicy(event) {
    if (event) event.preventDefault();
    document.getElementById('privacyPolicyModal').classList.add('active');
}

function closePrivacyPolicy() {
    document.getElementById('privacyPolicyModal').classList.remove('active');
}

async function handleAdoptionFormSubmit(e) {
    e.preventDefault();

    // Validar campos
    const validationErrors = validateAdoptionForm();
    if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        return;
    }

    // Validar captcha
    const captchaResult = validateCaptcha();
    if (!captchaResult.valid) {
        showToast(captchaResult.message, 'error');
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
        birthDate: document.getElementById('adoptBirthDate').value,
        profession: document.getElementById('adoptProfession').value,
        address: document.getElementById('adoptAddress').value,
        city: document.getElementById('adoptCity').value,
        housingType: document.getElementById('adoptHousingType').value,
        hasGarden: document.getElementById('adoptHasGarden').checked,
        ownerOrRenter: document.getElementById('adoptOwnerOrRenter').value,
        landlordAllowsPets: document.getElementById('adoptLandlordAllows').checked,
        familyMembers: document.getElementById('adoptFamilyMembers').value,
        allAgree: document.getElementById('adoptAllAgree').checked,
        hasOtherPets: document.getElementById('adoptHasOtherPets').checked,
        otherPetsDescription: document.getElementById('adoptOtherPetsDesc').value || '',
        previousPetExperience: document.getElementById('adoptPreviousExperience').value || '',
        whyAdopt: document.getElementById('adoptWhyAdopt').value,
        hoursAlone: parseInt(document.getElementById('adoptHoursAlone').value),
        commitmentAware: document.getElementById('adoptCommitment').checked,
        dataProtectionConsent: document.getElementById('adoptDataProtection').checked,
        followUpConsent: document.getElementById('adoptFollowUpConsent').checked
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
window.closeValidationErrorModal = closeValidationErrorModal;
window.openPrivacyPolicy = openPrivacyPolicy;
window.closePrivacyPolicy = closePrivacyPolicy;
