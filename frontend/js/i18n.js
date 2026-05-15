// Sistema de Internacionalización (i18n)

var I18n = (function() {
    var LANG_KEY = 'preferredLanguage';
    var currentLang = localStorage.getItem(LANG_KEY) || 'es';

    var translations = {
        es: {
            // Header
            'app.name': 'Protectora de Animales Uskar',
            'search.placeholder': 'Buscar por nombre, raza...',
            'login': 'Iniciar Sesión',
            'logout': 'Cerrar Sesión',
            'language': 'Idioma',

            // Sidebar - Formularios
            'sidebar.forms': 'Formulario',
            'sidebar.adoptionForm': 'Formulario de Adopción',
            'sidebar.adoptionRequests': 'Solicitudes Adopción',
            'sidebar.otherForms': 'Otros Formularios',

            // Sidebar - Descubre
            'sidebar.discover': 'Descubre nuestros animales',
            'sidebar.adoptionAnimals': 'Animales en adopción',
            'sidebar.happyEndings': 'Finales Felices',

            // Sidebar - Conócenos
            'sidebar.aboutUs': 'Conócenos',
            'sidebar.whoWeAre': 'Quiénes somos',
            'sidebar.contact': 'Contáctanos',

            // Sidebar - Ayúdanos
            'sidebar.helpUs': 'Ayúdanos',
            'sidebar.donations': 'Donaciones',
            'sidebar.sponsor': 'Apadrina un Animal',
            'sidebar.vetBills': 'Facturas Veterinarias',
            'sidebar.volunteering': 'Voluntariado',
            'sidebar.fosterHome': 'Casa de Acogida',
            'sidebar.teaming': 'Teaming',

            // Sidebar - Opinión
            'sidebar.opinion': 'Tu opinión',
            'sidebar.feedback': 'Danos tu opinión',

            // Sidebar - Estadísticas
            'stats.total': 'Total Animales',
            'stats.dogs': 'Perros',
            'stats.cats': 'Gatos',

            // Contenido principal
            'content.title': 'Nuestros Animales',
            'content.subtitle': 'Conoce a los animales que buscan un hogar',
            'content.newAnimal': 'Nuevo Animal',
            'content.happyTitle': 'Finales Felices',
            'content.happySubtitle': 'Animales que ya encontraron su familia',

            // Filtros
            'filter.age': 'Edad:',
            'filter.allAges': 'Todas las edades',
            'filter.puppy': 'Cachorro (0-1 año)',
            'filter.young': 'Joven (1-3 años)',
            'filter.adult': 'Adulto (3-7 años)',
            'filter.senior': 'Senior (7+ años)',

            // Pet Card
            'pet.years': 'años',
            'pet.year': 'año',
            'pet.months': 'meses',
            'pet.month': 'mes',
            'pet.male': 'Macho',
            'pet.female': 'Hembra',
            'pet.dog': 'Perro',
            'pet.cat': 'Gato',
            'pet.size.small': 'Pequeño',
            'pet.size.medium': 'Mediano',
            'pet.size.large': 'Grande',
            'pet.urgent': 'URGENTE',
            'pet.scheduled': 'RESERVADO',
            'pet.adopted': 'ADOPTADO',
            'pet.sponsors': 'padrinos',
            'pet.sponsor': 'padrino',

            // Pet Profile
            'profile.characteristics': 'Características',
            'profile.weight': 'Peso',
            'profile.size': 'Tamaño',
            'profile.neutered': 'Esterilizado',
            'profile.vaccinated': 'Vacunado',
            'profile.chipped': 'Con chip',
            'profile.yes': 'Sí',
            'profile.no': 'No',
            'profile.description': 'Descripción',
            'profile.gallery': 'Galería',
            'profile.videos': 'Vídeos',
            'profile.adopt': 'Quiero Adoptarlo',
            'profile.share': 'Compartir',
            'profile.edit': 'Editar',
            'profile.delete': 'Eliminar',
            'profile.close': 'Cerrar',

            // Login Modal
            'login.title': 'Iniciar Sesión',
            'login.user': 'Usuario',
            'login.password': 'Contraseña',
            'login.submit': 'Iniciar Sesión',
            'login.cancel': 'Cancelar',
            'login.error': 'Usuario o contraseña incorrectos',

            // Adoption Form
            'adoptionForm.title': 'Formulario de Adopción',
            'adoptionForm.subtitle': 'Completa este formulario para iniciar el proceso de adopción',
            'adoptionForm.name': 'Nombre completo',
            'adoptionForm.email': 'Email',
            'adoptionForm.phone': 'Teléfono',
            'adoptionForm.address': 'Dirección',
            'adoptionForm.city': 'Ciudad',
            'adoptionForm.experience': '¿Tienes experiencia con mascotas?',
            'adoptionForm.housingType': 'Tipo de vivienda',
            'adoptionForm.house': 'Casa',
            'adoptionForm.apartment': 'Piso',
            'adoptionForm.rural': 'Rural',
            'adoptionForm.hasGarden': '¿Tienes jardín o patio?',
            'adoptionForm.otherPets': '¿Tienes otras mascotas?',
            'adoptionForm.children': '¿Hay niños en casa?',
            'adoptionForm.workSchedule': 'Horario laboral',
            'adoptionForm.motivation': '¿Por qué quieres adoptar?',
            'adoptionForm.submit': 'Enviar Solicitud',
            'adoptionForm.success': 'Solicitud enviada correctamente',

            // Messages
            'msg.sessionExpired': 'Sesión expirada.',
            'msg.sessionStarted': 'Sesión iniciada correctamente',
            'msg.sessionClosed': 'Sesión cerrada',
            'msg.error': 'Error',
            'msg.success': 'Éxito',
            'msg.loading': 'Cargando...',
            'msg.noResults': 'No se encontraron resultados',
            'msg.confirmDelete': '¿Estás seguro de que quieres eliminar este animal?',
            'msg.animalDeleted': 'Animal eliminado correctamente',
            'msg.animalUpdated': 'Animal actualizado correctamente',
            'msg.animalAdded': 'Animal agregado correctamente',

            // About page
            'about.title': 'Quiénes Somos',
            'about.mission': 'Nuestra Misión',
            'about.history': 'Nuestra Historia',
            'about.team': 'Nuestro Equipo',

            // Contact page
            'contact.title': 'Contáctanos',
            'contact.info': 'Información de Contacto',
            'contact.address': 'Dirección',
            'contact.phone': 'Teléfono',
            'contact.email': 'Email',
            'contact.hours': 'Horario',
            'contact.form': 'Envíanos un mensaje',
            'contact.name': 'Nombre',
            'contact.subject': 'Asunto',
            'contact.message': 'Mensaje',
            'contact.send': 'Enviar',

            // Help modals
            'help.donations.title': 'Donaciones',
            'help.sponsor.title': 'Apadrina un Animal',
            'help.vetBills.title': 'Facturas Veterinarias',
            'help.volunteering.title': 'Voluntariado',
            'help.fosterHome.title': 'Casa de Acogida',
            'help.teaming.title': 'Teaming',
            'help.feedback.title': 'Tu Opinión'
        },

        en: {
            // Header
            'app.name': 'Uskar Animal Shelter',
            'search.placeholder': 'Search by name, breed...',
            'login': 'Log In',
            'logout': 'Log Out',
            'language': 'Language',

            // Sidebar - Forms
            'sidebar.forms': 'Form',
            'sidebar.adoptionForm': 'Adoption Form',
            'sidebar.adoptionRequests': 'Adoption Requests',
            'sidebar.otherForms': 'Other Forms',

            // Sidebar - Discover
            'sidebar.discover': 'Discover our animals',
            'sidebar.adoptionAnimals': 'Animals for adoption',
            'sidebar.happyEndings': 'Happy Endings',

            // Sidebar - About Us
            'sidebar.aboutUs': 'About Us',
            'sidebar.whoWeAre': 'Who we are',
            'sidebar.contact': 'Contact Us',

            // Sidebar - Help Us
            'sidebar.helpUs': 'Help Us',
            'sidebar.donations': 'Donations',
            'sidebar.sponsor': 'Sponsor an Animal',
            'sidebar.vetBills': 'Vet Bills',
            'sidebar.volunteering': 'Volunteering',
            'sidebar.fosterHome': 'Foster Home',
            'sidebar.teaming': 'Teaming',

            // Sidebar - Opinion
            'sidebar.opinion': 'Your opinion',
            'sidebar.feedback': 'Give us feedback',

            // Sidebar - Stats
            'stats.total': 'Total Animals',
            'stats.dogs': 'Dogs',
            'stats.cats': 'Cats',

            // Main content
            'content.title': 'Our Animals',
            'content.subtitle': 'Meet the animals looking for a home',
            'content.newAnimal': 'New Animal',
            'content.happyTitle': 'Happy Endings',
            'content.happySubtitle': 'Animals that already found their family',

            // Filters
            'filter.age': 'Age:',
            'filter.allAges': 'All ages',
            'filter.puppy': 'Puppy (0-1 year)',
            'filter.young': 'Young (1-3 years)',
            'filter.adult': 'Adult (3-7 years)',
            'filter.senior': 'Senior (7+ years)',

            // Pet Card
            'pet.years': 'years',
            'pet.year': 'year',
            'pet.months': 'months',
            'pet.month': 'month',
            'pet.male': 'Male',
            'pet.female': 'Female',
            'pet.dog': 'Dog',
            'pet.cat': 'Cat',
            'pet.size.small': 'Small',
            'pet.size.medium': 'Medium',
            'pet.size.large': 'Large',
            'pet.urgent': 'URGENT',
            'pet.scheduled': 'RESERVED',
            'pet.adopted': 'ADOPTED',
            'pet.sponsors': 'sponsors',
            'pet.sponsor': 'sponsor',

            // Pet Profile
            'profile.characteristics': 'Characteristics',
            'profile.weight': 'Weight',
            'profile.size': 'Size',
            'profile.neutered': 'Neutered',
            'profile.vaccinated': 'Vaccinated',
            'profile.chipped': 'Microchipped',
            'profile.yes': 'Yes',
            'profile.no': 'No',
            'profile.description': 'Description',
            'profile.gallery': 'Gallery',
            'profile.videos': 'Videos',
            'profile.adopt': 'I want to adopt',
            'profile.share': 'Share',
            'profile.edit': 'Edit',
            'profile.delete': 'Delete',
            'profile.close': 'Close',

            // Login Modal
            'login.title': 'Log In',
            'login.user': 'Username',
            'login.password': 'Password',
            'login.submit': 'Log In',
            'login.cancel': 'Cancel',
            'login.error': 'Invalid username or password',

            // Adoption Form
            'adoptionForm.title': 'Adoption Form',
            'adoptionForm.subtitle': 'Complete this form to start the adoption process',
            'adoptionForm.name': 'Full name',
            'adoptionForm.email': 'Email',
            'adoptionForm.phone': 'Phone',
            'adoptionForm.address': 'Address',
            'adoptionForm.city': 'City',
            'adoptionForm.experience': 'Do you have experience with pets?',
            'adoptionForm.housingType': 'Housing type',
            'adoptionForm.house': 'House',
            'adoptionForm.apartment': 'Apartment',
            'adoptionForm.rural': 'Rural',
            'adoptionForm.hasGarden': 'Do you have a garden or yard?',
            'adoptionForm.otherPets': 'Do you have other pets?',
            'adoptionForm.children': 'Are there children at home?',
            'adoptionForm.workSchedule': 'Work schedule',
            'adoptionForm.motivation': 'Why do you want to adopt?',
            'adoptionForm.submit': 'Submit Request',
            'adoptionForm.success': 'Request submitted successfully',

            // Messages
            'msg.sessionExpired': 'Session expired.',
            'msg.sessionStarted': 'Logged in successfully',
            'msg.sessionClosed': 'Logged out',
            'msg.error': 'Error',
            'msg.success': 'Success',
            'msg.loading': 'Loading...',
            'msg.noResults': 'No results found',
            'msg.confirmDelete': 'Are you sure you want to delete this animal?',
            'msg.animalDeleted': 'Animal deleted successfully',
            'msg.animalUpdated': 'Animal updated successfully',
            'msg.animalAdded': 'Animal added successfully',

            // About page
            'about.title': 'About Us',
            'about.mission': 'Our Mission',
            'about.history': 'Our History',
            'about.team': 'Our Team',

            // Contact page
            'contact.title': 'Contact Us',
            'contact.info': 'Contact Information',
            'contact.address': 'Address',
            'contact.phone': 'Phone',
            'contact.email': 'Email',
            'contact.hours': 'Hours',
            'contact.form': 'Send us a message',
            'contact.name': 'Name',
            'contact.subject': 'Subject',
            'contact.message': 'Message',
            'contact.send': 'Send',

            // Help modals
            'help.donations.title': 'Donations',
            'help.sponsor.title': 'Sponsor an Animal',
            'help.vetBills.title': 'Vet Bills',
            'help.volunteering.title': 'Volunteering',
            'help.fosterHome.title': 'Foster Home',
            'help.teaming.title': 'Teaming',
            'help.feedback.title': 'Your Feedback'
        }
    };

    function t(key) {
        return translations[currentLang][key] || translations['es'][key] || key;
    }

    function getCurrentLang() {
        return currentLang;
    }

    function setLang(lang) {
        if (translations[lang]) {
            currentLang = lang;
            localStorage.setItem(LANG_KEY, lang);
            document.documentElement.lang = lang;
            applyTranslations();
            // Disparar evento para que otros componentes puedan reaccionar
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
        }
    }

    function applyTranslations() {
        // Traducir elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            el.textContent = t(key);
        });

        // Traducir placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(key);
        });

        // Traducir títulos (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
            var key = el.getAttribute('data-i18n-title');
            el.title = t(key);
        });

        // Actualizar el selector de idioma
        updateLanguageSelector();
    }

    function updateLanguageSelector() {
        var langBtn = document.getElementById('langBtn');
        if (langBtn) {
            var flagSpan = langBtn.querySelector('.lang-flag');
            if (flagSpan) {
                flagSpan.textContent = currentLang === 'es' ? '🇪🇸' : '🇬🇧';
            }
        }
    }

    function init() {
        currentLang = localStorage.getItem(LANG_KEY) || 'es';
        document.documentElement.lang = currentLang;
        applyTranslations();
    }

    // Exponer API pública
    return {
        t: t,
        getCurrentLang: getCurrentLang,
        setLang: setLang,
        applyTranslations: applyTranslations,
        init: init
    };
})();

// Exponer globalmente
window.I18n = I18n;
window.t = I18n.t;
