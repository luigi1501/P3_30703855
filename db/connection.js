const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, 'database.sqlite');

class DatabaseAdapter {
    constructor() {
        this.isTurso = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
        this.client = null;
        this.db = null;
        this.readyPromise = this.init();
    }

    async init() {
        if (this.isTurso) {
            console.log('⚡ Conectando a la base de datos Turso Cloud...');
            try {
                this.client = createClient({
                    url: process.env.TURSO_DATABASE_URL,
                    authToken: process.env.TURSO_AUTH_TOKEN,
                });

                await this.client.execute(`CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT DEFAULT 'user',
                    resetToken TEXT,
                    resetTokenExpires TEXT
                )`);

                await this.client.execute(`CREATE TABLE IF NOT EXISTS category (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
                )`);

                await this.client.execute(`CREATE TABLE IF NOT EXISTS producto (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    code INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    brand TEXT,
                    model TEXT,
                    description TEXT,
                    price REAL NOT NULL,
                    category_id INTEGER
                )`);

                await this.client.execute(`CREATE TABLE IF NOT EXISTS imagen (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT NOT NULL,
                    producto_id INTEGER,
                    destacado TEXT NOT NULL DEFAULT 'NO'
                )`);

                await this.client.execute(`CREATE TABLE IF NOT EXISTS compra (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    cliente_id INTEGER,
                    producto_id INTEGER,
                    cantidad INTEGER,
                    total_pagado REAL,
                    fecha TEXT,
                    ip_cliente TEXT,
                    transaccion_id TEXT,
                    descripcion TEXT,
                    referencia TEXT,
                    moneda_id INTEGER
                )`);

                const countRes = await this.client.execute("SELECT COUNT(*) AS count FROM producto");
                const count = countRes.rows[0] ? Number(countRes.rows[0].count) : 0;

                if (count === 0) {
                    await this.client.execute("INSERT INTO category (id, name) VALUES (1, 'Teclados Mecánicos'), (2, 'Teclados Custom'), (3, 'Switches & Keycaps')");
                    
                    await this.client.execute(`INSERT INTO producto (id, code, name, brand, model, description, price, category_id) VALUES
                        (1, 101, 'Keychron K2 Wireless', 'Keychron', 'K2-V2', 'Teclado mecánico Bluetooth al 75% con retroiluminación RGB y switches Gateron Brown.', 99.99, 1),
                        (2, 102, 'Razer BlackWidow V4', 'Razer', 'V4 Pro', 'Teclado gaming mecánico completo con iluminación Chroma RGB y switches verdes táctiles.', 149.50, 1),
                        (3, 103, 'Akko 3068B Plus', 'Akko', '3068B', 'Teclado mecánico custom al 65% hot-swappable con keycaps PBT de alta calidad.', 89.00, 2),
                        (4, 104, 'Gateron Oil King Switches (110 pcs)', 'Gateron', 'Oil King', 'Switches lineales prémium pre-lubricados de fábrica de 55g para una pulsación ultrasuave.', 45.00, 3)
                    `);

                    await this.client.execute(`INSERT INTO imagen (id, url, producto_id, destacado) VALUES
                        (1, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 1, 'SI'),
                        (2, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', 2, 'SI'),
                        (3, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 3, 'SI'),
                        (4, 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600', 4, 'NO')
                    `);
                }
                console.log('✅ Base de datos Turso Cloud conectada e inicializada exitosamente.');
            } catch (err) {
                console.error('❌ Error al conectar con Turso Cloud:', err.message);
                console.log('⚠️ Usando SQLite local como respaldo.');
                this.isTurso = false;
                await this.initLocalSqlite();
            }
        } else {
            await this.initLocalSqlite();
        }
    }

