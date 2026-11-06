"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Chip, Eyebrow, RatingPill } from "@/components/ui";
import {
  type Anio,
  anioLabel,
  carreras,
  materias,
  normalizar,
} from "@/lib/data";

const anios: Anio[] = [1, 2, 3];
type Orden = "resenas" | "rating" | "az";
type Vista = "materias" | "profesores";

const ratingNum = (r: string | null) => (r ? Number(r.replace(",", ".")) : 0);

const selectClass =
  "rounded-xl border border-line-strong bg-paper px-3.5 py-3 text-[15px] text-ink";

export function Explorador() {
  const busqueda = useSearchParams().get("q")?.trim() ?? "";
  const q = normalizar(busqueda);
  const [anio, setAnio] = useState<Anio>(1);
  const [vista, setVista] = useState<Vista>("materias");
  const [orden, setOrden] = useState<Orden>("resenas");

  // Con búsqueda activa se busca en todos los años; sin búsqueda, en el año elegido.
  const coincide = (m: (typeof materias)[number]) =>
    !q ||
    normalizar(m.nombre).includes(q) ||
    m.catedras.some((c) => normalizar(c.profe).includes(q));

  const lista = materias
    .filter((m) => (q ? coincide(m) : m.anio === anio))
    .sort((a, b) => {
      if (orden === "az") return a.nombre.localeCompare(b.nombre, "es");
      if (orden === "rating") return ratingNum(b.rating) - ratingNum(a.rating);
      return b.resenas - a.resenas;
    });

  const profes = lista
    .flatMap((m) => m.catedras.map((c) => ({ ...c, materia: m })))
    .filter(
      (c) =>
        !q ||
        normalizar(c.profe).includes(q) ||
        normalizar(c.materia.nombre).includes(q),
    )
    .sort((a, b) => {
      if (orden === "az") return a.profe.localeCompare(b.profe, "es");
      if (orden === "rating") return ratingNum(b.rating) - ratingNum(a.rating);
      return b.n - a.n;
    });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 mb-2 text-[44px] font-extrabold tracking-[-0.01em] text-brand">
            {q ? "Resultados" : "Explorá materias"}
          </h1>
          <p className="m-0 text-[17px] text-body">
            {q
              ? `Materias y profes que coinciden con “${busqueda}”.`
              : "Elegí tu año y mirá qué dicen de cada cátedra antes de inscribirte."}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Ver por"
          className="inline-flex rounded-full bg-sand p-1"
        >
          {(["materias", "profesores"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={vista === v}
              onClick={() => setVista(v)}
              className={`cursor-pointer rounded-full px-5 py-2.5 ${
                vista === v
                  ? "bg-paper font-bold text-brand"
                  : "bg-transparent font-semibold text-body"
              }`}
            >
              {v === "materias" ? "Materias" : "Profesores"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-8">
        <aside
          aria-label="Filtros"
          className="flex flex-[1_1_240px] flex-col gap-7"
        >
          <fieldset
            className="m-0 flex flex-col gap-2.5 border-0 p-0"
            disabled={!!q}
          >
            <legend className="mb-2.5 text-[13px] font-bold tracking-[0.18em] text-brand">
              AÑO
            </legend>
            {anios.map((a) => {
              const activo = !q && a === anio;
              const total = materias.filter((m) => m.anio === a).length;
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setAnio(a)}
                  className={`flex cursor-pointer justify-between rounded-[14px] border-2 px-4 py-3.5 text-left disabled:cursor-default disabled:opacity-60 ${
                    activo
                      ? "border-brand bg-brand font-bold text-white"
                      : "border-line-strong bg-paper font-semibold text-ink"
                  }`}
                >
                  {anioLabel(a)}{" "}
                  <span className={`font-medium ${activo ? "" : "text-muted"}`}>
                    {total} {total === 1 ? "materia" : "materias"}
                  </span>
                </button>
              );
            })}
          </fieldset>
          {/* <div className="flex flex-col gap-2">
            <label htmlFor="carrera" className="text-[13px] font-bold tracking-[0.18em] text-brand">
              CARRERA
            </label>
            <select id="carrera" className={selectClass}>
              <option>Todas las carreras</option>
              {carreras.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div> */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="orden"
              className="text-[13px] font-bold tracking-[0.18em] text-brand"
            >
              ORDENAR POR
            </label>
            <select
              id="orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className={selectClass}
            >
              <option value="resenas">Más reseñadas</option>
              <option value="rating">Mejor puntuadas</option>
              <option value="az">A–Z</option>
            </select>
          </div>
          <div className="flex flex-col gap-2.5 rounded-2xl bg-brand-tint p-[18px]">
            <p className="m-0 font-bold text-brand">¿Ya cursaste alguna?</p>
            <p className="m-0 text-sm leading-[1.45] text-ink">
              Tu reseña le ahorra un mal cuatri a alguien.
            </p>
            <Link
              href="/resena/nueva"
              className="self-start text-[15px] font-bold"
            >
              Escribir una →
            </Link>
          </div>
        </aside>

        <section
          aria-label={q ? "Resultados" : `Materias de ${anioLabel(anio)}`}
          className="grid min-w-0 flex-[999_1_560px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4"
        >
          {vista === "materias" &&
            lista.map((m) => (
              <Link href={`/materias/${m.slug}`}>
                <article
                  key={m.slug}
                  className="flex flex-col gap-4 rounded-[18px] border border-line bg-paper p-[22px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/materias/${m.slug}`}
                      className="text-xl leading-[1.2] font-bold no-underline"
                    >
                      {m.nombre}
                    </Link>
                    <RatingPill value={m.rating} />
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {m.catedras.map((c) => (
                      <li
                        key={c.slug}
                        className="flex items-center justify-between border-t border-line-soft py-2.5 text-[15px]"
                      >
                        <span className="font-semibold">{c.profe}</span>
                        <span className="text-muted">
                          {c.rating ?? "—"} · {c.n} reseñas
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <Chip key={t} tone="neutral">
                        {t}
                      </Chip>
                    ))}
                  </div>
                </article>
              </Link>
            ))}

          {vista === "profesores" &&
            profes.map((c) => (
              <Link
                href={`/materias/${c.materia.slug}?catedra=${c.slug}`}
                // className="text-xl leading-[1.2] font-bold no-underline"
              >
                <article
                  key={`${c.materia.slug}-${c.slug}`}
                  className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-[22px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/materias/${c.materia.slug}?catedra=${c.slug}`}
                      className="text-xl leading-[1.2] font-bold no-underline"
                    >
                      {c.profe}
                    </Link>
                    {c.rating && <RatingPill value={c.rating} />}
                  </div>
                  <p className="m-0 text-[15px] text-body">
                    {c.materia.nombre} · {c.n} reseñas
                  </p>
                </article>
              </Link>
            ))}

          {(vista === "materias" ? lista.length : profes.length) === 0 && (
            <div className="flex flex-col gap-2 rounded-[18px] border border-dashed border-line-strong p-8">
              <Eyebrow>SIN RESULTADOS</Eyebrow>
              <p className="m-0 text-[17px] text-body">
                Todavía no hay reseñas acá. Si cursaste alguna materia, ¡podés
                ser el primero!
              </p>
              <Link href="/resena/nueva" className="self-start font-bold">
                Escribir una reseña →
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
