const axios = require('axios');
const db = require('../../db/models');
require('dotenv').config();

module.exports = {
    // Vista de Checkout General
    async getCheckout(req, res) {
        try {
            const productos = await db.getproducto();
            const usuarios = await db.getuser();
            res.render('client/compra', { producto: productos, cliente: usuarios });
        } catch (err) {
            res.render('client/compra', { producto: [], cliente: [] });
        }
    },

    // Pedido Producto Individual
    async getProductOrder(req, res) {
        try {
            const productos = await db.getproductoID(req.params.id);
            res.render('client/pedidoprd', { datos: productos[0] });
        } catch (err) {
            res.status(500).send('No se encontró el producto');
        }
    },

    // Formulario Pasarela de Pago
    async getPaymentPage(req, res) {
        const { producto, id } = req.params;
        try {
            const productos = await db.getproductoID(id);
            const productoData = productos[0] || {};
            res.render('client/payments', { producto, monto: productoData.price || 0, id });
        } catch (err) {
            res.render('client/payments', { producto: 'Error', monto: 0, id: '' });
        }
    },

    // Procesar Pago API Externa
    async processPayment(req, res) {
        const { descripcion, nombre, numero_tarjeta, cvv, mes_ven, year_ven, moneda_id, cantidad, referencia, precio, producto_id } = req.body;
        const ip_cliente = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress;

        let monto = cantidad * precio;
        let moneda = 'USD';

        if (moneda_id == 2) {
            moneda = 'EUR';
            monto = (cantidad * precio) * 0.91;
        } else if (moneda_id == 3) {
            moneda = 'VES';
            monto = (cantidad * precio) * 35.94;
        }

        const paymentPayload = {
            amount: monto,
            "card-number": numero_tarjeta,
            cvv,
            "expiration-month": mes_ven,
            "expiration-year": year_ven,
            "full-name": nombre,
            currency: moneda,
            description: descripcion || 'Compra en Keyboards Store',
            reference: referencia || `ref_${Date.now()}`
        };

        const token = process.env.PAYMENT_BEARER_TOKEN;
        const paymentUrl = process.env.PAYMENT_API_URL || 'https://fakepayment.onrender.com/payments';

        try {
            const response = await axios.post(paymentUrl, paymentPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const paymentData = response.data.data || {};
            const transaccion_id = paymentData.transaction_id || `tx_${Date.now()}`;
            const total_pagado = paymentData.amount || monto;
            const fecha = paymentData.date || new Date().toISOString();

            await db.insertcompra(
                req.session.user ? req.session.user.id : 1,
                producto_id,
                cantidad,
                total_pagado,
                fecha,
                ip_cliente,
                transaccion_id,
                descripcion,
                referencia,
                moneda_id
            );

            res.render('client/pagosuccess', { title: 'Compra Exitosa' });
        } catch (err) {
            console.error('Error al procesar pago:', err.message);
            res.render('client/pagofails', { title: 'Error en Pago' });
        }
    },

    // Procesar Pago Directo Producto
    async processDirectPayment(req, res) {
        const { producto, id } = req.params;
        const { count, card_number, expiration_month, expiration_year, cvv, currency } = req.body;
        const ip_cliente = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress;

        try {
            const productos = await db.getproductoID(id);
            if (productos.length === 0) return res.redirect('/');

            const precio = productos[0].price;
            const total_pagado = precio * (parseInt(count) || 1);

            const token = process.env.PAYMENT_BEARER_TOKEN;
            const paymentUrl = process.env.PAYMENT_API_URL || 'https://fakepayment.onrender.com/payments';

            const paymentPayload = {
                amount: total_pagado,
                "card-number": card_number,
                cvv,
                "expiration-month": expiration_month,
                "expiration-year": expiration_year,
                "full-name": req.session.user ? req.session.user.name : 'Cliente',
                currency: currency || 'USD',
                description: `Compra de ${producto}`,
                reference: `order_${Date.now()}`
            };

            try {
                await axios.post(paymentUrl, paymentPayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (apiErr) {
                console.log('Aviso API Pasarela:', apiErr.message);
            }

            const fechaC = new Date().toISOString();
            await db.insertcompra(
                req.session.user ? req.session.user.id : 1,
                id,
                count || 1,
                total_pagado,
                fechaC,
                ip_cliente,
                `tx_${Date.now()}`,
                `Compra de ${producto}`,
                `ref_${Date.now()}`,
                1
            );

            res.render('client/pagosuccess', { title: 'Compra Exitosa' });
        } catch (err) {
            console.error('Error en pago directo:', err);
            res.render('client/pagofails', { title: 'Error al realizar el pago' });
        }
    }
};
