const express = require('express');
const Registro = require('../models/schemaRegistro.js');
const Pelicula = require('../models/schemaPelicula.js');
const route = express.Router();
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const session = require('express-session')

route.use(session ({
    secret: '123',
    resave: false,
    saveUninitialized: false
}));


route.get('/', async (req, res) =>{
    res.render('iniciar')
})


route.post('/inicioSesionUsuario', async (req, res) =>{
    try{
        const {correo, contraseña} = req.body;

        // buscamos el usurio por medio del correo
        const usuario = await Registro.findOne({correo})
        const nUsuario = usuario.nombre;

        // validamos las contraseñas
        if(contraseña == usuario.contraseña){
            req.session.isLoggedIn = true;
            req.session.nombre = nUsuario;
            res.redirect('/crud')

        }
        else{
            res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
        
    }
    catch(error){
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
})

const requireLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); 
    } else {
        res.redirect('/'); 
    }
};

route.get('/crud', requireLogin, async (req, res) =>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const peliculas = await Pelicula.find()
    const registro = await Registro.find()
    const noUsuario = req.session.nombre

    res.render('crud', {peliculas, registro, noUsuario})
})

route.get('/registro', (req, res) =>{
    res.render('registro')
})

route.post('/registroPelicula', async (req, res) =>{
    try{
        const registroPeliculas = new Pelicula ({
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            imagen: req.body.imagen,
        })
        await registroPeliculas.save()
        res.redirect('/crud')
    }
    catch(error){
        res.status(500).json({error: 'Error al agregar una nueva pelicula'})
    }
})

route.delete('/delete/:id', async (req, res) =>{
    try{
        const eliminar = await Pelicula.findByIdAndDelete(req.params.id)
        if(eliminar) {
            res.redirect('/crud')
        }else{
            res.status(404).json({error: 'Pelicula no encontrado'})
        }
    }
    catch(error){
        res.status(500).json({error: 'Error al eliminar pelicula'})
    }
})


route.get('/actualizar/:id', async (req, res) =>{
    const parametro = req.params.id
    const Peliculas = await Pelicula.find()
    res.render('actualizar', {Peliculas, parametro})
})

route.put('/actualizar/:id', async (req, res) =>{
    try {
        const actualizar = await Pelicula.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                categoria: req.body.categoria,
                imagen: req.body.imagen
            },
            { new: true } 
        );
        if (!actualizar) {
            return res.status(404).json({ error: 'Pelicula no encontrada' });
        }
        res.redirect('/crud');
    } catch(error) {
        res.status(500).json({ error: 'Error al actualizar la película' });
    }
    
});


route.get('/registrar', async (req, res) =>{
    res.render('registrar')
})

route.post('/registroUsuario', async (req, res) =>{
    try{

        const existingUser = await Registro.findOne({ correo: req.body.correo });

        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const registroUsuarios = new Registro({
            nombre : req.body.nombre,
            correo : req.body.correo,
            contraseña : req.body.contraseña
        })
        const usuarios = new Registro()
        await registroUsuarios.save()
        res.redirect('/')

    }
    catch{
        res.status(500).json({error : 'Error al agregar un nuevo usuario'})
    }
})  

route.get('/cerrarSesion',  async (req, res) => {
    await req.session.destroy()
    res.redirect('/')
})



module.exports = route;