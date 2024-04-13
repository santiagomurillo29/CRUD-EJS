const mongoose = require('mongoose')

// Creamos la funcion conectar
async function conectarBD() {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/local');
        console.log('Se conecto a MongoDB');
    }
    catch (error){
        console.error('Error al conectar a MongoDB', error)
    }
}
// Llamada a la funcion conectar
conectarBD()


const registroSchema = new mongoose.Schema({
    nombre: String,
    correo: {
        type: String,
        unique: true
    },
    contraseña: String
})
const Registro = mongoose.model('Registros', registroSchema)

module.exports = Registro;

