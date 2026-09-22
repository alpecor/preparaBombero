import { ReinforcementPack, Territory } from './reinforcements.models';

// Static demo fixtures. Replace through ReinforcementsService when the API is ready.
export const DEMO_TERRITORIES: Territory[] = [
  {
    name: 'Andalucía',
    provinces: [
      {
        name: 'Almería',
        administrations: [],
      },
      {
        name: 'Cádiz',
        administrations: [],
      },
      {
        name: 'Córdoba',
        administrations: [],
      },
      {
        name: 'Granada',
        administrations: [],
      },
      {
        name: 'Huelva',
        administrations: [],
      },
      {
        name: 'Jaén',
        administrations: [],
      },
      {
        name: 'Málaga',
        administrations: ['Consorcio Provincial de Bomberos'],
      },
      {
        name: 'Sevilla',
        administrations: ['Ayuntamiento de Sevilla', 'Consorcio Provincial de Bomberos'],
      },
    ],
  },
  {
    name: 'Madrid',
    provinces: [
      {
        name: 'Madrid',
        administrations: [],
      },
    ],
  },
  {
    name: 'Cataluña',
    provinces: [
      {
        name: 'Barcelona',
        administrations: [],
      },
      {
        name: 'Girona',
        administrations: [],
      },
      {
        name: 'Lleida',
        administrations: [],
      },
      {
        name: 'Tarragona',
        administrations: [],
      },
    ],
  },
  {
    name: 'Aragón',
    provinces: [
      {
        name: 'Huesca',
        administrations: [],
      },
      {
        name: 'Teruel',
        administrations: [],
      },
      {
        name: 'Zaragoza',
        administrations: [],
      },
    ],
  },
  {
    name: 'País Vasco',
    provinces: [
      {
        name: 'Álava',
        administrations: [],
      },
      {
        name: 'Bizkaia',
        administrations: [],
      },
      {
        name: 'Gipuzkoa',
        administrations: [],
      },
    ],
  },
  {
    name: 'Castilla y León',
    provinces: [
      {
        name: 'Ávila',
        administrations: [],
      },
      {
        name: 'Burgos',
        administrations: [],
      },
      {
        name: 'León',
        administrations: [],
      },
      {
        name: 'Palencia',
        administrations: [],
      },
      {
        name: 'Salamanca',
        administrations: [],
      },
      {
        name: 'Segovia',
        administrations: [],
      },
      {
        name: 'Soria',
        administrations: [],
      },
      {
        name: 'Valladolid',
        administrations: [],
      },
      {
        name: 'Zamora',
        administrations: [],
      },
    ],
  },
  {
    name: 'Castilla-La Mancha',
    provinces: [
      {
        name: 'Albacete',
        administrations: [],
      },
      {
        name: 'Ciudad Real',
        administrations: [],
      },
      {
        name: 'Cuenca',
        administrations: [],
      },
      {
        name: 'Guadalajara',
        administrations: [],
      },
      {
        name: 'Toledo',
        administrations: [],
      },
    ],
  },
  {
    name: 'Comunidad Valenciana',
    provinces: [
      {
        name: 'Alicante',
        administrations: [],
      },
      {
        name: 'Castellón',
        administrations: [],
      },
      {
        name: 'Valencia',
        administrations: ['Ayuntamiento de Valencia'],
      },
    ],
  },
  {
    name: 'Galicia',
    provinces: [
      {
        name: 'A Coruña',
        administrations: [],
      },
      {
        name: 'Lugo',
        administrations: [],
      },
      {
        name: 'Ourense',
        administrations: [],
      },
      {
        name: 'Pontevedra',
        administrations: [],
      },
    ],
  },
  {
    name: 'Asturias',
    provinces: [
      {
        name: 'Asturias',
        administrations: [],
      },
    ],
  },
  {
    name: 'Cantabria',
    provinces: [
      {
        name: 'Cantabria',
        administrations: [],
      },
    ],
  },
  {
    name: 'Extremadura',
    provinces: [
      {
        name: 'Badajoz',
        administrations: [],
      },
      {
        name: 'Cáceres',
        administrations: [],
      },
    ],
  },
  {
    name: 'Islas Baleares',
    provinces: [
      {
        name: 'Islas Baleares',
        administrations: [],
      },
    ],
  },
  {
    name: 'Islas Canarias',
    provinces: [
      {
        name: 'Las Palmas',
        administrations: [],
      },
      {
        name: 'Santa Cruz de Tenerife',
        administrations: [],
      },
    ],
  },
  {
    name: 'La Rioja',
    provinces: [
      {
        name: 'La Rioja',
        administrations: [],
      },
    ],
  },
  {
    name: 'Región de Murcia',
    provinces: [
      {
        name: 'Murcia',
        administrations: [],
      },
    ],
  },
  {
    name: 'Navarra',
    provinces: [
      {
        name: 'Navarra',
        administrations: [],
      },
    ],
  },
  {
    name: 'Ciudades Autónomas Ceuta y Melilla',
    provinces: [
      {
        name: 'Ceuta',
        administrations: [],
      },
      {
        name: 'Melilla',
        administrations: [],
      },
    ],
  },
];

