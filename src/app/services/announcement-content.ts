export interface AnnouncementPageData {
  title: string;
  content: string;
}

const ANNOUNCEMENT_PAGES_PREFIX = 'PB_NEWS_PAGES_V1:';

export const DEFAULT_ANNOUNCEMENT_PAGES: AnnouncementPageData[] = [
  {
    title: 'Hemos rediseñado toda la plataforma',
    content: '<p>Prepara Bombero estrena una imagen más clara, coherente y cómoda para que puedas centrarte en avanzar.</p><ul><li>Hemos unificado cabeceras, tarjetas, colores y tipografías en todas las secciones.</li><li>La navegación y los estados de carga son ahora más rápidos y evitan saltos entre vistas.</li><li>También hemos renovado el acceso, el registro y la presentación del temario.</li></ul>',
  },
  {
    title: 'Tu plan de estudio se adapta a tu examen',
    content: '<p>Indica dónde te presentas y cuánto tiempo tienes. La plataforma organiza una ruta de estudio ajustada a tu convocatoria.</p><ul><li>Recibe sesiones programadas para avanzar con una rutina clara.</li><li>Repasa lo estudiado y comprueba tu progreso con simulacros.</li><li>Si tu suscripción se interrumpe, podrás retomar un plan que aún siga vigente al renovarla.</li></ul>',
  },
  {
    title: 'Nuevos packs de refuerzo',
    content: '<p>Amplía los temas que cuentan con menos preguntas oficiales mediante packs de contenido propio.</p><ul><li>Consulta cada pack por territorio, administración o materia.</li><li>Practica sus preguntas de forma independiente siempre que quieras.</li><li>Integra las preguntas adquiridas en exámenes personalizados y sesiones de tu plan de estudio.</li></ul>',
  },
  {
    title: 'Exámenes y repasos más flexibles',
    content: '<p>Elige exactamente qué parte del temario quieres trabajar y cómo prefieres hacerlo.</p><ul><li>Practica con exámenes oficiales completos o crea pruebas por temas y subtemas.</li><li>Selecciona el número de preguntas y alterna entre examen y repaso paso a paso.</li><li>Consulta las explicaciones para entender cada respuesta y reforzar tus puntos débiles.</li></ul>',
  },
  {
    title: 'Guarda las preguntas que quieras revisar',
    content: '<p>Marca las preguntas importantes mientras practicas y vuelve a ellas desde un único lugar.</p><ul><li>Filtra las preguntas guardadas por tema o repásalas en orden aleatorio.</li><li>Guarda y reporta preguntas desde exámenes, repasos, packs y sesiones del plan.</li><li>Mantén organizado tu propio recorrido de repaso.</li></ul>',
  },
  {
    title: 'Un temario más claro y fácil de explorar',
    content: '<p>Hemos renovado la jerarquía del temario para que temas y subtemas se entiendan de un vistazo.</p><ul><li>Los contadores muestran con claridad cuántas preguntas hay en cada apartado.</li><li>Los nuevos accesos permiten iniciar un examen, comenzar un repaso o abrir el PDF junto al contenido elegido.</li><li>Al abrir un PDF se accede directamente a su sección, sin volver al inicio de la página.</li></ul>',
  },
];

export function encodeAnnouncementPages(pages: AnnouncementPageData[]): string {
  return ANNOUNCEMENT_PAGES_PREFIX + JSON.stringify({ pages });
}

export function decodeAnnouncementPages(
  description: unknown,
  legacyTitle = '',
  includeDefaultsForLegacy = false
): AnnouncementPageData[] {
  const value = typeof description === 'string' ? description : '';

  if (value.startsWith(ANNOUNCEMENT_PAGES_PREFIX)) {
    try {
      const payload = JSON.parse(value.slice(ANNOUNCEMENT_PAGES_PREFIX.length));
      if (!Array.isArray(payload.pages)) return [];

      return payload.pages
        .filter((page: any) => typeof page?.title === 'string' && typeof page?.content === 'string')
        .map((page: AnnouncementPageData) => ({
          title: page.title,
          content: page.content,
        }));
    } catch {
      return [];
    }
  }

  const pages = includeDefaultsForLegacy
    ? DEFAULT_ANNOUNCEMENT_PAGES.map(page => ({ ...page }))
    : [];

  if (value.trim() || legacyTitle.trim()) {
    pages.push({ title: legacyTitle, content: value });
  }

  return pages;
}
