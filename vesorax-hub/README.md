# Vesorax Hub · WOTAN

Prototipo funcional para **WOTAN**, un Fjord 38 Xpress (2020) con base en Marina Port Ibiza, operado como *Public Yacht Club*.

Un único archivo (`index.html`) con dos modos que comparten datos:

- **Business Mode · WOTAN CRM & CDP (B2B):** analizador de leads con las reglas del club (solo Ibiza y Formentera, máximo 11 pasajeros con tándem de 2 barcos a partir de 12, sin pernocta), CDP con 8 clientes simulados y ficha 360º, y simulador del Investment Club (de 1 a 10 barcos).
- **Client Mode · Public Yacht Club (B2C):** plano de asientos en SVG del Fjord 38 Xpress, precios Day Pass 280 € vs VIP 200 €, modal de la membresía VIP (1.200 € / temporada) con calculadora de break-even, Vibe Matchmaker y fichas del barco con fotos que se pueden pegar o subir.

## Cómo abrirlo

Abre `index.html` en cualquier navegador. No hace falta instalar nada; necesita conexión a internet para cargar React, Tailwind y htm desde CDN.

## Notas

- Todos los clientes, leads y cifras de negocio son datos simulados, salvo los del growth audit (184 días vendibles, 1.500–2.000 €/día, comisiones de marketplace del 23–26 %).
- La velocidad máxima del barco está pendiente de confirmar con el propietario.
- Fuera de claude.ai, "Process with AI" usa el motor de reglas integrado, y las fotos se guardan solo en el navegador.
