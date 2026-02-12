// Componente Help Modals - Modales de ayuda (Donaciones, Voluntariado, Teaming, Apadrina, Facturas)

// URL base para formularios
const FORMS_API_URL = (window.API_BASE_URL || '') + '/api/forms';

// Datos de ejemplo para facturas veterinarias (en producción vendrían de la base de datos)
const veterinaryInvoices = [
    { id: 1, description: 'Esterilización Luna', amount: 150, date: '2025-01-15', animal: 'Luna', paid: 45 },
    { id: 2, description: 'Vacunas anuales Max', amount: 85, date: '2025-01-20', animal: 'Max', paid: 85 },
    { id: 3, description: 'Cirugía urgente Rocky', amount: 450, date: '2025-02-01', animal: 'Rocky', paid: 120 },
    { id: 4, description: 'Tratamiento leishmaniosis Toby', amount: 280, date: '2025-02-05', animal: 'Toby', paid: 0 },
    { id: 5, description: 'Radiografía Mía', amount: 95, date: '2025-02-08', animal: 'Mía', paid: 50 }
];

const helpContent = {
    donaciones: {
        title: 'Donaciones',
        icon: '💝',
        content: `
            <div class="help-section">
                <p class="help-intro">Tu donación nos ayuda a cuidar de los animales que más lo necesitan. Cada euro cuenta para alimentación, cuidados veterinarios y refugio.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🏦</div>
                        <h4>Transferencia bancaria</h4>
                        <p>IBAN: ES70 0049 3327 3721 1405 4110</p>
                        <p>Concepto: Donación Uskar</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🎁</div>
                        <h4>Donaciones en especie</h4>
                        <p>Aceptamos pienso, mantas, medicamentos y material veterinario...</p>
                    </div>
                    <div class="help-card coming-soon-card">
                        <div class="coming-soon-badge">PRÓXIMAMENTE</div>
                        <div class="help-card-icon">💳</div>
                        <h4>Pago online</h4>
                        <p>Donación instantánea o mensual con tarjeta, PayPal o Bizum.</p>
                        <div class="payment-icons">
                            <span>💳</span>
                            <span>🅿️</span>
                            <span>📱</span>
                        </div>
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
                <p class="help-intro">Hay muchas formas de colaborar con nosotros. Tu tiempo y habilidades pueden marcar la diferencia. Rellena el formulario según el tipo de voluntariado que te interese.</p>

                <div class="help-cards">
                    <div class="help-card clickable-card" onclick="openVolunteerForm('transporte')">
                        <div class="help-card-icon">🚗</div>
                        <h4>Transporte de animales</h4>
                        <p>Moviliza animales entre refugios, veterinarios o nuevos hogares durante tus viajes.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                    <div class="help-card clickable-card" onclick="openVolunteerForm('educador')">
                        <div class="help-card-icon">🎓</div>
                        <h4>Educador canino</h4>
                        <p>Ayuda a socializar y educar a los animales para facilitar su adopción.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                    <div class="help-card clickable-card" onclick="openVolunteerForm('refugio')">
                        <div class="help-card-icon">🧹</div>
                        <h4>Tareas en el refugio</h4>
                        <p>Limpieza, mantenimiento y cuidado diario de las instalaciones.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                    <div class="help-card clickable-card" onclick="openVolunteerForm('fotografia')">
                        <div class="help-card-icon">📸</div>
                        <h4>Fotografía</h4>
                        <p>Toma fotos profesionales de nuestros animales para facilitar su adopción.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                    <div class="help-card clickable-card" onclick="openVolunteerForm('eventos')">
                        <div class="help-card-icon">🎉</div>
                        <h4>Eventos y mercadillos</h4>
                        <p>Colabora en la organización y atención de eventos solidarios.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                    <div class="help-card clickable-card" onclick="openVolunteerForm('veterinario')">
                        <div class="help-card-icon">💉</div>
                        <h4>Apoyo veterinario</h4>
                        <p>Si eres profesional veterinario, tu ayuda es invaluable.</p>
                        <span class="card-action-hint">Haz clic para inscribirte</span>
                    </div>
                </div>

                <div class="help-cta">
                    <p style="margin-bottom: 16px; color: #78350f;">También puedes contactarnos directamente para más información.</p>
                </div>
            </div>
        `
    },
    casaAcogida: {
        title: 'Casa de acogida',
        icon: '🏠',
        content: `
            <div class="help-section">
                <p class="help-intro">Ser casa de acogida es ofrecer un hogar temporal a un animal mientras encuentra su familia definitiva. Es una labor fundamental para salvar vidas.</p>

                <div class="help-highlight">
                    <div class="help-highlight-icon">💕</div>
                    <h3>Tu casa puede ser su refugio</h3>
                    <p>Dale una oportunidad mientras busca su hogar para siempre</p>
                </div>

                <div class="help-cards">
                    <div class="help-card full-width">
                        <div class="help-card-icon">📋</div>
                        <h4>¿Qué implica ser casa de acogida?</h4>
                        <ul class="help-list">
                            <li>Ofrecer un espacio seguro y cariño temporal</li>
                            <li>Alimentación diaria</li>
                            <li>Paseos y socialización</li>
                            <li>Llevar al animal a las citas veterinarias programadas</li>
                            <li>Informarnos sobre su evolución y comportamiento</li>
                        </ul>
                    </div>
                </div>

                <div class="help-benefits">
                    <h4>Nosotros nos encargamos de:</h4>
                    <ul class="help-list">
                        <li>Todos los gastos veterinarios</li>
                        <li>Asesoramiento y apoyo continuo</li>
                        <li>Búsqueda activa de adoptantes</li>
                    </ul>
                </div>

                <div class="help-cta" style="margin-top: 1.5rem;">
                    <button class="btn btn-primary btn-large" onclick="openFosterForm()">Quiero ser casa de acogida</button>
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
                    <p>Un pequeño gesto que marca una gran diferencia</p>
                </div>

                <div class="help-cards">
                    <div class="help-card full-width">
                        <div class="help-card-icon">💡</div>
                        <h4>¿Cómo funciona Teaming?</h4>
                        <div class="teaming-content-columns">
                            <div class="teaming-list-column">
                                <ol class="help-list">
                                    <li>Entra en nuestra página de Teaming</li>
                                    <li>Regístrate con tu correo electrónico</li>
                                    <li>Configura tu donación mensual de 1 euro</li>
                                    <li>¡Listo! Ya estás ayudando cada mes</li>
                                </ol>
                            </div>
                            <div class="teaming-cta-column">
                                <a href="https://www.teaming.net/protectoraanimalesuskar" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                                    <button class="btn btn-primary btn-large">Unirme al Teaming</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    apadrina: {
        title: 'Apadrina un animal',
        icon: '❤️',
        content: generateSponsorContent()
    },
    facturas: {
        title: 'Facturas veterinarias',
        icon: '🏥',
        content: generateInvoicesContent()
    },
    feedback: {
        title: 'Tu opinión',
        icon: '💬',
        content: generateFeedbackContent()
    }
};

// Genera el contenido del formulario de opiniones
function generateFeedbackContent() {
    return `
        <div class="help-section">
            <p class="help-intro">Tu opinión nos ayuda a mejorar. Cuéntanos qué te parece nuestra página web y cómo podemos mejorar.</p>

            <form id="feedbackForm" class="feedback-form">
                <div class="form-group">
                    <label class="form-label">¿Cómo valorarías tu experiencia en la web? *</label>
                    <div class="rating-selector">
                        <button type="button" class="rating-btn" data-rating="1" onclick="setRating(1)">😞</button>
                        <button type="button" class="rating-btn" data-rating="2" onclick="setRating(2)">😕</button>
                        <button type="button" class="rating-btn" data-rating="3" onclick="setRating(3)">😐</button>
                        <button type="button" class="rating-btn" data-rating="4" onclick="setRating(4)">🙂</button>
                        <button type="button" class="rating-btn" data-rating="5" onclick="setRating(5)">😍</button>
                    </div>
                    <input type="hidden" id="feedbackRating" value="">
                </div>

                <div class="form-group">
                    <label class="form-label">¿Qué es lo que más te ha gustado?</label>
                    <textarea class="form-input form-textarea" id="feedbackLikes" rows="2" placeholder="Cuéntanos qué te ha gustado..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">¿Qué podríamos mejorar?</label>
                    <textarea class="form-input form-textarea" id="feedbackImprovements" rows="2" placeholder="Danos sugerencias para mejorar..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Comentarios adicionales</label>
                    <textarea class="form-input form-textarea" id="feedbackComments" rows="3" placeholder="Cualquier otro comentario que quieras compartir..."></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tu nombre (opcional)</label>
                        <input type="text" class="form-input" id="feedbackName" placeholder="Tu nombre">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tu email (opcional)</label>
                        <input type="email" class="form-input" id="feedbackEmail" placeholder="tu@email.com">
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Enviar opinión</button>
                </div>
            </form>
        </div>
    `;
}

// Genera el contenido de apadrinamiento con los animales disponibles
function generateSponsorContent() {
    return `
        <div class="help-section">
            <div class="coming-soon-banner">
                <span class="coming-soon-icon">🚧</span>
                <span>PRÓXIMAMENTE</span>
                <p>Estamos trabajando para habilitar el apadrinamiento online. Mientras tanto, puedes contactarnos directamente.</p>
            </div>

            <p class="help-intro">Apadrina a uno de nuestros animales y ayúdanos a cubrir sus gastos. Recibirás actualizaciones periódicas sobre tu ahijado.</p>

            <div class="help-highlight">
                <div class="help-highlight-icon">💕</div>
                <h3>Desde 5 euros al mes</h3>
                <p>Tú puedes elegir la cantidad que quieras aportar</p>
            </div>

            <div id="sponsorAnimalsGrid" class="sponsor-animals-grid">
                <!-- Los animales se cargarán dinámicamente -->
                <div class="loading-state">
                    <span>🐾</span>
                    <p>Cargando animales disponibles...</p>
                </div>
            </div>

            <div class="help-benefits">
                <h4>Beneficios del apadrinamiento:</h4>
                <ul class="help-list">
                    <li>Recibirás fotos y actualizaciones de tu ahijado</li>
                    <li>Certificado de apadrinamiento</li>
                    <li>Desgravación fiscal</li>
                </ul>
            </div>

            <div class="sponsor-contact-info">
                <h4>¿Quieres apadrinar ahora?</h4>
                <p>Contacta con nosotros en <strong>uskar.protectora@gmail.com</strong> indicando el nombre del animal que quieres apadrinar.</p>
            </div>
        </div>
    `;
}

// Genera el contenido de facturas veterinarias
function generateInvoicesContent() {
    let invoicesHtml = veterinaryInvoices.map(invoice => {
        const remaining = invoice.amount - invoice.paid;
        const progressPercent = (invoice.paid / invoice.amount) * 100;
        const isComplete = remaining === 0;

        return `
            <div class="invoice-card ${isComplete ? 'invoice-complete' : ''}">
                <div class="invoice-header">
                    <div class="invoice-animal">
                        <span class="invoice-animal-icon">🐾</span>
                        <span>${invoice.animal}</span>
                    </div>
                    <div class="invoice-date">${formatDate(invoice.date)}</div>
                </div>
                <div class="invoice-description">${invoice.description}</div>
                <div class="invoice-amounts">
                    <div class="invoice-total">Total: <strong>${invoice.amount}€</strong></div>
                    <div class="invoice-remaining ${isComplete ? 'complete' : ''}">
                        ${isComplete ? 'Completada' : `Faltan: <strong>${remaining}€</strong>`}
                    </div>
                </div>
                <div class="invoice-progress">
                    <div class="invoice-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                ${!isComplete ? `
                    <button class="btn btn-primary btn-small" onclick="openContributeModal(${invoice.id}, '${invoice.description}', ${remaining})">
                        Contribuir
                    </button>
                ` : '<span class="invoice-thanks">Gracias a todos los colaboradores</span>'}
            </div>
        `;
    }).join('');

    return `
        <div class="help-section">
            <p class="help-intro">Ayúdanos a pagar los gastos veterinarios de nuestros animales. Cada aportación cuenta y puedes contribuir con la cantidad que desees.</p>

            <div class="invoices-grid">
                ${invoicesHtml}
            </div>

            <div class="help-cta" style="margin-top: 1.5rem;">
                <p style="color: #5d4037; font-size: 0.875rem;">
                    Para contribuir, realiza una transferencia al IBAN: <strong>ES70 0049 3327 3721 1405 4110</strong><br>
                    Indica en el concepto: "Factura + nombre del animal"
                </p>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function openHelpModal(action) {
    // Actualizar contenido dinámico si es necesario
    if (action === 'apadrina') {
        helpContent.apadrina.content = generateSponsorContent();
    } else if (action === 'facturas') {
        helpContent.facturas.content = generateInvoicesContent();
    } else if (action === 'feedback') {
        helpContent.feedback.content = generateFeedbackContent();
    }

    const content = helpContent[action];
    if (!content) return;

    // Marcar el botón como activo
    document.querySelectorAll('.help-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.help-btn[data-action="${action}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Guardar la acción actual
    AppState.currentHelpAction = action;

    document.getElementById('helpModalTitle').innerHTML = `${content.icon} ${content.title}`;
    document.getElementById('helpContent').innerHTML = content.content;
    document.getElementById('helpModal').classList.add('active');

    // Si es apadrinamiento, cargar los animales
    if (action === 'apadrina') {
        loadSponsorAnimals();
    }

    // Si es feedback, configurar el event listener del formulario
    if (action === 'feedback') {
        currentRating = 0;
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', handleFeedbackSubmit);
        }
    }
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('active');
    // Quitar la selección del botón
    document.querySelectorAll('.help-btn').forEach(btn => btn.classList.remove('active'));
    AppState.currentHelpAction = null;
}

// Cargar animales para apadrinamiento
async function loadSponsorAnimals() {
    const grid = document.getElementById('sponsorAnimalsGrid');
    if (!grid) return;

    try {
        // Usar los animales ya cargados en AppState o cargarlos
        let animals = AppState.pets.filter(pet => pet.status === 'active');

        if (animals.length === 0) {
            // Intentar cargar desde la API
            const response = await fetch(API_URL + '?status=active');
            animals = await response.json();
        }

        if (animals.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <span>🐾</span>
                    <p>No hay animales disponibles para apadrinar en este momento.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = animals.map(animal => {
            const mainPhoto = animal.photos && animal.photos.length > 0
                ? animal.photos.find(p => p.isMain) || animal.photos[0]
                : null;
            const emoji = animal.type === 'dog' ? '🐕' : '🐱';
            const photoUrl = mainPhoto ? getMediaUrl(mainPhoto.url) : null;

            return `
                <div class="sponsor-animal-card">
                    <div class="sponsor-animal-image">
                        ${photoUrl
                            ? `<img src="${photoUrl}" alt="${animal.name}" onerror="this.parentElement.innerHTML='<div class=\\'sponsor-placeholder\\'>${emoji}</div>'">`
                            : `<div class="sponsor-placeholder">${emoji}</div>`
                        }
                    </div>
                    <div class="sponsor-animal-info">
                        <h4>${animal.name}</h4>
                        <p>${animal.breed || 'Mestizo'}</p>
                        <p class="sponsor-count">${animal.sponsors || 0} padrinos</p>
                    </div>
                    <div class="sponsor-btn-container">
                        <button class="btn btn-primary btn-small" onclick="openSponsorForm('${animal._id}', '${animal.name}')">
                            Apadrinar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error cargando animales:', error);
        grid.innerHTML = `
            <div class="error-state">
                <span>❌</span>
                <p>Error al cargar los animales. Inténtalo de nuevo.</p>
            </div>
        `;
    }
}

