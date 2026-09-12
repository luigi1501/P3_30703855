const express = require('express');
const router = express.Router();

const clientRoutes = require('./clientRoutes');
const adminRoutes = require('./adminRoutes');

// Montaje Modular de Rutas de Cliente y Admin
router.use('/', clientRoutes);
router.use('/', adminRoutes);

module.exports = router;
