// Componente Adoption Form - Formulario de adopción (Notion embed)

function openAdoptionFormModal() {
    document.getElementById('adoptionFormModal').classList.add('active');
}

function openCatAdoptionFormModal() {
    document.getElementById('catAdoptionFormModal').classList.add('active');
}

function openAdoptionFormByType(type) {
    if (type === 'cat') {
        openCatAdoptionFormModal();
    } else {
        openAdoptionFormModal();
    }
}

function closeAdoptionFormModal() {
    document.getElementById('adoptionFormModal').classList.remove('active');
}

function setupAdoptionFormListeners() {
    document.getElementById('openAdoptionFormBtn').addEventListener('click', () => {
        openAdoptionFormModal();
    });

    document.getElementById('closeAdoptionFormModal').addEventListener('click', closeAdoptionFormModal);

    document.getElementById('adoptionFormModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('adoptionFormModal')) closeAdoptionFormModal();
    });
}

// Exponer globalmente
window.openAdoptionFormModal = openAdoptionFormModal;
window.openCatAdoptionFormModal = openCatAdoptionFormModal;
window.openAdoptionFormByType = openAdoptionFormByType;
window.closeAdoptionFormModal = closeAdoptionFormModal;
window.setupAdoptionFormListeners = setupAdoptionFormListeners;
