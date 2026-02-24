// Funciones de utilidad

// ========================================
// FUNCIONES DE SANITIZACIÓN (prevención XSS)
// ========================================

/**
 * Sanitiza un string para usar de forma segura en HTML.
 * Convierte caracteres especiales en entidades HTML.
 * Usar cuando se interpole texto en innerHTML.
 *
 * @param {string} str - El string a sanitizar
 * @returns {string} - El string con caracteres peligrosos escapados
 *
 * @example
 * // Input malicioso: <script>alert('xss')</script>
 * // Output seguro: &lt;script&gt;alert('xss')&lt;/script&gt;
 */
function sanitizeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Sanitiza un string para usar de forma segura en atributos HTML,
 * especialmente en atributos de eventos como onclick, onerror, etc.
 * Escapa comillas y caracteres que podrían romper el contexto del atributo.
 *
 * IMPORTANTE: Aunque esta función añade seguridad, la mejor práctica
 * es evitar onclick inline y usar addEventListener en su lugar.
 *
 * @param {string} str - El string a sanitizar
 * @returns {string} - El string seguro para usar en atributos
 *
 * @example
 * // Input malicioso: '); alert('xss'); ('
 * // Output seguro: &#x27;); alert(&#x27;xss&#x27;); (&#x27;
 */
function sanitizeAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\/g, '&#x5c;')
        .replace(/`/g, '&#x60;');
}

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

// Resuelve URLs de medios (fotos/videos) añadiendo la URL base del API si es necesario
function getMediaUrl(url) {
    if (!url) return null;
    // Si ya es una URL completa (http/https o S3), devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // Si es una ruta relativa, añadir la URL base del API
    const baseUrl = window.API_BASE_URL || '';
    return baseUrl + url;
}

// Exponer globalmente
window.debounce = debounce;
window.showToast = showToast;
window.exportData = exportData;
window.formatAge = formatAge;
window.getMediaUrl = getMediaUrl;
window.sanitizeHtml = sanitizeHtml;
window.sanitizeAttr = sanitizeAttr;
