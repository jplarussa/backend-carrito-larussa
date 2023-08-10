# Backend de un E-commerce  - Realizado por Jean Pierre La Russa
 
## Proyecto Final Backend para CoderHouse 

`Proyecto Final` para el curso de Backend de la academia `Coder House` (2023).
Es una `App REST` realizado con NodeJS y Express, con la funcionalidad completa en lo que respecta al Backend (endpoints APIs, routes, controllers, dao, services, database, variables de entorno y logs).
El objetivo de la aplicación está enfocado en el backend, el frontend es principalmente prueba de uso.
La arquitectura del servidor está basada en capas (MVC).

## Descripciones generales
La aplicación contiene:

- Los Endpoints necesarios para listar productos existentes, ingresar productos nuevos, borrar y modificar sus detalles, así como interactuar con el carrito de compras.
- Se implementó un sistema de ingreso autorizado al sistema basado en Passport y JWT (Json Web Token) almacenado en cookies.
- Los productos, usuarios y carritos se almacenan en una base de datos MongoDB. Se hashean los passwords con Bcrypt.
- Se implementó un canal de chat basado en websockets.
- El cliente a traves de variables de entorno puede modificar configuraciones iniciales, credenciales, conexiones y puertos, así como modelos de persistencia. Se utilizó dotenv y commander para ello.


## API RESTFUL - Ecommerce para productos de prueba

- Tecnologías utilizadas:     
    - `NodeJS`
    - `Express`
    - `MongoDB`
    - `Handlebars`
    - `Passport & JWT Token`

## Framework Dependencies
- `Bcrypt para el Hasheo`
- `Mongoose y Mongo Connect para manejo de la DB Mongo`
- `Dotenv para variables de entorno`
- `Passport & JWT Token para Autorización y Autenticación`
- `Socket.io para websocket`


## Deployment 
[https://backend-carrito-larussa-production.up.railway.app/](https://backend-carrito-larussa-production.up.railway.app/)

[https://github.com/jplarussa/backend-carrito-larussa](https://github.com/jplarussa/backend-carrito-larussa)

## Directories
- `/config`
- `/controllers`
- `/dao`
- `/files`
- `/public`
- `/routes`
- `/views`
