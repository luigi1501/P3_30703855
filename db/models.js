const db = require('./connection');

const querys = {
    getuser: 'SELECT * FROM usuarios',
    getuserEmail: 'SELECT * FROM usuarios WHERE email = ?',
    getuserById: 'SELECT * FROM usuarios WHERE id = ?',
    getuserByResetToken: 'SELECT * FROM usuarios WHERE resetToken = ?',
    register: 'INSERT INTO usuarios(name, email, password, role) VALUES(?, ?, ?, ?)',
    updatePassword: 'UPDATE usuarios SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?',
    setResetToken: 'UPDATE usuarios SET resetToken = ?, resetTokenExpires = ? WHERE email = ?',
    
    getproducto: 'SELECT * FROM producto',
    getproductoID: 'SELECT * FROM producto WHERE id = ?',
    insertproducto: 'INSERT INTO producto (code, name, brand, model, description, price, category_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
    updateproducto: 'UPDATE producto SET code = ?, name = ?, brand = ?, model = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
    deleteproducto: 'DELETE FROM producto WHERE id = ?',

    getimagen: 'SELECT * FROM imagen',
    getimagenID: 'SELECT * FROM imagen WHERE id = ?',
    insertimagen: 'INSERT INTO imagen (url, producto_id, destacado) VALUES(?, ?, ?)',
    updateimagen: 'UPDATE imagen SET url = ?, producto_id = ?, destacado = ? WHERE id = ?',
    deleteimagen: 'DELETE FROM imagen WHERE id = ?',

    getcategory: 'SELECT * FROM category',
    getcategoryID: 'SELECT * FROM category WHERE id = ?',
    insertcategory: 'INSERT INTO category(name) VALUES(?)',
    updatecategory: 'UPDATE category SET name = ? WHERE id = ?',
    deletecategory: 'DELETE FROM category WHERE id = ?',

    getcompra: 'SELECT * FROM compra',
    insertcompra: 'INSERT INTO compra(cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
};

module.exports = {
    facturas(cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO compra (cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(sql, [cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    insertcompra(cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente, transaccion_id = '', descripcion = '', referencia = '', moneda_id = 1) {
        return new Promise((resolve, reject) => {
            db.run(querys.insertcompra, [cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    getcompra() {
        return new Promise((resolve, reject) => {
            db.all(querys.getcompra, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    getuser() {
        return new Promise((resolve, reject) => {
            db.all(querys.getuser, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    getuserEmail(email) {
        return new Promise((resolve, reject) => {
            db.all(querys.getuserEmail, [email], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    getuserById(id) {
        return new Promise((resolve, reject) => {
            db.get(querys.getuserById, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    register(name, email, password, role = 'user') {
        return new Promise((resolve, reject) => {
            db.run(querys.register, [name, email, password, role], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    setResetToken(email, token, expires) {
        return new Promise((resolve, reject) => {
            db.run(querys.setResetToken, [token, expires, email], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getuserByResetToken(token) {
        return new Promise((resolve, reject) => {
            db.get(querys.getuserByResetToken, [token], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    updatePassword(id, password) {
        return new Promise((resolve, reject) => {
            db.run(querys.updatePassword, [password, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getproducto() {
        return new Promise((resolve, reject) => {
            db.all(querys.getproducto, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    insertproducto(code, name, brand, model, description, price, category_id) {
        return new Promise((resolve, reject) => {
            db.run(querys.insertproducto, [code, name, brand, model, description, price, category_id], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    getproductoID(id) {
        return new Promise((resolve, reject) => {
            db.all(querys.getproductoID, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    updateproducto(id, code, name, brand, model, description, price, category_id) {
        return new Promise((resolve, reject) => {
            db.run(querys.updateproducto, [code, name, brand, model, description, price, category_id, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    deleteproducto(id) {
        return new Promise((resolve, reject) => {
            db.run(querys.deleteproducto, [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getimagen() {
        return new Promise((resolve, reject) => {
            db.all(querys.getimagen, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    getimagenID(id) {
        return new Promise((resolve, reject) => {
            db.all(querys.getimagenID, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    insertimagen(url, producto_id, destacado) {
        return new Promise((resolve, reject) => {
            db.run(querys.insertimagen, [url, producto_id, destacado], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    updateimagen(id, url, producto_id, destacado) {
        return new Promise((resolve, reject) => {
            db.run(querys.updateimagen, [url, producto_id, destacado, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    deleteimagen(id) {
        return new Promise((resolve, reject) => {
            db.run(querys.deleteimagen, [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    getcategory() {
        return new Promise((resolve, reject) => {
            db.all(querys.getcategory, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    getcategoryID(id) {
        return new Promise((resolve, reject) => {
            db.all(querys.getcategoryID, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    },

    insertcategory(name) {
        return new Promise((resolve, reject) => {
            db.run(querys.insertcategory, [name], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    },

    updatecategory(id, name) {
        return new Promise((resolve, reject) => {
            db.run(querys.updatecategory, [name, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    deletecategory(id) {
        return new Promise((resolve, reject) => {
            db.run(querys.deletecategory, [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    },

    // Consulta parametrizada segura (Anti-SQLi) con JOIN corregido (imagen.producto_id = producto.id)
    consultable(producto_name, description, category_name, brand, model) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT
                    producto.id AS producto_id,
                    producto.name AS producto_name,
                    producto.price AS price,
                    producto.description AS description,
                    producto.brand AS brand,
                    producto.model AS model,
                    producto.code AS code,
                    COALESCE(imagen.url, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500') AS imagen_url,
                    COALESCE(category.name, 'General') AS category_name
                FROM producto
                LEFT JOIN category ON category.id = producto.category_id
                LEFT JOIN imagen ON imagen.producto_id = producto.id
            `;

            const whereClauses = [];
            const params = [];

            if (producto_name && producto_name.trim() !== '') {
                whereClauses.push('producto.name LIKE ?');
                params.push(`%${producto_name.trim()}%`);
            }

            if (description && description.trim() !== '') {
                whereClauses.push('producto.description LIKE ?');
                params.push(`%${description.trim()}%`);
            }

            if (category_name && category_name.trim() !== '') {
                whereClauses.push('category.name = ?');
                params.push(category_name.trim());
            }

            if (model && model.trim() !== '') {
                whereClauses.push('producto.model LIKE ?');
                params.push(`%${model.trim()}%`);
            }

            if (brand && brand.trim() !== '') {
                whereClauses.push('producto.brand LIKE ?');
                params.push(`%${brand.trim()}%`);
            }

            if (whereClauses.length > 0) {
                query += ` WHERE ${whereClauses.join(' AND ')}`;
            }

            query += ` GROUP BY producto.id ORDER BY producto.id ASC`;

            db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Error en consultable:', err.message);
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    },

    getdetalles(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    producto.id AS producto_id,
                    producto.name AS producto_name,
                    producto.code AS producto_code,
                    producto.price AS price,
                    producto.description AS description,
                    producto.brand AS brand,
                    producto.model AS model,
                    COALESCE(category.name, 'General') AS category_name,
                    COALESCE(imagen.url, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500') AS imagen_url,
                    imagen.id AS imagen_id
                FROM producto
                LEFT JOIN category ON category.id = producto.category_id
                LEFT JOIN imagen ON imagen.producto_id = producto.id
                WHERE producto.id = ?
            `;
            db.all(query, [id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }
};