// Abrir formulario de apadrinamiento
function openSponsorForm(animalId, animalName) {
    const modalContent = `
        <div class="sponsor-form-content">
            <h3>Apadrinar a ${animalName}</h3>
            <p class="help-intro">Completa el formulario para convertirte en padrino/madrina de ${animalName}.</p>

            <form id="sponsorForm" class="sponsor-form">
                <input type="hidden" id="sponsorAnimalId" value="${animalId}">
                <input type="hidden" id="sponsorAnimalName" value="${animalName}">

                <div class="form-group">
                    <label class="form-label">Tu nombre completo *</label>
                    <input type="text" class="form-input" id="sponsorName" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Correo electrónico *</label>
                    <input type="email" class="form-input" id="sponsorEmail" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-input" id="sponsorPhone">
                </div>

                <div class="form-group">
                    <label class="form-label">Cantidad mensual (euros) *</label>
                    <div class="amount-selector">
                        <button type="button" class="amount-btn active" onclick="setAmount(5)">5€</button>
                        <button type="button" class="amount-btn" onclick="setAmount(10)">10€</button>
                        <button type="button" class="amount-btn" onclick="setAmount(25)">25€</button>
                        <button type="button" class="amount-btn" onclick="setAmount(50)">50€</button>
                        <input type="number" class="form-input amount-input" id="sponsorAmount" value="5" min="5" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="sponsorUpdates" checked>
                        Quiero recibir actualizaciones sobre mi ahijado
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="sponsorDataConsent" required>
                        Acepto la política de protección de datos y autorizo el tratamiento de mis datos *
                    </label>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="backToSponsorList()">Volver</button>
                    <button type="submit" class="btn btn-primary">Confirmar apadrinamiento</button>
                </div>
            </form>

            <div class="sponsor-payment-info">
                <p><strong>Método de pago:</strong> Transferencia bancaria mensual</p>
                <p>IBAN: ES70 0049 3327 3721 1405 4110</p>
                <p>Concepto: Apadrinamiento ${animalName}</p>
            </div>
        </div>
    `;

    document.getElementById('helpContent').innerHTML = modalContent;
    document.getElementById('helpModalTitle').innerHTML = '❤️ Apadrinar';

    // Event listener para el formulario
    document.getElementById('sponsorForm').addEventListener('submit', handleSponsorSubmit);
}

