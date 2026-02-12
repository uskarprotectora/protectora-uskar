// Funciones de API

const BASE_URL = window.API_BASE_URL || '';
const API_URL = BASE_URL + '/api/pets';
const ADOPTIONS_API_URL = BASE_URL + '/api/adoptions';

// Cargar mascotas
async function loadPets() {
    try {
        let url = API_URL + '?';

        if (AppState.currentView === 'adoption') {
            url += `status=active&`;
        } else if (AppState.currentView === 'happy') {
            url += `status=inactive&`;
        }

        if (AppState.searchQuery) {
            url += `search=${encodeURIComponent(AppState.searchQuery)}`;
        }

        const response = await fetch(url);
        AppState.pets = await response.json();
        renderPets();
    } catch (error) {
        console.error('Error cargando animales:', error);
        showToast('Error al cargar animales', 'error');
    }
}

// Cargar estadísticas (solo animales en adopción)
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats?status=active`);
        const stats = await response.json();
        document.getElementById('totalPets').textContent = stats.total;
        document.getElementById('totalDogs').textContent = stats.dogs;
        document.getElementById('totalCats').textContent = stats.cats;
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Guardar mascota
async function savePet(petData) {
    const petId = document.getElementById('petId').value;
    const isEdit = !!petId;

    try {
        // Collect all files to upload
        const allFiles = [
            ...AppState.selectedPhotos.map(f => ({ file: f, field: 'photos' })),
            ...AppState.selectedVideos.map(f => ({ file: f, field: 'videos' })),
        ];

        if (allFiles.length > 0) {
            // Get presigned URLs from backend
            const presignResponse = await fetch(`${API_URL}/presign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    files: allFiles.map(f => ({ name: f.file.name, type: f.file.type }))
                })
            });

            if (!presignResponse.ok) {
                throw new Error('Error obteniendo URLs de subida');
            }

            const presignedUrls = await presignResponse.json();

            // Upload each file directly to S3
            await Promise.all(allFiles.map(async (f, i) => {
                const uploadRes = await fetch(presignedUrls[i].uploadUrl, {
                    method: 'PUT',
                    body: f.file,
                    headers: { 'Content-Type': f.file.type }
                });
                if (!uploadRes.ok) {
                    throw new Error(`Error subiendo ${f.file.name}`);
                }
            }));

            // Attach S3 URLs to pet data
            const newPhotos = [];
            const newVideos = [];
            allFiles.forEach((f, i) => {
                const urlData = {
                    filename: presignedUrls[i].key,
                    url: presignedUrls[i].publicUrl
                };
                if (f.field === 'photos') {
                    newPhotos.push(urlData);
                } else {
                    newVideos.push(urlData);
                }
            });

            if (newPhotos.length > 0) petData.newPhotos = newPhotos;
            if (newVideos.length > 0) petData.newVideos = newVideos;
        }

        const response = await fetch(
            isEdit ? `${API_URL}/${petId}` : API_URL,
            {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData)
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

// Eliminar mascota
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

// Exponer globalmente
window.API_URL = API_URL;
window.ADOPTIONS_API_URL = ADOPTIONS_API_URL;
window.loadPets = loadPets;
window.loadStats = loadStats;
window.savePet = savePet;
window.deletePet = deletePet;
