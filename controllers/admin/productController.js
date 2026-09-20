const db = require('../../db/models');
const { upload } = require('../../config/cloudinary');
const uploadMiddleware = upload.single('imagen_file');

module.exports = {
    uploadMiddleware,

    // Listar Productos (Admin)
    async listProducts(req, res) {
        try {
            const productos = await db.getproducto();
            const categorias = await db.getcategory();
            res.render('admin/products/list', {
                producto: productos,
                category: categorias,
                cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
            });
        } catch (err) {
            res.render('admin/products/list', { producto: [], category: [], cloudinaryConfigured: false });
        }
    },

    // Formulario Crear Producto
    async getCreateProduct(req, res) {
        try {
            const categorias = await db.getcategory();
            res.render('admin/products/insert', {
                category: categorias,
                cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
            });
        } catch (err) {
            res.render('admin/products/insert', { category: [], cloudinaryConfigured: false });
        }
    },

    // Procesar Inserción Producto (All-In-One: Producto + Imagen)
    postCreateProduct: [
        (req, res, next) => {
            if (!process.env.CLOUDINARY_CLOUD_NAME) return next();
            uploadMiddleware(req, res, (err) => {
                if (err) console.error('Error upload producto imagen:', err.message);
                next();
            });
        },
        async (req, res) => {
            const { code, name, brand, model, description, price, category_id, image_url, destacado } = req.body;
            try {
                // 1. Registrar Producto en DB
                const prodResult = await db.insertproducto(code, name, brand, model, description, price, category_id);
                const newProductId = prodResult.id;

                // 2. Determinar URL de Imagen (por subida de archivo o por URL de texto)
                let finalImageUrl = image_url ? image_url.trim() : '';
                if (req.file && req.file.path) {
                    finalImageUrl = req.file.path;
                }

                // 3. Si se adjuntó una imagen, guardarla automáticamente asociada al nuevo producto
                if (finalImageUrl) {
                    await db.insertimagen(finalImageUrl, newProductId, destacado || 'SI');
                }

                res.redirect('/admin/products');
            } catch (err) {
                console.error('Error al guardar producto:', err);
                res.redirect('/admin/products/insert');
            }
        }
    ],

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
