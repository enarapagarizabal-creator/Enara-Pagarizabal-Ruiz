/**
 * Comprehensive bilingual intelligence and Q&A engine for Uma.
 * Handles diverse conversational intents, questions, and variations about
 * Enara Pagarizabal Ruiz so Uma always delivers natural, dynamic spoken answers
 * even when the server API is unreachable or awaiting a Gemini API key.
 */

let lastAnswerIndex = 0;

export function generateUmaFallbackReply(userText: string): string {
  const clean = userText.toLowerCase().trim();

  // Detect language: Spanish vs English
  const isSpanish =
    /[áéíóúñ¿¡]/i.test(userText) ||
    /\b(hola|buenos|buenas|enara|estudia|estudios|idiomas|universidad|deusto|que|qué|quién|quien|donde|dónde|hobbies|aficiones|equitación|equitacion|caballo|caballos|cv|contacto|telefono|teléfono|correo|deporte|delegada|practicas|prácticas|hacer|cuenta|cuéntame|hablame|háblame|por qué|porque|puntos|fuertes|contratar|experiencia|gracias|adiós|adios|hasta luego|interes|intereses)\b/i.test(
      clean
    );

  // 1. GREETING & CASUAL OPENINGS
  if (
    /\b(hola|buenos d[ií]as|buenas tardes|buenas noches|buenas|qu[eé] tal|c[oó]mo est[aá]s|hello|hi|hey|how are you|good morning|good afternoon)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "¡Hola! Qué alegría saludarte. Soy Uma, la asistente y representante personal de Enara Pagarizabal Ruiz. Puedes preguntarme sobre su doble grado en Deusto, su especialización en marketing, su certificación en LVMH o su disciplina en equitación. ¿Por dónde te gustaría empezar?",
      "¡Hola! Encantada de hablar contigo. Estoy aquí para contarte todo sobre el perfil profesional de Enara: sus estudios de ADE y Business Intelligence, su experiencia en marketing y sus logros deportivos con Galope 7. ¿En qué te puedo orientar hoy?",
      "¡Bienvenido! Soy Uma. Conozco en detalle la trayectoria académica, las competencias de marketing y los proyectos de Enara Pagarizabal. Pregúntame lo que necesites, ya sea en español o en inglés."
    ];
    const englishReplies = [
      "Hello! It is wonderful to speak with you. I am Uma, Enara Pagarizabal's personal voice representative. Feel free to ask about her dual degree at Deusto, her marketing specialization, her INSIDE LVMH certificate, or her equestrian background. What would you like to explore?",
      "Hi there! Welcome. I represent Enara Pagarizabal Ruiz. I can share insights into her academic milestones in Bilbao, her quantitative marketing skills, or her competitive sports discipline. How can I help you today?",
      "Hello! I am Uma. Whether you are curious about Enara's business strategy background, international Erasmus exchange in Estonia, or contact details, I am at your service."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 2. WHO IS ENARA / GENERAL OVERVIEW / "CUÉNTAME DE ELLA" / "TELL ME ABOUT HER"
  if (
    /\b(qui[eé]n es|qui[eé]n eres|presenta|presentaci[oó]n|cu[eé]ntame|h[aá]blame de ella|h[aá]blame de enara|sobre enara|resumen|who is|who are you|tell me about|introduce|overview)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara Pagarizabal Ruiz es estudiante de 4º curso del Doble Grado en ADE y Digital Business Intelligence en Deusto Business School en Bilbao. Combina una visión estratégica en marketing y experiencia de cliente con un rigor analítico en datos, complementado con la certificación INSIDE LVMH y más de 14 años de alta disciplina en equitación federada.",
      "Enara es una futura graduada en Administración de Empresas e Inteligencia Digital de Negocios en la Universidad de Deusto. Destaca por su capacidad de liderazgo como Delegada de curso, su dominio de C1 en inglés y su enfoque en estrategias de marca, fijación de precios y transformación omnicanal.",
      "Para resumir su perfil: Enara une la visión analítica de la inteligencia digital con la sensibilidad estética y estratégica del marketing. Además, su trayectoria deportiva de élite con Galope 7 en equitación le otorga una constancia, madurez y capacidad de superación excepcionales."
    ];
    const englishReplies = [
      "Enara Pagarizabal Ruiz is a 4th-year double-degree student at Deusto Business School in Bilbao, completing Business Administration (ADE) and Digital Business Intelligence. She pairs analytical business intelligence with luxury marketing sensibility from INSIDE LVMH, backed by 14 years of competitive equestrian discipline.",
      "Enara is an ambitious, articulate marketing and business analytics candidate from Universidad de Deusto. Elected Class Delegate by her peers and certified C1 in English, she specializes in customer experience, brand strategy, and omnichannel digital transformation.",
      "In short, Enara represents a rare balance of strategic marketing acumen, data fluency, and emotional composure honed through over a decade of elite equestrian sport holding the Galope 7 certification."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 3. WHY HIRE ENARA / STRENGTHS / VALUE / "POR QUÉ CONTRATARLA"
  if (
    /\b(por qu[eé] contratar|por qu[eé] deber[ií]amos|puntos fuertes|fortalezas|por qu[eé] elegirla|valor diferencial|why hire|strengths|why should we hire|qualities|stand out)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara aporta tres grandes fortalezas diferenciales: primero, una sólida doble formación que une la gestión comercial tradicional con la analítica de datos en Deusto; segundo, una alta resiliencia y serenidad bajo presión forjadas en 14 años de equitación de alta competición; y tercero, habilidades contrastadas de comunicación y mediación al haber sido Delegada de curso electa.",
      "Contratar a Enara significa sumar a alguien con iniciativa, capacidad de aprendizaje rápido y una ética de trabajo impecable. Su formación en INSIDE LVMH le da una visión sofisticada del cliente, mientras que sus competencias en ADE y SEO/SEM aseguran resultados medibles y orientados a negocio.",
      "Sus compañeros y profesores destacan en Enara su madurez, su compromiso constante y su facilidad para trabajar en equipo y liderar proyectos complejos con empatía y orden."
    ];
    const englishReplies = [
      "Enara brings three distinct competitive advantages: first, a dual skillset combining business management with digital analytics; second, immense composure and resilience developed over 14 years as an elite equestrian athlete; and third, proven peer leadership as an elected Class Delegate.",
      "Hiring Enara means bringing on a disciplined, proactive professional who understands luxury customer experience from INSIDE LVMH and quantitative performance from Deusto Business School. She adapts quickly and delivers with excellence.",
      "Her key strengths are emotional composure, analytical rigor, and collaborative empathy. She consistently turns complex business challenges into structured, elegant solutions."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 4. EQUESTRIAN / SPORTS / GALOPE 7 / HÍPICA / CABALLOS
  if (
    /\b(equitaci[oó]n|galope|caballo|caballos|h[ií]pica|amazona|deporte|deportes|atleta|horse|horses|equestrian|riding|sport|sports)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara es amazona federada desde hace más de 14 años y tiene la titulación oficial de Galope 7, que es el nivel más alto de competición hípica en España. Este deporte exige una sincronía total, calma bajo máxima tensión y una dedicación diaria innegociable.",
      "La equitación de élite ha moldeado el carácter profesional de Enara: le ha enseñado a gestionar la frustración, a liderar con sensibilidad y firmeza, y a mantener la concentración milimétrica en momentos decisivos.",
      "Con más de 14 años en las pistas y el título de Galope 7, Enara aplica la misma disciplina y empatía que requiere la doma y el salto al entorno empresarial: constancia, preparación rigurosa y respeto mutuo."
    ];
    const englishReplies = [
      "Enara has been a federated competitive equestrian athlete for over 14 years and holds the prestigious Galope 7 certification, the highest official level in Spain. This elite sport demands immense dedication, emotional control, and split-second decision making.",
      "Competing at the highest level of equestrian sports has forged Enara's work ethic: it has taught her daily perseverance, empathy without words, and exceptional composure under pressure.",
      "Her 14-year equestrian career holding Galope 7 directly translates to business: rigorous preparation, calm leadership in challenging situations, and a relentless commitment to excellence."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 5. STUDIES / DEGREE / DEUSTO / ADE / IDE / UNIVERSIDAD
  if (
    /\b(estudio|estudios|deusto|ade|ide|universidad|carrera|grado|doble grado|facultad|business school|asignaturas|degree|study|studies|university|academic)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara está en 4º año del Doble Grado en ADE y Digital Business Intelligence en Deusto Business School (Bilbao). Dentro de ADE ha elegido la intensificación en Marketing, cursando Gestión de marcas y precios, Experiencia del cliente, Dirección de la distribución y Comunicación corporativa.",
      "En la Universidad de Deusto, Enara compagina la administración de empresas con el título en Digital Business Intelligence, donde domina Marketing Digital I y II, SEO, SEM, herramientas analíticas y modelos de negocio en entornos digitales.",
      "Su formación en Deusto Business School se caracteriza por la excelencia académica, el análisis de casos reales de negocio y una sólida base cuantitativa combinada con visión ética y humanista."
    ];
    const englishReplies = [
      "Enara is in her 4th year completing a Double Degree in Business Administration (ADE) and Digital Business Intelligence at Deusto Business School in Bilbao. Her specialization is in Marketing: Brand Strategy, Customer Experience, Distribution, and Corporate PR.",
      "Her academic curriculum at Deusto pairs rigorous financial and strategic business management with digital transformation, advanced SEO/SEM, business analytics, and consumer behavior.",
      "Deusto Business School is renowned for academic prestige and ethical leadership; Enara has stood out both academically and through student representation as Class Delegate."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 6. MARKETING / BRAND / LVMH / LUXURY / CX / PRICING
  if (
    /\b(marketing|lvmh|marca|marcas|brand|branding|cx|consumidor|customer|lujo|luxury|seo|sem|precio|precios|pricing|publicidad|comunicaci[oó]n)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara cuenta con el Certificado oficial INSIDE LVMH obtenido en 2025, donde profundizó en gestión de marcas de lujo, retail omnicanal, diseño de experiencia de cliente y sostenibilidad en el sector premium.",
      "En el área de marketing, Enara domina la fijación estratégica de precios basada en valor, el análisis del comportamiento del consumidor y la ejecución de campañas digitales con SEO, SEM y analítica web.",
      "Su visión del marketing une la sofisticación y el storytelling emocional aprendido con LVMH con la medición cuantitativa del retorno de inversión y la optimización de canales de distribución aprendida en Deusto."
    ];
    const englishReplies = [
      "Enara earned the INSIDE LVMH Certificate in 2025, specializing in luxury brand management, omnichannel client journeys, sustainable craftsmanship, and high-end retail strategy.",
      "Her marketing expertise spans value-based pricing, consumer psychology, omnichannel distribution, and measurable digital growth through SEO, SEM, and performance tracking.",
      "Enara combines aesthetic luxury storytelling inspired by LVMH with data-driven marketing analytics developed during her digital business studies at Deusto."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 7. ERASMUS / ESTONIA / EBS / TALLINN / INTERNATIONAL
  if (
    /\b(erasmus|estonia|ebs|tallinn|tallin|internacional|international|intercambio|abroad|estudiar fuera)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara ha sido seleccionada para realizar su intercambio académico Erasmus+ en la prestigiosa Estonian Business School (EBS) en Tallin (Estonia) para 2026. Tallin es uno de los mayores hubs de tecnología y emprendimiento digital de Europa.",
      "La estancia en Estonian Business School le permitirá profundizar en innovación tecnológica y modelos de negocio digitales en un país pionero como Estonia, enriqueciendo su visión global y multicultural.",
      "Este programa Erasmus+ en EBS reafirma la mentalidad internacional de Enara, su facilidad para desenvolverse en entornos de habla inglesa y su interés en los ecosistemas de startups digitales."
    ];
    const englishReplies = [
      "Enara was awarded an Erasmus+ scholarship to study at the Estonian Business School (EBS) in Tallinn, Estonia, for 2026. Estonia is widely recognized as one of Europe's premier digital tech and startup nations.",
      "Her semester at EBS will immerse her in advanced digital entrepreneurship, European tech ecosystems, and international cross-border collaboration.",
      "This international experience underscores Enara's global adaptability, fluent English capability, and enthusiasm for forward-looking digital economies."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 8. LANGUAGES / IDIOMAS / ENGLISH / C1 / BASQUE / EUSKERA
  if (
    /\b(idioma|idiomas|ingl[eé]s|español|espanol|euskera|euskara|language|languages|english|spanish|basque|c1|linguaskill|biling[uü]e)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara tiene el español como lengua materna, cuenta con un nivel C1 Avanzado de inglés certificado por la Universidad de Deusto mediante Linguaskill, y un nivel intermedio en euskera. Se desenvuelve con total fluidez en reuniones y presentaciones en inglés.",
      "Su competencia lingüística es sobresaliente: domina el inglés C1 para negociaciones y análisis corporativos, y puede trabajar cómodamente en equipos multinacionales o bilingües.",
      "Enara puede mantener conversaciones de negocios tanto en inglés como en español con absoluta naturalidad, precisión técnica y corrección formal."
    ];
    const englishReplies = [
      "Enara is a native Spanish speaker with a certified C1 Advanced English level from Universidad de Deusto (Linguaskill), alongside intermediate Basque proficiency.",
      "She is entirely comfortable conducting business presentations, negotiations, and client meetings in both English and Spanish.",
      "Her bilingual fluency allows her to bridge local Spanish and global European markets with confidence and clarity."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 9. LEADERSHIP / CLASS DELEGATE / VOLUNTEERING / VALORES
  if (
    /\b(delegada|liderazgo|subdelegada|alimentos|voluntariado|banco|compañeros|valores|leadership|volunteer|volunteering|class delegate)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara fue elegida por sus compañeros de universidad como Delegada de curso para 2º y 3º año, y Subdelegada en 1º en Deusto. Esto demuestra la enorme confianza que genera, su habilidad para mediar conflictos y su capacidad de defender los intereses del grupo ante el decanato.",
      "En el plano social, ha sido voluntaria en el Banco de Alimentos de Bizkaia y monitora de apoyo en campamentos ecuestres infantiles, lo que refleja su empatía, generosidad y compromiso activo con la comunidad.",
      "Su liderazgo se basa en la escucha activa, la transparencia y el ejemplo: sabe coordinar equipos diversos manteniendo siempre un ambiente positivo y constructivo."
    ];
    const englishReplies = [
      "Enara was elected Class Delegate by her peers for her 2nd and 3rd academic years, as well as Sub-delegate for her 1st year at Deusto. This demonstrates her trustworthiness, negotiation skills, and ability to represent complex interests.",
      "She has also volunteered with the Bizkaia Food Bank and mentored children in equestrian summer camps, highlighting her empathy and strong sense of social responsibility.",
      "Her leadership style is collaborative and empathetic: she leads by example, communicates transparently, and brings out the best in team members."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 10. TOOLS / SOFTWARE / EXCEL / SEO / SEM / DIGITAL SKILLS
  if (
    /\b(herramienta|herramientas|software|excel|mailchimp|project|seo|sem|analytics|datos|t[eé]cnica|competencias digitales|tools|tech)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Enara maneja herramientas avanzadas para la gestión empresarial: modelización financiera en Microsoft Excel, gestión de campañas con MailChimp, posicionamiento SEO/SEM, analítica de redes sociales y planificación con Microsoft Project.",
      "Gracias a su especialización en Digital Business Intelligence, Enara sabe interpretar dashboards, métricas de conversión digital (CTR, CAC, LTV) y traducir datos numéricos en decisiones comerciales estratégicas.",
      "Combina la suite ofimática avanzada con herramientas de marketing digital contemporáneas, permitiéndole coordinar proyectos de principio a fin con datos contrastados."
    ];
    const englishReplies = [
      "Enara is proficient in Microsoft Excel for financial and business modeling, MailChimp for campaign workflows, Microsoft Project for planning, and modern SEO/SEM suites.",
      "Through her Digital Business Intelligence program, she analyzes key commercial metrics like CAC, LTV, and conversion funnels, translating raw data into actionable strategic insights.",
      "She pairs standard executive software with digital analytics tools to manage marketing initiatives with quantitative rigor."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 11. HOBBIES / INTERESTS / TIME OFF / "QUÉ LE GUSTA"
  if (
    /\b(hobbie|hobbies|afici[oó]n|aficiones|inter[eé]s|intereses|tiempo libre|qu[eé] le gusta|gastronom[ií]a|viajar|leisure|free time|interests)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Más allá de su dedicación deportiva a la equitación, a Enara le apasiona la gastronomía y la cocina, las artes estéticas, el diseño y viajar para conocer nuevas culturas y tendencias urbanas.",
      "En su tiempo libre disfruta del contacto con la naturaleza a través de los caballos, de explorar la gastronomía y de mantenerse al día sobre novedades en moda, retail y diseño sostenible.",
      "Sus aficiones reflejan su personalidad: la calma y el amor por los animales en el campo, junto con la curiosidad cosmopolita por la gastronomía y el diseño internacional."
    ];
    const englishReplies = [
      "Beyond her competitive equestrian dedication, Enara is passionate about culinary arts and gastronomy, aesthetic design, cultural travel, and global lifestyle trends.",
      "In her free time, she enjoys horseback riding in nature, exploring creative cooking, and staying inspired by contemporary fashion and sustainable architecture.",
      "Her hobbies reflect a harmonious balance: outdoor sporting discipline paired with cosmopolitan curiosity for design, culinary craft, and travel."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 12. CONTACT / PHONE / EMAIL / LOCATION / AVAILABILITY
  if (
    /\b(contacto|email|correo|telefono|tel[eé]fono|llamar|escribir|d[oó]nde est[aá]|bilbao|disponibilidad|incorporaci[oó]n|contact|phone|location|reach|available|hire)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "Puedes contactar directamente con Enara por correo en enara.pagarizabal@opendeusto.es o por teléfono en el +34 651 350 390. Reside en Bilbao (código postal 48001) y tiene disponibilidad inmediata para prácticas y proyectos de marketing.",
      "Enara está disponible para entrevistas y oportunidades laborales en Bilbao o en formato híbrido y remoto. Su correo es enara.pagarizabal@opendeusto.es y su teléfono es el +34 651 350 390.",
      "Para ponerse en contacto con ella, escribe a enara.pagarizabal@opendeusto.es o llámala al +34 651 350 390. También puedes descargar su currículum completo en formato PDF en esta misma página."
    ];
    const englishReplies = [
      "You can reach Enara directly via email at enara.pagarizabal@opendeusto.es or by telephone at +34 651 350 390. She is based in Bilbao, Spain, with immediate availability for internships and junior marketing roles.",
      "Enara is available for interviews and career opportunities. Feel free to contact her at enara.pagarizabal@opendeusto.es or +34 651 350 390, or view her full CV right here in the application.",
      "She welcomes inquiries from recruiters and leaders. Connect with her at enara.pagarizabal@opendeusto.es or call +34 651 350 390."
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 13. THANK YOU / FAREWELL / "GRACIAS" / "ADIÓS"
  if (
    /\b(gracias|muchas gracias|genial|perfecto|adi[oó]s|hasta luego|chao|thank you|thanks|goodbye|bye)\b/i.test(
      clean
    )
  ) {
    const spanishReplies = [
      "¡De nada! Ha sido un auténtico placer conversar contigo. Si quieres saber algo más sobre Enara o contactarla, aquí estaré. ¡Que tengas un excelente día!",
      "¡A ti por tu tiempo e interés en el perfil de Enara! No dudes en preguntarme cualquier otra duda cuando lo desees.",
      "¡Muchas gracias a ti! Espero que esta conversación te haya ayudado a conocer mejor el talento y la dedicación de Enara Pagarizabal. ¡Hasta pronto!"
    ];
    const englishReplies = [
      "You are very welcome! It was a real pleasure speaking with you. If you have any further questions about Enara, I am always here to help. Have a wonderful day!",
      "Thank you for your time and interest in Enara's profile! Feel free to ask more whenever you like.",
      "My absolute pleasure! I hope this gave you a great overview of Enara Pagarizabal's capabilities and dedication. Talk soon!"
    ];
    return pickNext(isSpanish ? spanishReplies : englishReplies);
  }

  // 14. DYNAMIC ROTATING FALLBACK FOR ANY OTHER UNMATCHED QUESTION
  const fallbackSpanish = [
    "Enara Pagarizabal destaca por su formación en ADE y Digital Business Intelligence en Deusto, su certificación en LVMH y su disciplina de Galope 7 en equitación. ¿Te gustaría conocer detalles sobre sus proyectos de marketing, sus idiomas o sus datos de contacto?",
    "En relación con lo que me preguntas, Enara combina una visión analítica del negocio con alta sensibilidad para la experiencia de cliente y el branding. Además cuenta con nivel C1 en inglés y disponibilidad para incorporarse a equipos de marketing.",
    "Para profundizar en ese aspecto: Enara ha demostrado un alto compromiso académico y deportivo, siendo Delegada electa en Deusto y amazona federada durante más de una década. Puedes explorar su CV completo o preguntarme sobre alguna de sus áreas específicas."
  ];

  const fallbackEnglish = [
    "Enara Pagarizabal stands out for her dual degree at Deusto Business School, her INSIDE LVMH credential, and her Galope 7 equestrian discipline. Would you like to explore her marketing competencies, language certifications, or contact details?",
    "Regarding your question, Enara pairs business management intelligence with refined customer experience strategy and fluent C1 English communication. She is ready for high-impact roles.",
    "To elaborate further: Enara balances academic leadership as an elected Class Delegate with the high discipline of competitive equestrian sport. You can check her CV tab or ask me about any particular topic."
  ];

  return pickNext(isSpanish ? fallbackSpanish : fallbackEnglish);
}

function pickNext(arr: string[]): string {
  if (!arr || arr.length === 0) return "";
  lastAnswerIndex = (lastAnswerIndex + 1) % arr.length;
  return arr[lastAnswerIndex];
}
