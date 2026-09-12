const db = require('../../db/models');
require('dotenv').config();

module.exports = {
    // Login de Administrador (Formulario)
    getLogin(req, res) {
        res.render('admin/login', { error: null });
    },

    // Procesar Login de Administrador
    postLogin(req, res) {
        const { user, pass } = req.body;
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || '12345';

        if (user === adminUser && pass === adminPass) {
            req.session.isAdmin = true;
            req.session.user = { name: 'Administrador', role: 'admin' };
            return res.redirect('/admin/dashboard');
        } else {
            return res.render('admin/login', { error: 'Credenciales de administrador inválidas' });
        }
    },

    // Dashboard con Métricas Estadísticas
    async getDashboard(req, res) {
        try {
            const productos = await db.getproducto();
            const categorias = await db.getcategory();
            const imagenes = await db.getimagen();
            const clientes = await db.getuser();
            const compras = await db.getcompra();

            res.render('admin/dashboard', {
                totalProductos: productos.length,
                totalCategorias: categorias.length,
                totalImagenes: imagenes.length,
                totalClientes: clientes.length,
                totalCompras: compras.length
            });
        } catch (err) {
            console.error('Error en admin dashboard:', err);
            res.render('admin/dashboard', {
                totalProductos: 0,
                totalCategorias: 0,
                totalImagenes: 0,
                totalClientes: 0,
                totalCompras: 0
            });
        }
    }
};
