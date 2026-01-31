// Configuracion de la API - Auto-detecta localhost o produccion
const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://02af85pdxe.execute-api.eu-west-1.amazonaws.com/prod'
};

window.API_BASE_URL = CONFIG.API_BASE_URL;
