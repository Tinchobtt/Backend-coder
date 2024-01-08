import multer from 'multer';

//Config Multer
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'src/public/assets') //En null es para el manejo de errores
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}${file.originalname}`) //Nombre del archivo concatenado con la fecha para que sea unico
    }
})

export const upload = multer({storage})