const express = require('express');
const router = express.Router();

const catalogController = require('../controllers/client/catalogController');
const authController = require('../controllers/client/authController');
const paymentController = require('../controllers/client/paymentController');

// Middleware de Autenticación de Usuario Cliente
function isAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/userini');
}

// ================= RUTAS PÚBLICAS Y DE CATÁLOGO ================= //
router.get('/', catalogController.getCatalog);
router.get('/pageini', catalogController.getLoggedCatalog);
router.get('/detalles/:id', catalogController.getProductDetails);
router.get('/detallesini/:id', catalogController.getProductDetails);
router.get('/filters', (req, res) => res.render('filters'));
router.get('/filterslog', catalogController.getLoggedCatalog);

// ================= API BÚSQUEDA EN TIEMPO REAL & HEALTHCHECK ================= //
router.get('/ping', (req, res) => res.status(200).send('pong'));
router.get('/api/search', catalogController.searchJSON);

// ================= AUTENTICACIÓN CLIENTE ================= //
router.get('/userini', authController.getLogin);
router.post('/pageini', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/password', authController.getPasswordRecovery);
router.post('/recuperar', authController.postPasswordRecovery);

router.get('/logout', authController.logout);

// ================= COMPRAS Y PAGOS ================= //
router.get('/compra', isAuth, paymentController.getCheckout);
router.get('/pedidoprd/:id', isAuth, paymentController.getProductOrder);
router.get('/payments/:producto/:id', isAuth, paymentController.getPaymentPage);

router.post('/payments', isAuth, paymentController.processPayment);
router.post('/payments/:producto/:id', isAuth, paymentController.processDirectPayment);

module.exports = router;
