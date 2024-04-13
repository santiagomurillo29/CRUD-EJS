const express = require('express')
const router = require('./routes/router.js')
const path = require('path')
const methodOverride = require('method-override')

const app = express();
const port = 3000;


app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(router);



// motor de plantillas
app.set('view engine', 'ejs')
// donde van a estar las vistas
app.set('views', __dirname + '/views')

// ejecuta de primero lo statico
app.use(express.static(__dirname + "/public"))

app.listen(port, () =>{
    console.log(`http://localhost:${port}/`)
})