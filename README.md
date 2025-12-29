# CineData 🎬

Plataforma web completa para explorar y gestionar películas con autenticación JWT, sistema de favoritos y panel administrativo. Arquitectura de microservicios con tecnologías modernas.

## 📋 Descripción General

CineData es un sistema integral que permite a los usuarios:
- Registrarse y autenticarse de manera segura
- Explorar un catálogo de películas
- Buscar y filtrar películas por género y año
- Guardar películas como favoritas
- Los administradores gestionar todos los usuarios del sistema

## 🏗️ Arquitectura

### Servicios Principales

#### **UserService** (Backend API)
- **Stack**: FastAPI + Motor (async MongoDB driver) + Python 3.10+
- **Funcionalidades**:
  - Autenticación y autorización con JWT
  - Gestión de usuarios (registro, login, perfil)
  - Sistema de favoritos por usuario
  - Panel administrativo para gestionar usuarios
  - Tokens revocados para logout seguro
- **Puerto**: `8000`
- **Documentación API**: `http://localhost:8000/docs` (Swagger UI)

#### **MovieService** (Backend API)
- **Stack**: Node.js + Express + MySQL 8
- **Funcionalidades**:
  - Catálogo de películas
  - API REST para consultar películas
  - Filtrado por género y año
  - Búsqueda por título
- **Puerto**: `3001`

#### **Frontend** (Interfaz de Usuario)
- **Stack**: React 19 + Vite + Nginx + React Router v7
- **Componentes principales**:
  - `Dashboard`: Vista principal con catálogo de películas
  - `Login/Register`: Páginas de autenticación
  - `AdminUsers`: Panel de administración
  - `SearchBar`: Búsqueda de películas
  - `FilterBar`: Filtrado por género y año
  - `FavoritesButton`: Gestión de favoritos
  - `MovieDetailModal`: Modal con detalles de película
  - `ProtectedRoute` y `AdminRoute`: Control de acceso
- **Estilos**: CSS modular por componente
- **Puerto**: `5173` (desarrollo) / `80` (producción con Nginx)

#### **Bases de Datos**

| BD | Motor | Puerto | Contenido |
|----|-------|--------|-----------|
| MongoDB | Mongo 6 | `27017` | Usuarios, sesiones, tokens revocados |
| MySQL | MySQL 8 | `3307` | Catálogo de películas |

## ✨ Funcionalidades

### Autenticación y Usuarios
- ✅ Registro de nuevos usuarios con validación de email
- ✅ Login con autenticación JWT
- ✅ Logout seguro con revocación de tokens
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración

### Catálogo de Películas
- ✅ Listado completo de películas con información detallada
- ✅ Búsqueda en tiempo real por título
- ✅ Filtrado por género, año de lanzamiento y valoración
- ✅ Vista detallada de cada película en modal
- ✅ Información: título, año, género, sinopsis

### Sistema de Favoritos
- ✅ Guardar películas como favoritas
- ✅ Sección dedicada para ver solo favoritos
- ✅ Sincronización en tiempo real entre dispositivos
- ✅ Indicador visual de películas favoritas

### Panel Administrativo
- ✅ Vista de todos los usuarios del sistema
- ✅ Información de cada usuario
- ✅ Eliminar usuarios del sistema
- ✅ Acceso restringido solo a administradores

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI**: Framework web moderno para Python
- **Motor**: Driver async para MongoDB
- **Express.js**: Framework para Node.js
- **MySQL 2**: Cliente MySQL para Node.js
- **JWT (python-jose)**: Autenticación basada en tokens
- **Bcrypt/Passlib**: Seguridad de contraseñas

### Frontend
- **React 19**: Biblioteca de UI
- **Vite**: Herramienta de construcción rápida
- **React Router v7**: Enrutamiento de aplicación
- **Axios**: Cliente HTTP
- **ESLint**: Linter para código JS/JSX

### DevOps
- **Docker**: Containerización de servicios
- **Docker Compose**: Orquestación de contenedores
- **Nginx**: Servidor web y proxy inverso

## 📁 Estructura del Proyecto

```
CineData/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── FavoritesButton.jsx
│   │   │   ├── MovieDetailModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── styles/             # Estilos CSS modular
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── nginx.conf
│   ├── Dockerfile
│   └── index.html
├── userService/                # API de usuarios (FastAPI)
│   ├── app/
│   │   ├── main.py            # Punto de entrada
│   │   ├── database.py         # Configuración MongoDB
│   │   ├── models.py           # Modelos de datos
│   │   ├── schemas.py          # Esquemas de validación
│   │   ├── auth.py             # Lógica de autenticación
│   │   ├── utils.py            # Utilidades
│   │   ├── routes/
│   │   │   ├── users.py        # Endpoints de usuarios
│   │   │   └── admin.py        # Endpoints administrativos
│   │   └── models/
│   │       └── logout.py       # Modelo para tokens revocados
│   ├── requirements.txt
│   ├── Dockerfile
│   └── package.json
├── movieService/               # API de películas (Express)
│   ├── index.js               # Servidor Express
│   ├── db.js                  # Configuración MySQL
│   ├── routes/
│   │   └── movies.js          # Endpoints de películas
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml         # Orquestación de servicios
├── init.sql                   # Script de inicialización de BD
└── README.md
```

