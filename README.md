# Movies API

## Alcance
Esta API permite gestionar usuarios, autenticarse mediante tokens, cerrar sesión (logout), buscar películas utilizando la API externa de The Movie Database (TMDB) y administrar una lista personal de películas favoritas.  
El sistema mantiene la información en archivos locales en formato JSON y expone endpoints REST para registrar usuarios, iniciar y cerrar sesión, buscar películas, y agregar o eliminar favoritos. Está diseñada para ser clara, modular y fácilmente extensible a futuro.

---

## Especificación de la API

| Método | Endpoint | Autenticación | Descripción | Códigos de estado |
|--------|-----------|----------------|--------------|-------------------|
| **POST** | `/api/users` | No | Registra un nuevo usuario. | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **POST** | `/api/auth` | No | Inicia sesión y devuelve un token. | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **DELETE** | `/api/auth` | Sí | Cierra la sesión del usuario autenticado. | `204 No Content`, `401 Unauthorized` |
| **GET** | `/api/movies` | Sí | Busca películas por título o devuelve las más populares. | `200 OK`, `400 Bad Request` |
| **GET** | `/api/favorites` | Sí | Devuelve las películas favoritas del usuario. | `200 OK` |
| **POST** | `/api/favorites` | Sí | Agrega una película a favoritos. | `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| **DELETE** | `/api/favorites/:id` | Sí | Elimina una película de favoritos. | `204 No Content`, `404 Not Found` |

**Headers:**  
`Authorization: Bearer <token>` (cuando es requerido)  
`Content-Type: application/json` (en requests con cuerpo)

---

#  Decisiones de diseño
La aplicación fue desarrollada siguiendo una **arquitectura en tres capas**:  
- **Web API:** contiene las rutas, controladores y middlewares (manejo de errores, autenticación, parsing de JSON).  
- **Business Logic:** concentra la lógica del dominio, entidades, validaciones y errores customizados.
- **Data Access:** maneja la persistencia mediante repositorios basados en archivos `.txt` con contenido JSON.  

Las dependencias entre capas se resuelven mediante **inyección de dependencias manual**, utilizando *factory functions* que permiten construir cada servicio con sus repositorios y controladores asociados.  
Gracias a este enfoque desacoplado, el sistema es **extensible y fácilmente adaptable**: en el futuro podría sustituirse la capa de persistencia por una base de datos real sin modificar la lógica de negocio ni los controladores.

---

## Manejo de errores
La API cuenta con una jerarquía de clases de error basada en `AppError`, de la cual heredan errores más específicos como `BadRequestError`, `UnauthorizedError`, `NotFoundError` y `ConflictError`.  
Cada uno define un código de estado y un mensaje asociado, permitiendo mantener respuestas consistentes en toda la aplicación.  
El **middleware global de manejo de errores** centraliza su tratamiento, devolviendo siempre un objeto JSON con la estructura `{ error, code }`.  
Además, se captura automáticamente el caso de **JSON inválido** en el cuerpo de la request y se responde con `400 Bad Request`.

---

## Autenticación
El proceso de autenticación se realiza mediante **tokens Bearer**.  
Al iniciar sesión, el servidor genera un token único y lo asocia al usuario en una lista de sesiones persistida en archivo.  
El middleware de autenticación valida el token en cada request protegida y, si es válido, permite el acceso agregando la información del usuario al contexto de la petición.  
Al cerrar sesión, la sesión correspondiente se elimina, invalidando el token.

---

## Integración con TMDB
La API se integra con el servicio externo **The Movie Database (TMDB)** para obtener películas y sus detalles.  
Se utiliza una API Key configurada en el archivo `.env` (`TMDB_API_KEY`) y las respuestas se adaptan a un formato más simple antes de ser devueltas al cliente.

---

## Variables de entorno
- `PORT`: puerto del servidor (por defecto 3000)  
- `TMDB_API_KEY`: clave de acceso para la API de TMDB

---
## Tecnologías utilizadas
La API fue desarrollada utilizando **Node.js** y **Express**, con JavaScript como lenguaje principal.

---

## Colección de Postman
Se incluye en la carpeta `/coleccionPostan` el archivo **`Movies_API_challenge_postman_collection-paula.json`**, con todas las requests organizadas para probar la API.

