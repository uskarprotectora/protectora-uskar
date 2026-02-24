// Pagina Requests - Solicitudes de Adopción (Admin)

// Estado de selección de solicitudes
var selectedRequestIds = [];

async function renderAdoptionRequestsView() {
    const contentHeader = document.querySelector('.content-header');
    const addPetBtn = document.getElementById('addPetBtn');
    const petsGrid = document.getElementById('petsGrid');

    contentHeader.style.display = 'none';
    addPetBtn.classList.remove('visible');
    petsGrid.classList.add('full-width-view');

    // Mostrar loading
    petsGrid.innerHTML = '<div class="loading-state"><span>⏳</span><p>Cargando solicitudes...</p></div>';

    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(ADOPTIONS_API_URL, {
            headers: authHeaders
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        AppState.adoptionRequests = await response.json();
        renderRequestsTable();
    } catch (error) {
        petsGrid.innerHTML = '<div class="error-state"><span>❌</span><p>Error al cargar solicitudes</p></div>';
    }
}

function renderRequestsTable() {
    const petsGrid = document.getElementById('petsGrid');
    const statusLabels = {
        pending: 'Pendiente',
        reviewing: 'En revisión',
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
    let filteredRequests = AppState.adoptionRequests;
    if (AppState.requestsFilter !== 'all') {
        filteredRequests = AppState.adoptionRequests.filter(r => r.status === AppState.requestsFilter);
    }

    const statsHtml = `
        <div class="requests-stats">
            <div class="stat-chip ${AppState.requestsFilter === 'all' ? 'active' : ''}" onclick="filterRequests('all')">
                <span>Todas</span>
                <span class="stat-count">${AppState.adoptionRequests.length}</span>
            </div>
            <div class="stat-chip ${AppState.requestsFilter === 'pending' ? 'active' : ''}" onclick="filterRequests('pending')">
                <span>Pendientes</span>
                <span class="stat-count">${AppState.adoptionRequests.filter(r => r.status === 'pending').length}</span>
            </div>
            <div class="stat-chip ${AppState.requestsFilter === 'reviewing' ? 'active' : ''}" onclick="filterRequests('reviewing')">
                <span>En revisión</span>
                <span class="stat-count">${AppState.adoptionRequests.filter(r => r.status === 'reviewing').length}</span>
            </div>
            <div class="stat-chip ${AppState.requestsFilter === 'approved' ? 'active' : ''}" onclick="filterRequests('approved')">
                <span>Aprobadas</span>
                <span class="stat-count">${AppState.adoptionRequests.filter(r => r.status === 'approved').length}</span>
            </div>
            <div class="stat-chip ${AppState.requestsFilter === 'rejected' ? 'active' : ''}" onclick="filterRequests('rejected')">
                <span>Rechazadas</span>
                <span class="stat-count">${AppState.adoptionRequests.filter(r => r.status === 'rejected').length}</span>
            </div>
        </div>
    `;

    if (filteredRequests.length === 0) {
        petsGrid.innerHTML = `
            <div class="requests-view">
                <div class="requests-header">
                    <div class="requests-header-text">
                        <h1>📊 Solicitudes de Adopción</h1>
                        <p>Gestiona las solicitudes recibidas</p>
                    </div>
                    <div class="requests-header-actions">
                        <button class="btn btn-secondary export-btn" onclick="exportAdoptionsToCSV()">
                            <span>📥</span> Exportar CSV
                        </button>
                    </div>
                </div>
                ${statsHtml}
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3 class="empty-title">No hay solicitudes</h3>
                    <p class="empty-text">${AppState.requestsFilter === 'all' ? 'Aún no se han recibido solicitudes de adopción' : 'No hay solicitudes con este estado'}</p>
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
        const isSelected = selectedRequestIds.includes(request._id);

        return `
            <tr class="request-row ${isSelected ? 'selected' : ''}" onclick="viewRequestDetails('${sanitizeAttr(request._id)}')">
                <td class="request-checkbox" onclick="event.stopPropagation();">
                    <input type="checkbox" class="request-select-checkbox" data-id="${sanitizeAttr(request._id)}" ${isSelected ? 'checked' : ''} onchange="toggleRequestSelection('${sanitizeAttr(request._id)}')">
                </td>
                <td class="request-date">${date}</td>
                <td class="request-name">${sanitizeHtml(request.fullName)}</td>
                <td class="request-email">${sanitizeHtml(request.email)}</td>
                <td class="request-phone">${sanitizeHtml(request.phone)}</td>
                <td class="request-pet">${sanitizeHtml(request.petName) || 'General'}</td>
                <td>
                    <span class="request-status" style="background: ${statusColors[request.status]}20; color: ${statusColors[request.status]}">
                        ${statusLabels[request.status]}
                    </span>
                </td>
                <td class="request-actions">
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${sanitizeAttr(request._id)}', 'reviewing')" title="En revisión">📝</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${sanitizeAttr(request._id)}', 'approved')" title="Aprobar">✅</button>
                    <button class="action-icon-btn" onclick="event.stopPropagation(); changeRequestStatus('${sanitizeAttr(request._id)}', 'rejected')" title="Rechazar">❌</button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteRequest('${sanitizeAttr(request._id)}')" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');

    const allChecked = filteredRequests.length > 0 && filteredRequests.every(r => selectedRequestIds.includes(r._id));
    const someChecked = selectedRequestIds.length > 0;

    petsGrid.innerHTML = `
        <div class="requests-view">
            <div class="requests-header">
                <div class="requests-header-text">
                    <h1>📊 Solicitudes de Adopción</h1>
                    <p>Gestiona las solicitudes recibidas</p>
                </div>
                <div class="requests-header-actions">
                    ${someChecked ? `<button class="btn btn-danger delete-selected-btn" onclick="deleteSelectedRequests()">
                        <span>🗑️</span> Eliminar (${selectedRequestIds.length})
                    </button>` : ''}
                    <button class="btn btn-secondary export-btn" onclick="exportAdoptionsToCSV()">
                        <span>📥</span> Exportar CSV
                    </button>
                </div>
            </div>
            ${statsHtml}
            <div class="requests-table-container">
                <table class="requests-table">
                    <thead>
                        <tr>
                            <th class="checkbox-header">
                                <input type="checkbox" id="selectAllRequests" ${allChecked ? 'checked' : ''} onchange="toggleSelectAllRequests(this.checked)">
                            </th>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
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
    AppState.requestsFilter = status;
    selectedRequestIds = []; // Limpiar selección al cambiar filtro
    renderRequestsTable();
}

function toggleRequestSelection(requestId) {
    const index = selectedRequestIds.indexOf(requestId);
    if (index === -1) {
        selectedRequestIds.push(requestId);
    } else {
        selectedRequestIds.splice(index, 1);
    }
    renderRequestsTable();
}

function toggleSelectAllRequests(checked) {
    let filteredRequests = AppState.adoptionRequests;
    if (AppState.requestsFilter !== 'all') {
        filteredRequests = AppState.adoptionRequests.filter(r => r.status === AppState.requestsFilter);
    }

    if (checked) {
        selectedRequestIds = filteredRequests.map(r => r._id);
    } else {
        selectedRequestIds = [];
    }
    renderRequestsTable();
}

async function deleteSelectedRequests() {
    if (selectedRequestIds.length === 0) return;

    if (!confirm(`¿Eliminar ${selectedRequestIds.length} solicitud(es) seleccionada(s) permanentemente?`)) return;

    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${ADOPTIONS_API_URL}/bulk-delete`, {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders),
            body: JSON.stringify({ ids: selectedRequestIds })
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        if (response.ok) {
            const result = await response.json();
            showToast(result.message, 'success');
            selectedRequestIds = [];
            renderAdoptionRequestsView();
        } else {
            const error = await response.json();
            showToast(error.message || 'Error al eliminar', 'error');
        }
    } catch (error) {
        showToast('Error al eliminar solicitudes', 'error');
    }
}

async function changeRequestStatus(requestId, newStatus) {
    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`, {
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
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`, {
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
            showToast('Solicitud eliminada', 'success');
            renderAdoptionRequestsView();
        }
    } catch (error) {
        showToast('Error al eliminar solicitud', 'error');
    }
}