## 🚀 Cómo Levantar el Proyecto

### Opción 1: Con Docker Compose (Recomendado) ⭐

La forma más sencilla y recomendada para tener toda la aplicación corriendo.

**Requisitos**: Docker Desktop (activo y en ejecución)

**Pasos**:

1. Navega a la carpeta raíz del proyecto, en mi caso:
```powershell
cd c:\Users\HP\Desktop\ano 4\1\Desarrollo Avanzado de Software para la Web de Datos\Proyecto\CineData
```

2. Ejecuta Docker Compose:
```powershell
docker compose up --build
```

3. Espera a que todos los servicios estén listos (esto tomará unos minutos la primera vez)

**Servicios que se iniciarán**:
- ✅ MongoDB (puerto 27017)
- ✅ MySQL 8 (puerto 3307)
- ✅ UserService API (puerto 8000)
- ✅ MovieService API (puerto 3001)
- ✅ Frontend con Nginx (puerto 5173)

**URLs de acceso**:
| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:5173 |
| **Swagger (Documentación API)** | http://localhost:8000/docs |

**Comandos útiles**:
```powershell
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (reinicia todo desde cero)
docker compose down -v

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f users
docker compose logs -f movies
```

### Opción 2: Desarrollo Local (Sin Docker)

Si prefieres ejecutar cada servicio por separado en tu máquina.

#### Requisitos Globales
- Python 3.10 o superior
- Node.js 16+ con npm
- MongoDB 6 (local)
- MySQL 8 (local)

#### UserService (FastAPI)

```powershell
# Navegar a la carpeta
cd userService

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor (con reload automático)
uvicorn app.main:app --reload

# El servicio estará disponible en http://localhost:8000
# Documentación: http://localhost:8000/docs
```

#### MovieService (Express + Node.js)

```powershell
# Navegar a la carpeta
cd movieService

# Instalar dependencias
npm install

# Ejecutar servidor
npm start

# El servicio estará disponible en http://localhost:3001
```

#### Frontend (React + Vite)

```powershell
# Navegar a la carpeta
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend estará disponible en http://localhost:5173
```

**En modo desarrollo**:
- El frontend con Vite soporta Hot Module Replacement (HMR)
- Los cambios se reflejan automáticamente en el navegador
- Los servidores Express y FastAPI también soportan reload automático

## 📚 Documentación de Endpoints

### UserService (FastAPI)
La documentación interactiva está disponible en: **http://localhost:8000/docs**

#### Endpoints Principales:
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /users/me` - Obtener perfil del usuario actual
- `POST /favorites/{movie_id}` - Guardar película como favorita
- `DELETE /favorites/{movie_id}` - Eliminar película de favoritos
- `GET /favorites` - Obtener lista de favoritos del usuario
- `GET /admin/users` - Listar todos los usuarios (Admin)
- `DELETE /admin/users/{user_id}` - Eliminar usuario (Admin)

### MovieService (Express)
Endpoints disponibles:
- `GET /api/movies` - Listar todas las películas
- `GET /api/movies/:id` - Obtener detalles de una película
- `GET /api/movies/filter?genre=...&year=...` - Filtrar películas
- `GET /api/movies/search?title=...` - Buscar películas por título

## 🔐 Seguridad

- **Autenticación JWT**: Todos los endpoints protegidos requieren token JWT
- **Hashing de Contraseñas**: Bcrypt con salt para almacenar contraseñas seguras
- **CORS Habilitado**: Comunicación segura entre frontend y backend
- **Tokens Revocados**: Control de logout mediante lista de tokens inválidos
- **Validación de Entrada**: Email y contraseña validados en esquemas
- **Rutas Protegidas**: Componentes de React con ProtectedRoute y AdminRoute

## 🧪 Características de Desarrollo

### ESLint para Frontend
```powershell
cd frontend
npm run lint
```

### Build de Producción
```powershell
cd frontend
npm run build

# Los archivos compilados estarán en dist/
```

## 📝 Variables de Entorno

### UserService
Configuradas en `docker-compose.yml`:
- `MONGO_URL`: URL de conexión a MongoDB

### MovieService
Configuradas en `docker-compose.yml`:
- `DB_HOST`: Host del servidor MySQL
- `DB_USER`: Usuario de MySQL
- `DB_PASSWORD`: Contraseña de MySQL
- `DB_NAME`: Nombre de la base de datos
- `DB_PORT`: Puerto de MySQL

## 🐛 Troubleshooting

### Puerto ya está en uso
```powershell
# Encuentra el proceso usando el puerto (ej: 5173)
netstat -ano | findstr :5173

# Termina el proceso
taskkill /PID <PID> /F
```

### MongoDB no se conecta
- Verifica que MongoDB esté en ejecución: `mongod`
- Comprueba la URL de conexión en variables de entorno

### MySQL no se conecta
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `docker-compose.yml`

### Errores CORS
- Verifica que la URL del frontend esté en `allow_origins` en `userService/app/main.py`

