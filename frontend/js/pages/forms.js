// Página Forms - Solicitudes de Voluntariado, Casa de Acogida, Apadrinamiento (Admin)

const FORMS_API = (window.API_BASE_URL || '') + '/api/forms';

async function renderFormsView() {
    const contentHeader = document.querySelector('.content-header');
    const addPetBtn = document.getElementById('addPetBtn');
    const petsGrid = document.getElementById('petsGrid');

    contentHeader.style.display = 'none';
    addPetBtn.classList.remove('visible');
    petsGrid.classList.add('full-width-view');

    // Mostrar loading
    petsGrid.innerHTML = '<div class="loading-state"><span>⏳</span><p>Cargando formularios...</p></div>';

    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(FORMS_API, {
            headers: authHeaders
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        AppState.formSubmissions = await response.json();
        renderFormsTable();
    } catch (error) {
        console.error('Error cargando formularios:', error);
        petsGrid.innerHTML = '<div class="error-state"><span>❌</span><p>Error al cargar formularios</p></div>';
    }
}

function renderFormsTable() {
    const petsGrid = document.getElementById('petsGrid');
    const formTypeLabels = {
        volunteer: 'Voluntariado',
        foster: 'Casa de Acogida',
        sponsorship: 'Apadrinamiento',
        invoice_contribution: 'Contribución Factura',
        feedback: 'Opinión Web'
    };

    const volunteerTypeLabels = {
        transporte: 'Transporte',
        educador: 'Educador canino',
        refugio: 'Tareas refugio',
        fotografia: 'Fotografía',
        eventos: 'Eventos',
        veterinario: 'Apoyo veterinario'
    };

    const statusLabels = {
        pending: 'Pendiente',
        reviewing: 'En revisión',
        approved: 'Aprobada',
        rejected: 'Rechazada',
        completed: 'Completada'
    };

    const statusColors = {
        pending: '#f59e0b',
        reviewing: '#3b82f6',
        approved: '#10b981',
        rejected: '#ef4444',
        completed: '#6b7280'
    };

    // Filtrar por tipo si hay filtro activo
    let filteredForms = AppState.formSubmissions || [];
    if (AppState.formsFilter && AppState.formsFilter !== 'all') {
        filteredForms = filteredForms.filter(f => f.formType === AppState.formsFilter);
    }

    const statsHtml = `
        <div class="requests-stats">
            <div class="stat-chip ${!AppState.formsFilter || AppState.formsFilter === 'all' ? 'active' : ''}" onclick="filterForms('all')">
                <span>Todos</span>
                <span class="stat-count">${(AppState.formSubmissions || []).length}</span>
            </div>
            <div class="stat-chip ${AppState.formsFilter === 'volunteer' ? 'active' : ''}" onclick="filterForms('volunteer')">
                <span>Voluntariado</span>
                <span class="stat-count">${(AppState.formSubmissions || []).filter(f => f.formType === 'volunteer').length}</span>
            </div>
            <div class="stat-chip ${AppState.formsFilter === 'foster' ? 'active' : ''}" onclick="filterForms('foster')">
                <span>Casa Acogida</span>
                <span class="stat-count">${(AppState.formSubmissions || []).filter(f => f.formType === 'foster').length}</span>
            </div>
            <div class="stat-chip ${AppState.formsFilter === 'sponsorship' ? 'active' : ''}" onclick="filterForms('sponsorship')">
                <span>Apadrinamiento</span>
                <span class="stat-count">${(AppState.formSubmissions || []).filter(f => f.formType === 'sponsorship').length}</span>
            </div>
            <div class="stat-chip ${AppState.formsFilter === 'invoice_contribution' ? 'active' : ''}" onclick="filterForms('invoice_contribution')">
                <span>Contribuciones</span>
                <span class="stat-count">${(AppState.formSubmissions || []).filter(f => f.formType === 'invoice_contribution').length}</span>
            </div>
            <div class="stat-chip ${AppState.formsFilter === 'feedback' ? 'active' : ''}" onclick="filterForms('feedback')">
                <span>Opiniones</span>
                <span class="stat-count">${(AppState.formSubmissions || []).filter(f => f.formType === 'feedback').length}</span>
            </div>
        </div>
    `;

    if (filteredForms.length === 0) {
        petsGrid.innerHTML = `
            <div class="requests-view">
                <div class="requests-header">
                    <h1>📝 Formularios Recibidos</h1>
                    <p>Gestiona las solicitudes de voluntariado, acogida y apadrinamiento</p>
                </div>
                ${statsHtml}
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3 class="empty-title">No hay formularios</h3>
                    <p class="empty-text">${!AppState.formsFilter || AppState.formsFilter === 'all' ? 'Aún no se han recibido formularios' : 'No hay formularios de este tipo'}</p>
                </div>
            </div>
        `;
        return;
    }

    const tableRows = filteredForms.map(form => {
        const date = new Date(form.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const typeLabel = formTypeLabels[form.formType] || form.formType;
        const subType = form.volunteerType ? ` (${volunteerTypeLabels[form.volunteerType] || form.volunteerType})` : '';

        return `
            <tr class="request-row" onclick="viewFormDetails('${form._id}')">
                <td class="request-date">${date}</td>
                <td class="request-name">${form.name || 'Sin nombre'}</td>
                <td class="request-email">${form.email || '-'}</td>
                <td class="request-phone">${form.phone || '-'}</td>
                <td class="request-pet">${typeLabel}${subType}</td>
                <td>
                    <span class="request-status" style="background: ${statusColors[form.status]}20; color: ${statusColors[form.status]}">
                        ${statusLabels[form.status] || 'Pendiente'}
                    </span>
                </td>
                <td class="request-actions">
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeFormStatus('${form._id}', 'reviewing')" title="En revisión">📝</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeFormStatus('${form._id}', 'approved')" title="Aprobar">✅</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeFormStatus('${form._id}', 'rejected')" title="Rechazar">❌</button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteForm('${form._id}')" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    petsGrid.innerHTML = `
        <div class="requests-view">
            <div class="requests-header">
                <div class="requests-header-text">
                    <h1>📝 Formularios Recibidos</h1>
                    <p>Gestiona las solicitudes de voluntariado, acogida y apadrinamiento</p>
                </div>
                <div class="requests-header-actions">
                    <button class="btn btn-secondary export-btn" onclick="exportFormsToCSV()">
                        <span>📥</span> Exportar CSV
                    </button>
                </div>
            </div>
            ${statsHtml}
            <div class="requests-table-container">
                <table class="requests-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Tipo</th>
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

function filterForms(type) {
    AppState.formsFilter = type;
    renderFormsTable();
}

async function changeFormStatus(formId, newStatus) {
    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${FORMS_API}/${formId}`, {
            method: 'PUT',
            headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
            body: JSON.stringify({ status: newStatus })
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        if (response.ok) {
            const statusLabels = {
                pending: 'pendiente',
                reviewing: 'en revisión',
                approved: 'aprobado',
                rejected: 'rechazado',
                completed: 'completado'
            };
            showToast(`Formulario marcado como ${statusLabels[newStatus]}`, 'success');
            renderFormsView();
        }
    } catch (error) {
        showToast('Error al actualizar estado', 'error');
    }
}

async function deleteForm(formId) {
    if (!confirm('¿Eliminar este formulario permanentemente?')) return;

    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${FORMS_API}/${formId}`, {
            method: 'DELETE',
            headers: authHeaders
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        if (response.ok) {
            showToast('Formulario eliminado', 'success');
            renderFormsView();
        }
    } catch (error) {
        showToast('Error al eliminar formulario', 'error');
    }
}

async function viewFormDetails(formId) {
    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${FORMS_API}/${formId}`, {
            headers: authHeaders
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        const form = await response.json();

        const formTypeLabels = {
            volunteer: 'Voluntariado',
            foster: 'Casa de Acogida',
            sponsorship: 'Apadrinamiento',
            invoice_contribution: 'Contribución Factura',
            feedback: 'Opinión Web'
        };

        const volunteerTypeLabels = {
            transporte: 'Transporte de animales',
            educador: 'Educador canino',
            refugio: 'Tareas en el refugio',
            fotografia: 'Fotografía',
            eventos: 'Eventos y mercadillos',
            veterinario: 'Apoyo veterinario'
        };

        const statusLabels = {
            pending: 'Pendiente',
            reviewing: 'En revisión',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            completed: 'Completado'
        };

        const date = new Date(form.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let specificDetails = '';

        // Detalles según tipo de formulario
        if (form.formType === 'volunteer') {
            specificDetails = `
                <div class="detail-section">
                    <h4>🤝 Tipo de Voluntariado</h4>
                    <p><strong>${volunteerTypeLabels[form.volunteerType] || form.volunteerType}</strong></p>
                </div>
                ${form.socialLink ? `
                <div class="detail-section">
                    <h4>🔗 Red Social</h4>
                    <p><a href="${form.socialLink}" target="_blank">${form.socialLink}</a></p>
                </div>
                ` : ''}
                ${form.experience ? `
                <div class="detail-section">
                    <h4>📋 Experiencia Previa</h4>
                    <p>${form.experience}</p>
                </div>
                ` : ''}
                ${form.availability && form.availability.length > 0 ? `
                <div class="detail-section">
                    <h4>🕐 Disponibilidad</h4>
                    <p>${form.availability.map(a => {
                        const labels = { mananas: 'Mañanas', tardes: 'Tardes', fines_semana: 'Fines de semana', flexible: 'Flexible' };
                        return labels[a] || a;
                    }).join(', ')}</p>
                </div>
                ` : ''}
                ${form.transportDates && form.transportDates.length > 0 ? `
                <div class="detail-section">
                    <h4>🚗 Trayectos Disponibles</h4>
                    <div class="transport-list">
                        ${form.transportDates.map(t => `
                            <div class="transport-item">
                                <span>${t.origin} → ${t.destination}</span>
                                <span>${t.date ? new Date(t.date).toLocaleDateString('es-ES') : (t.start ? new Date(t.start).toLocaleDateString('es-ES') : '-')}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            `;
        } else if (form.formType === 'foster') {
            specificDetails = `
                <div class="detail-section">
                    <h4>🏠 Vivienda</h4>
                    <div class="detail-grid">
                        <div><span>Tipo:</span> ${form.housingType || '-'}</div>
                        <div><span>Exterior:</span> ${form.outdoor || '-'}</div>
                        ${form.otherPets ? `<div class="full-width"><span>Otras mascotas:</span> ${form.otherPets}</div>` : ''}
                        ${form.children ? `<div><span>Niños:</span> ${form.children}</div>` : ''}
                    </div>
                </div>
                ${form.animalTypes && form.animalTypes.length > 0 ? `
                <div class="detail-section">
                    <h4>🐾 Tipos de Animal</h4>
                    <p>${form.animalTypes.join(', ')}</p>
                </div>
                ` : ''}
                ${form.duration ? `
                <div class="detail-section">
                    <h4>⏱️ Duración Acogida</h4>
                    <p>${form.duration}</p>
                </div>
                ` : ''}
                ${form.experience ? `
                <div class="detail-section">
                    <h4>📋 Experiencia</h4>
                    <p>${form.experience}</p>
                </div>
                ` : ''}
            `;
        } else if (form.formType === 'sponsorship') {
            specificDetails = `
                <div class="detail-section">
                    <h4>🐾 Animal Apadrinado</h4>
                    <p><strong>${form.animalName || 'No especificado'}</strong></p>
                </div>
                <div class="detail-section">
                    <h4>💰 Cantidad Mensual</h4>
                    <p><strong>${form.amount || 5}€/mes</strong></p>
                </div>
                <div class="detail-section">
                    <h4>📧 Actualizaciones</h4>
                    <p>${form.wantsUpdates ? 'Sí, quiere recibir actualizaciones' : 'No quiere actualizaciones'}</p>
                </div>
            `;
        } else if (form.formType === 'invoice_contribution') {
            specificDetails = `
                <div class="detail-section">
                    <h4>🧾 Factura</h4>
                    <p>ID: ${form.invoiceId || '-'}</p>
                </div>
                <div class="detail-section">
                    <h4>💰 Cantidad Aportada</h4>
                    <p><strong>${form.amount || 0}€</strong></p>
                </div>
            `;
        } else if (form.formType === 'feedback') {
            const ratingEmojis = ['', '😞', '😕', '😐', '🙂', '😍'];
            const ratingLabel = form.rating ? `${ratingEmojis[form.rating]} (${form.rating}/5)` : 'No valorado';
            specificDetails = `
                <div class="detail-section">
                    <h4>⭐ Valoración</h4>
                    <p class="feedback-rating-display">${ratingLabel}</p>
                </div>
                ${form.likes ? `
                <div class="detail-section">
                    <h4>👍 Lo que más le gustó</h4>
                    <p>${form.likes}</p>
                </div>
                ` : ''}
                ${form.improvements ? `
                <div class="detail-section">
                    <h4>💡 Sugerencias de mejora</h4>
                    <p>${form.improvements}</p>
                </div>
                ` : ''}
            `;
        }

        const detailsHtml = `
            <div class="request-details">
                <div class="request-details-header">
                    <h3>${formTypeLabels[form.formType]} - ${form.name || 'Sin nombre'}</h3>
                    <span class="request-status-large status-${form.status}">${statusLabels[form.status] || 'Pendiente'}</span>
                </div>
                <p class="request-date-detail">Recibido el ${date}</p>

                <div class="detail-section">
                    <h4>👤 Datos de Contacto</h4>
                    <div class="detail-grid">
                        <div><span>Nombre:</span> ${form.name || '-'}</div>
                        <div><span>Email:</span> ${form.email || '-'}</div>
                        <div><span>Teléfono:</span> ${form.phone || '-'}</div>
                        <div><span>Ciudad:</span> ${form.city || '-'}</div>
                    </div>
                </div>

                ${specificDetails}

                <div class="detail-section">
                    <h4>✅ Consentimientos</h4>
                    <div class="detail-grid">
                        <div><span>Contacto:</span> ${form.contactConsent ? 'Sí' : 'No'}</div>
                        <div><span>Datos:</span> ${form.dataConsent ? 'Sí' : 'No'}</div>
                        ${form.followUpConsent !== undefined ? `<div><span>Seguimiento:</span> ${form.followUpConsent ? 'Sí' : 'No'}</div>` : ''}
                    </div>
                </div>

                ${form.comments ? `
                <div class="detail-section">
                    <h4>💬 Comentarios</h4>
                    <p>${form.comments}</p>
                </div>
                ` : ''}

                <div class="request-details-actions">
                    <button class="btn btn-secondary" onclick="changeFormStatus('${form._id}', 'reviewing'); closeProfileModal();">📝 En Revisión</button>
                    <button class="btn btn-primary" onclick="changeFormStatus('${form._id}', 'approved'); closeProfileModal();">✅ Aprobar</button>
                    <button class="btn btn-secondary" style="background: #ef4444; border-color: #ef4444; color: white;" onclick="changeFormStatus('${form._id}', 'rejected'); closeProfileModal();">❌ Rechazar</button>
                </div>
            </div>
        `;

        document.getElementById('profileContent').innerHTML = detailsHtml;
        document.querySelector('#profileModal .modal-title').textContent = '📋 Detalles del Formulario';
        document.getElementById('profileModal').classList.add('active');

    } catch (error) {
        showToast('Error al cargar detalles', 'error');
    }
}

// Exportar formularios a CSV
function exportFormsToCSV() {
    const forms = AppState.formSubmissions || [];

    if (forms.length === 0) {
        showToast('No hay formularios para exportar', 'error');
        return;
    }

    // Filtrar por el filtro activo si hay alguno
    let dataToExport = forms;
    if (AppState.formsFilter && AppState.formsFilter !== 'all') {
        dataToExport = forms.filter(f => f.formType === AppState.formsFilter);
    }

    if (dataToExport.length === 0) {
        showToast('No hay formularios de este tipo para exportar', 'error');
        return;
    }

    const formTypeLabels = {
        volunteer: 'Voluntariado',
        foster: 'Casa de Acogida',
        sponsorship: 'Apadrinamiento',
        invoice_contribution: 'Contribución Factura',
        feedback: 'Opinión Web'
    };

    const volunteerTypeLabels = {
        transporte: 'Transporte',
        educador: 'Educador canino',
        refugio: 'Tareas refugio',
        fotografia: 'Fotografía',
        eventos: 'Eventos',
        veterinario: 'Apoyo veterinario'
    };

    const statusLabels = {
        pending: 'Pendiente',
        reviewing: 'En revisión',
        approved: 'Aprobado',
        rejected: 'Rechazado',
        completed: 'Completado'
    };

    // Cabeceras del CSV
    const headers = [
        'Fecha',
        'Tipo',
        'Subtipo',
        'Estado',
        'Nombre',
        'Email',
        'Teléfono',
        'Ciudad',
        'Valoración',
        'Comentarios'
    ];

    // Convertir datos a filas CSV
    const rows = dataToExport.map(form => {
        const date = new Date(form.createdAt).toLocaleDateString('es-ES');
        const type = formTypeLabels[form.formType] || form.formType;
        const subtype = form.volunteerType ? (volunteerTypeLabels[form.volunteerType] || form.volunteerType) : (form.animalName || '');
        const status = statusLabels[form.status] || form.status;
        const comments = form.comments || form.likes || form.improvements || form.experience || '';

        return [
            date,
            type,
            subtype,
            status,
            form.name || '',
            form.email || '',
            form.phone || '',
            form.city || '',
            form.rating || '',
            comments.replace(/"/g, '""').replace(/\n/g, ' ')
        ];
    });

    // Crear contenido CSV
    let csvContent = headers.join(';') + '\n';
    rows.forEach(row => {
        csvContent += row.map(cell => '"' + cell + '"').join(';') + '\n';
    });

    // Añadir BOM para que Excel reconozca UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Crear enlace de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filterName = AppState.formsFilter && AppState.formsFilter !== 'all' ? '_' + AppState.formsFilter : '';
    const filename = 'formularios' + filterName + '_' + new Date().toISOString().split('T')[0] + '.csv';

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV exportado correctamente', 'success');
}

// Exponer globalmente
window.renderFormsView = renderFormsView;
window.filterForms = filterForms;
window.changeFormStatus = changeFormStatus;
window.deleteForm = deleteForm;
window.viewFormDetails = viewFormDetails;
window.exportFormsToCSV = exportFormsToCSV;
