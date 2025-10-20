# Movies API

## Alcance
Esta API permite gestionar usuarios, autenticarse mediante tokens, cerrar sesión (logout), buscar películas utilizando la API externa de The Movie Database (TMDB) y administrar una lista personal de películas favoritas.  
El sistema mantiene la información en archivos locales en formato JSON y expone endpoints REST para registrar usuarios, iniciar y cerrar sesión, buscar películas, y agregar o eliminar favoritos. Está diseñada para ser clara, modular y fácilmente extensible a futuro.

---

## Especificación de la API

| Método | Endpoint | Autenticación | Descripción | Body (JSON) | Códigos de estado |
|--------|-----------|----------------|--------------|--------------|-------------------|
| **POST** | `/api/users` | No | Registra un nuevo usuario. | `{ "email": "user@example.com", "firstName": "Ana", "lastName": "Pérez", "password": "1234" }` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **POST** | `/api/auth` | No | Inicia sesión y devuelve un token. | `{ "email": "user@example.com", "password": "1234" }` | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **DELETE** | `/api/auth` | Sí | Cierra la sesión del usuario autenticado. | — | `204 No Content`, `401 Unauthorized` |
| **GET** | `/api/movies` | Sí | Busca películas por título (`?query=`) o devuelve las más populares. | — | `200 OK`, `400 Bad Request` |
| **GET** | `/api/favorites` | Sí | Devuelve las películas favoritas del usuario. | — | `200 OK` |
| **POST** | `/api/favorites` | Sí | Agrega una película a favoritos. | `{ "movieId": "12345" }` | `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| **DELETE** | `/api/favorites/:id` | Sí | Elimina una película de favoritos. | — | `204 No Content`, `404 Not Found` |

**Headers:**  
`Authorization: Bearer <token>` (cuando es requerido)  
`Content-Type: application/json` (en requests con cuerpo)

---

# Decisiones de diseño
La aplicación fue desarrollada siguiendo una **arquitectura en tres capas**:

- **Web API:** actúa como punto de acceso a la aplicación, manejando las peticiones HTTP a través de rutas, controladores y middlewares (manejo de errores, autenticación y parsing de JSON).  
- **Business Logic:** concentra la lógica del dominio, las entidades, validaciones y errores customizados.  
- **Data Access:** se encarga de la persistencia de datos mediante repositorios basados en archivos `.txt` con contenido JSON.  

Cada capa cumple una responsabilidad específica, lo que garantiza una **alta cohesión interna** (cada módulo se enfoca en una sola tarea) y un **bajo acoplamiento** entre componentes.  
De esta forma, los cambios en una capa no afectan directamente a las demás, manteniendo el código más mantenible y escalable.  

Para conectar estas capas de forma ordenada y evitar dependencias directas, se implementó una **inyección de dependencias manual**, basada en *factory functions* que construyen los servicios junto con sus repositorios y controladores asociados.  
Este mecanismo permite aislar responsabilidades y facilita la sustitución o ampliación de componentes sin alterar el resto del sistema.  

Gracias a este enfoque desacoplado, el sistema es **extensible y fácilmente adaptable**: por ejemplo, la capa de persistencia podría sustituirse por una base de datos real sin modificar la lógica de negocio ni los controladores, permitiendo extender la funcionalidad sin alterar el código existente.

---

## Modelo de dominio
El dominio se modela explícitamente con **entidades** para mantener reglas claras y centralizar la validación:

- **User**: valida campos requeridos al crearse, expone solo datos seguros (`toPublic`) y define un formato de persistencia (`toRecord`). Esto desacopla controladores y servicios de los detalles de almacenamiento y facilita futuros cambios (por ejemplo, encriptar contraseñas).  

- **Favorite**: representa una acción concreta dentro del dominio: cuando un usuario marca una película como favorita.  
  Al modelarlo como entidad, este comportamiento tiene su propio espacio de validación y atributos (`userId`, `movieId`, `addedAt`), en lugar de ser solo una relación o un dato suelto.  
  Esto permite mantener la información de forma consistente y deja abierta la posibilidad de ampliar el concepto en el futuro (por ejemplo, agregar comentarios, puntuaciones o estados como “pendiente de ver”).  

No se definió una entidad `Movie` ya que las películas provienen de una **fuente externa (TMDB)**.  
La API solo las **consume y adapta**, pero no las gestiona dentro del dominio: no se crean, modifican ni almacenan de forma local, por lo que no es necesario modelarlas como parte del núcleo de la aplicación.

Este enfoque mantiene **alta cohesión** (cada entidad se ocupa de sus reglas) y **bajo acoplamiento** (los controladores no dependen del formato de almacenamiento), permitiendo evolucionar el sistema sin romper otras capas.

---

## Manejo de errores
La API cuenta con una jerarquía de clases de error basada en `AppError`, de la cual heredan errores más específicos como `BadRequestError`, `UnauthorizedError`, `NotFoundError` y `ConflictError`.  
Cada uno define un código de estado y un mensaje asociado, manteniendo respuestas consistentes en toda la aplicación.  
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
Se incluye en la carpeta `/coleccionPostman` el archivo **`Movies_API_challenge_postman_collection-paula.json`**, con todas las requests organizadas para probar la API.
