// Cargador de Componentes HTML
// Permite cargar archivos HTML externos e insertarlos en el DOM

const ComponentLoader = {
    // Cache para componentes ya cargados
    cache: {},

    // Cargar un componente HTML
    async load(path) {
        // Si ya esta en cache, devolverlo
        if (this.cache[path]) {
            return this.cache[path];
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Error cargando componente: ${path}`);
            }
            const html = await response.text();
            this.cache[path] = html;
            return html;
        } catch (error) {
            console.error(`Error al cargar componente ${path}:`, error);
            return '';
        }
    },

    // Cargar un componente e insertarlo en un contenedor
    async loadInto(path, containerId) {
        const html = await this.load(path);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        }
        return html;
    },

    // Cargar un componente e insertarlo antes del cierre del body
    async appendToBody(path) {
        const html = await this.load(path);
        const temp = document.createElement('div');
        temp.innerHTML = html;
        while (temp.firstChild) {
            document.body.appendChild(temp.firstChild);
        }
        return html;
    },

    // Cargar multiples componentes en paralelo
    async loadMultiple(paths) {
        const promises = paths.map(path => this.load(path));
        return Promise.all(promises);
    },

    // Cargar multiples componentes y anadirlos al body
    async appendMultipleToBody(paths) {
        const htmls = await this.loadMultiple(paths);
        htmls.forEach(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            while (temp.firstChild) {
                document.body.appendChild(temp.firstChild);
            }
        });
        return htmls;
    }
};

// Exponer globalmente
window.ComponentLoader = ComponentLoader;