export const DEMO_PACKS: ReinforcementPack[] = [
  {
    id: 'demo-pack-1',
    title: 'Geografía y legislación de Andalucía',
    type: 'GEOGRAFÍA',
    community: 'Andalucía',
    province: null,
    administration: null,
    questionCount: 140,
    priceCents: 695,
    bullets: ['Ley 2/2002 de Ordenación Urbanística', 'PTEAnd y organización de consorcios provinciales'],
  },
  {
    id: 'demo-pack-2',
    title: 'Callejero de Sevilla capital',
    type: 'CALLEJERO',
    community: 'Andalucía',
    province: 'Sevilla',
    administration: null,
    questionCount: 95,
    priceCents: 395,
    bullets: ['Centro histórico y barrios principales', 'Ubicación de parques de bomberos y hospitales'],
  },
  {
    id: 'demo-pack-3',
    title: 'Geografía de la provincia de Sevilla',
    type: 'GEOGRAFÍA',
    community: 'Andalucía',
    province: 'Sevilla',
    administration: null,
    questionCount: 95,
    priceCents: 450,
    bullets: ['Comarcas y municipios menores', 'Útil para oposiciones de Diputación'],
  },
  {
    id: 'demo-pack-4',
    title: 'Organización y normativa — Ayto. de Sevilla',
    type: 'TEMAS DEL SERVICIO',
    community: 'Andalucía',
    province: 'Sevilla',
    administration: 'Ayuntamiento de Sevilla',
    questionCount: 85,
    priceCents: 395,
    bullets: [
      'Estructura del Servicio de Extinción de Incendios',
      'Ordenanzas municipales de protección civil',
    ],
  },
  {
    id: 'demo-pack-5',
    title: 'Organización — Consorcio de Sevilla',
    type: 'TEMAS DEL SERVICIO',
    community: 'Andalucía',
    province: 'Sevilla',
    administration: 'Consorcio Provincial de Bomberos',
    questionCount: 70,
    priceCents: 350,
    bullets: ['Estructura territorial del consorcio', 'Convenio y régimen de personal propio'],
  },
  {
    id: 'demo-pack-6',
    title: 'Callejero de Málaga capital',
    type: 'CALLEJERO',
    community: 'Andalucía',
    province: 'Málaga',
    administration: null,
    questionCount: 90,
    priceCents: 395,
    bullets: ['Centro y zona metropolitana', 'Accesos y polígonos industriales'],
  },
  {
    id: 'demo-pack-7',
    title: 'Organización — Consorcio de Málaga',
    type: 'TEMAS DEL SERVICIO',
    community: 'Andalucía',
    province: 'Málaga',
    administration: 'Consorcio Provincial de Bomberos',
    questionCount: 80,
    priceCents: 395,
    bullets: ['Organización territorial del consorcio', 'Parques comarcales y su cobertura'],
  },
  {
    id: 'demo-pack-8',
    title: 'Geografía de la provincia de Cádiz',
    type: 'GEOGRAFÍA',
    community: 'Andalucía',
    province: 'Cádiz',
    administration: null,
    questionCount: 110,
    priceCents: 495,
    bullets: ['Términos municipales y mancomunidades', 'Ríos, sierras y espacios protegidos'],
  },
  {
    id: 'demo-pack-9',
    title: 'Callejero de Madrid capital',
    type: 'CALLEJERO',
    community: 'Madrid',
    province: 'Madrid',
    administration: null,
    questionCount: 120,
    priceCents: 450,
    bullets: ['Distritos y ejes viarios principales', 'Puntos críticos para intervención'],
  },
  {
    id: 'demo-pack-10',
    title: 'Geografía de la provincia de Girona',
    type: 'GEOGRAFÍA',
    community: 'Cataluña',
    province: 'Girona',
    administration: null,
    questionCount: 90,
    priceCents: 450,
    bullets: ["Comarques de l'Empordà i la Garrotxa", 'Costa Brava i espais protegits'],
  },
  {
    id: 'demo-pack-11',
    title: 'Callejero de Zaragoza capital',
    type: 'CALLEJERO',
    community: 'Aragón',
    province: 'Zaragoza',
    administration: null,
    questionCount: 85,
    priceCents: 395,
    bullets: ['Distritos y barrios periféricos', 'Polígonos industriales y accesos'],
  },
  {
    id: 'demo-pack-12',
    title: 'Callejero de Bilbao',
    type: 'CALLEJERO',
    community: 'País Vasco',
    province: 'Bizkaia',
    administration: null,
    questionCount: 75,
    priceCents: 395,
    bullets: ['Núcleo urbano y margen de la ría', 'Accesos e infraestructuras críticas'],
  },
  {
    id: 'demo-pack-13',
    title: 'Geografía de la provincia de Valladolid',
    type: 'GEOGRAFÍA',
    community: 'Castilla y León',
    province: 'Valladolid',
    administration: null,
    questionCount: 95,
    priceCents: 450,
    bullets: ['Comarcas y municipios menores de 1.000 hab.', 'Orografía y red hidrográfica'],
  },
  {
    id: 'demo-pack-14',
    title: 'Geografía de la provincia de Toledo',
    type: 'GEOGRAFÍA',
    community: 'Castilla-La Mancha',
    province: 'Toledo',
    administration: null,
    questionCount: 90,
    priceCents: 450,
    bullets: ['Comarcas y municipios pequeños', 'Patrimonio y espacios naturales'],
  },
  {
    id: 'demo-pack-15',
    title: 'Organización y normativa — Ayto. de Valencia',
    type: 'TEMAS DEL SERVICIO',
    community: 'Comunidad Valenciana',
    province: 'Valencia',
    administration: 'Ayuntamiento de Valencia',
    questionCount: 80,
    priceCents: 395,
    bullets: ['Estructura del cuerpo de bomberos municipal', 'Ordenanzas y protocolos propios'],
  },
];
