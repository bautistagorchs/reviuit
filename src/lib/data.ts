// Datos de ejemplo hasta que haya un backend. Las cifras son las del diseño.

export type Anio = 1 | 2 | 3;

export type Resena = {
  meta: string;
  rating: number;
  util: number;
  texto: string;
  tags: string[];
  cuatri: string;
};

export type Destacada = {
  bueno: string;
  ojo: string;
  rating: number;
  meta: string;
  util: number;
};

export type Catedra = {
  slug: string;
  profe: string;
  horario?: string;
  /** null cuando no hay suficientes reseñas para mostrar un promedio. */
  rating: string | null;
  n: number;
  resumen?: {
    label: string;
    detalle: string;
    criterios: { nombre: string; valor: string; pct: number }[];
  };
  evaluacion?: { tags: string[]; votos: number };
  comparacion?: {
    explicaClaro: string | null;
    exigencia: string | null;
    comoEvalua: string;
    asistencia: string;
    loQueSeRepite: string;
  };
  destacada?: Destacada;
  resenas?: Resena[];
};

export type Materia = {
  slug: string;
  nombre: string;
  /** Versión corta para chips y sugerencias. */
  nombreCorto?: string;
  anio: Anio;
  rating: string;
  resenas: number;
  tags: string[];
  catedras: Catedra[];
};

export const MIN_RESENAS_PROMEDIO = 8;

