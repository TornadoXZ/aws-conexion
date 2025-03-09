# Sistema de Gestión de Usuarios con AWS

Este proyecto es una API REST para gestionar usuarios con fotos de perfil, utilizando servicios de AWS (EC2, S3 y RDS).

## Requisitos Previos

- Node.js y npm instalados
- Cuenta de AWS con acceso a EC2, S3 y RDS
- MySQL instalado (para desarrollo local)

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
- Copia el archivo `.env.example` a `.env`
- Completa las variables con tus credenciales de AWS y configuración de la base de datos

## Servicios AWS Necesarios

1. **EC2**:
   - Crear una instancia EC2
   - Configurar el grupo de seguridad para permitir el tráfico en el puerto 3000
   - Instalar Node.js en la instancia

2. **S3**:
   - Crear un bucket para almacenar las fotos de perfil
   - Configurar el bucket para acceso público
   - Configurar CORS si es necesario

3. **RDS**:
   - Crear una instancia de RDS MySQL
   - Configurar el grupo de seguridad para permitir conexiones desde EC2
   - Crear la base de datos y usuario necesarios

## Uso

Para iniciar el servidor:
```bash
npm start
```

Para desarrollo:
```bash
npm run dev
```

## Endpoints

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear un nuevo usuario
  - Body: form-data
    - name: string
    - email: string
    - profilePicture: file
- `PUT /api/users/:id` - Actualizar un usuario
- `DELETE /api/users/:id` - Eliminar un usuario

## Seguridad

- Asegúrate de no compartir tus credenciales de AWS
- Configura correctamente los grupos de seguridad
- Utiliza políticas IAM apropiadas
- Mantén las dependencias actualizadas 