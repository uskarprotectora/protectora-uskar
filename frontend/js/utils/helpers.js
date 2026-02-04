// Funciones de utilidad

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function exportData(pets) {
    const dataStr = JSON.stringify(pets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animales_protectora_uskar.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Datos exportados correctamente', 'success');
}

function formatAge(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months < 0) months = 0;

    if (months === 0) return '< 1 mes';
    if (months === 1) return '1 mes';
    if (months < 12) return months + ' meses';

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const halfYear = remainingMonths >= 6;

    let text = years + (years === 1 ? ' año' : ' años');
    if (halfYear) text += ' y medio';
    return text;
}

// Exponer globalmente
window.debounce = debounce;
window.showToast = showToast;
window.exportData = exportData;
window.formatAge = formatAge;
