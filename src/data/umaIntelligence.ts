/**
 * Intelligent contextual response generator for Uma (offline / API-fallback mode).
 * Ensures Uma always provides articulate, tailored answers about Enara Pagarizabal Ruiz
 * in both Spanish and English, and ALWAYS triggers voice output.
 */

export function generateUmaFallbackReply(userText: string): string {
  const lower = userText.toLowerCase().trim();

  // Detect Spanish vs English
  const isSpanish =
    /[áéíóúñ¿¡]/i.test(userText) ||
    /\b(hola|buenos|buenas|enara|estudia|estudios|idiomas|universidad|deusto|que|quién|quien|donde|dónde|hobbies|equitación|equitacion|caballo|caballos|cv|contacto|telefono|teléfono|correo|deporte|delegada|practicas|prácticas|hacer|cuenta|cuéntame|hablame|háblame)\b/i.test(
      lower
    );

  // Greetings / Introduction / Who are you
  if (
    /\b(hola|buenos d[ií]as|buenas tardes|buenas|hello|hi|hey|who are you|quién eres|quien eres|presentate|preséntate)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "¡Hola! Soy Uma, la representante virtual y asistente de voz de Enara Pagarizabal Ruiz. Puedo hablarte de su Doble Grado en ADE y Digital Business Intelligence en Deusto, su especialización en marketing y experiencia de cliente, su certificación INSIDE LVMH o su disciplina de más de 14 años en equitación con Galope 7. ¿Qué te gustaría saber?"
      : "Hello! I am Uma, Enara Pagarizabal's personal voice representative. I am delighted to speak with you about her background in marketing, her dual degree at Deusto Business School, her INSIDE LVMH certification, or her Galope 7 equestrian athletic discipline. What would you like to explore?";
  }

  // Equestrian / Sports / Discipline / Galope 7
  if (
    /\b(equitaci[oó]n|galope|caballo|caballos|deporte|deportes|atleta|horse|horses|equestrian|riding|sport|sports)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara es amazona federada de equitación desde hace más de 14 años y cuenta con la titulación oficial de Galope 7, el máximo nivel deportivo en España. Esta disciplina de alta exigencia demuestra su constancia, resiliencia emocional, serenidad bajo presión y una gran capacidad de superación diaria."
      : "Enara has been a federated competitive equestrian athlete for over 14 years and holds the official Galope 7 certification, the highest level in Spain. This elite sport reflects her dedication, emotional resilience, poise under pressure, and daily perseverance.";
  }

  // Studies / Degree / University / Deusto Business School / ADE / IDE
  if (
    /\b(estudio|estudios|deusto|ade|ide|universidad|carrera|grado|business school|doble grado|degree|study|studies|university)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara cursa el 4º año del Doble Grado en Administración y Dirección de Empresas (ADE) junto con el Título Propio en Digital Business Intelligence en Deusto Business School en Bilbao. Está especializada en Marketing, analítica digital, gestión de marcas y experiencia de cliente."
      : "Enara is a 4th-year student at Deusto Business School in Bilbao, completing a Double Degree in Business Administration (ADE) and Digital Business Intelligence. She specializes in Brand Strategy, Customer Experience, and Digital Transformation.";
  }

  // Marketing / Brand / LVMH / Luxury / SEO / SEM / Pricing / CX
  if (
    /\b(marketing|lvmh|marca|marcas|brand|branding|cx|consumidor|customer|lujo|luxury|seo|sem|precio|precios|pricing)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara está certificada por el programa INSIDE LVMH en gestión de marcas de lujo, experiencia omnicanal y sostenibilidad. Además, tiene formación avanzada en estrategia de fijación de precios, comportamiento del consumidor y herramientas de marketing digital como SEO, SEM y analítica."
      : "Enara holds the prestigious INSIDE LVMH Certificate focusing on luxury brand management, omnichannel retail journeys, and sustainability. She combines refined brand sensibility with quantitative marketing expertise, SEO/SEM, and customer experience analysis.";
  }

  // Erasmus / EBS / Estonia / Tallinn / International
  if (
    /\b(erasmus|estonia|ebs|tallinn|internacional|international|intercambio|abroad|viaje)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara ha sido seleccionada para el programa Erasmus+ en la prestigiosa Estonian Business School (EBS) en Tallin, Estonia, para 2026. Esta experiencia internacional potencia su perfil en uno de los centros tecnológicos y de emprendimiento digital más punteros de Europa."
      : "Enara was selected for the Erasmus+ scholarship program at the Estonian Business School (EBS) in Tallinn, Estonia, for 2026. This complements her international business profile in one of Europe's top digital and startup innovation hubs.";
  }

  // Languages / Idiomas / English / C1 / Spanish / Basque
  if (
    /\b(idioma|idiomas|ingl[eé]s|español|espanol|euskera|euskara|language|languages|english|spanish|basque|c1|linguaskill)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara tiene un nivel C1 Avanzado de inglés certificado por la Universidad de Deusto mediante Linguaskill, español como lengua materna y nivel intermedio en euskera. Se comunica con total soltura en entornos de trabajo internacionales y bilingües."
      : "Enara is certified at C1 Advanced English by the University of Deusto (Linguaskill), has native Spanish, and intermediate Basque. She communicates effortlessly in international, bilingual corporate environments.";
  }

  // Leadership / Delegate / Volunteering / Delegada
  if (
    /\b(delegada|liderazgo|voluntariado|alimentos|banco|leadership|volunteer|volunteering|subdelegada)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Enara fue elegida democráticamente por sus compañeros como Delegada de curso en 2º y 3º año, y Subdelegada en 1º en Deusto Business School, demostrando empatía y capacidad de negociación. Además, ha sido voluntaria activa en el Banco de Alimentos de Bizkaia."
      : "Enara was elected Class Delegate by her peers for both her 2nd and 3rd academic years, and Sub-delegate in her 1st year at Deusto. She has also served as a volunteer for the Bizkaia Food Bank and supported youth equestrian camps.";
  }

  // Contact / Phone / Email / Location
  if (
    /\b(contacto|email|correo|telefono|tel[eé]fono|contact|phone|llamar|escribir|disponibilidad|cv|curr[ií]culum|curriculum)\b/i.test(
      lower
    )
  ) {
    return isSpanish
      ? "Puedes ponerte en contacto con Enara escribiendo a enara.pagarizabal@opendeusto.es o llamando al +34 651 350 390. Reside en Bilbao y tiene disponibilidad inmediata para incorporarse a puestos de marketing, branding y experiencia de cliente."
      : "You can reach Enara directly via email at enara.pagarizabal@opendeusto.es or by phone at +34 651 350 390. She is based in Bilbao, Spain, with immediate availability for marketing, customer experience, and digital transformation roles.";
  }

  // General fallback
  return isSpanish
    ? "Enara Pagarizabal Ruiz es estudiante de 4º curso del Doble Grado en ADE y Digital Business Intelligence en Deusto Business School, amazona de Galope 7 y titulada por INSIDE LVMH. ¿Te gustaría que te detalle su formación académica, sus certificaciones o sus datos de contacto?"
    : "Enara Pagarizabal Ruiz is a 4th-year student of ADE and Digital Business Intelligence at Deusto Business School, a Galope 7 equestrian athlete, and an INSIDE LVMH certificate holder. Would you like to know more about her marketing projects, academic milestones, or contact details?";
}
