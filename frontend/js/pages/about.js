// Pagina About - Quienes Somos (Landing Page)

function renderAboutPage() {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = `
        <div class="static-page landing-page">
            <div class="landing-hero">
                <div class="landing-hero-content">
                    <div class="landing-hero-icon">🐾</div>
                    <h1>Bienvenidos a la Protectora de Animales Uskar</h1>
                    <p class="landing-hero-subtitle">Rescatando vidas, creando familias desde 2018</p>
                    <div class="landing-hero-buttons">
                        <button class="landing-cta-btn primary" onclick="navigateToView('adoption')">
                            <span>🐕</span> Ver Animales en Adopción
                        </button>
                        <button class="landing-cta-btn secondary" onclick="navigateToView('contact')">
                            <span>📞</span> Contáctanos
                        </button>
                    </div>
                </div>
            </div>

            <div class="landing-section">
                <h2>Nuestra Misión</h2>
                <p class="about-intro">Somos una organización sin ánimo de lucro dedicada al rescate, rehabilitación y búsqueda de hogares para animales abandonados y maltratados. Trabajamos incansablemente para darles una segunda oportunidad.</p>
            </div>

            <div class="landing-section">
                <h2>¿Qué Hacemos?</h2>
                <div class="landing-cards">
                    <div class="landing-card">
                        <span class="landing-card-icon">🚑</span>
                        <h3>Rescatamos</h3>
                        <p>Salvamos animales en situación de abandono, maltrato o peligro en las calles.</p>
                    </div>
                    <div class="landing-card">
                        <span class="landing-card-icon">💉</span>
                        <h3>Rehabilitamos</h3>
                        <p>Les proporcionamos atención veterinaria, vacunas, esterilización y mucho amor.</p>
                    </div>
                    <div class="landing-card">
                        <span class="landing-card-icon">🏠</span>
                        <h3>Encontramos Hogares</h3>
                        <p>Buscamos familias responsables que les den una segunda oportunidad.</p>
                    </div>
                </div>
            </div>

            <div class="landing-section landing-stats-section">
                <h2>Nuestro Impacto</h2>
                <div class="landing-stats">
                    <div class="landing-stat">
                        <span class="landing-stat-number" id="landingTotalPets">0</span>
                        <span class="landing-stat-label">Animales en Adopción</span>
                    </div>
                    <div class="landing-stat">
                        <span class="landing-stat-number" id="landingAdopted">+100</span>
                        <span class="landing-stat-label">Finales Felices</span>
                    </div>
                    <div class="landing-stat">
                        <span class="landing-stat-number">2018</span>
                        <span class="landing-stat-label">Año de Fundación</span>
                    </div>
                </div>
            </div>

            <div class="landing-section">
                <h2>Nuestra Historia</h2>
                <p class="about-intro">La Protectora de Animales Uskar nació en 2018, aunque nuestra principal colaboradora lleva años rescatando perretes y encontrándoles un hogar. Lo que empezó como una labor individual se ha convertido en una comunidad de personas comprometidas con el bienestar animal.</p>
            </div>

            <div class="landing-section">
                <h2>¿Cómo Puedes Ayudar?</h2>
                <div class="landing-help-cards">
                    <div class="landing-help-card" onclick="openHelpModal('donaciones')">
                        <span class="landing-help-icon">💝</span>
                        <h3>Donaciones</h3>
                        <p>Tu aportación nos ayuda a cubrir gastos veterinarios y alimentación.</p>
                    </div>
                    <div class="landing-help-card" onclick="openHelpModal('apadrina')">
                        <span class="landing-help-icon">❤️</span>
                        <h3>Apadrina</h3>
                        <p>Apadrina a un animal y ayúdanos con sus gastos mensuales.</p>
                    </div>
                    <div class="landing-help-card" onclick="openHelpModal('voluntariado')">
                        <span class="landing-help-icon">🤝</span>
                        <h3>Voluntariado</h3>
                        <p>Únete a nuestro equipo de voluntarios y marca la diferencia.</p>
                    </div>
                    <div class="landing-help-card" onclick="openHelpModal('casaAcogida')">
                        <span class="landing-help-icon">🏡</span>
                        <h3>Casa de Acogida</h3>
                        <p>Ofrece un hogar temporal mientras encuentran familia.</p>
                    </div>
                </div>
            </div>

            <div class="landing-section landing-cta-section">
                <h2>¿Listo para Adoptar?</h2>
                <p>Cada animal merece una segunda oportunidad. ¿Serás tú quien se la dé?</p>
                <button class="landing-cta-btn primary large" onclick="navigateToView('adoption')">
                    <span>🐾</span> Ver Animales Disponibles
                </button>
            </div>

            <div class="landing-section">
                <h2>Contacto</h2>
                <div class="landing-contact">
                    <div class="landing-contact-item">
                        <span>📍</span>
                        <p>Huéscar, Granada (España)</p>
                    </div>
                    <div class="landing-contact-item">
                        <span>📞</span>
                        <p>+34 602 002 943</p>
                    </div>
                    <div class="landing-contact-item">
                        <span>✉️</span>
                        <p>uskar.protectora@gmail.com</p>
                    </div>
                </div>
                <div class="landing-social">
                    <a href="https://www.facebook.com/protectoraUSKAR/?locale=es_LA" class="landing-social-link" target="_blank">
                        📘 Facebook
                    </a>
                    <a href="https://www.instagram.com/protectora_animales_uskar/" class="landing-social-link" target="_blank">
                        📸 Instagram
                    </a>
                </div>
            </div>
        </div>
    `;

    // Update stats from current data
    updateLandingStats();
}

function updateLandingStats() {
    const totalPetsEl = document.getElementById('landingTotalPets');
    if (totalPetsEl && AppState.pets) {
        const activePets = AppState.pets.filter(p => p.status === 'active' || p.status === 'scheduled').length;
        totalPetsEl.textContent = activePets || '0';
    }
}

function navigateToView(viewName) {
    const btn = document.querySelector(`[data-filter="view"][data-value="${viewName}"]`);
    if (btn) {
        handleViewChange(btn);
    }
}

// Exponer globalmente
window.renderAboutPage = renderAboutPage;
window.navigateToView = navigateToView;
window.updateLandingStats = updateLandingStats;