function setAmount(amount) {
    document.getElementById('sponsorAmount').value = amount;
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function backToSponsorList() {
    openHelpModal('apadrina');
}

// Validación de formulario de apadrinamiento
function validateSponsorForm() {
    const errors = [];
    const fieldLabels = {
        'sponsorName': 'Nombre completo',
        'sponsorEmail': 'Correo electrónico',
        'sponsorAmount': 'Cantidad mensual',
        'sponsorDataConsent': 'Política de protección de datos'
    };

    const requiredFields = ['sponsorName', 'sponsorEmail', 'sponsorAmount'];
    const requiredCheckboxes = ['sponsorDataConsent'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && (!field.value || field.value.trim() === '')) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    requiredCheckboxes.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.checked) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    // Validar email
    const email = document.getElementById('sponsorEmail')?.value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no tiene un formato válido');
    }

    // Validar cantidad mínima
    const amount = parseInt(document.getElementById('sponsorAmount')?.value);
    if (amount < 5) {
        errors.push('La cantidad mínima de apadrinamiento es 5€');
    }

    return errors;
}

async function handleSponsorSubmit(e) {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateSponsorForm();
    if (validationErrors.length > 0) {
        showVolunteerValidationErrors(validationErrors);
        return;
    }

    const data = {
        formType: 'sponsorship',
        animalId: document.getElementById('sponsorAnimalId').value,
        animalName: document.getElementById('sponsorAnimalName').value,
        name: document.getElementById('sponsorName').value,
        email: document.getElementById('sponsorEmail').value,
        phone: document.getElementById('sponsorPhone').value,
        amount: document.getElementById('sponsorAmount').value,
        wantsUpdates: document.getElementById('sponsorUpdates').checked,
        dataConsent: document.getElementById('sponsorDataConsent').checked
    };

    try {
        console.log('Enviando apadrinamiento:', data);
        console.log('URL:', FORMS_API_URL);

        const response = await fetch(FORMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Error del servidor:', response.status, responseData);
            showDetailedErrorPopup({
                url: FORMS_API_URL,
                method: 'POST',
                status: response.status,
                statusText: response.statusText,
                responseMessage: responseData.message || JSON.stringify(responseData)
            });
            return;
        }

        showToast('¡Solicitud de apadrinamiento enviada! Te contactaremos pronto.', 'success');
        closeHelpModal();
    } catch (error) {
        console.error('Error guardando formulario de apadrinamiento:', error);
        showDetailedErrorPopup({
            url: FORMS_API_URL,
            method: 'POST',
            status: 0,
            networkError: error.message
        });
    }
}

