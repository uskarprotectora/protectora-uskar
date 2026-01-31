// Pagina About - Quienes Somos

function renderAboutPage() {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">🐾</div>
                <h1>Protectora de Animales Uskar</h1>
                <p>Rescatando vidas, creando familias.</p>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Misión</h2>
                <p>Somos una organización sin ánimo de lucro dedicada al rescate, rehabilitación y búsqueda de hogares para animales abandonados y maltratados. Trabajamos incansablemente para darles una segunda oportunidad.</p>
            </div>

            <div class="about-section-content">
                <h2>Qué Hacemos</h2>
                <div class="about-cards-grid">
                    <div class="about-card-item">
                        <span class="about-card-icon">🚑</span>
                        <h3>Rescate</h3>
                        <p>Rescatamos animales en situación de abandono o maltrato.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">🏠</span>
                        <h3>Adopción</h3>
                        <p>Buscamos familias responsables para cada animal.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">📢</span>
                        <h3>Concienciación</h3>
                        <p>Educamos sobre tenencia responsable de animales.</p>
                    </div>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Historia</h2>
                <p>La Protectora de Animales Uskar nació en ... </p>
            </div>
        </div>
    `;
}

// Exponer globalmente
window.renderAboutPage = renderAboutPage;
