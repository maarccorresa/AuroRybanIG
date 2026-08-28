Resumen del proyecto
Estamos creando una aplicación web para modificar automáticamente los metadatos de fotos y vídeos, con el objetivo de aplicar un perfil de Ray-Ban Meta Smart Glasses 2.

Arquitectura
GitHub
│
├── Frontend → Vercel
│   └── Interfaz Drag & Drop
│
└── Backend → Python / FastAPI
    ├── ExifTool → Fotos
    └── FFmpeg → Vídeos

Funcionamiento
El usuario:

Entra en la aplicación web.
Hace Drag & Drop de una foto o vídeo.
El frontend envía el archivo al backend.
Python identifica el tipo de archivo.
Se aplican automáticamente los metadatos correspondientes.
Se devuelve el archivo modificado para descargarlo.
La idea es que no haya que editar manualmente cada campo.

Perfil de las fotos
Los campos principales que hemos definido son:

Make                : Meta AI
Model               : Ray-Ban Meta Smart Glasses 2
Orientation         : Horizontal (normal)

X Resolution        : 72
Y Resolution        : 72
Resolution Unit     : inches

Y Cb Cr Positioning : Centered

Exif Version        : 0221
Flashpix Version    : 0100

Color Space         : sRGB

Scene Capture Type  : Standard

Las dimensiones (ImageWidth, ImageHeight) se deberían conservar de la imagen real en lugar de forzarlas siempre a 3024 × 4032.

No vamos a escribir manualmente campos derivados como:

Image Size
Megapixels
Thumbnail Offset
Thumbnail Length
Encoding Process
Bits Per Sample
Color Components

ExifTool/JPEG se encargará de esos valores cuando corresponda.

Make y Model
Estos dos valores serán siempre fijos:

Make  = Meta AI
Model = Ray-Ban Meta Smart Glasses 2

El usuario no tendrá que modificarlos.

Estructura actual
Ahora mismo estás trabajando en Windows y tienes:

/
└── app/
    ├── main.py
    └── metadata.py

main.py contiene FastAPI y carga el router de metadata.py.

metadata.py contiene la lógica para:

Leer metadatos.
Aplicar el perfil Ray-Ban Meta.
Recibir archivos mediante API.
Devolver el archivo modificado.
API prevista
POST /metadata/read

Lee los metadatos de un archivo.

POST /metadata/apply

Aplica automáticamente el perfil y devuelve el archivo.

Tecnologías
Frontend: React/Next.js + TypeScript
Hosting frontend: Vercel
Backend: Python + FastAPI
Fotos: ExifTool
Vídeos: FFmpeg + ExifTool
Repositorio: GitHub
Siguiente fase
Antes de terminar los perfiles definitivos, necesitamos definir qué metadatos exactos llevan las fotos y vídeos originales de las Ray-Ban Meta Smart Glasses 2. Para vídeo habrá que crear un perfil diferente al de las fotos.

Después podemos construir el flujo completo:

Drag & Drop
     ↓
Detectar FOTO / VÍDEO
     ↓
Aplicar perfil correspondiente
     ↓
Procesar
     ↓
Descargar archivo

Así tendremos una primera versión funcional del proyecto.