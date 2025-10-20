# Movies API

## Alcance
Esta API permite gestionar usuarios, autenticarse mediante tokens, cerrar sesi�n (logout), buscar pel�culas utilizando la API externa de The Movie Database (TMDB) y administrar una lista personal de pel�culas favoritas.  
El sistema mantiene la informaci�n en archivos locales en formato JSON y expone endpoints REST para registrar usuarios, iniciar y cerrar sesi�n, buscar pel�culas, y agregar o eliminar favoritos. Est� dise�ada para ser clara, modular y f�cilmente extensible a futuro.

---

## Especificaci�n de la API

| M�todo | Endpoint | Autenticaci�n | Descripci�n | C�digos de estado |
|--------|-----------|----------------|--------------|-------------------|
| **POST** | `/api/users` | No | Registra un nuevo usuario. | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **POST** | `/api/auth` | No | Inicia sesi�n y devuelve un token. | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **DELETE** | `/api/auth` | S� | Cierra la sesi�n del usuario autenticado. | `204 No Content`, `401 Unauthorized` |
| **GET** | `/api/movies` | S� | Busca pel�culas por t�tulo o devuelve las m�s populares. | `200 OK`, `400 Bad Request` |
| **GET** | `/api/favorites` | S� | Devuelve las pel�culas favoritas del usuario. | `200 OK` |
| **POST** | `/api/favorites` | S� | Agrega una pel�cula a favoritos. | `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| **DELETE** | `/api/favorites/:id` | S� | Elimina una pel�cula de favoritos. | `204 No Content`, `404 Not Found` |

**Headers:**  
`Authorization: Bearer <token>` (cuando es requerido)  
`Content-Type: application/json` (en requests con cuerpo)

---

#  Decisiones de dise�o
La aplicaci�n fue desarrollada siguiendo una **arquitectura en tres capas**:  
- **Web API:** contiene las rutas, controladores y middlewares (manejo de errores, autenticaci�n, parsing de JSON).  
- **Business Logic:** concentra la l�gica del dominio, entidades, validaciones y errores customizados.
- **Data Access:** maneja la persistencia mediante repositorios basados en archivos `.txt` con contenido JSON.  

Las dependencias entre capas se resuelven mediante **inyecci�n de dependencias manual**, utilizando *factory functions* que permiten construir cada servicio con sus repositorios y controladores asociados.  
Gracias a este enfoque desacoplado, el sistema es **extensible y f�cilmente adaptable**: en el futuro podr�a sustituirse la capa de persistencia por una base de datos real sin modificar la l�gica de negocio ni los controladores.

---

## Manejo de errores
La API cuenta con una jerarqu�a de clases de error basada en `AppError`, de la cual heredan errores m�s espec�ficos como `BadRequestError`, `UnauthorizedError`, `NotFoundError` y `ConflictError`.  
Cada uno define un c�digo de estado y un mensaje asociado, permitiendo mantener respuestas consistentes en toda la aplicaci�n.  
El **middleware global de manejo de errores** centraliza su tratamiento, devolviendo siempre un objeto JSON con la estructura `{ error, code }`.  
Adem�s, se captura autom�ticamente el caso de **JSON inv�lido** en el cuerpo de la request y se responde con `400 Bad Request`.

---

## Autenticaci�n
El proceso de autenticaci�n se realiza mediante **tokens Bearer**.  
Al iniciar sesi�n, el servidor genera un token �nico y lo asocia al usuario en una lista de sesiones persistida en archivo.  
El middleware de autenticaci�n valida el token en cada request protegida y, si es v�lido, permite el acceso agregando la informaci�n del usuario al contexto de la petici�n.  
Al cerrar sesi�n, la sesi�n correspondiente se elimina, invalidando el token.

---

## Integraci�n con TMDB
La API se integra con el servicio externo **The Movie Database (TMDB)** para obtener pel�culas y sus detalles.  
Se utiliza una API Key configurada en el archivo `.env` (`TMDB_API_KEY`) y las respuestas se adaptan a un formato m�s simple antes de ser devueltas al cliente.

---

## Variables de entorno
- `PORT`: puerto del servidor (por defecto 3000)  
- `TMDB_API_KEY`: clave de acceso para la API de TMDB

---
## Tecnolog�as utilizadas
La API fue desarrollada utilizando **Node.js** y **Express**, con JavaScript como lenguaje principal.

---

## Colecci�n de Postman
Se incluye en la carpeta `/coleccionPostan` el archivo **`Movies_API_challenge_postman_collection-paula.json`**, con todas las requests organizadas para probar la API.