// Formulario de voluntariado
function openVolunteerForm(type) {
    const volunteerTypes = {
        transporte: {
            title: 'Transporte de animales',
            icon: '🚗',
            showCalendar: true,
            description: 'Ayúdanos a mover animales durante tus viajes o desplazamientos.'
        },
        educador: {
            title: 'Educador canino',
            icon: '🎓',
            showCalendar: false,
            description: 'Colabora en la socialización y educación de nuestros animales.'
        },
        refugio: {
            title: 'Tareas en el refugio',
            icon: '🧹',
            showCalendar: false,
            description: 'Ayuda con limpieza, mantenimiento y cuidado de las instalaciones.'
        },
        fotografia: {
            title: 'Fotografía',
            icon: '📸',
            showCalendar: false,
            description: 'Toma fotos profesionales de nuestros animales.'
        },
        eventos: {
            title: 'Eventos y mercadillos',
            icon: '🎉',
            showCalendar: false,
            description: 'Colabora en la organización y atención de eventos solidarios.'
        },
        veterinario: {
            title: 'Apoyo veterinario',
            icon: '💉',
            showCalendar: false,
            description: 'Si eres profesional veterinario, tu ayuda es invaluable.'
        }
    };

    const volunteerInfo = volunteerTypes[type];
    if (!volunteerInfo) return;

    const calendarSection = volunteerInfo.showCalendar ? `
        <div class="form-group">
            <label class="form-label">Trayectos disponibles para transporte</label>
            <p class="form-hint">Indica las fechas y rutas en las que podrías transportar animales.</p>
            <div class="transport-dates-container">
                <div class="transport-date-row">
                    <div class="form-group">
                        <label class="form-label">Fecha</label>
                        <input type="date" class="form-input" id="transportDate1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Origen</label>
                        <input type="text" class="form-input" id="transportOrigin1" placeholder="Ciudad de origen">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destino</label>
                        <input type="text" class="form-input" id="transportDestination1" placeholder="Ciudad de destino">
                    </div>
                </div>
                <button type="button" class="btn btn-secondary btn-small" onclick="addTransportDateRow()">+ Añadir otro trayecto</button>
            </div>
        </div>
    ` : '';

    // Experiencia previa solo para tipos que no son transporte
    const experienceSection = !volunteerInfo.showCalendar ? `
        <div class="form-group">
            <label class="form-label">Experiencia previa (si tienes)</label>
            <textarea class="form-input form-textarea" id="volunteerExperience" rows="3" placeholder="Cuéntanos si tienes experiencia previa relacionada con este tipo de voluntariado..."></textarea>
        </div>
    ` : '';

    const modalContent = `
        <div class="volunteer-form-content">
            <div class="volunteer-form-header">
                <span class="volunteer-icon">${volunteerInfo.icon}</span>
                <h3>${volunteerInfo.title}</h3>
            </div>
            <p class="help-intro">${volunteerInfo.description}</p>

            <form id="volunteerForm" class="volunteer-form">
                <input type="hidden" id="volunteerType" value="${type}">

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nombre completo *</label>
                        <input type="text" class="form-input" id="volunteerName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Correo electrónico *</label>
                        <input type="email" class="form-input" id="volunteerEmail" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Teléfono *</label>
                        <input type="tel" class="form-input" id="volunteerPhone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ciudad *</label>
                        <input type="text" class="form-input" id="volunteerCity" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Link a tu red social (si tienes)</label>
                    <input type="url" class="form-input" id="volunteerSocialLink" placeholder="https://instagram.com/tu_usuario o similar">
                </div>

                ${calendarSection}

                ${experienceSection}

                <div class="form-group">
                    <label class="form-label">Disponibilidad horaria</label>
                    <div class="availability-grid">
                        <label class="checkbox-label"><input type="checkbox" name="availability" value="mananas"> Mañanas</label>
                        <label class="checkbox-label"><input type="checkbox" name="availability" value="tardes"> Tardes</label>
                        <label class="checkbox-label"><input type="checkbox" name="availability" value="fines_semana"> Fines de semana</label>
                        <label class="checkbox-label"><input type="checkbox" name="availability" value="flexible"> Horario flexible</label>
                    </div>
                </div>

                <div class="legal-clauses">
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="volunteerContactConsent" required>
                            <span>Doy mi consentimiento para que la protectora se ponga en contacto conmigo a través de los datos facilitados para coordinar las tareas de voluntariado. *</span>
                        </label>
                    </div>
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="volunteerDataConsent" required>
                            <span>Acepto la política de protección de datos y autorizo el tratamiento de mis datos personales. *</span>
                        </label>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="openHelpModal('voluntariado')">Volver</button>
                    <button type="submit" class="btn btn-primary">Enviar solicitud</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('helpContent').innerHTML = modalContent;
    document.getElementById('helpModalTitle').innerHTML = `🤝 Voluntariado - ${volunteerInfo.title}`;

    // Resetear contador de filas de transporte
    transportDateRowCount = 1;

    document.getElementById('volunteerForm').addEventListener('submit', handleVolunteerSubmit);
}

let transportDateRowCount = 1;

function addTransportDateRow() {
    transportDateRowCount++;
    const container = document.querySelector('.transport-dates-container');
    const newRow = document.createElement('div');
    newRow.className = 'transport-date-row';
    newRow.innerHTML = `
        <div class="form-group">
            <label class="form-label">Fecha</label>
            <input type="date" class="form-input" id="transportDate${transportDateRowCount}">
        </div>
        <div class="form-group">
            <label class="form-label">Origen</label>
            <input type="text" class="form-input" id="transportOrigin${transportDateRowCount}" placeholder="Ciudad de origen">
        </div>
        <div class="form-group">
            <label class="form-label">Destino</label>
            <input type="text" class="form-input" id="transportDestination${transportDateRowCount}" placeholder="Ciudad de destino">
        </div>
        <button type="button" class="btn-remove-row" onclick="this.parentElement.remove()">×</button>
    `;
    container.insertBefore(newRow, container.lastElementChild);
}

// Validación de formularios de voluntariado
function validateVolunteerForm() {
    const errors = [];
    const fieldLabels = {
        'volunteerName': 'Nombre completo',
        'volunteerEmail': 'Correo electrónico',
        'volunteerPhone': 'Teléfono',
        'volunteerCity': 'Ciudad',
        'volunteerContactConsent': 'Consentimiento de contacto',
        'volunteerDataConsent': 'Política de protección de datos'
    };

    const requiredFields = ['volunteerName', 'volunteerEmail', 'volunteerPhone', 'volunteerCity'];
    const requiredCheckboxes = ['volunteerContactConsent', 'volunteerDataConsent'];

    // Validar campos de texto
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

    // Validar email
    const email = document.getElementById('volunteerEmail')?.value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no tiene un formato válido');
    }

    return errors;
}

function showVolunteerValidationErrors(errors, title = 'Campos incompletos', intro = 'Por favor, completa los siguientes campos obligatorios:') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'volunteerValidationModal';
    modal.innerHTML = `
        <div class="modal modal-small">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeVolunteerValidationModal()">&times;</button>
            </div>
            <div class="validation-error-content">
                <p>${intro}</p>
                <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="closeVolunteerValidationModal()">Entendido</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showErrorPopup(errorMessage) {
    showVolunteerValidationErrors([errorMessage], 'Error al enviar', 'Ha ocurrido un error:');
}

function showDetailedErrorPopup(details) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'volunteerValidationModal';
    modal.innerHTML = `
        <div class="modal modal-small">
            <div class="modal-header">
                <h2 class="modal-title">Error al enviar formulario</h2>
                <button class="modal-close" onclick="closeVolunteerValidationModal()">&times;</button>
            </div>
            <div class="validation-error-content">
                <div class="error-details">
                    <p><strong>URL:</strong> <code>${details.url}</code></p>
                    <p><strong>Método:</strong> ${details.method}</p>
                    <p><strong>Estado:</strong> ${details.status} ${details.statusText || ''}</p>
                    ${details.responseMessage ? `<p><strong>Mensaje:</strong> ${details.responseMessage}</p>` : ''}
                    ${details.networkError ? `<p><strong>Error de red:</strong> ${details.networkError}</p>` : ''}
                </div>
                <div class="error-help">
                    <p><strong>Posibles causas:</strong></p>
                    <ul>
                        ${details.status === 404 ? '<li>La ruta /api/forms no existe en el servidor</li><li>El servidor backend no está ejecutándose</li><li>El Lambda no ha sido desplegado con esta ruta</li>' : ''}
                        ${details.status === 500 ? '<li>Error interno del servidor</li><li>Problema con la base de datos</li>' : ''}
                        ${details.status === 400 ? '<li>Datos del formulario inválidos</li><li>Campo requerido faltante</li>' : ''}
                        ${details.networkError ? '<li>No hay conexión a internet</li><li>El servidor no responde</li><li>CORS bloqueando la petición</li>' : ''}
                    </ul>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="closeVolunteerValidationModal()">Entendido</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeVolunteerValidationModal() {
    const modal = document.getElementById('volunteerValidationModal');
    if (modal) modal.remove();
}

async function handleVolunteerSubmit(e) {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateVolunteerForm();
    if (validationErrors.length > 0) {
        showVolunteerValidationErrors(validationErrors);
        return;
    }

    const availabilities = [];
    document.querySelectorAll('input[name="availability"]:checked').forEach(cb => {
        availabilities.push(cb.value);
    });

    // Recoger fechas de transporte si existen
    const transportDates = [];
    for (let i = 1; i <= transportDateRowCount; i++) {
        const date = document.getElementById(`transportDate${i}`)?.value;
        const origin = document.getElementById(`transportOrigin${i}`)?.value;
        const destination = document.getElementById(`transportDestination${i}`)?.value;

        if (date && origin && destination) {
            transportDates.push({ date, origin, destination });
        }
    }

    const volunteerType = document.getElementById('volunteerType').value;
    const experienceField = document.getElementById('volunteerExperience');

    const data = {
        formType: 'volunteer',
        volunteerType: volunteerType,
        name: document.getElementById('volunteerName').value,
        email: document.getElementById('volunteerEmail').value,
        phone: document.getElementById('volunteerPhone').value,
        city: document.getElementById('volunteerCity').value,
        socialLink: document.getElementById('volunteerSocialLink').value || '',
        experience: experienceField ? experienceField.value : '',
        availability: availabilities,
        transportDates: transportDates,
        contactConsent: document.getElementById('volunteerContactConsent').checked,
        dataConsent: document.getElementById('volunteerDataConsent').checked
    };

    try {
        console.log('Enviando formulario de voluntariado:', data);
        console.log('URL:', FORMS_API_URL);

        const response = await fetch(FORMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Error del servidor:', response.status, responseData);
            showDetailedErrorPopup({
                url: FORMS_API_URL,
                method: 'POST',
                status: response.status,
                statusText: response.statusText,
                responseMessage: responseData.message || JSON.stringify(responseData)
            });
            return;
        }

        showToast('¡Solicitud de voluntariado enviada! Te contactaremos pronto.', 'success');
        closeHelpModal();
    } catch (error) {
        console.error('Error guardando formulario de voluntariado:', error);
        showDetailedErrorPopup({
            url: FORMS_API_URL,
            method: 'POST',
            status: 0,
            networkError: error.message
        });
    }
}

// Formulario de casa de acogida
function openFosterForm() {
    const modalContent = `
        <div class="foster-form-content">
            <h3>Solicitud casa de acogida</h3>
            <p class="help-intro">Gracias por tu interés en ser casa de acogida. Completa este formulario y nos pondremos en contacto contigo.</p>

            <form id="fosterForm" class="foster-form">
                <div class="form-section-header">
                    <h4>Datos personales</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nombre completo *</label>
                        <input type="text" class="form-input" id="fosterName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Correo electrónico *</label>
                        <input type="email" class="form-input" id="fosterEmail" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Teléfono *</label>
                        <input type="tel" class="form-input" id="fosterPhone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ciudad *</label>
                        <input type="text" class="form-input" id="fosterCity" required>
                    </div>
                </div>

                <div class="form-section-header">
                    <h4>Sobre tu hogar</h4>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Tipo de vivienda *</label>
                        <select class="form-input" id="fosterHousingType" required>
                            <option value="">Selecciona...</option>
                            <option value="piso">Piso</option>
                            <option value="casa">Casa</option>
                            <option value="chalet">Chalet</option>
                            <option value="finca">Finca</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">¿Tienes jardín o terraza? *</label>
                        <select class="form-input" id="fosterOutdoor" required>
                            <option value="">Selecciona...</option>
                            <option value="jardin">Sí, jardín</option>
                            <option value="terraza">Sí, terraza</option>
                            <option value="ambos">Ambos</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Otras mascotas en casa</label>
                    <textarea class="form-input form-textarea" id="fosterOtherPets" placeholder="Describe si tienes otras mascotas, su edad, carácter..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Niños en casa</label>
                    <input type="text" class="form-input" id="fosterChildren" placeholder="Número y edades de los niños (si hay)">
                </div>

                <div class="form-section-header">
                    <h4>Preferencias de acogida</h4>
                </div>

                <div class="form-group">
                    <label class="form-label">¿Qué tipo de animal podrías acoger? *</label>
                    <div class="availability-grid">
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="perro_pequeno"> Perro pequeño</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="perro_mediano"> Perro mediano</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="perro_grande"> Perro grande</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="gato"> Gato</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="cachorro"> Cachorros</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="senior"> Animales sénior</label>
                        <label class="checkbox-label"><input type="checkbox" name="fosterAnimalType" value="especial"> Necesidades especiales</label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">¿Cuánto tiempo podrías acoger?</label>
                    <select class="form-input" id="fosterDuration">
                        <option value="">Selecciona...</option>
                        <option value="corto">Corto plazo (1-2 semanas)</option>
                        <option value="medio">Medio plazo (1-3 meses)</option>
                        <option value="largo">Largo plazo (hasta adopción)</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Experiencia previa con animales</label>
                    <textarea class="form-input form-textarea" id="fosterExperience" placeholder="Cuéntanos tu experiencia con animales..."></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Comentarios adicionales</label>
                    <textarea class="form-input form-textarea" id="fosterComments" placeholder="Algo más que quieras contarnos..."></textarea>
                </div>

                <div class="legal-clauses">
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="fosterDataConsent" required>
                            <span>Acepto la política de protección de datos y autorizo el tratamiento de mis datos personales. *</span>
                        </label>
                    </div>
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="fosterFollowUpConsent" required>
                            <span>Doy mi consentimiento para que la protectora se ponga en contacto conmigo y realice un seguimiento del animal acogido. *</span>
                        </label>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="openHelpModal('casaAcogida')">Volver</button>
                    <button type="submit" class="btn btn-primary">Enviar solicitud</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('helpContent').innerHTML = modalContent;
    document.getElementById('helpModalTitle').innerHTML = '🏠 Casa de acogida';

    document.getElementById('fosterForm').addEventListener('submit', handleFosterSubmit);
}

