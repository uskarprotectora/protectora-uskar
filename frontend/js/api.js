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

// Cargar estadisticas
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        document.getElementById('totalPets').textContent = stats.total;
        document.getElementById('totalDogs').textContent = stats.dogs;
        document.getElementById('totalCats').textContent = stats.cats;
    } catch (error) {
        console.error('Error cargando estadisticas:', error);
    }
}

// Guardar mascota
async function savePet(petData) {
    const petId = document.getElementById('petId').value;
    const isEdit = !!petId;

    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(petData));

        AppState.selectedPhotos.forEach(photo => {
            formData.append('photos', photo);
        });

        AppState.selectedVideos.forEach(video => {
            formData.append('videos', video);
        });

        const response = await fetch(
            isEdit ? `${API_URL}/${petId}` : API_URL,
            {
                method: isEdit ? 'PUT' : 'POST',
                body: formData
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
