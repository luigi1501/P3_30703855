var express = require('express');
var router = express.Router();
const db = require('../db/models');
require('dotenv').config()
const tablas = require ('../db/models')


//login
let logged = false;



router.get('/filters', (req, res) => {
  res.render('filters')
  });
  
  router.get('/detalles/:id', (req, res) => {
    db.getdetalles()
      .then(data => {
          res.render('detalles', {producto: data});
      })
      .catch(err => {
        res.render('detalles', {producto: []});
      });
    });



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


router.get('/login', (req,res) => {
  res.render('login')
})

router.post('/login', (req,res) =>{
  console.log(req.body)
  if (req.body.user === process.env.USER && req.body.pass === process.env.PASS) {
    console.log("Iniciaste")
    logged = true
    tablas
    res.redirect('/administrar')
  
  } else {
    logged = false
    res.redirect('/login')
  }
})

router.get('/administrar', (req, res) =>{
  tablas
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
