# MiniBlog · Sistema de red social en ES6+

MiniBlog es un proyecto de práctica en JavaScript moderno (ES6+) que implementa un sistema básico de red social / blog:

- Usuarios con seguidores y siguiendo (`Usuario`)
- Publicaciones con IDs auto–incrementales, likes y extractos (`Publicacion`)
- Feed indexado por ID y hashtags (`Feed`)
- Pipeline asíncrono de publicación con Promises (`validarPublicacion`, `moderarContenido`, `guardarEnFeed`)
- Clase orquestadora que integra todo (`MiniBlog`)

El objetivo del proyecto es ejercitar clases modernas, campos privados, `Map`, `Set`, destructuring, `reduce`, `sort` y Promises encadenadas en un mini–sistema coherente.

---

## Estructura del proyecto

Versión modular ES6 (recomendada):

```text
miniblog/
  index.html
  main.js           // Punto de entrada: importa MiniBlog y ejecuta la demo
  MiniBlog.js       // Clase orquestadora
  models/
    Publicacion.js  // Modelo base de publicación
    Usuario.js      // Perfil de usuario con Set de seguidores/siguiendo
  services/
    Feed.js         // Muro de publicaciones (Map + Set)
    pipeline.js     // Funciones de Promises para validar/moderar/guardar
```

Cada archivo exporta su clase o funciones con `export` y se importa donde se necesita con `import { ... } from './ruta'`.

---

## Conceptos practicados

- Clases ES6, campos privados `#` y `static`
- Encapsulación vía getters (`id`, `likes`, `extracto`, `seguidores`, `siguiendo`, `esInfluencer`)
- Herencia y polimorfismo con `extends` y `super.toString()`
- `Map` como índice de publicaciones por ID y contador de frecuencia para hashtags
- `Set` para mantener seguidores y siguiendo únicos, y construir mutualidades
- Métodos encadenables (`darLike()`, `seguir()`, `desactivar()`) retornando `this`
- Promises con `new Promise()`, `setTimeout`, `.then()` encadenados y `.catch()` único
- Destructuring de objetos y uso de `...rest` en constructores
- Organización del código con módulos ES6

---

## Uso (versión módulos ES6)

1. Clona el repositorio y entra a la carpeta del proyecto:

```bash
git clone <URL_DEL_REPO>
cd miniblog
```

2. Asegúrate de que `index.html` carga `main.js` como módulo:

```html
<script type="module" src="main.js"></script>
```

3. Levanta un servidor estático (por ejemplo, con Live Server en VS Code o `npx serve .`):

```bash
npx serve .
```

4. Abre `index.html` en el navegador y revisa la **consola**. Deberías ver:

- Registro de usuarios (`juanpa`, `maria`, `carlos`)
- Conexiones de seguidores mutuos
- Publicaciones realizadas con `blog.publicarPost(...)` usando el pipeline de Promises
- Estadísticas del MiniBlog (usuarios, posts, likes, trending)
- Listado de posts filtrados por hashtag (`blog.explorar('js')`)
- Conteo de seguidores de `juanpa` y uso del método `daLike` (si lo invocas)

---

## API principal

### Clase `MiniBlog`

- `registrar(datosUsuario)`  
  Registra un nuevo usuario `{ nombre, username, bio? }`.  
  Lanza `Error` si el `username` ya existe.

- `publicarPost(username, datosPost)`  
  Crea una `Publicacion` y la pasa por el pipeline:
  `validarPublicacion → moderarContenido → guardarEnFeed`.  
  Devuelve una `Promise`.  
  Rechaza con `Error('Usuario no encontrado')` si el usuario no existe.

- `conectar(usernameA, usernameB)`  
  Hace que A siga a B y B siga a A (mutuo), usando los métodos `seguir` de `Usuario`.

- `explorar(hashtag)`  
  Devuelve las publicaciones del feed filtradas por hashtag.

- `get estadisticas`  
  Devuelve un objeto:
  - `totalUsuarios` — tamaño del `Map` de usuarios  
  - `totalPosts` — total de publicaciones en el `Feed`  
  - `totalLikes` — suma de likes de todas las publicaciones  
  - `trending` — top 3 hashtags del feed (como pares `[tag, count]`)

- `daLike(username, postId)` (desafío extra)  
  Registra un like sobre un post dado y maneja errores con `try/catch` si el usuario o el post no existen.

---

## Pruebas y commits

En la versión modular ES6, la demo principal se ejecuta desde `main.js` y muestra el comportamiento del sistema completo en la consola del navegador cuando se carga `index.html` con `type="module"`.

Si quieres ver todas las pruebas de las **etapas 1 a 5** (Publicacion, PublicacionDestacada, Feed, Usuario, pipeline de Promises) ejecutadas de forma secuencial en un solo archivo, puedes revisar el commit:

- `feat: etapa 5 completada - 188a29c`

En ese commit se encuentran todas las pruebas del proyecto con las clases y funciones definidas en un solo `main.js` antes de modularizar el código.

---

## Notas

- Este proyecto está pensado como ejercicio de fundamentos de JavaScript para desarrollo web moderno, no como producto listo para producción.
- La estructura modular ES6 está pensada para que puedas reutilizar las clases y servicios en proyectos más grandes (por ejemplo, una API con Node.js o una SPA con React/TypeScript).

## Puedes ver el resultado en:

https://zakkdruzer.github.io/mini-blog/
