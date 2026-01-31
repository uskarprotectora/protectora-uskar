// Pagina Contact - Contactanos

function renderContactPage() {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">📞</div>
                <h1>Contactanos</h1>
                <p>Estamos aqui para ayudarte</p>
            </div>

            <div class="contact-grid">
                <div class="contact-card">
                    <span class="contact-icon">📍</span>
                    <h3>Direccion</h3>
                    <p>Calle Example 123</p>
                    <p>Ciudad, CP 00000</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">📞</span>
                    <h3>Telefono</h3>
                    <p>+34 600 000 000</p>
                    <p>Lunes a Domingo</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">✉️</span>
                    <h3>Email</h3>
                    <p>info@protectorauskar.org</p>
                    <p>adopciones@protectorauskar.org</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">🕐</span>
                    <h3>Horario</h3>
                    <p>Lunes a Domingo</p>
                    <p>10:00 - 18:00</p>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Redes Sociales</h2>
                <div class="social-links">
                    <a href="#" class="social-link">📘 Facebook</a>
                    <a href="#" class="social-link">📸 Instagram</a>
                    <a href="#" class="social-link">🐦 Twitter</a>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Como llegar</h2>
                <div class="map-placeholder">
                    <span>🗺️</span>
                    <p>Mapa de ubicacion</p>
                </div>
            </div>
        </div>
    `;
}

// Exponer globalmente
window.renderContactPage = renderContactPage;
