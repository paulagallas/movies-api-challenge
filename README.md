# Movies API

## Alcance
Esta API permite gestionar usuarios, autenticarse mediante tokens, cerrar sesi�n (logout), buscar pel�culas utilizando la API externa de The Movie Database (TMDB) y administrar una lista personal de pel�culas favoritas.  
El sistema mantiene la informaci�n en archivos locales en formato JSON y expone endpoints REST para registrar usuarios, iniciar y cerrar sesi�n, buscar pel�culas, y agregar o eliminar favoritos. Est� dise�ada para ser clara, modular y f�cilmente extensible a futuro.

---

## Especificaci�n de la API

| M�todo | Endpoint | Autenticaci�n | Descripci�n | Body (JSON) | C�digos de estado |
|--------|-----------|----------------|--------------|--------------|-------------------|
| **POST** | `/api/users` | No | Registra un nuevo usuario. | `{ "email": "user@example.com", "firstName": "Ana", "lastName": "P�rez", "password": "1234" }` | `201 Created`, `400 Bad Request`, `409 Conflict` |
| **POST** | `/api/auth` | No | Inicia sesi�n y devuelve un token. | `{ "email": "user@example.com", "password": "1234" }` | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| **DELETE** | `/api/auth` | S� | Cierra la sesi�n del usuario autenticado. | � | `204 No Content`, `401 Unauthorized` |
| **GET** | `/api/movies` | S� | Busca pel�culas por t�tulo (`?query=`) o devuelve las m�s populares. | � | `200 OK`, `400 Bad Request` |
| **GET** | `/api/favorites` | S� | Devuelve las pel�culas favoritas del usuario. | � | `200 OK` |
| **POST** | `/api/favorites` | S� | Agrega una pel�cula a favoritos. | `{ "movieId": "12345" }` | `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| **DELETE** | `/api/favorites/:id` | S� | Elimina una pel�cula de favoritos. | � | `204 No Content`, `404 Not Found` |

**Headers:**  
`Authorization: Bearer <token>` (cuando es requerido)  
`Content-Type: application/json` (en requests con cuerpo)

---

# Decisiones de dise�o
La aplicaci�n fue desarrollada siguiendo una **arquitectura en tres capas**:

- **Web API:** act�a como punto de acceso a la aplicaci�n, manejando las peticiones HTTP a trav�s de rutas, controladores y middlewares (manejo de errores, autenticaci�n y parsing de JSON).  
- **Business Logic:** concentra la l�gica del dominio, las entidades, validaciones y errores customizados.  
- **Data Access:** se encarga de la persistencia de datos mediante repositorios basados en archivos `.txt` con contenido JSON.  

Cada capa cumple una responsabilidad espec�fica, lo que garantiza una **alta cohesi�n interna** (cada m�dulo se enfoca en una sola tarea) y un **bajo acoplamiento** entre componentes.  
De esta forma, los cambios en una capa no afectan directamente a las dem�s, manteniendo el c�digo m�s mantenible y escalable.  

Para conectar estas capas de forma ordenada y evitar dependencias directas, se implement� una **inyecci�n de dependencias manual**, basada en *factory functions* que construyen los servicios junto con sus repositorios y controladores asociados.  
Este mecanismo permite aislar responsabilidades y facilita la sustituci�n o ampliaci�n de componentes sin alterar el resto del sistema.  

Gracias a este enfoque desacoplado, el sistema es **extensible y f�cilmente adaptable**: por ejemplo, la capa de persistencia podr�a sustituirse por una base de datos real sin modificar la l�gica de negocio ni los controladores, permitiendo extender la funcionalidad sin alterar el c�digo existente.

---

## Modelo de dominio
El dominio se modela expl�citamente con **entidades** para mantener reglas claras y centralizar la validaci�n:

- **User**: valida campos requeridos al crearse, expone solo datos seguros (`toPublic`) y define un formato de persistencia (`toRecord`). Esto desacopla controladores y servicios de los detalles de almacenamiento y facilita futuros cambios (por ejemplo, encriptar contrase�as).  

- **Favorite**: representa una acci�n concreta dentro del dominio: cuando un usuario marca una pel�cula como favorita.  
  Al modelarlo como entidad, este comportamiento tiene su propio espacio de validaci�n y atributos (`userId`, `movieId`, `addedAt`), en lugar de ser solo una relaci�n o un dato suelto.  
  Esto permite mantener la informaci�n de forma consistente y deja abierta la posibilidad de ampliar el concepto en el futuro (por ejemplo, agregar comentarios, puntuaciones o estados como �pendiente de ver�).  

No se defini� una entidad `Movie` ya que las pel�culas provienen de una **fuente externa (TMDB)**.  
La API solo las **consume y adapta**, pero no las gestiona dentro del dominio: no se crean, modifican ni almacenan de forma local, por lo que no es necesario modelarlas como parte del n�cleo de la aplicaci�n.

Este enfoque mantiene **alta cohesi�n** (cada entidad se ocupa de sus reglas) y **bajo acoplamiento** (los controladores no dependen del formato de almacenamiento), permitiendo evolucionar el sistema sin romper otras capas.

---

## Manejo de errores
La API cuenta con una jerarqu�a de clases de error basada en `AppError`, de la cual heredan errores m�s espec�ficos como `BadRequestError`, `UnauthorizedError`, `NotFoundError` y `ConflictError`.  
Cada uno define un c�digo de estado y un mensaje asociado, manteniendo respuestas consistentes en toda la aplicaci�n.  
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
Se incluye en la carpeta `/coleccionPostman` el archivo **`Movies_API_challenge_postman_collection-paula.json`**, con todas las requests organizadas para probar la API.
