# ⌨️ KeyboardStore — E-Commerce de Teclados Mecánicos & Custom

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.16-blue.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-Turso%20Cloud%20%2F%20SQLite-cyan.svg)](https://turso.tech)
[![Storage](https://img.shields.io/badge/CDN-Cloudinary-orange.svg)](https://cloudinary.com)
[![Deployment](https://img.shields.io/badge/Deploy-Render-purple.svg)](https://render.com)

**KeyboardStore** es una aplicación web full-stack de comercio electrónico enfocada en teclados mecánicos, custom, switches y accesorios. Cuenta con una interfaz moderna y dinámica con estética Cyberpunk/Dark, animación mecanografiada (typing effect) en la búsqueda, carrito de compras en tiempo real, pasarela de pago integrada y un panel de administración completo.

---

## ✨ Características Principales

### 🛍️ Experiencia del Cliente
* **Catálogo Interactivo con Búsqueda en Tiempo Real:** Filtrado dinámico de productos por categoría y barra de búsqueda en vivo.
* **Efecto Typing / Mecanografiado:** Al buscar o cuando un filtro no produce resultados, aparece una interfaz animada tipo teclado escribiendo letra por letra.
* **Carrito y Checkout:** Sistema de carrito persistente con cálculo automático de totales y procesamiento de pagos con pasarela cifrada (Bearer Token JWT).
* **Autenticación y Perfil:** Registro de clientes, inicio de sesión seguro y recuperación de contraseña vía correo electrónico (`Nodemailer` + SMTP).
* **Diseño 100% Responsive & Favicon Custom:** Adaptado para dispositivos móviles, tablets y ordenadores con iconografía vectorial personalizada.

### 🛠️ Panel de Administración (`/admin/login`)
* **Dashboard Estadístico:** Métricas en tiempo real de productos, ventas, usuarios registrados y volumen de inventario.
* **Gestión CRUD Completa:**
  * 📦 **Productos:** Crear, editar, listar y eliminar teclados y accesorios.
  * 📂 **Categorías:** Control de taxonomías y organización del catálogo.
  * 🖼️ **Imágenes & CDN:** Subida de imágenes vía **Drag & Drop** o URL externa directamente a la CDN de **Cloudinary** con resize automático.
  * 👥 **Clientes:** Inspección de usuarios registrados y roles.

---

## ☁️ Arquitectura e Infraestructura en la Nube

Para garantizar rendimiento y **persistencia total sin pérdida de datos** en servidores gratuitos como Render:

| Componente | Servicio / Tecnología | Descripción |
| :--- | :--- | :--- |
| **Imágenes & Media** | **Cloudinary CDN** | Carga ultra rápida y optimización de imágenes programática. |
| **Base de Datos** | **Turso Cloud (LibSQL)** | SQLite distribuido en la nube. Persistencia 24/7 sin reseteos al reiniciar el servidor. Fallback automático a SQLite local (`sql.js`). |
| **Hosting & Deploy** | **Render / Docker** | Despliegue automatizado mediante `render.yaml`. |

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js, EJS Template Engine.
* **Base de Datos:** Turso Cloud (`@libsql/client`), SQLite (`sql.js`).
* **Storage:** Cloudinary, Multer, Multer Storage Cloudinary.
* **Seguridad:** `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser`, `express-session`.
* **Comunicaciones:** `nodemailer` (SMTP).
* **Peticiones HTTP:** `axios`.

---

## 📂 Estructura del Proyecto

```text
P3_30703855/
├── config/
│   └── cloudinary.js        # Configuración del SDK de Cloudinary y Multer Storage
├── controllers/
│   ├── admin/               # Controladores del Panel de Administración (auth, productos, categorías, imágenes)
│   └── client/              # Controladores de la Tienda (catálogo, carrito, usuarios, pasarela de pago)
├── db/
│   ├── connection.js        # Adaptador de Base de Datos Híbrido (Turso Cloud / SQLite local)
│   ├── database.sqlite      # Base de datos local de respaldo
│   └── models.js            # Modelo de consultas SQL (usuarios, productos, categorías, compras, imágenes)
├── public/
│   ├── favicon.jpg / svg    # Favicons del proyecto
│   └── stylesheets/         # Hojas de estilo modulares (common, client, admin)
├── routes/
│   ├── adminRoutes.js       # Rutas administrativas (/admin)
│   ├── clientRoutes.js      # Rutas del cliente (/)
│   └── index.js             # Enrutador principal
├── views/
│   ├── admin/               # Vistas EJS del panel de administración
│   ├── client/              # Vistas EJS de la tienda y autenticación del cliente
│   └── partials/            # Componentes reutilizables (header, navbar, footer, productCard)
├── .env                     # Variables de entorno (ignorado en Git)
├── Dockerfile               # Configuración de contenedor Docker
├── render.yaml              # Blueprint de despliegue para Render
├── app.js                   # Configuración del servidor Express
└── package.json             # Dependencias del proyecto
```

---

## 🚀 Instalación y Configuración Local

### 1. Prerrequisitos
* **Node.js** v18 o superior.
* **pnpm** (o `npm`).

### 2. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/luigi1501/P3_30703855.git
cd P3_30703855
pnpm install
```

### 3. Configurar las Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente plantilla:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=supersecret_keyboards_store_session_key_2026!
ADMIN_USER=admin
ADMIN_PASS=12345

# Credenciales de Pasarela de Pago
PAYMENT_BEARER_TOKEN=tu_bearer_token_aqui
PAYMENT_API_URL=https://fakepayment.onrender.com/payments

# Credenciales de Cloudinary
CLOUDINARY_CLOUD_NAME=wqh4mkgz
CLOUDINARY_API_KEY=296891529276353
CLOUDINARY_API_SECRET=tu_cloudinary_secret

# Credenciales de Turso Cloud DB (Base de Datos Persistente)
TURSO_DATABASE_URL=libsql://keyboardstore-luigi1501.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=tu_turso_auth_token

# Servidor de Correo (Nodemailer)
EMAIL=keyboardsstore@gmail.com
PASS=password_email_secret
HOST=smtp.gmail.com
```

### 4. Ejecutar en Modo Desarrollo
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 🌐 Despliegue en Render

El proyecto incluye un archivo `render.yaml` listo para despliegue automático en **Render**:

1. Conecta tu repositorio de GitHub en [Render Dashboard](https://dashboard.render.com).
2. Selecciona **Blueprint** para que Render configure los parámetros según `render.yaml`.
3. Configura las **Environment Variables** en el panel de Render (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_USER`, `ADMIN_PASS`, `PAYMENT_BEARER_TOKEN`).
4. ¡Haz clic en **Deploy**! 🎉

---

## 🔑 Credenciales de Prueba por Defecto

* **Panel de Administración (`/admin/login`):**
  * **Usuario:** `admin`
  * **Contraseña:** `12345`

---

## 📜 Licencia

Desarrollado como proyecto académico de E-Commerce Full-Stack.
