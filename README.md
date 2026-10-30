# Reviuit

Reseñas de profes y materias de UdeSA, hechas por alumnos verificados y siempre anónimas.

Hecho con Next.js (App Router) + Tailwind CSS v4.

## Desarrollo

```bash
npm install
npm run dev
```

## Pantallas

| Ruta | Pantalla |
| --- | --- |
| `/` | Home con buscador central |
| `/explorar` | Explorar materias por año (acepta `?q=` para buscar) |
| `/materias/[slug]` | Materia con cátedras en tabs y reseñas (acepta `?catedra=`) |
| `/materias/[slug]/comparar` | Comparador de cátedras |
| `/resena/nueva` | Escribir una reseña con vista previa |

Los datos de ejemplo viven en `src/lib/data.ts` hasta que exista un backend.
Los colores del diseño están definidos como tokens en `src/app/globals.css` (`brand`, `ink`, `cream`, `paper`, …).
