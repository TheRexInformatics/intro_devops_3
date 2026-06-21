# SmartLogix - Sistema de Gestión Logística

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│                 localhost:5173                        │
│  Login │ Dashboard │ Tienda │ Pedidos │ Inventario   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP + JWT
                       ▼
┌─────────────────────────────────────────────────────┐
│               API Gateway (Spring Boot)              │
│                 localhost:8080                       │
│  Proxy Controller │ JWT Filter │ CORS Config         │
└──┬─────────┬──────────┬──────────┬──────────┬───────┘
   │         │          │          │          │
   ▼         ▼          ▼          ▼          ▼
┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────┐
│ Auth │ │  BFF │ │Inventario│ │ Pedidos  │ │Envios│
│:8085 │ │:8084 │ │  :8081   │ │  :8082   │ │:8083 │
└──┬───┘ └──┬───┘ └────┬─────┘ └────┬─────┘ └──┬───┘
   │        │           │            │           │
   │        │           └─────┬──────┘           │
   │        │        Feign/RestTemplate         │
   │        │                                    │
   ▼        ▼           ▼            ▼           ▼
┌─────────────────────────────────────────────────────┐
│              Neon PostgreSQL (Cloud)                │
│   usuarios │ productos │ stocks │ pedidos │ envios   │
└─────────────────────────────────────────────────────┘
```

## Microservicios

| Servicio | Puerto | Descripción | BD |
|---|---|---|---|
| **api-gateway** | 8080 | Proxy + JWT + CORS | No |
| **auth-service** | 8085 | Login/Register (JPA) | Neon (usuarios) |
| **bff-service** | 8084 | KPIs y Dashboard | No |
| **inventario-service** | 8081 | Productos y Stocks | Neon (productos, stocks) |
| **pedidos-service** | 8082 | Pedidos con Saga Pattern | Neon (pedidos) |
| **envios-service** | 8083 | Envíos con tracking | Neon (envios) |

## Stack Tecnológico

### Backend
- **Java 17** / **Spring Boot 4.0.4** / **Spring Framework 7.0.6**
- **Spring MVC** (Servlet)
- **Spring Data JPA** + Hibernate
- **PostgreSQL** (Neon Cloud)
- **JSON Web Token** (jjwt 0.11.5)
- **OpenAPI / Swagger** (springdoc 2.5.0)
- **Docker** + Docker Compose

### Frontend
- **React 19.2.5** / **Vite 8.0.9**
- **Tailwind CSS 4.2.4**
- **Vitest** + React Testing Library
- **Context API** (CartContext)
- **Role-based UI** (Admin / Cliente)

## Patrones de Diseño

| Patrón | Ubicación | Descripción |
|---|---|---|
| **API Gateway** | `api-gateway` | Punto único de entrada con proxy |
| **BFF (Backend for Frontend)** | `bff-service` | Agrega datos de múltiples servicios |
| **Saga Pattern** | `pedidos-service` | Orquestación con compensación |
| **Feign/RestTemplate** | `bff-service`, `pedidos-service` | Comunicación entre servicios |
| **Global Exception Handler** | Todos los servicios | Manejo centralizado de errores |

## Estados del Saga (Pedidos)

```
Nuevo → PROCESADO ──→ [Completar] → COMPLETADO
           │
           └────→ [Cancelar] → CANCELLED (restaura stock)
```

## Flujo de Envíos

```
PREPARACION → EN_TRANSITO → ENTREGADO
```

## Roles de Usuario

| Rol | Menú | Acceso |
|---|---|---|
| **ROLE_ADMIN** | Dashboard, Inventario, Pedidos, Envíos | Gestión completa |
| **ROLE_CLIENTE** | Tienda, Mis Pedidos | Compras propias |

## API Endpoints

### Auth Service (`/auth`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/login` | No | Login con JWT |
| POST | `/auth/register` | No | Registrar usuario |

### Inventario Service (`/api`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/productos` | JWT | Listar productos |
| POST | `/api/productos` | JWT | Crear producto |
| GET | `/api/stocks` | JWT | Listar stocks |
| POST | `/api/stocks/entrada` | JWT | Agregar stock |
| POST | `/api/stocks/salida` | JWT | Reducir stock |

### Pedidos Service (`/api`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/pedidos` | JWT | Listar pedidos |
| POST | `/api/pedidos` | JWT | Crear pedido (Saga) |
| GET | `/api/pedidos/{id}` | JWT | Detalle pedido |
| PUT | `/api/pedidos/{id}/completar` | JWT | Completar saga |
| PUT | `/api/pedidos/{id}/compensar` | JWT | Cancelar (restaura stock) |

### Envíos Service (`/api`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/envios/pedido/{id}` | JWT | Crear envío |
| GET | `/api/envios/pedido/{id}` | JWT | Consultar envío |
| PUT | `/api/envios/{id}/estado` | JWT | Actualizar estado |

### BFF Service (`/api`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/bff/kpis` | JWT | KPIs consolidados |
| GET | `/api/bff/dashboard` | JWT | Dashboard completo |

## Swagger UI

| Servicio | URL |
|---|---|
| bff-service | http://localhost:8084/swagger-ui.html |
| inventario-service | http://localhost:8081/swagger-ui.html |
| pedidos-service | http://localhost:8082/swagger-ui.html |
| envios-service | http://localhost:8083/swagger-ui.html |

## Ejecución

### Docker Compose
```bash
docker compose up --build -d
```

### Frontend
```bash
cd frontend-smartlogix
npm install
npm run dev
```

### Tests
```bash
# Backend (por servicio)
cd <service> && ./mvnw test

# Frontend
cd frontend-smartlogix && npm test
```

### Credenciales por defecto

| Usuario | Password | Rol |
|---|---|---|
| diego | admin123 | ROLE_ADMIN |
| cliente | 1234 | ROLE_CLIENTE |

## Variables de Entorno (`.env`)

```env
JWT_SECRET=SmartLogixSecretKeyUltraSegura2026ParaDesarrolloLocal
JWT_EXPIRATION=3600000

NEON_INVENTARIO_URL=jdbc:postgresql://host/db
NEON_INVENTARIO_USER=user
NEON_INVENTARIO_PASSWORD=pass

NEON_PEDIDOS_URL=jdbc:postgresql://host/db
NEON_PEDIDOS_USER=user
NEON_PEDIDOS_PASSWORD=pass

NEON_ENVIOS_URL=jdbc:postgresql://host/db
NEON_ENVIOS_USER=user
NEON_ENVIOS_PASSWORD=pass

NEON_AUTH_URL=jdbc:postgresql://host/db
NEON_AUTH_USER=user
NEON_AUTH_PASSWORD=pass

STOCK_ALERT_THRESHOLD=10
```

## Cobertura de Tests

| Componente | Tests |
|---|---|
| auth-service | 3 |
| bff-service | 1 |
| inventario-service | 23 (10 stock, 13 integration) |
| pedidos-service | 5 (3 web + 2 model) |
| envios-service | 8 (6 service + 2 integration) |
| **Frontend (Vitest)** | **40** |
| **Total** | **80** |
