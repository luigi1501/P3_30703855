var express = require('express');
var router = express.Router();
const db = require('../db/models');
require('dotenv').config()
var axios = require ('axios');
const { Axios } = require('axios');
const tablas = require ('../db/models')


//login
let logged = false;
let logeedin = false;


//Pago productos API 
router.post('/payments', async (req, res, next)=>{
  var monto, moneda;
  const {descripcion, nombre, numero_tarjeta, cvv, mes_ven, year_ven, moneda_id, cantidad, referencia, precio} = req.body;
  const ip_cliente = req.socket.remoteAddress;
  if (moneda_id == 1) {
    moneda= 'USD';
    monto = cantidad * precio;
  }else{
    if (moneda_id == 2) {
      moneda= 'EUR';
      monto = (cantidad * precio) * 0.91;
    } else {
      if (moneda_id == 3) {
        moneda= 'VES';
        monto = (cantidad * precio) * 35.94; 
      }
    }
  }
  const payments ={
    "amount": monto,
    "card-number": numero_tarjeta,
    "cvv": cvv,
    "expiration-month": mes_ven,
    "expiration-year": year_ven,
    "full-name": nombre,
    "currency": moneda,
    "description": descripcion,
    "reference": referencia
  }
  try{
    const response = await axios.post ('https://fakepayment.onrender.com/payments', payments, {headers:{ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xMVQyMjoxMzoyMC41NTZaIiwiaWF0IjoxNzA1MDExMjAwfQ.MC2WfwWwfyRT4Q6q9-D1n73rrorClhC1Ih4Lb0o1_sI'}});
    const data = JSON.parse(JSON.stringify(response.data));
      const transaccion_id = data.data.transaction_id;
      const total_pagado = data.data.amount;
      const fecha = data.data.date;
      const referencia = data.data.reference;
      const descripcion = data.data.description;
      const message = data.message;
      console.log(message);
      productosModel
      .facturas(cantidad, total_pagado, fecha, ip_cliente, transaccion_id, descripcion, referencia, moneda_id, cliente_id, producto_id)
      .then(idFacturaRealizada =>{
        res.render('pagosuccess', {title: 'Compra Exitosa'})
      })
      
  } catch (err) {
    res.render('pagofails');
  }
})

// compra
router.get('/compra', (req, res) => {
  db.getproducto()
  .then(data =>{
    db.getuser()
    .then (client => { 
      console.log(client);
      res.render ('compra', { producto: data, cliente: client });
    })
    .catch (err => {
      res.render ('compra', { producto: data, cliente: client  });
    })
  })     
  .catch (err => {
    res.render ('compra', { producto: [], cliente: [] });
  });
} )

//Pagina formulario de compra 
router.get('/pedidoprd/:id', function(req, res, next){
  if(req.session.auth){
    const id = req.params.id
    productosModel
      .obtenerPorId(id)
      .then(datos=>{
        res.render('pedidoprd', {datos: datos});
      })
      .catch(err=>{
        console.error(err.message);
        return res.status(500).send('No se encuentra el producto')
      })
  } else{
    res.redirect('/userini');
  }
})




router.post('/compra', function(req, res, next) {
  let date = new Date();
  let Datetime = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  let fecha = Datetime;
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ip_cliente = ip.split(",")[0];
  const cliente_id = req.body.cliente_id
  const producto_id = req.body.producto_id
  const cantidad = req.body.cantidad
  const bd = require('../db/connection');
  let sql = `SELECT price FROM producto WHERE id = ?`;
  let precio;
 
  bd.get(sql, [producto_id], (err, row) => {
    if (err) {
      console.error(err.message);
    }
    precio = row.price;
    console.log(`El precio del producto ${producto_id} es: ${precio}`);
   
    let total_pagado = precio * cantidad;
    console.log(`El resultado de la multiplicación es: ${total_pagado}`);

    db.insertcompra(cliente_id, producto_id, cantidad, total_pagado, fecha, ip_cliente)
    .then(() => {
       res.redirect('payments')
    })
    .catch(err => {
      console.log(err);
    })

  });
 
})


router.get('/tabcliente', (req, res) => {
  db.getuser()
    .then(data => {        
      console.log(data)
      res.render('tabcliente', { usuarios: data });
  })
  .catch(err => {
      res.render('tabcliente', { usuarios: [] });
  })

});

router.get('/payments', (req, res) => {
  res.render('payments')
  });

  router.get('/paga', (req, res) => {
    res.render('paga')
    });




  router.get('/filterslog', (req, res) => {
    const { producto_name, description, category_name, brand, model } = req.query;
    db.consultable(producto_name, description, category_name, brand, model)
      .then(data => {
        res.render('pageini', { producto: data });
      })
      .catch(err => {
        console.error(err);
        res.render('pageini', { producto: [] });
      });
  });
  



    router.get('/filters', (req, res) => {
      res.render('filters')
      });
      
      router.get('/imagen/:id', (req, res)=>{
        const id = req.params.id
        db.getimagenID(id)
        .then(data =>{
          console.log(data)
          res.render('imagen', {imagen: data[0]})
        })
          .catch(err =>{
            console.log(err);
            res.render('imagen', {imagen: []})
          })   
      })



      router.get('/detallesini/:id', (req, res)=>{
        const id = req.params.id
        db.getproductoID(id)
        .then(data =>{
          console.log(data)
          db.getimagen()
          .then (images => { 
            res.render ('detallesini', { producto: data[0], imagen: images });
          })
          .catch (err => {
            res.render ('detallesini', { producto: data[0], imagen: [] });
          })
        })     
        .catch (err => {
          res.render ('detallesini', { producto: [], imagen: [] });
        });
      })




      router.get('/detalles/:id', (req, res)=>{
        const id = req.params.id
        db.getproductoID(id)
        .then(data =>{
          console.log(data)
          db.getimagen()
          .then (images => { 
            res.render ('detalles', { producto: data[0], imagen: images });
          })
          .catch (err => {
            res.render ('detalles', { producto: data[0], imagen: [] });
          })
        })     
        .catch (err => {
          res.render ('detalles', { producto: [], imagen: [] });
        });
      })



router.get('/', (req, res) => {
  const { producto_name, description, category_name, brand, model } = req.query;
  db.consultable(producto_name, description, category_name, brand, model)
    .then(data => {
      res.render('userpage', { producto: data });
    })
    .catch(err => {
      console.error(err);
      res.render('userpage', { producto: [] });
    });
});


router.get('/pageini', (req, res) => {
  const { producto_name, description, category_name, brand, model } = req.query;
  db.consultable(producto_name, description, category_name, brand, model)
    .then(data => {
      res.render('pageini', { producto: data });
    })
    .catch(err => {
      console.error(err);
      res.render('pageini', { producto: [] });
    });
});

router.get('/register', (req,res)=> {
  res.render('register')
})

router.post('/register', (req, res) => {
  const {name,email, password} = req.body;
  console.log(name, email, password);
  db.register(name, email, password)
  .then(() => {
     res.redirect('pageini')
  })
  .catch(err => {
    console.log(err);
  })
});  

router.get('/userini', (req,res)=> {
  res.render('userini')
})

router.post('/pageini', (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;
  console.log(email, password);
  const bd = require('../db/connection');
  bd.get('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err) {
      console.error(err);
      // Manejar el error
    } else {
      if (row) {
        console.log(" Los datos son iguales, redirigir a otra vista")
        res.redirect('/pageini');
      } else {
        console.log(" Los datos no son iguales, manejar según sea necesario")
        res.redirect('/userini');
      }
    }
  });
});



router.get('/login', (req,res) => {
  res.render('login')
})

router.post('/login', (req,res) =>{
  console.log(req.body)
  if (req.body.user === process.env.USER && req.body.pass === process.env.PASS) {
    console.log("Iniciaste")
    logged = true
    res.redirect('/administrar')
  
  } else {
    logged = false
    res.redirect('/login')
  }
})

router.get('/administrar', (req, res) =>{
  res.render('administrar')
})

//index
router.get('/index', (req, res) => {
  tablas
  db.getproducto()
    .then(data => {        
      console.log(data)
      tablas
      res.render('index', { producto: data });
  })
  .catch(err => {
      res.render('index', { producto: [] });
  })
});


router.get('/tabcategory', (req, res) => {
  tablas
  db.getcategory()
    .then(data => {        
      console.log(data)
      res.render('tabcategory', { category: data });
  })
  .catch(err => {
      res.render('tabcategory', { category: [] });
  })

});

router.get('/tabimagen', (req, res) => {
  tablas
  db.getimagen()
    .then(data => {        
      console.log(data)
      res.render('tabimagen', { imagen: data });
  })
  .catch(err => {
      res.render('tabimagen', { imagen: [] });
  })

});


router.get('/insertcat', (req, res) => {
  tablas
  res.render('insertcat')
} )


//insertar producto
router.get('/insert', (req, res) => {
  tablas
  db.getcategory()
  .then(data => {
    res.render('insert', {category: data});
  })
  .catch(err => {
    res.render('insert', {category: []});
  })
} )


router.post('/insert', (req, res) => {
  const {code, name, brand, model, description, price, category_id} = req.body;
  console.log(code, name, brand, model, description, price, category_id);
  tablas
  db.insertproducto(code, name,brand,model,description,price,category_id)
  .then(() => {
     res.redirect('index')
  })
  .catch(err => {
    console.log(err);
  })
});

router.post('/insertcat', (req, res) => {
  const {name} = req.body;
  console.log(name);
  tablas
  db.insertcategory(name)
  .then(() => {
     res.redirect('tabcategory')
  })
  .catch(err => {
    console.log(err);
  })
});

router.post('/insertima', (req, res) => {
  const {url, producto_id, destacado} = req.body;
  console.log(url, producto_id, destacado);
  tablas
  db.insertimagen(url, producto_id, destacado)
  .then(() => {
     res.redirect('tabimagen')
  })
  .catch(err => {
    console.log(err);
  })
});


//editar producto
router.post('/edit/', (req, res)=>{
  const {id, code, name, brand, model, description, price, category_id,} = req.body;
  tablas
  db.updateproducto(id, code, name, brand, model, description, price, category_id)
  .then(() =>{
    res.redirect('/index');
    console.log(id, code, name, brand, model, description, price, category_id);
  })
  .catch(err =>{
    console.log(err);

  })
});

router.post('/editcat/', (req, res)=>{
  const {id, name} = req.body;
  tablas
  db.updatecategory(id, name)
  .then(() =>{
    res.redirect('/tabcategory');
  })
  .catch(err =>{
    console.log(err);

  })
});





router.post('/editima/', (req, res)=>{
  const {id, url, producto_id, destacado} = req.body;
  tablas
  db.updateimagen(id, url, producto_id, destacado)
  .then(() =>{
    res.redirect('/tabimagen');
    console.log(id, url, producto_id, destacado);
  })
  .catch(err =>{
    console.log(err);

  })
});



router.get('/edit/:id', (req, res)=>{
  const id = req.params.id
  tablas
  db.getproductoID(id)
  .then(data =>{
    console.log(data)
    res.render('edit', {producto: data[0]})
  })
    .catch(err =>{
      console.log(err);
      res.render('edit', {producto: []})
    }) 


    
})

router.get('/editima/:id', (req, res)=>{
  tablas
  const id = req.params.id
  db.getimagenID(id)
  .then(data =>{
    db.getimagen
    console.log(data)
    res.render('editima', {imagen: data[0]})
  })
    .catch(err =>{
      console.log(err);
      res.render('editima', {imagen: []})
    }) 


    
})

router.get('/editcat/:id', (req, res)=>{
  const id = req.params.id
  tablas
  db.getcategoryID(id)
  .then(data =>{
    console.log(data)
    res.render('editcat', {category: data[0]})
  })
    .catch(err =>{
      console.log(err);
      res.render('editcat', {category: []})
    }) 


    
})

router.get('/delete/:id', (req, res)=>{
  const id = req.params.id;
  tablas
  db.deleteproducto(id)
    .then(() => {
    res.redirect('/index');
  })
  .catch(err => {
  console.log(err);
  });
})



router.get('/tabcategory', (req, res) =>{
  tablas
  res.render('tabcategory')
})

router.get('/deletecat/:id', (req, res)=>{
  tablas
  const id = req.params.id;
  db.deletecategory(id)
    .then(() => {
    res.redirect('/tabcategory');
  })
  .catch(err => {
  console.log(err);
  });
})

router.get('/tabcategory', (req, res) =>{
  tablas
  res.render('tabcategory')
})

router.get('/deleteima/:id', (req, res)=>{
  const id = req.params.id;
  tablas
  db.deleteimagen(id)
    .then(() => {
    res.redirect('/tabimagen');
  })
  .catch(err => {
  console.log(err);
  });
})

router.get('/insertima', (req, res) => {
  tablas
  db.getproducto()
  .then(data => {
    res.render('insertima', {producto: data});
  })
  .catch(err => {
    res.render('insertima', {producto: []});
  })
});





module.exports = router;
