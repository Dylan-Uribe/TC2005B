# Proyecto: Consumo de la API de Dragon Ball

Este proyecto es una pequeña aplicación web que consume la [API pública de Dragon Ball](https://dragonball-api.com/api/characters) para mostrar información de personajes de la serie. Permite buscar personajes por nombre y navegar entre páginas de resultados usando paginación.

Con documentación: https://web.dragonball-api.com/documentation

## Estructura principal
- **Api/assets/api.js**: Función genérica para hacer peticiones a la API.
- **Api/assets/characters.js**: Funciones para obtener, renderizar personajes y manejar la paginación.
- **Api/assets/main.js**: Lógica principal para cargar personajes y manejar eventos de búsqueda.
- **Api/pages/index.html**: Página principal con el buscador y el contenedor de personajes.
- **Api/styles/main.css**: Estilos para la interfaz.

## Paginación
Para la paginación, se utilizan los objetos `links` y `meta` que ya provee la respuesta de la API. Estos objetos contienen las URLs para navegar entre páginas (primera, anterior, siguiente, última) y la información de la página actual y total de páginas. Así, no es necesario construir manualmente las URLs de paginación, sino que se usan directamente las que la API retorna.

## Uso
1. Abre `Api/pages/index.html` en tu navegador.
2. Utiliza la barra de búsqueda para filtrar personajes por nombre.
3. Navega entre páginas usando los botones de paginación.

---

Este proyecto es un ejemplo sencillo de consumo de APIs REST y manejo de paginación en el frontend usando JavaScript.
