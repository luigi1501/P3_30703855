const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../../db/models');
require('dotenv').config();

function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    });
}

module.exports = {
    // Formulario Iniciar Sesión Usuario
    getLogin(req, res) {
        res.render('client/login', { error: null });
    },

    // Procesar Iniciar Sesión Usuario
    async postLogin(req, res) {
        const { email, password } = req.body;
        try {
            const users = await db.getuserEmail(email);
            if (users.length === 0) {
                return res.render('client/login', { error: 'Correo o contraseña incorrectos' });
            }

            const user = users[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user'
                };
                return res.redirect('/pageini');
            } else {
                return res.render('client/login', { error: 'Correo o contraseña incorrectos' });
            }
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            return res.render('client/login', { error: 'Error del servidor, por favor intenta de nuevo.' });
        }
    },

    // Formulario Registro
    getRegister(req, res) {
        res.render('client/register', { keypublic: process.env.KEYPUBLIC || '', error: null });
    },

    // Procesar Registro (Con BCrypt Hashing)
    async postRegister(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render('client/register', { keypublic: process.env.KEYPUBLIC || '', error: 'Todos los campos son obligatorios.' });
        }

        try {
            const existingUsers = await db.getuserEmail(email);
            if (existingUsers.length > 0) {
                return res.render('client/register', { keypublic: process.env.KEYPUBLIC || '', error: 'El correo electrónico ya está registrado.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.register(name, email, hashedPassword, 'user');

            try {
                const transporter = getTransporter();
                await transporter.sendMail({
                    from: process.env.EMAIL || 'keyboardsstore@gmail.com',
                    to: email,
                    subject: `¡Bienvenido a Keyboards Store, ${name}!`,
                    text: `Hola ${name},\n\nTu registro se ha completado con éxito.`
                });
            } catch (emailErr) {
                console.log('Aviso Email:', emailErr.message);
            }

            req.session.user = { name, email, role: 'user' };
            return res.redirect('/pageini');
        } catch (err) {
            console.error('Error en registro:', err);
            return res.render('client/register', { keypublic: process.env.KEYPUBLIC || '', error: 'Error al registrar el usuario.' });
        }
    },

    // Recuperar Contraseña
    getPasswordRecovery(req, res) {
        res.render('client/password', { message: null, error: null });
    },

    async postPasswordRecovery(req, res) {
        const { email } = req.body;
        try {
            const users = await db.getuserEmail(email);
            if (users.length === 0) {
                return res.render('client/password', { message: 'Si el correo existe, se enviará un enlace de recuperación.', error: null });
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            const expires = Date.now() + 3600000;

            await db.setResetToken(email, resetToken, expires.toString());

            const transporter = getTransporter();
            const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;

            await transporter.sendMail({
                from: process.env.EMAIL || 'keyboardsstore@gmail.com',
                to: email,
                subject: 'Solicitud de recuperación de contraseña',
                text: `Has solicitado restablecer tu contraseña. Haz clic en el enlace para continuar: ${resetUrl}\n\nEste enlace expira en 1 hora.`
            });

            res.render('client/password', { message: 'Se ha enviado un enlace seguro a tu correo electrónico.', error: null });
        } catch (err) {
            console.error('Error en recuperación:', err);
            res.render('client/password', { message: null, error: 'Error al procesar la solicitud.' });
        }
    },

    // Cerrar Sesión
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
};
