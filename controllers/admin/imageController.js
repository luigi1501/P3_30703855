const db = require('../../db/models');
const { upload, cloudinary } = require('../../config/cloudinary');

// Middleware de Multer exportado para usar en las rutas
const uploadMiddleware = upload.single('imagen_file');

module.exports = {
    uploadMiddleware,

    // Listar Imágenes
    async listImages(req, res) {
        try {
            const imagenes = await db.getimagen();
            res.render('admin/images/list', { imagen: imagenes });
        } catch (err) {
            res.render('admin/images/list', { imagen: [] });
        }
    },

    // Formulario Inserción Imagen
    async getCreateImage(req, res) {
        try {
            const productos = await db.getproducto();
            res.render('admin/images/insert', {
                producto: productos,
                cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
            });
        } catch (err) {
            res.render('admin/images/insert', { producto: [], cloudinaryConfigured: false });
        }
    },

    // Procesar Inserción Imagen (acepta archivo O URL)
    postCreateImage: [
        (req, res, next) => {
            // Si no hay Cloudinary configurado, salta el upload
            if (!process.env.CLOUDINARY_CLOUD_NAME) return next();
            uploadMiddleware(req, res, (err) => {
                if (err) {
                    console.error('Error upload Cloudinary:', err.message);
                }
                next();
            });
        },
        async (req, res) => {
            let { url, producto_id, destacado } = req.body;

            // Si se subió archivo, usar la URL de Cloudinary
            if (req.file && req.file.path) {
                url = req.file.path;
            }

            if (!url || !url.trim()) {
                const productos = await db.getproducto();
                return res.render('admin/images/insert', {
                    producto: productos,
                    error: 'Debes proporcionar una imagen (archivo o URL).',
                    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
                });
            }

            try {
                await db.insertimagen(url.trim(), producto_id, destacado || 'NO');
                res.redirect('/admin/images');
            } catch (err) {
                console.error('Error al insertar imagen:', err.message);
                res.redirect('/admin/images/insert');
            }
        }
    ],

    // Formulario Editar Imagen
    async getEditImage(req, res) {
        try {
            const imagenes = await db.getimagenID(req.params.id);
            const productos = await db.getproducto();
            res.render('admin/images/edit', {
                imagen: imagenes[0],
                producto: productos,
                cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
            });
        } catch (err) {
            res.redirect('/admin/images');
        }
    },

    // Procesar Edición Imagen (acepta archivo O URL)
    postEditImage: [
        (req, res, next) => {
            if (!process.env.CLOUDINARY_CLOUD_NAME) return next();
            uploadMiddleware(req, res, (err) => {
                if (err) console.error('Error upload edit Cloudinary:', err.message);
                next();
            });
        },
        async (req, res) => {
            let { id, url, producto_id, destacado } = req.body;

            // Priorizar archivo subido sobre URL manual
            if (req.file && req.file.path) {
                url = req.file.path;
            }

            if (!url || !url.trim()) {
                return res.redirect('/admin/images/edit/' + id);
            }

            try {
                await db.updateimagen(id, url.trim(), producto_id, destacado || 'NO');
                res.redirect('/admin/images');
            } catch (err) {
                res.redirect('/admin/images');
            }
        }
    ],

    // Eliminar Imagen (también borra de Cloudinary si es URL de Cloudinary)
    async deleteImage(req, res) {
        try {
            const imagenes = await db.getimagenID(req.params.id);
            if (imagenes && imagenes[0] && imagenes[0].url) {
                const url = imagenes[0].url;
                // Si la URL es de Cloudinary, eliminarla también del CDN
                if (url.includes('cloudinary.com') && process.env.CLOUDINARY_CLOUD_NAME) {
                    try {
                        // Extraer public_id de la URL
                        const parts = url.split('/');
                        const fileWithExt = parts[parts.length - 1];
                        const fileName = fileWithExt.split('.')[0];
                        const folder = parts.slice(-3, -1).join('/');
                        await cloudinary.uploader.destroy(folder + '/' + fileName);
                    } catch (cdnErr) {
                        console.log('Aviso: no se pudo eliminar de Cloudinary:', cdnErr.message);
                    }
                }
            }
            await db.deleteimagen(req.params.id);
            res.redirect('/admin/images');
        } catch (err) {
            res.redirect('/admin/images');
        }
    }
};
