## CineData
Plataforma sencilla con backend FastAPI y frontend React para gestionar usuarios, login y panel de administración.

## Arquitectura
- Backend: FastAPI (JWT), MongoDB (colección `users`, `revoked_tokens`).
- Frontend: React + Vite.
- Auth: login vía `/users/login`, token JWT en localStorage, comprobación de rol; logout revoca token.

## Flujo principal
1) Registro (`/users/register`) o creación de admins (`/admin/open-create-admin`).
2) Login (`/users/login`) devuelve JWT.
3) Frontend guarda el token y consulta `/users/me` para saber rol.
4) Usuarios normales acceden a `/dashboard`; admins a `/admin/users` (ruta protegida).
5) Logout (`/users/logout`) revoca el token y limpia sesión en el cliente.
6) Admin puede borrar usuarios (`DELETE /users/delete/{user_id}`) desde la lista.

## Cómo levantar el proyecto

### Opción A) Sin Docker (desarrollo local)
Backend (requiere Python 3.10+, MongoDB local, pip actualizado):
```powershell
cd userService
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
El API queda en `http://127.0.0.1:8000` con docs en `/docs`.

Frontend (requiere Node.js + npm):
```powershell
cd frontend
npm install
npm run dev
```
La app queda en `http://localhost:5173/`.

### Opción B) Con Docker (backend + frontend juntos)
Requiere Docker Desktop activo. Desde la raíz `CineData`:
```powershell
docker compose up --build
```
Docker construye las imágenes y levanta ambos servicios. Si actualizas dependencias del backend, vuelve a usar `--build`.

## Estructura relevante
- backend: `userService/app` (rutas en `routes/`, auth en `auth.py`, base de datos en `database.py`).
- frontend: `frontend/src` (páginas en `pages/`, componentes en `components/`).

## Notas rápidas
- Token JWT se guarda en `localStorage` como `token`.
- Rutas de admin usan `AdminRoute` para verificar rol antes de renderizar.
- El logout envía el token a `revoked_tokens` y borra el token local.
