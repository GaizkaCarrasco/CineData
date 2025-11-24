# CineData
Proyecto para la asignatura de Web de Datos

# Requisitos previos
Antes de ejecutar el proyecto asegúrate de tener instalado:
Python 3.10+
MongoDB Community Server (modo local)
MongoDB Compass (opcional, para visualizar los datos)
pip actualizado

# Crear un entorno virtual (solo la primera vez)
1. Ir al directorio donde está el proyecto
2. python -m venv venv

# Activar el entorno virtual
1. Ir al directorio donde está el proyecto
2. venv\Scripts\activate
3. Si aparece un error por permisos, abre PowerShell como administrador y ejecuta:
3.1. Set-ExecutionPolicy RemoteSigned
4. Volver a activar el entorno: volver a ejecutar el punto 2.
5. Una vez activado el entorno descargar las dependencias: 
pip install fastapi uvicorn motor passlib[bcrypt] python-jose[cryptography] pydantic[email]
pip install python-multipart

# Ejecución del servicio
1. uvicorn app.main:app --reload

# Cómo iniciar el Frontend
# Requisitos: Debes tener instalado:

Node.js y NPM

# Ubicación del proyecto

El frontend se encuentra en:

frontend/

# Ejecutar por primera vez

# Si acabas de clonar el proyecto o nunca has instalado dependencias:

cd frontend
npm install

# Iniciar el servidor de desarrollo

# Para arrancar el frontend:

cd frontend
npm run dev

Esto iniciará la aplicación en:

http://localhost:5173/

# Detener el servidor

En la terminal donde se esté ejecutando, presiona:

Ctrl + C
