# CineData

Plataforma web para gestionar usuarios, explorar películas y administrar favoritos. Sistema completo con autenticación JWT, catálogo de películas y panel de administración.

## Arquitectura

### Servicios
- **UserService (Backend)**: FastAPI + MongoDB
  - Gestión de usuarios y autenticación JWT
  - Sistema de favoritos por usuario
  - Panel de administración
  - Puerto: `8000`

- **MovieService (Backend)**: Node.js + Express + MySQL
  - Catálogo de películas importadas automáticamente
  - API REST para consulta de películas
  - Puerto: `3001`

- **Frontend**: React + Vite + Nginx
  - Interfaz de usuario responsiva
  - Búsqueda y filtrado de películas
  - Gestión de favoritos
  - Puerto: `5173`

- **Bases de Datos**:
  - MongoDB (puerto `27017`): usuarios, tokens revocados
  - MySQL 8 (puerto `3307`): catálogo de películas

## Funcionalidades

### Para Usuarios
- ✅ **Registro y Login**: Autenticación con JWT
- ✅ **Catálogo de Películas**: Exploración de películas con detalles completos
- ✅ **Búsqueda**: Buscar películas por título
- ✅ **Filtros**: Filtrar por género y año
- ✅ **Sistema de Favoritos**: Marcar/desmarcar películas como favoritas
- ✅ **Vista de Favoritos**: Ver solo las películas guardadas como favoritas
- ✅ **Logout**: Cierre de sesión seguro

### Para Administradores
- ✅ **Panel de Administración**: Gestión de todos los usuarios
- ✅ **Eliminar Usuarios**: Borrar usuarios del sistema

## Cómo levantar el proyecto

### Con Docker (Recomendado)

Requiere Docker Desktop activo. Desde la raíz del proyecto:

```powershell
docker compose up --build
```

Este comando levantará automáticamente:
- MongoDB (base de datos de usuarios)
- MySQL (base de datos de películas)
- UserService (API de usuarios)
- MovieService (API de películas)
- Frontend (interfaz web)

**URLs disponibles:**
- Frontend: http://localhost:5173
- UserService API: http://localhost:8000
- MovieService API: http://localhost:3001
- Documentación API (Swagger): http://localhost:8000/docs

**Para detener los servicios:**
```powershell
docker compose down
```

**Para limpiar volúmenes y empezar desde cero:**
```powershell
docker compose down -v
docker compose up --build
```

### Sin Docker (Desarrollo local)

#### UserService
Requiere Python 3.10+, MongoDB local:
```powershell
cd userService
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### MovieService
Requiere Node.js, MySQL local:
```powershell
cd movieService
npm install
npm start
```

#### Frontend
Requiere Node.js + npm:
```powershell
cd frontend
npm install
npm run dev
```

## Estructura del proyecto

```
CineData/
├── userService/          # Backend FastAPI (usuarios y auth)
│   ├── app/
│   │   ├── routes/      # Endpoints (users.py, admin.py)
│   │   ├── models/      # Modelos de datos
│   │   ├── auth.py      # Autenticación JWT
│   │   ├── database.py  # Conexión MongoDB
│   │   └── main.py      # Aplicación principal
│   ├── Dockerfile
│   └── requirements.txt
│
├── movieService/         # Backend Node.js (películas)
│   ├── routes/
│   │   └── movies.js    # Endpoints de películas
│   ├── db.js            # Conexión MySQL
│   ├── index.js         # Servidor Express
│   ├── Dockerfile
│   └── package.json
│
├── frontend/             # Frontend React
│   ├── src/
│   │   ├── pages/       # Login, Register, Dashboard, AdminUsers
│   │   ├── components/  # SearchBar, FilterBar, MovieDetailModal, etc.
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml    # Orquestación de servicios
├── init.sql             # Schema inicial de MySQL
└── README.md

```

## API Endpoints

### UserService (http://localhost:8000)

**Autenticación:**
- `POST /users/register` - Registrar nuevo usuario
- `POST /users/login` - Login (devuelve JWT)
- `POST /users/logout` - Logout (revoca token)
- `GET /users/me` - Obtener perfil del usuario actual

**Favoritos:**
- `GET /users/favorites` - Lista de IDs de películas favoritas
- `POST /users/favorites/{movie_id}` - Añadir película a favoritos
- `DELETE /users/favorites/{movie_id}` - Quitar película de favoritos

**Administración:**
- `POST /admin/open-create-admin` - Crear administrador
- `GET /admin/users` - Listar todos los usuarios
- `DELETE /admin/users/{user_id}` - Eliminar usuario

### MovieService (http://localhost:3001)

- `GET /movies` - Obtener todas las películas
- `GET /movies?genre=Action` - Filtrar por género
- `GET /movies?year=2020` - Filtrar por año

## Flujo de uso

1. **Registro**: El usuario se registra en `/register`
2. **Login**: Inicia sesión y recibe un token JWT guardado en localStorage
3. **Dashboard**: Accede al catálogo de películas con búsqueda y filtros
4. **Favoritos**: Hace clic en la estrella para marcar/desmarcar favoritos
5. **Vista de Favoritos**: Activa el filtro de favoritos para ver solo sus películas guardadas
6. **Logout**: Cierra sesión revocando el token

## Notas técnicas

- **Autenticación**: Token JWT almacenado en `localStorage`
- **Favoritos**: Lista de IDs de películas almacenada en el documento de usuario en MongoDB
- **Importación de películas**: Automática al iniciar MovieService desde API externa
- **Rutas protegidas**: AdminRoute verifica el rol antes de renderizar componentes de admin
- **Persistencia**: Volúmenes Docker para MongoDB (`mongo_data`) y MySQL (`mysql_data`)
- **Retry logic**: MovieService reintenta conexión a MySQL hasta 30 veces (60 segundos)