async function viewRequestDetails(requestId) {
    try {
        var authHeaders = getAuthHeaders();
        const response = await fetch(`${ADOPTIONS_API_URL}/${requestId}`, {
            headers: authHeaders
        });

        if (response.status === 401) {
            clearAuthData();
            AppState.isLoggedIn = false;
            updateUIForLogin();
            showToast('Sesion expirada.', 'error');
            return;
        }

        const request = await response.json();

        const statusLabels = {
            pending: 'Pendiente',
            reviewing: 'En revisión',
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
                    <h3>Solicitud de ${sanitizeHtml(request.fullName)}</h3>
                    <span class="request-status-large status-${request.status}">${statusLabels[request.status]}</span>
                </div>
                <p class="request-date-detail">Recibida el ${date}</p>

                ${request.petName ? `
                <div class="detail-section">
                    <h4>🐾 Animal de interés</h4>
                    <p><strong>${sanitizeHtml(request.petName)}</strong></p>
                </div>
                ` : ''}

                ${request.presentationVideo && request.presentationVideo.url ? `
                <div class="detail-section">
                    <h4>🎥 Vídeo de Presentación</h4>
                    <div class="request-video-container">
                        <video src="${sanitizeAttr(request.presentationVideo.url)}" controls></video>
                    </div>
                </div>
                ` : ''}

                <div class="detail-section">
                    <h4>👤 Datos Personales</h4>
                    <div class="detail-grid">
                        <div><span>Nombre:</span> ${sanitizeHtml(request.fullName)}</div>
                        <div><span>Edad:</span> ${sanitizeHtml(request.age)} años</div>
                        <div><span>Email:</span> ${sanitizeHtml(request.email)}</div>
                        <div><span>Teléfono:</span> ${sanitizeHtml(request.phone)}</div>
                        <div><span>Dirección:</span> ${sanitizeHtml(request.address)}</div>
                        <div><span>Ciudad:</span> ${sanitizeHtml(request.city)}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🏠 Vivienda</h4>
                    <div class="detail-grid">
                        <div><span>Tipo:</span> ${sanitizeHtml(request.housingType)}</div>
                        <div><span>Propiedad:</span> ${request.ownerOrRenter === 'propietario' ? 'Propietario' : 'Alquiler'}</div>
                        <div><span>Jardin/Terraza:</span> ${request.hasGarden ? 'Si' : 'No'}</div>
                        ${request.ownerOrRenter === 'alquiler' ? `<div><span>Propietario permite:</span> ${request.landlordAllowsPets ? 'Si' : 'No'}</div>` : ''}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>👨‍👩‍👧‍👦 Familia</h4>
                    <div class="detail-grid">
                        <div><span>Miembros:</span> ${sanitizeHtml(request.familyMembers)}</div>
                        <div><span>Niños:</span> ${request.hasChildren ? 'Si' + (request.childrenAges ? ' (' + sanitizeHtml(request.childrenAges) + ')' : '') : 'No'}</div>
                        <div><span>Todos de acuerdo:</span> ${request.allAgree ? 'Si' : 'No'}</div>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🐕 Experiencia</h4>
                    <div class="detail-grid">
                        <div><span>Otras mascotas:</span> ${request.hasOtherPets ? 'Si' : 'No'}</div>
                        ${request.otherPetsDescription ? `<div class="full-width"><span>Descripción:</span> ${sanitizeHtml(request.otherPetsDescription)}</div>` : ''}
                        ${request.previousPetExperience ? `<div class="full-width"><span>Experiencia previa:</span> ${sanitizeHtml(request.previousPetExperience)}</div>` : ''}
                    </div>
                </div>

                <div class="detail-section">
                    <h4>❤️ Motivación</h4>
                    <div class="detail-grid">
                        <div class="full-width"><span>Por qué quiere adoptar:</span><br>${sanitizeHtml(request.whyAdopt)}</div>
                        <div><span>Horas solo:</span> ${sanitizeHtml(request.hoursAlone)}h/día</div>
                        ${request.vacationPlan ? `<div><span>Plan vacaciones:</span> ${sanitizeHtml(request.vacationPlan)}</div>` : ''}
                    </div>
                </div>

                <div class="request-details-actions">
                    <button class="btn btn-secondary" onclick="changeRequestStatus('${sanitizeAttr(request._id)}', 'reviewing'); closeProfileModal();">📝 En Revisión</button>
                    <button class="btn btn-primary" onclick="changeRequestStatus('${sanitizeAttr(request._id)}', 'approved'); closeProfileModal();">✅ Aprobar</button>
                    <button class="btn btn-secondary" style="background: #ef4444; border-color: #ef4444; color: white;" onclick="changeRequestStatus('${sanitizeAttr(request._id)}', 'rejected'); closeProfileModal();">❌ Rechazar</button>
                </div>
            </div>
        `;

        document.getElementById('profileContent').innerHTML = detailsHtml;
        document.querySelector('#profileModal .modal-title').textContent = '📋 Detalles de Solicitud';
        document.getElementById('profileModal').classList.add('active');

    } catch (error) {
        showToast('Error al cargar detalles', 'error');
    }
}

// Exportar solicitudes de adopción a CSV
function exportAdoptionsToCSV() {
    const requests = AppState.adoptionRequests || [];

    if (requests.length === 0) {
        showToast('No hay solicitudes para exportar', 'error');
        return;
    }

    // Filtrar por el filtro activo si hay alguno
    let dataToExport = requests;
    if (AppState.requestsFilter && AppState.requestsFilter !== 'all') {
        dataToExport = requests.filter(r => r.status === AppState.requestsFilter);
    }

    if (dataToExport.length === 0) {
        showToast('No hay solicitudes con este estado para exportar', 'error');
        return;
    }

    const statusLabels = {
        pending: 'Pendiente',
        reviewing: 'En revisión',
        approved: 'Aprobada',
        rejected: 'Rechazada'
    };

    // Cabeceras del CSV
    const headers = [
        'Fecha',
        'Estado',
        'Animal',
        'Nombre',
        'Email',
        'Teléfono',
        'Edad',
        'Ciudad',
        'Dirección',
        'Tipo Vivienda',
        'Propietario/Alquiler',
        'Jardín',
        'Miembros Familia',
        'Niños',
        'Otras Mascotas',
        'Horas Solo',
        'Por qué adoptar'
    ];

    // Convertir datos a filas CSV
    const rows = dataToExport.map(r => {
        const date = new Date(r.createdAt).toLocaleDateString('es-ES');
        const status = statusLabels[r.status] || r.status;
        const whyAdopt = r.whyAdopt ? r.whyAdopt.replace(/"/g, '""').replace(/\n/g, ' ') : '';

        return [
            date,
            status,
            r.petName || 'General',
            r.fullName || '',
            r.email || '',
            r.phone || '',
            r.age || '',
            r.city || '',
            r.address || '',
            r.housingType || '',
            r.ownerOrRenter || '',
            r.hasGarden ? 'Sí' : 'No',
            r.familyMembers || '',
            r.hasChildren ? 'Sí' : 'No',
            r.hasOtherPets ? 'Sí' : 'No',
            r.hoursAlone || '',
            whyAdopt
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
    const filterName = AppState.requestsFilter && AppState.requestsFilter !== 'all' ? '_' + AppState.requestsFilter : '';
    const filename = 'solicitudes_adopcion' + filterName + '_' + new Date().toISOString().split('T')[0] + '.csv';

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV exportado correctamente', 'success');
}

// Exponer globalmente
window.renderAdoptionRequestsView = renderAdoptionRequestsView;
window.renderRequestsTable = renderRequestsTable;
window.filterRequests = filterRequests;
window.changeRequestStatus = changeRequestStatus;
window.deleteRequest = deleteRequest;
window.viewRequestDetails = viewRequestDetails;
window.exportAdoptionsToCSV = exportAdoptionsToCSV;
window.toggleRequestSelection = toggleRequestSelection;
window.toggleSelectAllRequests = toggleSelectAllRequests;
window.deleteSelectedRequests = deleteSelectedRequests;
