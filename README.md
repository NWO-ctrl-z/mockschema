# MockSchema

MockSchema es un generador de datos de prueba basado en la web, diseñado para crear sentencias INSERT INTO automáticamente a partir de esquemas de bases de datos relacionales. 

Este proyecto fue desarrollado para agilizar la fase de pruebas en proyectos de bases de datos, permitiendo a los desarrolladores generar grandes volúmenes de datos coherentes sin necesidad de escribirlos manualmente o depender de software de terceros complejo.

## Funcionalidades principales

* Análisis de sentencias SQL: El sistema procesa código CREATE TABLE estándar para identificar automáticamente los nombres de las tablas y sus respectivas columnas.
* Asignación inteligente de datos: Utiliza la librería Faker.js para inferir el tipo de dato necesario basándose en el nombre de la columna (por ejemplo, genera correos electrónicos válidos si la columna contiene la palabra "correo").
* Manejo de llaves foráneas: Identifica columnas que terminan con el sufijo "_id" y les asigna valores numéricos dentro del rango de registros generados, simulando la integridad referencial.
* Soporte bilingüe: Opción para generar los conjuntos de datos en español o inglés.
* Ejecución segura en el cliente: Todo el procesamiento ocurre en el navegador del usuario. Para prevenir problemas de memoria, el sistema incluye un límite estricto de 5000 registros por tabla.

## Tecnologías utilizadas

El proyecto está construido bajo una arquitectura completamente "Client-Side", priorizando la rapidez de desarrollo y la simplicidad de ejecución:

* Frontend: HTML5 y JavaScript puro (Vanilla JS).
* Estilos: Pico.css (framework CSS minimalista).
* Generación de datos: Faker.js (importado mediante módulo ES).
* Despliegue y Hosting: Vercel.

## Instrucciones de uso local

Al no depender de un servidor backend o de Node.js, el proyecto no requiere un proceso de instalación complejo.

1. Clona este repositorio en tu equipo local.
2. Abre el archivo `index.html` directamente en cualquier navegador web moderno.
3. El sistema estará listo para usarse.

## Ejemplo de entrada y salida

Entrada SQL proporcionada por el usuario:
```sql
CREATE TABLE usuarios (
  id INT,
  nombre VARCHAR(50),
  correo VARCHAR(100)
);
```

Salida generada por MockSchema:
```sql
INSERT INTO usuarios (id, nombre, correo) VALUES (1, 'Carlos Martínez', 'cmartinez22@gmail.com');
INSERT INTO usuarios (id, nombre, correo) VALUES (2, 'Ana Rojas', 'ana.rojas@hotmail.com');
```