// Validación de formulario de casa de acogida
function validateFosterForm() {
    const errors = [];
    const fieldLabels = {
        'fosterName': 'Nombre completo',
        'fosterEmail': 'Correo electrónico',
        'fosterPhone': 'Teléfono',
        'fosterCity': 'Ciudad',
        'fosterHousingType': 'Tipo de vivienda',
        'fosterOutdoor': 'Jardín o terraza',
        'fosterDataConsent': 'Política de protección de datos',
        'fosterFollowUpConsent': 'Consentimiento de seguimiento'
    };

    const requiredFields = ['fosterName', 'fosterEmail', 'fosterPhone', 'fosterCity', 'fosterHousingType', 'fosterOutdoor'];
    const requiredCheckboxes = ['fosterDataConsent', 'fosterFollowUpConsent'];

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && (!field.value || field.value.trim() === '')) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    requiredCheckboxes.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.checked) {
            errors.push(fieldLabels[fieldId] || fieldId);
        }
    });

    // Validar email
    const email = document.getElementById('fosterEmail')?.value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no tiene un formato válido');
    }

    // Validar que al menos un tipo de animal esté seleccionado
    const animalTypesSelected = document.querySelectorAll('input[name="fosterAnimalType"]:checked');
    if (animalTypesSelected.length === 0) {
        errors.push('Selecciona al menos un tipo de animal que podrías acoger');
    }

    return errors;
}

