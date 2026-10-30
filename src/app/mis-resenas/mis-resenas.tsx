"use client";

import Link from "next/link";
import { StarIcon } from "@/components/icons";
import { Chip, Eyebrow } from "@/components/ui";
import { getMateria } from "@/lib/data";
import { borrarResena, useResenasLocales } from "@/lib/resenas-locales";

const fecha = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" });

export function MisResenas() {
  const resenas = useResenasLocales();

  const borrar = (id: string) => {
    if (window.confirm("¿Borrar tu reseña? No se puede deshacer.")) borrarResena(id);
  };

  if (resenas.length === 0) {
    return (
      <div className="flex max-w-[720px] flex-col gap-2 rounded-[20px] border border-dashed border-line-strong p-8">
        <Eyebrow>TODAVÍA NO ESCRIBISTE NINGUNA</Eyebrow>
        <p className="m-0 text-[17px] text-body">
          Contá cómo te fue con alguna materia: le ahorra un mal cuatri a alguien.
        </p>
        <Link href="/resena/nueva" className="self-start font-bold">
          Escribir una reseña →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-[840px] flex-col gap-4">
      {resenas.map((r) => {
        const materia = getMateria(r.materiaSlug);
        const catedra = materia?.catedras.find((c) => c.slug === r.catedraSlug);
        return (
          <article key={r.id} className="flex flex-col gap-3.5 rounded-[20px] bg-paper p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={`/materias/${r.materiaSlug}?catedra=${r.catedraSlug}`}
                  className="text-xl font-bold no-underline"
                >
                  {materia?.nombre ?? r.materiaSlug}
                </Link>
                <p className="m-0 mt-1 text-sm text-muted">
                  {catedra?.profe ?? r.catedraSlug} · cursó {r.cuatri} · publicada el{" "}
                  {fecha.format(new Date(r.creadaEn))}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-extrabold text-brand">
                <StarIcon />
                <span className="sr-only">Puntaje: </span>
                {r.rating}
              </span>
            </div>
            <p className="m-0 text-[17px] leading-[1.55] whitespace-pre-line">{r.texto}</p>
            {r.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <Chip key={t} tone="neutral">
                    {t}
                  </Chip>
                ))}
              </div>
            )}
            <div className="flex items-center justify-end border-t border-line-soft pt-3">
              <button
                onClick={() => borrar(r.id)}
                className="cursor-pointer bg-transparent p-2.5 text-sm text-muted underline"
              >
                Borrar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
