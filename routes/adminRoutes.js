const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin/adminController');
const productController = require('../controllers/admin/productController');
const categoryController = require('../controllers/admin/categoryController');
const imageController = require('../controllers/admin/imageController');
const userAdminController = require('../controllers/admin/userAdminController');

// Middleware de Protección de Rutas Administrativas
function isAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.redirect('/login');
}

// ================= AUTENTICACIÓN ADMIN & DASHBOARD ================= //
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/administrar', isAdmin, adminController.getDashboard);
router.get('/admin/dashboard', isAdmin, adminController.getDashboard);

// ================= CRUD PRODUCTOS ================= //
router.get('/index', isAdmin, productController.listProducts);
router.get('/admin/products', isAdmin, productController.listProducts);

router.get('/insert', isAdmin, productController.getCreateProduct);
router.get('/admin/products/insert', isAdmin, productController.getCreateProduct);
router.post('/insert', isAdmin, productController.postCreateProduct);
router.post('/admin/products/insert', isAdmin, productController.postCreateProduct);

router.get('/edit/:id', isAdmin, productController.getEditProduct);
router.get('/admin/products/edit/:id', isAdmin, productController.getEditProduct);
router.post('/edit', isAdmin, productController.postEditProduct);
router.post('/admin/products/edit', isAdmin, productController.postEditProduct);

router.get('/delete/:id', isAdmin, productController.deleteProduct);
router.get('/admin/products/delete/:id', isAdmin, productController.deleteProduct);

// ================= CRUD CATEGORÍAS ================= //
router.get('/tabcategory', isAdmin, categoryController.listCategories);
router.get('/admin/categories', isAdmin, categoryController.listCategories);

router.get('/insertcat', isAdmin, categoryController.getCreateCategory);
router.get('/admin/categories/insert', isAdmin, categoryController.getCreateCategory);
router.post('/insertcat', isAdmin, categoryController.postCreateCategory);
router.post('/admin/categories/insert', isAdmin, categoryController.postCreateCategory);
router.post('/api/categories/quick-create', isAdmin, categoryController.quickCreateCategory);

router.get('/editcat/:id', isAdmin, categoryController.getEditCategory);
router.get('/admin/categories/edit/:id', isAdmin, categoryController.getEditCategory);
router.post('/editcat', isAdmin, categoryController.postEditCategory);
router.post('/admin/categories/edit', isAdmin, categoryController.postEditCategory);

router.get('/deletecat/:id', isAdmin, categoryController.deleteCategory);
router.get('/admin/categories/delete/:id', isAdmin, categoryController.deleteCategory);

// ================= CRUD IMÁGENES ================= //
router.get('/tabimagen', isAdmin, imageController.listImages);
router.get('/admin/images', isAdmin, imageController.listImages);

router.get('/insertima', isAdmin, imageController.getCreateImage);
router.get('/admin/images/insert', isAdmin, imageController.getCreateImage);
// postCreateImage es un array [multerMiddleware, handler]
router.post('/insertima', isAdmin, imageController.postCreateImage);
router.post('/admin/images/insert', isAdmin, imageController.postCreateImage);

router.get('/editima/:id', isAdmin, imageController.getEditImage);
router.get('/admin/images/edit/:id', isAdmin, imageController.getEditImage);
// postEditImage es un array [multerMiddleware, handler]
router.post('/editima', isAdmin, imageController.postEditImage);
router.post('/admin/images/edit', isAdmin, imageController.postEditImage);

router.get('/deleteima/:id', isAdmin, imageController.deleteImage);
router.get('/admin/images/delete/:id', isAdmin, imageController.deleteImage);

// ================= CLIENTES / USUARIOS ================= //
router.get('/tabcliente', isAdmin, userAdminController.listClients);
router.get('/admin/clients', isAdmin, userAdminController.listClients);

module.exports = router;
