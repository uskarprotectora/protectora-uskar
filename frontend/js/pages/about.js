// Pagina About - Quienes Somos

function renderAboutPage() {
    const petsGrid = document.getElementById('petsGrid');
    petsGrid.innerHTML = `
        <div class="static-page">
            <div class="about-hero">
                <div class="about-hero-icon">🐾</div>
                <h1>Protectora de Animales Uskar</h1>
                <p>Rescatando vidas, creando familias desde 2010</p>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Mision</h2>
                <p>Somos una organizacion sin animo de lucro dedicada al rescate, rehabilitacion y busqueda de hogares para animales abandonados y maltratados. Trabajamos incansablemente para darles una segunda oportunidad.</p>
            </div>

            <div class="about-section-content">
                <h2>Que Hacemos</h2>
                <div class="about-cards-grid">
                    <div class="about-card-item">
                        <span class="about-card-icon">🚑</span>
                        <h3>Rescate</h3>
                        <p>Rescatamos animales en situacion de abandono o maltrato.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">💊</span>
                        <h3>Cuidados</h3>
                        <p>Proporcionamos atencion veterinaria y rehabilitacion.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">🏠</span>
                        <h3>Adopcion</h3>
                        <p>Buscamos familias responsables para cada animal.</p>
                    </div>
                    <div class="about-card-item">
                        <span class="about-card-icon">📢</span>
                        <h3>Concienciacion</h3>
                        <p>Educamos sobre tenencia responsable de animales.</p>
                    </div>
                </div>
            </div>

            <div class="about-section-content">
                <h2>Nuestra Historia</h2>
                <p>La Protectora de Animales Uskar nacio en 2010 de la mano de un pequeño grupo de voluntarios apasionados por el bienestar animal. Lo que comenzo como una iniciativa local para ayudar a los animales abandonados de nuestra comunidad, se ha convertido en una organizacion consolidada que ha salvado miles de vidas.</p>
                <p>A lo largo de estos años, hemos crecido gracias al apoyo incondicional de nuestros voluntarios, colaboradores y adoptantes.</p>
            </div>
        </div>
    `;
}

// Exponer globalmente
window.renderAboutPage = renderAboutPage;
