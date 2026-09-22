# Refuerzos: demostración de frontend

Ruta pública `/refuerzos`, dentro del layout compartido. Datos y precios ficticios procedentes de la maqueta del usuario. El menú usa **Refuerzos**, según su petición, aunque el PDF usa el singular.

## Comportamiento de la demo

- Catálogo de 15 ejemplos. Árbol de 18 entradas (17 comunidades y una agrupación de Ceuta/Melilla), con 50 provincias y las dos ciudades autónomas. Incluye Almería, ausente en la maqueta original.
- Búsqueda sin distinción de mayúsculas ni tildes, combinada con filtros en cascada. Elegir un nivel muestra packs de ese nodo y sus descendientes; los packs de niveles superiores no se duplican en cada provincia o administración.
- Colección inicial: Callejero de Sevilla. La compra simulada añade un pack una sola vez. Todo permanece únicamente en memoria al navegar y se reinicia al recargar o pulsar «Reiniciar demo».
- Dos preguntas ilustrativas por pack para comprobar selección, corrección, explicación y avance. No son el contenido anunciado del pack ni se envían como resultados reales.
- La demo es accesible sin cuenta ni Premium para poder revisar el diseño. No hay Stripe, cobros, almacenamiento de derechos reales, mezcla de preguntas ni cambios al banco oficial.

## Conexión futura

`reinforcements.models.ts` define el contrato de vista: identificador estable, tipo libre, ámbito nullable, número de preguntas, precio en céntimos y bullets. `reinforcements.mock.ts` contiene exclusivamente fixtures. `ReinforcementsService` concentra catálogo, colección, compra y preguntas de muestra: sustituir este adaptador por llamadas cuando se acuerden los endpoints.

1. Leer territorios de la misma fuente que Plan de estudio (`Pdf.community`, `Pdf.city`, `Pdf.type`), usando los valores/identificadores que acuerde el backend. No persistir este árbol de demostración como un segundo catálogo real.
2. Cargar catálogo y propiedad desde el servidor; exigir sesión para compra/práctica y comprobar propiedad también en el backend, sin exigir Premium para practicar packs comprados.
3. Reemplazar `simulatePurchase` por checkout de pago único. El precio y el derecho de acceso deben venir del servidor; no conceder propiedad por un clic o por la URL de retorno. Actualizar colección solo tras confirmación del webhook de Stripe.
4. Sustituir `getDemoQuestions` por preguntas reales del pack y reutilizar la práctica/favoritos del banco existente. Los IDs `demo-*` nunca deben enviarse a esos endpoints.
5. Implementar la mezcla con el banco general únicamente en generación de exámenes personalizados/plan, con Premium + propiedad + coincidencia territorial (incluidos ámbitos superiores). Mantener los exámenes oficiales sin cambios.
6. Quitar el aviso, el reinicio y los textos de demo solo cuando existan catálogo, cobros y derechos reales.

El enlace de contacto es `mailto:`; abrirlo no envía ningún mensaje automáticamente.
