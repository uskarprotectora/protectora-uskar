// Pagina Requests - Solicitudes de Adopcion (Admin)

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
        const response = await fetch(ADOPTIONS_API_URL);
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
                <span>En revision</span>
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
                    <h1>📊 Solicitudes de Adopcion</h1>
                    <p>Gestiona las solicitudes recibidas</p>
                </div>
                ${statsHtml}
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3 class="empty-title">No hay solicitudes</h3>
                    <p class="empty-text">${AppState.requestsFilter === 'all' ? 'Aun no se han recibido solicitudes de adopcion' : 'No hay solicitudes con este estado'}</p>
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
    AppState.requestsFilter = status;
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
        document.getElementById('profileModal').classList.add('active');

    } catch (error) {
        showToast('Error al cargar detalles', 'error');
    }
}

// Exponer globalmente
window.renderAdoptionRequestsView = renderAdoptionRequestsView;
window.renderRequestsTable = renderRequestsTable;
window.filterRequests = filterRequests;
window.changeRequestStatus = changeRequestStatus;
window.deleteRequest = deleteRequest;
window.viewRequestDetails = viewRequestDetails;
