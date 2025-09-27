# backend

## Levantar el proyecto

1. **Clona el repositorio y entra a la carpeta:**
	```bash
	git clone https://github.com/CampoHub/backend.git
	cd backend
	```

2. **Copia el archivo `.env` si no existe:**
```bash
    cp .env.example .env
```

3. **Levanta los servicios con Docker Compose:**
	```bash
	docker compose up -d
	```
	Esto levantará la base de datos MySQL y el backend en Node.js.

4. **Instala las dependencias:**
	```bash
	npm install
	```

## 🗄️ Crear la base de datos y las tablas
No necesitas crear la base de datos ni las tablas manualmente. Al correr el seed, Sequelize se encarga de sincronizar el modelo y crear todo automáticamente.

## 🌱 Cargar datos iniciales (seed)

Para crear las tablas y cargar datos de ejemplo ejecuta:

```bash
    docker compose exec backend npm run seed
```

Esto:
- Sincroniza la base de datos (elimina y recrea las tablas)
- Carga usuarios, trabajadores y otros datos de ejemplo

## 🔥 Comandos útiles

- Levantar backend en modo desarrollo:
  ```bash
  docker compose exec backend npm run dev
  ```
- Levantar backend en modo producción:
  ```bash
  docker compose exec backend npm start
  ```

---
Si tienes dudas, revisa los archivos `docker-compose.yml`, `.env` y los scripts en `package.json`.