async function handleFosterSubmit(e) {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateFosterForm();
    if (validationErrors.length > 0) {
        showVolunteerValidationErrors(validationErrors);
        return;
    }

    const animalTypes = [];
    document.querySelectorAll('input[name="fosterAnimalType"]:checked').forEach(cb => {
        animalTypes.push(cb.value);
    });

    const data = {
        formType: 'foster',
        name: document.getElementById('fosterName').value,
        email: document.getElementById('fosterEmail').value,
        phone: document.getElementById('fosterPhone').value,
        city: document.getElementById('fosterCity').value,
        housingType: document.getElementById('fosterHousingType').value,
        outdoor: document.getElementById('fosterOutdoor').value,
        otherPets: document.getElementById('fosterOtherPets').value,
        children: document.getElementById('fosterChildren').value,
        animalTypes: animalTypes,
        duration: document.getElementById('fosterDuration').value,
        experience: document.getElementById('fosterExperience').value,
        comments: document.getElementById('fosterComments').value,
        dataConsent: document.getElementById('fosterDataConsent').checked,
        followUpConsent: document.getElementById('fosterFollowUpConsent').checked
    };

    try {
        console.log('Enviando formulario de casa de acogida:', data);
        console.log('URL:', FORMS_API_URL);

        const response = await fetch(FORMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Error del servidor:', response.status, responseData);
            showDetailedErrorPopup({
                url: FORMS_API_URL,
                method: 'POST',
                status: response.status,
                statusText: response.statusText,
                responseMessage: responseData.message || JSON.stringify(responseData)
            });
            return;
        }

        showToast('¡Solicitud de casa de acogida enviada! Te contactaremos pronto.', 'success');
        closeHelpModal();
    } catch (error) {
        console.error('Error guardando formulario de casa de acogida:', error);
        showDetailedErrorPopup({
            url: FORMS_API_URL,
            method: 'POST',
            status: 0,
            networkError: error.message
        });
    }
}

