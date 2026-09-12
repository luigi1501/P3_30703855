const db = require('../../db/models');

module.exports = {
    // Página Principal Catálogo (Público / Invitado)
    async getCatalog(req, res) {
        try {
            const { producto_name, description, category_name, brand, model } = req.query;
            const productos = await db.consultable(producto_name, description, category_name, brand, model);
            const categorias = await db.getcategory();
            res.render('client/catalog', { producto: productos, categorias, query: req.query });
        } catch (err) {
            console.error('Error al cargar catálogo público:', err);
            res.render('client/catalog', { producto: [], categorias: [], query: req.query });
        }
    },

    // Página Inicial Catálogo (Usuario Autenticado)
    async getLoggedCatalog(req, res) {
        try {
            const { producto_name, description, category_name, brand, model } = req.query;
            const productos = await db.consultable(producto_name, description, category_name, brand, model);
            const categorias = await db.getcategory();
            res.render('client/catalog', { producto: productos, categorias, query: req.query });
        } catch (err) {
            console.error('Error al cargar catálogo logueado:', err);
            res.render('client/catalog', { producto: [], categorias: [], query: req.query });
        }
    },

    // Detalles del Producto (Servicio / API fallback)
    async getProductDetails(req, res) {
        try {
            const id = req.params.id;
            const productos = await db.getdetalles(id);
            const producto = productos[0] || {};
            res.render('client/pedidoprd', { datos: producto });
        } catch (err) {
            console.error('Error en detalles:', err);
            res.status(500).render('error', { message: 'Producto no encontrado', error: { status: 404 } });
        }
    },

    // ===== API: Búsqueda en Tiempo Real (Devuelve JSON) =====
    async searchJSON(req, res) {
        try {
            const { producto_name, description, category_name, brand, model } = req.query;
            const productos = await db.consultable(producto_name, description, category_name, brand, model);
            res.json({ success: true, count: productos.length, productos });
        } catch (err) {
            console.error('Error en búsqueda JSON:', err);
            res.status(500).json({ success: false, count: 0, productos: [], error: err.message });
        }
    }
};

