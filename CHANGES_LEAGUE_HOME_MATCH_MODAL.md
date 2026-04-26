# Cambios aplicados

## Home / Dashboard
- La página inicial ahora funciona como selector de liga.
- Se muestran las ligas:
  - Liga Senior Femenina
  - Liga Senior 1
  - Liga Senior 2
  - Liga Senior 3 Grupo 1
  - Liga Senior 3 Grupo 2
  - Liga Senior 3 Grupo 3
- En la home no se muestra el menú de navegación.
- Al volver a `/` se pierde visualmente la selección de liga y desaparece el menú.

## Navegación filtrada por liga
- El menú superior solo aparece cuando hay una liga seleccionada.
- El menú muestra claramente la liga seleccionada.
- Los enlaces de Equipos, Jugadores, Porteros y Partidos mantienen `league_key` y `league_name` en query params.
- Cada pestaña sigue filtrando por la liga seleccionada.

## Partidos
- Las tarjetas de partidos ahora son clicables.
- Al clicar un partido se abre un modal con:
  - estado
  - equipos
  - marcador
  - fecha
  - pista
  - liga
  - ID de partido
  - temporada
  - enlace a ficha original si existe

## Responsive / Fondos
- Se mantienen los ajustes anteriores:
  - en móvil la imagen de fondo del equipo queda centrada, más brillante y más pequeña;
  - en desktop se eliminan las imágenes de fondo en tablas de jugadores, porteros y equipos.
