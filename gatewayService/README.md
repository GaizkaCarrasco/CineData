# API Gateway - CineData 🚀

Punto de entrada centralizado para todos los servicios de la plataforma CineData.

## 📋 Descripción

El API Gateway es un servidor Express que actúa como proxy inverso y proporciona:
- Punto de entrada único para el cliente
- Enrutamiento transparente a los servicios backend
- Autenticación JWT centralizada
- CORS configurado
- Logging de solicitudes
- Health checks

## 🏗️ Arquitectura

```
Cliente (Frontend)
       │
       ▼
┌─────────────────────────┐
│    API Gateway          │
│ (Express + Middleware)  │
└──────┬────────┬─────────┘
       │        │
   ┌───▼──┐ ┌──▼───┐
   │Users │ │Movies│
   │ API  │ │ API  │
   └──────┘ └──────┘
```

## 🚀 Inicio Rápido

### Con Docker Compose
```powershell
cd ..
docker compose up --build
# Gateway estará disponible en http://localhost:8080
```

### Desarrollo Local
```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# O en producción
npm start
```

## 📊 Rutas y Endpoints

### Rutas Públicas (sin autenticación)

#### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión (devuelve JWT)

#### Películas
- `GET /movies` - Listar todas las películas
- `GET /movies?search=...` - Buscar películas por título
- `GET /movies?genre=...&year=...` - Filtrar películas

### Rutas Protegidas (requieren JWT en header Authorization)

#### Autenticación
- `POST /auth/logout` - Cerrar sesión

#### Usuarios
- `GET /users/me` - Obtener perfil del usuario actual

#### Favoritos
- `GET /favorites` - Obtener lista de favoritos del usuario
- `POST /favorites/{movie_id}` - Guardar película como favorita
- `DELETE /favorites/{movie_id}` - Eliminar película de favoritos

#### Administración
- `GET /admin/users` - Listar todos los usuarios
- `DELETE /admin/users/{user_id}` - Eliminar usuario

### Rutas Informativas

- `GET /health` - Estado del gateway
- `GET /info` - Información del gateway y servicios

## 🔐 Seguridad

### JWT (JSON Web Tokens)
Los tokens JWT se esperan en el header `Authorization`:
```
Authorization: Bearer <token>
```

### CORS
El gateway está configurado para aceptar solicitudes desde:
- http://localhost:5173 (Frontend en desarrollo)
- http://localhost:80 (Frontend en producción)

### Middleware de Autenticación
Las rutas protegidas validan automáticamente el token JWT antes de enrutarlo al servicio backend.

## 🔧 Configuración

### Variables de Entorno
```
PORT=8080                                    # Puerto del gateway
USER_SERVICE_URL=http://users:8000           # URL del UserService
MOVIE_SERVICE_URL=http://movies:3001         # URL del MovieService
NODE_ENV=production                          # Entorno
```

## 📝 Ejemplo de Uso

### Registro
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Respuesta: {"access_token": "eyJ..."}
```

### Obtener Películas (público)
```bash
curl http://localhost:8080/movies
```

### Obtener Favoritos (protegido)
```bash
curl http://localhost:8080/favorites \
  -H "Authorization: Bearer eyJ..."
```

## 🛠️ Tecnologías

- **Express.js**: Framework web
- **express-http-proxy**: Proxy inverso
- **jsonwebtoken**: Validación de JWT
- **cors**: Cross-Origin Resource Sharing
- **morgan**: HTTP request logger

## 📖 Dependencias

Ver `package.json` para la lista completa de dependencias.

## 🚨 Troubleshooting

### El gateway no puede conectar con los servicios
- Verifica que UserService y MovieService estén corriendo
- Revisa las URLs en variables de entorno

### CORS errors
- El gateway tiene CORS configurado para localhost
- Para acceder desde otro origen, actualiza `app.use(cors())`

### JWT inválido
- Asegúrate que el token está en formato correcto
- Valida que el token no haya expirado
