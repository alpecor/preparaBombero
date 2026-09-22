# Refuerzos

La vista obtiene el catálogo desde `GET /pack` y redirige al checkout de Stripe mediante
`POST /pack/:id/checkout`. El estado de compra procede del backend; no se mantiene propiedad simulada en el
navegador.
