const db = require('../../db/models');

module.exports = {
    // Listar Categorías
    async listCategories(req, res) {
        try {
            const categorias = await db.getcategory();
            res.render('admin/categories/list', { category: categorias });
        } catch (err) {
            res.render('admin/categories/list', { category: [] });
        }
    },

    // Formulario Crear Categoría
    getCreateCategory(req, res) {
        res.render('admin/categories/insert');
    },

    // Procesar Inserción Categoría
    async postCreateCategory(req, res) {
        try {
            await db.insertcategory(req.body.name);
            res.redirect('/admin/categories');
        } catch (err) {
            res.redirect('/admin/categories/insert');
        }
    },

    // Formulario Editar Categoría
    async getEditCategory(req, res) {
        try {
            const data = await db.getcategoryID(req.params.id);
            res.render('admin/categories/edit', { category: data[0] });
        } catch (err) {
            res.redirect('/admin/categories');
        }
    },

    // Procesar Edición Categoría
    async postEditCategory(req, res) {
        try {
            await db.updatecategory(req.body.id, req.body.name);
            res.redirect('/admin/categories');
        } catch (err) {
            res.redirect('/admin/categories');
        }
    },

    // Eliminar Categoría
    async deleteCategory(req, res) {
        try {
            await db.deletecategory(req.params.id);
            res.redirect('/admin/categories');
        } catch (err) {
            res.redirect('/admin/categories');
        }
    }
};