export const materias: Materia[] = [
  {
    slug: "programacion-i",
    nombre: "Programación I",
    anio: 1,
    rating: "4,4",
    resenas: 61,
    tags: ["TPs semanales", "Parcial práctico"],
    catedras: [
      { slug: "duarte", profe: "Prof. Duarte", rating: "4,7", n: 24 },
      { slug: "sosa", profe: "Prof. Sosa", rating: "4,2", n: 19 },
      { slug: "paz", profe: "Prof. Paz", rating: "4,1", n: 18 },
    ],
  },
  {
    slug: "microeconomia",
    nombre: "Microeconomía",
    anio: 1,
    rating: "3,6",
    resenas: 52,
    tags: ["Final escrito", "Mucha lectura"],
    catedras: [
      { slug: "ibanez", profe: "Prof. Ibáñez", rating: "3,9", n: 30 },
      { slug: "correa", profe: "Prof. Correa", rating: "3,2", n: 22 },
    ],
  },
  {
    slug: "contabilidad-financiera",
    nombre: "Contabilidad Financiera",
    nombreCorto: "Contabilidad",
    anio: 1,
    rating: "3,9",
    resenas: 27,
    tags: ["Ejercicios en clase"],
    catedras: [
      { slug: "ledesma", profe: "Prof. Ledesma", rating: "4,0", n: 15 },
      { slug: "rivas", profe: "Prof. Rivas", rating: "3,8", n: 12 },
    ],
  },
  {
    slug: "matematica-i",
    nombre: "Matemática I",
    anio: 1,
    rating: "3,4",
    resenas: 54,
    tags: ["Asistencia obligatoria", "Dos parciales"],
    catedras: [
      { slug: "benitez", profe: "Prof. Benítez", rating: "3,7", n: 28 },
      { slug: "quiroga", profe: "Prof. Quiroga", rating: "3,1", n: 26 },
    ],
  },
  {
    slug: "pensamiento-critico",
    nombre: "Pensamiento Crítico",
    anio: 1,
    rating: "4,2",
    resenas: 33,
    tags: ["Ensayos", "Debate en clase"],
    catedras: [{ slug: "aguirre", profe: "Prof. Aguirre", rating: "4,2", n: 33 }],
  },
  {
    slug: "historia-economica",
    nombre: "Historia Económica",
    anio: 1,
    rating: "3,8",
    resenas: 25,
    tags: ["Final oral"],
    catedras: [
      { slug: "molina", profe: "Prof. Molina", rating: "4,1", n: 14 },
      { slug: "vera", profe: "Prof. Vera", rating: "3,5", n: 11 },
    ],
  },
  {
    slug: "estadistica-aplicada",
    nombre: "Estadística Aplicada",
    anio: 2,
    rating: "4,1",
    resenas: 38,
    tags: ["2 parciales", "TP grupal con R"],
    catedras: [
      {
        slug: "romero",
        profe: "Prof. Romero",
        horario: "Lun y Mié 8:30",
        rating: "4,3",
        n: 21,
        resumen: {
          label: "Muy recomendada",
          detalle: "18 de 21 la volverían a elegir",
          criterios: [
            { nombre: "Explica claro", valor: "4,6", pct: 92 },
            { nombre: "Exigencia", valor: "4,1", pct: 82 },
            { nombre: "Buena onda", valor: "4,4", pct: 88 },
            { nombre: "Organización del curso", valor: "3,9", pct: 78 },
          ],
        },
        evaluacion: {
          tags: ["2 parciales escritos", "TP grupal con R", "Toma asistencia", "Final promocionable"],
          votos: 17,
        },
        comparacion: {
          explicaClaro: "4,6",
          exigencia: "Alta",
          comoEvalua: "2 parciales + TP grupal",
          asistencia: "La toma siempre",
          loQueSeRepite: "Exige, pero te enseña de verdad",
        },
        destacada: {
          rating: 5,
          bueno: "Usa datos reales en cada clase y los TPs te preparan para el parcial.",
          ojo: "Toma asistencia siempre y cuenta para la nota.",
          meta: "cursó 1C 2026",
          util: 24,
        },
        resenas: [
          {
            meta: "2º año · cursó 1C 2026",
            cuatri: "1C 2026",
            rating: 5,
            util: 24,
            texto:
              "La mejor cátedra para entender de verdad. Usa datos reales en cada clase y los TPs te dejan listo para el parcial. Exige, pero si vas al día no te complica.",
            tags: ["Explica claro", "Exigente"],
          },
          {
            meta: "3º año · cursó 2C 2025",
            cuatri: "2C 2025",
            rating: 4,
            util: 17,
            texto:
              "Toma asistencia todas las clases y lo cuenta para la nota. El segundo parcial es bastante más largo que el primero, practicá con los de años anteriores.",
            tags: ["Toma asistencia", "Parcial largo"],
          },
          {
            meta: "2º año · cursó 1C 2026",
            cuatri: "1C 2026",
            rating: 4,
            util: 9,
            texto:
              "El TP en R asusta al principio, pero los ayudantes responden rápido en el foro. Recomiendo armar grupo con alguien que ya haya programado.",
            tags: ["Buenos ayudantes"],
          },
          {
            meta: "2º año · cursó 2C 2025",
            cuatri: "2C 2025",
            rating: 3,
            util: 4,
            texto: "Sabe mucho pero va rápido. Si te perdés una clase cuesta engancharte de nuevo.",
            tags: ["Ritmo rápido"],
          },
        ],
      },
      {
        slug: "fontana",
        profe: "Prof. Fontana",
        horario: "Mar y Jue 14:00",
        rating: "3,8",
        n: 12,
        comparacion: {
          explicaClaro: "3,5",
          exigencia: "Media",
          comoEvalua: "Parcial + final oral",
          asistencia: "No la toma",
          loQueSeRepite: "Más teórica, el oral define",
        },
        destacada: {
          rating: 4,
          bueno: "Muy flexible con las entregas y responde todas las dudas por mail.",
          ojo: "El final oral pesa mucho; preparalo con tiempo.",
          meta: "cursó 2C 2025",
          util: 11,
        },
      },
      {
        slug: "gil",
        profe: "Prof. Gil",
        horario: "Vie 9:00",
        rating: null,
        n: 5,
        comparacion: {
          explicaClaro: null,
          exigencia: null,
          comoEvalua: "Parcial + TP individual",
          asistencia: "A veces",
          loQueSeRepite: "Cátedra nueva, buena primera impresión",
        },
        destacada: {
          rating: 4,
          bueno: "Clases cortas y al grano, con ejercicios resueltos en el campus.",
          ojo: "Es su primer año dictando, todavía ajusta el programa.",
          meta: "cursó 1C 2026",
          util: 3,
        },
      },
    ],
  },
];

export const destacadasHome = [
  "estadistica-aplicada",
  "microeconomia",
  "programacion-i",
  "contabilidad-financiera",
];

export const sugerenciasBusqueda = [
  "estadistica-aplicada",
  "microeconomia",
  "programacion-i",
  "contabilidad-financiera",
];

export const cuatrimestres = ["1C 2026", "2C 2025", "1C 2025"];

export const carreras = ["Negocios Digitales", "Administración", "Economía"];

export function getMateria(slug: string) {
  return materias.find((m) => m.slug === slug);
}

export function anioLabel(anio: Anio) {
  return `${anio}º año`;
}

export function pluralCatedras(n: number) {
  return n === 1 ? "1 cátedra" : `${n} cátedras`;
}

export function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Usuario de ejemplo hasta que exista el login con @udesa.edu.ar. */
export const usuarioDemo = { anio: 2 as Anio };

export const opcionesEvaluacion = [
  "Parciales escritos",
  "TP grupal",
  "Final oral",
  "Toma asistencia",
  "Se promociona",
];
