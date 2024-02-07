const db = require('./connection');

let querys = {
    getuser:'SELECT * FROM usuarios',
    getuserEmail:'SELECT * FROM usuarios WHERE email = ?',
    register:'INSERT INTO usuarios(name, email, password) VALUES(?, ?, ?)',
    getproducto: 'SELECT * FROM producto',
    getproductoID: 'SELECT * FROM producto WHERE id = ?',
    getimagenID: 'SELECT * FROM imagen WHERE id = ?',
    insertproducto: 'INSERT INTO producto (code, name, brand, model, description, price, category_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
    getimagen: 'SELECT * FROM imagen',
    getcategory: 'SELECT * FROM category',
    getcategoryID: 'SELECT * FROM category WHERE id = ?',
    insertimagen: 'INSERT INTO imagen (url, producto_id, destacado) VALUES(?, ?, ?)',
    insertcategory: 'INSERT INTO category(name) VALUES(?)',
    updateproducto: 'UPDATE producto SET code = ?, name = ?, brand = ?, model = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
    updateimagen: 'UPDATE imagen SET url = ?, producto_id = ?, destacado = ? WHERE id = ?',
    updatecategory: 'UPDATE category SET name = ? WHERE id = ?',
    deleteproducto: 'DELETE FROM producto WHERE id = ?',
    deleteimagen: 'DELETE FROM imagen WHERE id = ?',
    deletecategory: 'DELETE FROM category WHERE id = ?',
    consultable: 'SELECT producto.id AS producto_id, producto.name AS producto_name, producto.price AS price, producto.description AS description, imagen.url AS imagen_url, category.name AS category_name FROM category INNER JOIN producto ON category.id = producto.category_id INNER JOIN imagen ON imagen.id = producto.id',
    getdetalles: 'SELECT producto.id AS producto_id, producto.name AS producto_name, producto.code AS producto_code, producto.price AS price, producto.description AS description, category.name AS category_name, producto.brand AS brand, producto.model AS model, imagen.url AS imagen_url, imagen.id AS imagen_id FROM producto INNER JOIN category ON category.id = producto.category_id INNER JOIN imagen ON imagen.id = producto.id',
    getcompra: 'SELECT * FROM compra',
    insertcompra: 'INSERT INTO compra(cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente) VALUES(?,?,?,?,?,?)'
    
}
module.exports = {




    facturas(cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id){
        return new Promise ((resolve, reject)=>{
            const sql= 'INSERT INTO compras (cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.run(sql, [cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id], (err, resultados)=>{
                if (err) reject(err);
                else resolve (resultados);
            });
        })
    },

    insertcompra(cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente){
        return new Promise((resolve, reject) => {
            db.run(querys.insertcompra, [cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente], (err) => {
                if(err) reject(err);
                    resolve()
            })
        })
    
    },

    getcompra(){
        return new Promise((resolve, reject)=>{
            db.all(querys.getcompra, (err,rows)=>{
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    getuser(){
        return new Promise((resolve, reject)=>{
            db.all(querys.getuser, (err,rows)=>{
                if(err) reject(err);
                resolve(rows);
            })
        })

    
    },
    getuserEmail(email){
        return new Promise((resolve, reject)=>{
            db.all(querys.getuserEmail, [email], (err,rows)=>{
                if(err) reject(err);
                console.log(rows);
                resolve(rows);
            })
        })
    },

    register(name, email, password){
        return new Promise((resolve, reject) => {
            db.run(querys.register, [name, email, password], (err) => {
                if(err) reject(err);
                    resolve()
            })
        })
    },

    getproducto(){
        return new Promise((resolve, reject)=>{
            db.all(querys.getproducto, (err,rows)=>{
                if(err) reject(err);
                resolve(rows);
            })
        })

    
    },
    
    insertproducto(code, name, brand, model, description, price, category_id){
        return new Promise((resolve, reject) => {
            db.run(querys.insertproducto, [code, name, brand, model, description, price, category_id], (err) => {
                if(err) reject(err);
                    resolve()
            })
        })
    
    },

    getproductoID(id){
        return new Promise((resolve, reject)=>{
            db.all(querys.getproductoID, [id], (err,rows)=>{
                if(err) reject(err);
                resolve(rows);
            })
        })
    },

    updateproducto(id, code, name, brand, model, description, price, category_id){
        return new Promise((resolve, reject) => {
            db.run(querys.updateproducto, [code, name, brand, model, description, price, category_id, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    deleteproducto(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteproducto, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    getimagen(){
        return new Promise((resolve, reject) => {
            db.all(querys.getimagen, (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },


    getimagenID(id){
        return new Promise((resolve, reject) => {
            db.all(querys.getimagenID, [id], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },

    insertimagen(url, producto_id, destacado){
        return new Promise((resolve, reject) => {
            db.run(querys.insertimagen, [url, producto_id, destacado], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    updateimagen(id, url, producto_id, destacado){
        return new Promise((resolve, reject) => {
            db.run(querys.updateimagen, [ url, producto_id, destacado, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    deleteimagen(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deleteimagen, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    getcategory(){
        return new Promise((resolve, reject) => {
            db.all(querys.getcategory, (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    getcategoryID(id){
        return new Promise((resolve, reject) => {
            db.all(querys.getcategoryID, [id], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            })
        })
    },
    
    insertcategory(name, id){
        return new Promise((resolve, reject) => {
            db.all(querys.insertcategory, [name, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    updatecategory(id, name){
        return new Promise((resolve, reject) => {
            db.run(querys.updatecategory, [name, id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },

    deletecategory(id){
        return new Promise((resolve, reject) => {
            db.run(querys.deletecategory, [id], (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    },
    

    consultable(producto_name, description, category_name, model, brand) {
        return new Promise((resolve, reject) => {
          let query = `
            SELECT
              producto.id AS producto_id,
              producto.name AS producto_name,
              producto.price AS price,
              producto.description AS description,
              producto.brand AS brand,
              producto.model AS model,
              imagen.url AS imagen_url,
              category.name AS category_name
            FROM category
            INNER JOIN producto ON category.id = producto.category_id
            INNER JOIN imagen ON imagen.id = producto.id
          `;
      
          let whereClause = '';
      
          if (producto_name) {
            whereClause += `producto.name LIKE '%${producto_name}%'`;
          }
      
          if (description) {
            if (whereClause.length > 0) {
              whereClause += ` AND `;
            }
            whereClause += `producto.description LIKE '%${description}%'`;
          }
      
          if (category_name) {
            if (whereClause.length > 0) {
              whereClause += ` AND `;
            }
            whereClause += `category.name = '${category_name}'`;
          }
      
          if (model) {
            if (whereClause.length > 0) {
              whereClause += ` AND `;
            }
            whereClause += `producto.model LIKE '%${model}%'`;
          }
      
          if (brand) {
            if (whereClause.length > 0) {
              whereClause += ` AND `;
            }
            whereClause += `producto.brand LIKE '%${brand}%'`;
          }
      
          if (whereClause.length > 0) {
            query += ` WHERE ${whereClause}`;
          }
      
          db.all(query, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
    getdetalles(){
        return new Promise((resolve, reject)=>{
           db.all(querys.getdetalles ,(err, rows) => { 
              if(err) reject(err);
              resolve(rows);
            });
        });
    }
}
