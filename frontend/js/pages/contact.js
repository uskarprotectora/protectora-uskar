// Pagina Contact - Contactanos

function renderContactPage() {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">📞</div>
                <h1>Contáctanos</h1>
                <p>Estamos aquí para ayudarte</p>
            </div>

            <div class="contact-grid">
                <div class="contact-card">
                    <span class="contact-icon">📍</span>
                    <h3>Dirección</h3>
                    <p>Carretera de huescar,</p>
                    <p>Huéscar 18830</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">✉️</span>
                    <h3>Email</h3>
                    <p>uskar.protectora@gmail.com</p>
                </div>
                <div class="contact-card">
                    <span class="contact-icon">📞</span>
                    <h3>Teléfono</h3>
                    <p>Lunes a Domingo</p>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Cómo llegar (Una vez aquí, preguntadnos por las direcciones para llegar)</h2>
                    <div class="map-container">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100888.09152662118!2d-2.620681819803272!3d37.79583120949102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6f841c7b59f7ab%3A0xa564adef701d5459!2sHu%C3%A9scar%2C%20Granada%2C%20Espanya!5e0!3m2!1sca!2suk!4v1771249739564!5m2!1sca!2suk" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
            </div>

            

            <div class="about-section-content">
                <h2>Redes Sociales</h2>
                <div class="social-links">
                    <a href="https://www.facebook.com/protectoraUSKAR/?locale=es_LA" class="social-link" target="_blank">📘 Facebook</a>
                    <a href="https://www.instagram.com/protectora_animales_uskar/" class="social-link" target="_blank" >📸 Instagram</a>
                </div>
            </div>
        </div>
    `;
}

// Exponer globalmente
window.renderContactPage = renderContactPage;