    async initLocalSqlite() {
        console.log('💾 Conectando a SQLite Local (sql.js)...');
        const SQL = await initSqlJs();
        if (fs.existsSync(dbPath)) {
            const filebuffer = fs.readFileSync(dbPath);
            this.db = new SQL.Database(filebuffer);
        } else {
            this.db = new SQL.Database();
            this.save();
        }

        this.db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            resetToken TEXT,
            resetTokenExpires TEXT
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS producto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code INTEGER NOT NULL,
            name TEXT NOT NULL,
            brand TEXT,
            model TEXT,
            description TEXT,
            price REAL NOT NULL,
            category_id INTEGER
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS imagen (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            producto_id INTEGER,
            destacado TEXT NOT NULL DEFAULT 'NO'
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS compra (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER,
            producto_id INTEGER,
            cantidad INTEGER,
            total_pagado REAL,
            fecha TEXT,
            ip_cliente TEXT,
            transaccion_id TEXT,
            descripcion TEXT,
            referencia TEXT,
            moneda_id INTEGER
        )`);

        const countRes = this.db.exec("SELECT COUNT(*) AS count FROM producto")[0];
        const count = countRes && countRes.values[0] ? countRes.values[0][0] : 0;
        
        if (count === 0) {
            this.db.run("INSERT INTO category (id, name) VALUES (1, 'Teclados Mecánicos'), (2, 'Teclados Custom'), (3, 'Switches & Keycaps')");
            
            this.db.run(`INSERT INTO producto (id, code, name, brand, model, description, price, category_id) VALUES
                (1, 101, 'Keychron K2 Wireless', 'Keychron', 'K2-V2', 'Teclado mecánico Bluetooth al 75% con retroiluminación RGB y switches Gateron Brown.', 99.99, 1),
                (2, 102, 'Razer BlackWidow V4', 'Razer', 'V4 Pro', 'Teclado gaming mecánico completo con iluminación Chroma RGB y switches verdes táctiles.', 149.50, 1),
                (3, 103, 'Akko 3068B Plus', 'Akko', '3068B', 'Teclado mecánico custom al 65% hot-swappable con keycaps PBT de alta calidad.', 89.00, 2),
                (4, 104, 'Gateron Oil King Switches (110 pcs)', 'Gateron', 'Oil King', 'Switches lineales prémium pre-lubricados de fábrica de 55g para una pulsación ultrasuave.', 45.00, 3)
            `);

            this.db.run(`INSERT INTO imagen (id, url, producto_id, destacado) VALUES
                (1, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 1, 'SI'),
                (2, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600', 2, 'SI'),
                (3, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600', 3, 'SI'),
                (4, 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600', 4, 'NO')
            `);
        }

        this.save();
        console.log('Base de datos SQLite local inicializada exitosamente en:', dbPath);
    }

    save() {
        if (!this.db || this.isTurso) return;
        try {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(dbPath, buffer);
        } catch (err) {
            console.error('Error al guardar la base de datos en disco:', err.message);
        }
    }

    serialize(fn) {
        if (typeof fn === 'function') fn();
    }

    run(sql, params = [], callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        this.readyPromise.then(async () => {
            if (this.isTurso) {
                try {
                    const res = await this.client.execute({ sql, args: params });
                    const lastID = res.lastInsertRowid !== undefined ? Number(res.lastInsertRowid) : 0;
                    const changes = res.rowsAffected !== undefined ? Number(res.rowsAffected) : 0;
                    if (callback) callback.call({ lastID, changes }, null);
                } catch (err) {
                    console.error('Error Turso run:', err.message);
                    if (callback) callback(err);
                }
            } else {
                try {
                    this.db.run(sql, params);
                    this.save();
                    const res = this.db.exec("SELECT last_insert_rowid() AS id, changes() AS changes")[0];
                    const lastID = res && res.values[0] ? res.values[0][0] : 0;
                    const changes = res && res.values[0] ? res.values[0][1] : 0;
                    if (callback) callback.call({ lastID, changes }, null);
                } catch (err) {
                    console.error('Error SQL run:', err.message);
                    if (callback) callback(err);
                }
            }
        });
    }

    all(sql, params = [], callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        this.readyPromise.then(async () => {
            if (this.isTurso) {
                try {
                    const res = await this.client.execute({ sql, args: params });
                    const rows = res.rows ? Array.from(res.rows) : [];
                    if (callback) callback(null, rows);
                } catch (err) {
                    console.error('Error Turso all:', err.message);
                    if (callback) callback(err, []);
                }
            } else {
                try {
                    const stmt = this.db.prepare(sql);
                    stmt.bind(params);
                    const rows = [];
                    while (stmt.step()) {
                        rows.push(stmt.getAsObject());
                    }
                    stmt.free();
                    if (callback) callback(null, rows);
                } catch (err) {
                    console.error('Error SQL all:', err.message);
                    if (callback) callback(err, []);
                }
            }
        });
    }

    get(sql, params = [], callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        this.readyPromise.then(async () => {
            if (this.isTurso) {
                try {
                    const res = await this.client.execute({ sql, args: params });
                    const row = res.rows && res.rows.length > 0 ? res.rows[0] : null;
                    if (callback) callback(null, row);
                } catch (err) {
                    console.error('Error Turso get:', err.message);
                    if (callback) callback(err, null);
                }
            } else {
                try {
                    const stmt = this.db.prepare(sql);
                    stmt.bind(params);
                    let row = null;
                    if (stmt.step()) {
                        row = stmt.getAsObject();
                    }
                    stmt.free();
                    if (callback) callback(null, row);
                } catch (err) {
                    console.error('Error SQL get:', err.message);
                    if (callback) callback(err, null);
                }
            }
        });
    }
}

const db = new DatabaseAdapter();
module.exports = db;