// Abrir modal para contribuir a una factura
function openContributeModal(invoiceId, description, remaining) {
    const modalContent = `
        <div class="contribute-form-content">
            <h3>Contribuir a factura</h3>
            <p class="help-intro">${description}</p>
            <p class="contribute-remaining">Cantidad pendiente: <strong>${remaining}€</strong></p>

            <form id="contributeForm" class="contribute-form">
                <input type="hidden" id="contributeInvoiceId" value="${invoiceId}">

                <div class="form-group">
                    <label class="form-label">Tu nombre</label>
                    <input type="text" class="form-input" id="contributeName" placeholder="Opcional - puedes ser anónimo">
                </div>

                <div class="form-group">
                    <label class="form-label">Correo electrónico</label>
                    <input type="email" class="form-input" id="contributeEmail" placeholder="Para enviarte confirmación">
                </div>

                <div class="form-group">
                    <label class="form-label">Cantidad a aportar (euros) *</label>
                    <div class="amount-selector">
                        <button type="button" class="amount-btn" onclick="setContributeAmount(10)">10€</button>
                        <button type="button" class="amount-btn" onclick="setContributeAmount(25)">25€</button>
                        <button type="button" class="amount-btn" onclick="setContributeAmount(50)">50€</button>
                        <button type="button" class="amount-btn" onclick="setContributeAmount(${remaining})">Todo (${remaining}€)</button>
                        <input type="number" class="form-input amount-input" id="contributeAmount" value="10" min="1" max="${remaining}" required>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="openHelpModal('facturas')">Volver</button>
                    <button type="submit" class="btn btn-primary">Confirmar aportación</button>
                </div>
            </form>

            <div class="sponsor-payment-info">
                <p><strong>Método de pago:</strong> Transferencia bancaria</p>
                <p>IBAN: ES70 0049 3327 3721 1405 4110</p>
                <p>Concepto: Factura ${description}</p>
            </div>
        </div>
    `;

    document.getElementById('helpContent').innerHTML = modalContent;
    document.getElementById('helpModalTitle').innerHTML = '🏥 Contribuir a factura';

    document.getElementById('contributeForm').addEventListener('submit', handleContributeSubmit);
}

