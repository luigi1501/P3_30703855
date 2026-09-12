const db = require('../../db/models');

module.exports = {
    // Listar Productos (Admin)
    async listProducts(req, res) {
        try {
            const productos = await db.getproducto();
            res.render('admin/products/list', { producto: productos });
        } catch (err) {
            res.render('admin/products/list', { producto: [] });
        }
    },

    // Formulario Crear Producto
    async getCreateProduct(req, res) {
        try {
            const categorias = await db.getcategory();
            res.render('admin/products/insert', { category: categorias });
        } catch (err) {
            res.render('admin/products/insert', { category: [] });
        }
    },

    // Procesar Inserción Producto
    async postCreateProduct(req, res) {
        const { code, name, brand, model, description, price, category_id } = req.body;
        try {
            await db.insertproducto(code, name, brand, model, description, price, category_id);
            res.redirect('/admin/products');
        } catch (err) {
            console.error(err);
            res.redirect('/admin/products/insert');
        }
    },

    // Formulario Editar Producto
    async getEditProduct(req, res) {
        try {
            const id = req.params.id;
            const productos = await db.getproductoID(id);
            const categorias = await db.getcategory();
            res.render('admin/products/edit', { producto: productos[0], category: categorias });
        } catch (err) {
            res.redirect('/admin/products');
        }
    },

    // Procesar Edición Producto
    async postEditProduct(req, res) {
        const { id, code, name, brand, model, description, price, category_id } = req.body;
        try {
            await db.updateproducto(id, code, name, brand, model, description, price, category_id);
            res.redirect('/admin/products');
        } catch (err) {
            console.error(err);
            res.redirect('/admin/products');
        }
    },

    // Eliminar Producto
    async deleteProduct(req, res) {
        try {
            await db.deleteproducto(req.params.id);
            res.redirect('/admin/products');
        } catch (err) {
            console.error(err);
            res.redirect('/admin/products');
        }
    }
};
