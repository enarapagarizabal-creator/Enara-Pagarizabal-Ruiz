# Vesorax Hub · WOTAN

Prototipo funcional para **WOTAN**, un Fjord 38 Xpress (2020) con base en Marina Port Ibiza, operado como *Public Yacht Club*.

Un archivo `index.html` (más las fotos de `img/`) con dos modos que comparten datos:

- **Business Mode · WOTAN CRM & CDP (B2B):** analizador de leads con las reglas del club (solo Ibiza y Formentera, máximo 11 pasajeros con tándem de 2 barcos a partir de 12, sin pernocta), CDP con 8 clientes simulados y ficha 360º, y simulador del Investment Club (de 1 a 10 barcos).
- **Client Mode · Public Yacht Club (B2C):** plano de asientos en SVG del Fjord 38 Xpress, precios Day Pass 280 € vs VIP 200 €, modal de la membresía VIP (1.200 € / temporada) con calculadora de break-even, Vibe Matchmaker y fichas del barco con fotos que se pueden pegar o subir.

## Cómo abrirlo

Abre `index.html` en cualquier navegador. No hace falta instalar nada; necesita conexión a internet para cargar React, Tailwind y htm desde CDN.

## Notas

- Todos los clientes, leads y cifras de negocio son datos simulados, salvo los del growth audit (184 días vendibles, 1.500–2.000 €/día, comisiones de marketplace del 23–26 %).
- Las especificaciones y las 3 fotos (`img/`) vienen del dossier del Fjord 38 Xpress WOTAN.
- Fuera de claude.ai, "Process with AI" usa el motor de reglas integrado, y las fotos se guardan solo en el navegador.

## Historial de versiones

- **29 oct 2026 · v2.0:** versión definitiva con CDP, Investment Club, plano SVG del Fjord 38 Xpress, modal VIP y Vibe Matchmaker.
- **29 oct 2026 · prueba de sincronización:** commit de prueba para comprobar que los cambios llegan a GitHub.
- **29 oct 2026 · v3.0:** precios dinámicos por evento (190–350 € miembro / +40 % day pass), membresía VIP a 2.900 € / temporada con nueva calculadora de break-even, WOTAN AI Concierge (chat local sin API externa), telemetría marina y badges de confianza + acciones Stripe / PDF en la ficha 360º. Specs actualizadas según el dossier: 2 × 300 hp Mercury, 40 kn máx.