function setContributeAmount(amount) {
    document.getElementById('contributeAmount').value = amount;
    document.querySelectorAll('.contribute-form-content .amount-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

async function handleContributeSubmit(e) {
    e.preventDefault();

    const data = {
        formType: 'invoice_contribution',
        invoiceId: document.getElementById('contributeInvoiceId').value,
        name: document.getElementById('contributeName').value,
        email: document.getElementById('contributeEmail').value,
        amount: document.getElementById('contributeAmount').value
    };

    try {
        console.log('Enviando contribución:', data);
        console.log('URL:', FORMS_API_URL);

        const response = await fetch(FORMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Error del servidor:', response.status, responseData);
            showDetailedErrorPopup({
                url: FORMS_API_URL,
                method: 'POST',
                status: response.status,
                statusText: response.statusText,
                responseMessage: responseData.message || JSON.stringify(responseData)
            });
            return;
        }

        showToast('¡Gracias por tu aportación! Te enviaremos confirmación.', 'success');
        closeHelpModal();
    } catch (error) {
        console.error('Error guardando contribución:', error);
        showDetailedErrorPopup({
            url: FORMS_API_URL,
            method: 'POST',
            status: 0,
            networkError: error.message
        });
    }
}

// Funciones para el formulario de feedback
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    document.getElementById('feedbackRating').value = rating;
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.rating) <= rating);
    });
}

function validateFeedbackForm() {
    const errors = [];
    const rating = document.getElementById('feedbackRating')?.value;

    if (!rating || rating === '') {
        errors.push('Por favor, selecciona una valoración');
    }

    // Validar email si se proporciona
    const email = document.getElementById('feedbackEmail')?.value;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El correo electrónico no tiene un formato válido');
    }

    return errors;
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();

    const validationErrors = validateFeedbackForm();
    if (validationErrors.length > 0) {
        showVolunteerValidationErrors(validationErrors);
        return;
    }

    const data = {
        formType: 'feedback',
        rating: parseInt(document.getElementById('feedbackRating').value),
        likes: document.getElementById('feedbackLikes').value || '',
        improvements: document.getElementById('feedbackImprovements').value || '',
        comments: document.getElementById('feedbackComments').value || '',
        name: document.getElementById('feedbackName').value || '',
        email: document.getElementById('feedbackEmail').value || ''
    };

    try {
        console.log('Enviando feedback:', data);
        console.log('URL:', FORMS_API_URL);

        const response = await fetch(FORMS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Error del servidor:', response.status, responseData);
            showDetailedErrorPopup({
                url: FORMS_API_URL,
                method: 'POST',
                status: response.status,
                statusText: response.statusText,
                responseMessage: responseData.message || JSON.stringify(responseData)
            });
            return;
        }

        showToast('¡Gracias por tu opinión! Nos ayuda mucho a mejorar.', 'success');
        closeHelpModal();
    } catch (error) {
        console.error('Error guardando feedback:', error);
        showDetailedErrorPopup({
            url: FORMS_API_URL,
            method: 'POST',
            status: 0,
            networkError: error.message
        });
    }
}

function setupHelpListeners() {
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', () => openHelpModal(btn.dataset.action));
    });

    document.getElementById('closeHelpModal').addEventListener('click', closeHelpModal);
    document.getElementById('helpModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('helpModal')) closeHelpModal();
    });
}

// Exponer globalmente
window.helpContent = helpContent;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;
window.setupHelpListeners = setupHelpListeners;
window.openVolunteerForm = openVolunteerForm;
window.openFosterForm = openFosterForm;
window.openSponsorForm = openSponsorForm;
window.openContributeModal = openContributeModal;
window.setAmount = setAmount;
window.setContributeAmount = setContributeAmount;
window.addTransportDateRow = addTransportDateRow;
window.backToSponsorList = backToSponsorList;
window.closeVolunteerValidationModal = closeVolunteerValidationModal;
window.setRating = setRating;
