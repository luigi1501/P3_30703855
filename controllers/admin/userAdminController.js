const db = require('../../db/models');

module.exports = {
    // Listar Clientes / Usuarios Registrados
    async listClients(req, res) {
        try {
            const clientes = await db.getuser();
            res.render('admin/clients/list', { usuarios: clientes });
        } catch (err) {
            res.render('admin/clients/list', { usuarios: [] });
        }
    }
};
