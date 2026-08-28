# AutoRayban

Aplicación web para modificar automáticamente los metadatos de fotos y vídeos, aplicando el perfil de **Ray-Ban Meta Smart Glasses 2**.

## Arquitectura

```
GitHub
├── Frontend → Vercel (Next.js + TypeScript)
│   └── Interfaz Drag & Drop
│
└── Backend → Python / FastAPI
    ├── ExifTool → Fotos
    └── FFmpeg → Vídeos
```

## Características

- **Drag & Drop**: Arrastra y suelta fotos o vídeos directamente desde tu explorador
- **Perfil automático**: Aplica automáticamente los metadatos de Ray-Ban Meta Smart Glasses 2
- **Soporte múltiple**: Funciona con JPG, PNG, HEIC, MP4, MOV, y más formatos
- **Descarga directa**: Obtén tu archivo modificado listo para descargar

### Perfil de metadatos aplicado

| Campo | Valor |
|-------|-------|
| Make | Meta AI |
| Model | Ray-Ban Meta Smart Glasses 2 |
| Orientation | Horizontal (normal) |
| X/Y Resolution | 72 |
| Resolution Unit | inches |
| Color Space | sRGB |
| Exif Version | 0221 |
| Flashpix Version | 0100 |

## Estructura del proyecto

```
AutoRyban/
├── frontend/                 # Next.js app (Vercel)
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── app/                      # FastAPI backend
│   ├── main.py
│   ├── metadata.py
│   └── __init__.py
│
├── requirements.txt
├── run.py
└── README.md
```

## Instalación y ejecución local

### Backend (Python/FastAPI)

1. **Clonar el repositorio** (si aún no lo has hecho):
   ```bash
   git clone <tu-repo-url>
   cd AutoRyban
   ```

2. **Crear entorno virtual**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # o
   source venv/bin/activate  # Mac/Linux
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Instalar herramientas externas**:
   - **ExifTool**: [Descargar desde la web oficial](https://exiftool.org/)
   - **FFmpeg**: [Descargar desde la web oficial](https://ffmpeg.org/) o usar `winget install ffmpeg` en Windows

   Asegúrate de que ambos estén en tu PATH.

5. **Ejecutar el servidor**:
   ```bash
   python run.py
   ```

   El servidor estará disponible en `http://localhost:8000`

   - `POST /metadata/read` - Lee metadatos de un archivo
   - `POST /metadata/apply` - Aplica el perfil y devuelve el archivo modificado

### Frontend (Next.js)

1. **Navegar al directorio frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variable de entorno** (opcional):
   
   Crea un archivo `.env.local` en el directorio `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   
   Si no lo configuras, usará `""` como base (útil si sirves el frontend desde el mismo dominio que el backend).

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## Despliegue en Vercel

### Paso 1: Preparar el repositorio

Asegúrate de que tu repositorio tenga la siguiente estructura:

```
tu-repo/
├── frontend/
│   ├── app/
│   ├── lib/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
└── (archivos del backend en otra carpeta o repo separado)
```

### Paso 2: Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate o inicia sesión (puedes usar tu cuenta de GitHub)

### Paso 3: Importar el proyecto

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Selecciona tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 4: Configurar el proyecto

En la pantalla de configuración:

1. **Framework Preset**: Debe aparecer "Next.js" automáticamente
2. **Root Directory**: Cambia a `frontend/` (importante: sin barra inicial)
3. **Build Command**: `npm run build` (debería aparecer por defecto)
4. **Output Directory**: `.next` (debería aparecer por defecto)

### Paso 5: Configurar variables de entorno

En la sección **"Environment Variables"**, agrega:

| Variable | Valor | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://tu-backend-url.com` | Production, Preview, Development |

> **Importante**: Reemplaza `https://tu-backend-url.com` con la URL real de tu backend desplegado (por ejemplo, en Render, Railway, Fly.io, etc.)

### Paso 6: Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine la construcción (1-2 minutos)
3. Vercel te asignará una URL como `https://tu-proyecto.vercel.app`

### Paso 7: Configurar dominio personalizado (opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

## Despliegue del Backend

El backend Python/FastAPI no se despliega en Vercel. Necesitas un servicio que soporte Python, como:

- **Render**: [render.com](https://render.com) - Plan gratuito disponible
- **Railway**: [railway.app](https://railway.app)
- **Fly.io**: [fly.io](https://fly.io)
- **Python Anywhere**: [pythonanywhere.com](https://www.pythonanywhere.com)

### Ejemplo de despliegue en Render:

1. Crea un nuevo **Web Service** en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (o el que necesites)
4. Agrega variables de entorno si es necesario
5. Despliega

Una vez desplegado, actualiza `NEXT_PUBLIC_API_URL` en Vercel con la URL de Render.

## Uso de la aplicación

1. Abre la aplicación web
2. Arrastra y suelta una foto o vídeo, o haz clic para seleccionar uno
3. Visualiza los metadatos actuales del archivo
4. Haz clic en **"Apply Ray-Ban Profile & Download"**
5. El archivo modificado se descargará automáticamente

## Notas importantes

- **Dimensiones de imagen**: Las dimensiones (ImageWidth, ImageHeight) se preservan de la imagen original
- **Campos derivados**: No se escriben manualmente campos como Image Size, Megapixels, Thumbnail Offset, etc. ExifTool/FFmpeg los calcula automáticamente
- **Vídeos**: El perfil de vídeo actualmente solo aplica Make y Model. Se definirá un perfil más completo en fases futuras

## Próximos pasos

- [ ] Definir perfil completo de metadatos para vídeos
- [ ] Añadir opción de vista previa antes de descargar
- [ ] Historial de archivos procesados
- [ ] Soporte para batch processing
- [ ] Selección de perfiles personalizados

## Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, ExifTool, FFmpeg
- **Hosting**: Vercel (frontend), Render/Railway (backend)
- **Repositorio**: GitHub

## Licencia

MIT
