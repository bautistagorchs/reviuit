import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ShieldCheckIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { type Catedra, MIN_RESENAS_PROMEDIO, anioLabel, getMateria, materias } from "@/lib/data";

export function generateStaticParams() {
  return materias.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: PageProps<"/materias/[slug]/comparar">): Promise<Metadata> {
  const materia = getMateria((await props.params).slug);
  return { title: materia ? `Comparar cátedras de ${materia.nombre} · Reviuit` : "Reviuit" };
}

const pocosDatos = <span className="text-muted">Pocos datos</span>;

const filas: { label: string; celda: (c: Catedra) => ReactNode }[] = [
  {
    label: "Explica claro",
    celda: (c) => (c.comparacion?.explicaClaro ? <strong>{c.comparacion.explicaClaro}</strong> : pocosDatos),
  },
  { label: "Exigencia", celda: (c) => c.comparacion?.exigencia ?? pocosDatos },
  { label: "Cómo evalúa", celda: (c) => c.comparacion?.comoEvalua ?? pocosDatos },
  { label: "Asistencia", celda: (c) => c.comparacion?.asistencia ?? pocosDatos },
  {
    label: "Lo que más se repite",
    celda: (c) => (c.comparacion ? <span className="leading-[1.45]">“{c.comparacion.loQueSeRepite}”</span> : pocosDatos),
  },
];

const th = "px-6 py-[18px] text-left font-semibold text-body";
const td = "border-l border-line-soft px-6 py-[18px] align-top";

export default async function CompararPage(props: PageProps<"/materias/[slug]/comparar">) {
  const { slug } = await props.params;
  const materia = getMateria(slug);
  if (!materia) notFound();

  const { catedras } = materia;
  const masElegida = catedras
    .filter((c) => c.rating)
    .reduce<Catedra | undefined>((max, c) => (!max || c.n > max.n ? c : max), undefined);
  const destacadas = catedras.filter((c) => c.destacada);

  return (
    <>
      <SiteHeader cta />
      <PageMain className="flex flex-col gap-8 pt-10">
        <div className="flex flex-col gap-2.5">
          <p className="m-0 text-[13px] font-bold tracking-[0.22em] text-brand">
            {anioLabel(materia.anio).toUpperCase()} · {materia.resenas} RESEÑAS
          </p>
          <h1 className="m-0 text-5xl font-extrabold tracking-[-0.01em] text-brand">{materia.nombre}: ¿con quién?</h1>
          <p className="m-0 max-w-[680px] text-lg text-body">
            {catedras.length === 1 ? "La cátedra" : `Las ${catedras.length} cátedras lado a lado`}. Mirá cómo evalúa
            cada una y qué dicen los que ya cursaron.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[22px] border border-line bg-paper">
          <table className="w-full min-w-[820px] border-collapse text-base">
            <caption className="sr-only">Comparación de cátedras de {materia.nombre}</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[22%] p-6 text-left align-bottom">
                  <span className="sr-only">Criterio</span>
                </th>
                {catedras.map((c) => (
                  <th key={c.slug} scope="col" className="border-l border-line-soft p-6 text-left align-top">
                    <span className="block text-[22px] font-extrabold text-brand">{c.profe}</span>
                    <span className="mt-1 block text-sm font-medium text-muted">
                      {c.horario ? `${c.horario} · ` : ""}
                      {c.n} reseñas
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line-soft">
                <th scope="row" className={th}>
                  General
                </th>
                {catedras.map((c) => (
                  <td key={c.slug} className={td}>
                    {c.rating && c.n >= MIN_RESENAS_PROMEDIO ? (
                      <>
                        <span className="text-[28px] font-extrabold text-brand">{c.rating}</span>
                        {c === masElegida && (
                          <span className="ml-2 rounded-full bg-brand px-2 py-1 align-middle text-xs font-bold text-white">
                            LA MÁS ELEGIDA
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[28px] font-extrabold text-faint">—</span>
                        <span className="block text-[13px] text-muted">
                          Mostramos el promedio desde {MIN_RESENAS_PROMEDIO} reseñas
                        </span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
              {filas.map((f) => (
                <tr key={f.label} className="border-t border-line-soft">
                  <th scope="row" className={th}>
                    {f.label}
                  </th>
                  {catedras.map((c) => (
                    <td key={c.slug} className={td}>
                      {f.celda(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line-soft">
                <td className="px-6 py-[18px]" />
                {catedras.map((c) => (
                  <td key={c.slug} className={td}>
                    <Link href={`/materias/${materia.slug}?catedra=${c.slug}`} className="font-bold">
                      Ver {c.n} reseñas →
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {destacadas.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="m-0 text-[28px] font-extrabold text-brand">La reseña más útil de cada una</h2>
              <p className="m-0 flex items-center gap-1.5 text-sm text-muted">
                <ShieldCheckIcon size={15} className="text-brand" />
                Solo alumnos verificados. Sin nombres.
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {destacadas.map((c) => {
                const d = c.destacada!;
                return (
                  <article key={c.slug} className="flex flex-col gap-3.5 rounded-[20px] bg-paper p-[22px]">
                    <p className="m-0 text-sm font-bold text-brand">
                      {c.profe} · ★ {d.rating}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="m-0 text-xs font-bold tracking-[0.16em] text-brand">LO BUENO</p>
                      <p className="m-0 text-base leading-normal">{d.bueno}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="m-0 text-xs font-bold tracking-[0.16em] text-warn">A TENER EN CUENTA</p>
                      <p className="m-0 text-base leading-normal">{d.ojo}</p>
                    </div>
                    <p className="m-0 border-t border-line-soft pt-3 text-[13px] text-muted">
                      Alumno verificado · {d.meta} · {d.util} les sirvió
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </PageMain>
    </>
  );
}
