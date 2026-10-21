export interface ExperienceItem {
  year: string;
  title: string;
  institution: string;
  description: string;
  category: 'education' | 'certificate' | 'volunteer' | 'achievement';
  tags?: string[];
}

export interface ProfileData {
  name: string;
  subtitle: string;
  shortBioEn: string;
  shortBioEs: string;
  email: string;
  phone: string;
  location: string;
  cvPdfPath: string;
  languages: { language: string; level: string; note?: string }[];
  skills: string[];
  tools: string[];
  education: ExperienceItem[];
  certifications: ExperienceItem[];
  volunteerAndSports: ExperienceItem[];
  keyHighlights: {
    stat: string;
    labelEn: string;
    labelEs: string;
    detailEn: string;
    detailEs: string;
  }[];
  sampleQuestions: {
    en: string;
    es: string;
    category: string;
  }[];
}

export const ENARA_PROFILE: ProfileData = {
  name: "Enara Pagarizabal Ruiz",
  subtitle: "Double Degree ADE + Digital Business Intelligence | Marketing Specialization",
  shortBioEn: "4th-year student at Deusto Business School combining Business Administration with Digital Business Intelligence. Specializing in Brand Strategy, Customer Experience, and Digital Transformation.",
  shortBioEs: "Estudiante de 4º de ADE + IDE (Inteligencia Digital Empresarial) en la Universidad de Deusto. Especialización en Marketing, branding, experiencia de cliente y transformación digital con dominio de SEO/SEM.",
  email: "enara.pagarizabal@opendeusto.es",
  phone: "+34 651 350 390",
  location: "Bilbao, 48001 (Spain)",
  cvPdfPath: "/assets/aistudio/CV_marketing-_Enara_Pagarizabal_Ruiz___1__368f1630.pdf",
  languages: [
    { language: "Spanish / Español", level: "Native / Nativo", note: "Mother tongue" },
    { language: "English / Inglés", level: "C1 Advanced", note: "Certified by UD - Linguaskill" },
    { language: "Basque / Euskara", level: "Intermediate / Medio", note: "Bilingual regional proficiency" }
  ],
  skills: [
    "Brand Strategy & Pricing",
    "Customer Experience (CX)",
    "Consumer Behavior",
    "Digital Transformation",
    "Omnichannel Distribution",
    "Strategic Corporate Communication",
    "Commercial Direction & Sales",
    "Leadership & Team Coordination"
  ],
  tools: [
    "Microsoft Excel (Financial & Data Modeling)",
    "MailChimp (Email Marketing)",
    "SEO / SEM Suite",
    "Social Media Analytics",
    "Microsoft Project",
    "Digital Business Intelligence"
  ],
  education: [
    {
      year: "2023 — Present",
      title: "Grado en Administración y Dirección de Empresas (ADE)",
      institution: "Deusto Business School — Universidad de Deusto, Bilbao",
      description: "Profundización en Marketing: Gestión de marcas y precios, Experiencia del cliente y comportamiento del consumidor, Dirección de la distribución, Dirección de la comunicación, Dirección comercial y ventas.",
      category: "education",
      tags: ["Marketing", "Branding", "CX", "Sales Strategy"]
    },
    {
      year: "2023 — Present",
      title: "Título Propio en Digital Business Intelligence (IDE)",
      institution: "Deusto Business School — Universidad de Deusto, Bilbao",
      description: "Programa especializado en transformación digital corporativa, inteligencia de negocio, y Marketing Digital I & II.",
      category: "education",
      tags: ["Business Intelligence", "Digital Marketing", "SEO/SEM"]
    },
    {
      year: "2026",
      title: "Programa Erasmus+",
      institution: "Estonian Business School (EBS) — Tallinn, Estonia",
      description: "Intercambio académico internacional en uno de los hubs de innovación y tecnología digital más avanzados de Europa.",
      category: "education",
      tags: ["International", "Innovation", "Estonia"]
    }
  ],
  certifications: [
    {
      year: "2025",
      title: "INSIDE LVMH Certificate",
      institution: "LVMH Moët Hennessy Louis Vuitton",
      description: "Inmersión profunda en el ecosistema del lujo: gestión de marcas de prestigio, experiencia de cliente omnicanal, sostenibilidad e innovación artesanal.",
      category: "certificate",
      tags: ["Luxury", "Brand Management", "CX"]
    },
    {
      year: "2025",
      title: "International Seminar",
      institution: "Woosong University (SolBridge International School of Business)",
      description: "Seminario intensivo sobre estrategia global, negociación multicultural y liderazgo empresarial.",
      category: "certificate",
      tags: ["Global Business", "Cross-cultural"]
    },
    {
      year: "2025",
      title: "Bloomberg Market Concepts (BMC)",
      institution: "Deusto Business School (DBS)",
      description: "Certificación práctica en mercados de capitales, divisas, renta fija, renta variable e indicadores macroeconómicos.",
      category: "certificate",
      tags: ["Finance", "Bloomberg", "Analytics"]
    },
    {
      year: "2021 — 2022",
      title: "STARTinnova Emprendimiento",
      institution: "Colegio Azkorri — Berango, Bilbao",
      description: "Desarrollo de planes de negocio innovadores y fomento del espíritu emprendedor.",
      category: "certificate",
      tags: ["Entrepreneurship", "Innovation"]
    }
  ],
  volunteerAndSports: [
    {
      year: "Federada 14+ años",
      title: "Equitación de Alto Rendimiento (Titulación Galope 7)",
      institution: "Federación Hípica Española",
      description: "Galope 7 (máxima titulación deportiva en hípica). Demuestra 14 años de estricta disciplina, constancia, resiliencia, empatía animal y toma de decisiones serenas bajo presión.",
      category: "achievement",
      tags: ["High Discipline", "Resilience", "Sports Excellence"]
    },
    {
      year: "1º, 2º y 3º de Grado",
      title: "Representación Estudiantil: Delegada y Subdelegada",
      institution: "Deusto Business School",
      description: "Elegida por votación de los compañeros como Subdelegada en 1º y Delegada de curso en 2º y 3º. Demuestra liderazgo, confianza de grupo, capacidad de negociación y escucha activa.",
      category: "achievement",
      tags: ["Leadership", "Negotiation", "Peer Trust"]
    },
    {
      year: "2023",
      title: "Voluntariado Social",
      institution: "Banco de Alimentos de Bizkaia",
      description: "Apoyo en clasificación, logística y campañas de captación solidaria de alimentos para familias vulnerables.",
      category: "volunteer",
      tags: ["Community", "Social Impact"]
    },
    {
      year: "2022",
      title: "Monitora de Apoyo en Campamentos Ecuestres",
      institution: "Centros Hípicos de Bizkaia",
      description: "Formación y cuidado de jóvenes jinetes, fomento de valores de respeto, seguridad y trabajo en equipo.",
      category: "volunteer",
      tags: ["Mentorship", "Teamwork"]
    }
  ],
  keyHighlights: [
    {
      stat: "ADE + IDE",
      labelEn: "Dual Degree Excellence",
      labelEs: "Doble Grado Deusto",
      detailEn: "Deusto Business School: Business Administration + Digital Business Intelligence",
      detailEs: "Administración de Empresas + Inteligencia Digital Empresarial"
    },
    {
      stat: "Galope 7",
      labelEn: "Equestrian Discipline",
      labelEs: "Equitación de Élite",
      detailEn: "Federated 14+ years, highest national horse riding certification",
      detailEs: "14 años federada con la titulación oficial máxima de la federación"
    },
    {
      stat: "LVMH",
      labelEn: "Certified in Luxury",
      labelEs: "Certificado LVMH",
      detailEn: "INSIDE LVMH program: Brand excellence and retail customer experience",
      detailEs: "Gestión de marcas icónicas, experiencia omnicanal y excelencia artesanal"
    },
    {
      stat: "C1 / Native",
      labelEn: "Multilingual Communication",
      labelEs: "Comunicación Global",
      detailEn: "English C1 (Linguaskill), Spanish (Native), Basque (Intermediate)",
      detailEs: "Inglés C1 certificado, Castellano nativo y Euskera nivel medio"
    }
  ],
  sampleQuestions: [
    {
      en: "Can you give me an overview of Enara's profile and marketing focus?",
      es: "¿Puedes resumirme el perfil de Enara y su especialización en marketing?",
      category: "Overview"
    },
    {
      en: "What did Enara learn from the INSIDE LVMH Certificate?",
      es: "¿Qué aprendizajes obtuvo Enara con el certificado INSIDE LVMH?",
      category: "Brand & Luxury"
    },
    {
      en: "How does the Galope 7 equestrian title reflect her work ethic?",
      es: "¿De qué manera el Galope 7 en equitación refleja su disciplina de trabajo?",
      category: "Discipline & Values"
    },
    {
      en: "Why is Enara's combination of ADE and Digital Business Intelligence unique?",
      es: "¿Por qué es tan valiosa la combinación de ADE con Inteligencia Digital Empresarial?",
      category: "Education"
    },
    {
      en: "What leadership experience did she gain as University Class Delegate?",
      es: "¿Qué experiencia de liderazgo desarrolló como delegada de curso en Deusto?",
      category: "Leadership"
    },
    {
      en: "What are her contact details and availability for opportunities?",
      es: "¿Cuáles son sus datos de contacto y disponibilidad para incorporarse a un proyecto?",
      category: "Contact"
    }
  ]
};
