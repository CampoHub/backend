# Especificación de Endpoints de Autenticación

Este documento describe los endpoints disponibles para autenticación en la API.

---

## POST `/api/auth/register`
Registra un nuevo usuario.

- **Body JSON:**
  ```json
  {
    "nombre": "string",
    "correo": "string",
    "contraseña": "string",
    "rol": "string"
  }
  ```
- **Respuestas:**
  - `201 Created`: Usuario creado correctamente.
    ```json
    { "message": "Usuario creado", "user": { ... } }
    ```
  - `400 Bad Request`: El correo ya está registrado.
  - `500 Internal Server Error`: Error en registro.

---

## POST `/api/auth/login`
Inicia sesión y devuelve un token JWT.

- **Body JSON:**
  ```json
  {
    "correo": "string",
    "contraseña": "string"
  }
  ```
- **Respuestas:**
  - `200 OK`: Login exitoso, retorna token.
    ```json
    { "message": "Login exitoso", "token": "..." }
    ```
  - `404 Not Found`: Usuario no encontrado.
  - `401 Unauthorized`: Contraseña incorrecta.
  - `500 Internal Server Error`: Error en login.

---

## GET `/api/auth/profile`
Devuelve el perfil del usuario autenticado.

- **Headers:**
  - `Authorization: Bearer <token>`
- **Respuestas:**
  - `200 OK`: Datos del usuario.
    ```json
    {
      "id": 1,
      "nombre": "...",
      "correo": "...",
      "rol": "...",
      "is_active": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```
  - `401 Unauthorized`: Token inválido o ausente.
  - `500 Internal Server Error`: Error obteniendo perfil.

---

> Todos los endpoints devuelven respuestas en formato JSON.
