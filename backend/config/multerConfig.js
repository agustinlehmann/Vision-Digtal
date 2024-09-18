import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta para almacenar archivos cargados
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Genera un nombre único para el archivo
  }
});

// Crear la instancia de Multer
const upload = multer({ storage });

// Exportar como default para usar con 'import'
export default upload;
