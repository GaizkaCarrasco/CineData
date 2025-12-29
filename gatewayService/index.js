const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;

// URLs de los servicios backend
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8000';
const MOVIE_SERVICE_URL = process.env.MOVIE_SERVICE_URL || 'http://localhost:3001';

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// ==================== MIDDLEWARE DE AUTENTICACIÓN ====================

const authMiddleware = (req, res, next) => {
    // Las rutas públicas no necesitan autenticación
    const publicRoutes = [
        '/auth/register', 
        '/auth/login', 
        '/api/movies'
    ];
    
    // Verificar si es una ruta pública
    if (publicRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }
    
    // Permitir GET a /movies sin autenticación
    if (req.path.startsWith('/movies') && req.method === 'GET') {
        return next();
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    try {
        // Validar que el token tenga un formato válido (sin validar la firma aquí)
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Error al validar token' });
    }
};

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        gateway: 'API Gateway v1.0'
    });
});

// ==================== INFORMACIÓN DEL GATEWAY ====================

app.get('/info', (req, res) => {
    res.json({
        name: 'CineData API Gateway',
        version: '1.0.0',
        services: {
            userService: USER_SERVICE_URL,
            movieService: MOVIE_SERVICE_URL
        },
        endpoints: {
            auth: '/auth/*',
            users: '/users/*',
            movies: '/movies/*',
            favorites: '/favorites/*',
            admin: '/admin/*'
        },
        documentation: 'http://localhost:8000/docs'
    });
});

// ==================== REDIRECCIÓN A DOCUMENTACIÓN ====================

app.get('/docs', (req, res) => {
    res.redirect('http://localhost:8000/docs');
});

// ==================== RUTAS PÚBLICAS (Sin autenticación) ====================

// Autenticación: Registro y Login (específicamente)
app.post('/auth/register', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/users/register`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

app.post('/auth/login', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/users/login`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// Películas: Listado público
app.use('/movies', proxy(MOVIE_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/movies${req.url}`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// Admin: Ruta pública para crear admin (sin autenticación)
app.post('/admin/open-create-admin', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/admin/open-create-admin`;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// ==================== RUTAS PROTEGIDAS (Con autenticación) ====================

// Aplicar middleware de autenticación a todas las rutas protegidas
app.use('/users', authMiddleware);
app.use('/favorites', authMiddleware);
app.use('/admin', authMiddleware);

// Usuarios: Perfil, favoritos, etc.
app.use('/users', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/users${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Pasar el token al servicio backend
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// Favoritos: Alias para /users/favorites
app.use('/favorites', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/users/favorites${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// Admin: Panel administrativo (rutas protegidas)
app.use('/admin', proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
        return `/admin${req.url}`;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if (srcReq.headers.authorization) {
            proxyReqOpts.headers['Authorization'] = srcReq.headers.authorization;
        }
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        userRes.header('X-Proxied-By', 'CineData Gateway');
        return proxyResData;
    }
}));

// ==================== MANEJO DE ERRORES ====================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor',
        timestamp: new Date()
    });
});

// ==================== RUTAS NO ENCONTRADAS ====================

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

// ==================== SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`\n🚀 API Gateway ejecutándose en puerto ${PORT}`);
    console.log(`📍 User Service: ${USER_SERVICE_URL}`);
    console.log(`📍 Movie Service: ${MOVIE_SERVICE_URL}`);
    console.log(`\n📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`📋 Info: http://localhost:${PORT}/info\n`);
});
