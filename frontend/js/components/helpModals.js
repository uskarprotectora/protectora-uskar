// Componente Help Modals - Modales de ayuda (Donaciones, Voluntariado, Teaming, Apadrina)

const helpContent = {
    donaciones: {
        title: 'Donaciones',
        icon: '💝',
        content: `
            <div class="help-section">
                <p class="help-intro">Tu donacion nos ayuda a cuidar de los animales que mas lo necesitan. Cada euro cuenta para alimentacion, cuidados veterinarios y refugio.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🏦</div>
                        <h4>Transferencia Bancaria</h4>
                        <p>IBAN: ES70 0049 3327 3721 1405 4110</p>
                        <p>Concepto: Donacion Uskar</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🎁</div>
                        <h4>Donaciones en Especie</h4>
                        <p>Aceptamos pienso, mantas, medicamentos y material veterinario...</p>
                    </div>
                </div>
            </div>
        `
    },
    voluntariado: {
        title: 'Voluntariado',
        icon: '🤝',
        content: `
            <div class="help-section">
                <p class="help-intro">Hay muchas formas de colaborar con nosotros. Tu tiempo y habilidades pueden marcar la diferencia.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🏠</div>
                        <h4>Casa de Acogida</h4>
                        <p>Ofrece un hogar temporal a un animal mientras encuentra familia definitiva.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🚗</div>
                        <h4>Transporte</h4>
                        <p>Ayudaños a llevar animales al veterinario o a sus nuevos hogares.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">📸</div>
                        <h4>Fotografia</h4>
                        <p>Toma fotos profesionales de nuestros animales para facilitar su adopcion.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🧹</div>
                        <h4>Tareas en el Refugio</h4>
                        <p>Ayuda con limpieza, cuidado y socializacion de animales.</p>
                    </div>
                </div>

                <div class="help-cta">
                    <p style="margin-bottom: 16px; color: #78350f;">Contáctanos para mas información sobre cómo ser voluntario.</p>
                </div>
            </div>
        `
    },
    teaming: {
        title: 'Teaming',
        icon: '👥',
        content: `
            <div class="help-section">
                <p class="help-intro">Con solo 1 euro al mes puedes ayudarnos a seguir salvando vidas. Teaming es una plataforma de microdonaciones que no cobra comisiones.</p>

                <div class="help-highlight">
                    <div class="help-highlight-icon">⭐</div>
                    <h3>Solo 1 euro al mes</h3>
                    <p>Un pequeño gesto que marca una gran diferencia</p>
                </div>

                <div class="help-cards">
                    <div class="help-card full-width">
                        <div class="help-card-icon">💡</div>
                        <h4>Como funciona Teaming?</h4>
                        <div class="teaming-content-columns">
                            <div class="teaming-list-column">
                                <ol class="help-list">
                                    <li>Entra en nuestra página de Teaming</li>
                                    <li>Regístrate con tu email</li>
                                    <li>Configura tu donación mensual de 1 euro</li>
                                    <li>Listo! Ya estás ayudando cada mes</li>
                                </ol>
                            </div>
                            <div class="teaming-cta-column">
                                <a href="https://www.teaming.net/protectoraanimalesuskar" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                                    <button class="btn btn-primary btn-large">Unirme al Teaming</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        `
    },
    apadrina: {
        title: 'Apadrina un Animal',
        icon: '❤️',
        content: `
            <div class="help-section">
                <p class="help-intro">Algunos de nuestros animales son dificiles de adoptar por su edad o condicion de salud. Apadrinarlos es darles la oportunidad de vivir dignamente.</p>

                <div class="help-cards">
                    <div class="help-card">
                        <div class="help-card-icon">🐕</div>
                        <h4>Apadrinamiento Basico</h4>
                        <p><strong>10 euros/mes</strong></p>
                        <p>Cubre alimentacion basica del animal.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">💊</div>
                        <h4>Apadrinamiento Completo</h4>
                        <p><strong>25 euros/mes</strong></p>
                        <p>Alimentacion + cuidados veterinarios.</p>
                    </div>
                    <div class="help-card">
                        <div class="help-card-icon">🌟</div>
                        <h4>Apadrinamiento Premium</h4>
                        <p><strong>50 euros/mes</strong></p>
                        <p>Cuidado integral + tratamientos especiales.</p>
                    </div>
                </div>

                <div class="help-benefits">
                    <h4>Beneficios del apadrinamiento:</h4>
                    <ul class="help-list">
                        <li>Recibiras fotos y actualizaciones de tu ahijado</li>
                        <li>Podras visitarlo en el refugio</li>
                        <li>Certificado de apadrinamiento</li>
                        <li>Desgravacion fiscal</li>
                    </ul>
                </div>
            </div>
        `
    }
};

function openHelpModal(action) {
    const content = helpContent[action];
    if (!content) return;

    document.getElementById('helpModalTitle').innerHTML = `${content.icon} ${content.title}`;
    document.getElementById('helpContent').innerHTML = content.content;
    document.getElementById('helpModal').classList.add('active');
}

function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('active');
}

function setupHelpListeners() {
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', () => openHelpModal(btn.dataset.action));
    });

    document.getElementById('closeHelpModal').addEventListener('click', closeHelpModal);
    document.getElementById('helpModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('helpModal')) closeHelpModal();
    });
}

// Exponer globalmente
window.helpContent = helpContent;
window.openHelpModal = openHelpModal;
window.closeHelpModal = closeHelpModal;
window.setupHelpListeners = setupHelpListeners;
