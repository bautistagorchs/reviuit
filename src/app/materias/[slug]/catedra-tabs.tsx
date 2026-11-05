"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheckIcon, StarIcon, ThumbUpIcon } from "@/components/icons";
import { Chip, Eyebrow, VerifiedAvatar } from "@/components/ui";
import {
  autorVisible,
  type Catedra,
  type Materia,
  type Resena,
} from "@/lib/data";
import { borrarResena, useResenasLocales } from "@/lib/resenas-locales";

type Orden = "utiles" | "recientes" | "2026";

const ordenes: { id: Orden; label: string }[] = [
  { id: "utiles", label: "Más útiles" },
  { id: "recientes", label: "Recientes" },
  { id: "2026", label: "Solo 2026" },
];

// "1C 2026" → 20261, para ordenar por fecha de cursada.
const cuatriKey = (c: string) => {
  const [n, anio] = c.split(" ");
  return Number(anio) * 10 + Number(n[0]);
};

function resenasDe(c: Catedra): Resena[] {
  if (c.resenas) return c.resenas;
  if (!c.destacada) return [];
  const d = c.destacada;
  return [
    {
      autor: d.autor,
      anonimo: false,
      meta: d.meta,
      cuatri: d.meta.replace("cursó ", ""),
      rating: d.rating,
      util: d.util,
      texto: `${d.bueno} ${d.ojo}`,
      tags: [],
    },
  ];
}

export function CatedraTabs({
  materia,
  usuarioEmail,
}: {
  materia: Materia;
  usuarioEmail: string | null;
}) {
  const params = useSearchParams();
  const inicial = params.get("catedra");
  const nueva = params.get("nueva");
  const locales = useResenasLocales().filter(
    (r) => r.materiaSlug === materia.slug,
  );
  const totalDe = (c: Catedra) =>
    c.n + locales.filter((r) => r.catedraSlug === c.slug).length;
  const [activa, setActiva] = useState(
    materia.catedras.find((c) => c.slug === inicial)?.slug ??
      materia.catedras[0].slug,
  );
  const [orden, setOrden] = useState<Orden>("utiles");
  const [votadas, setVotadas] = useState<Set<string>>(new Set());

  const catedra =
    materia.catedras.find((c) => c.slug === activa) ?? materia.catedras[0];
  const deEstaCatedra = locales
    .filter((r) => r.catedraSlug === catedra.slug)
    .map((r) => ({
      ...r,
      propia: !!usuarioEmail && r.autorEmail === usuarioEmail,
    }));
  const propias = deEstaCatedra.filter((r) => r.propia);
  const resenas = [
    // Las reseñas escritas en este navegador van primero (las tuyas antes), de la más nueva a la más vieja.
    ...propias,
    ...deEstaCatedra.filter((r) => !r.propia),
    ...resenasDe(catedra)
      .map((r, i) => ({ ...r, id: `${catedra.slug}-${i}`, propia: false }))
      .sort((a, b) =>
        orden === "recientes"
          ? cuatriKey(b.cuatri) - cuatriKey(a.cuatri)
          : b.util - a.util,
      ),
  ].filter((r) => orden !== "2026" || r.cuatri.endsWith("2026"));
  const recienPublicada = propias.some((r) => r.id === nueva);

  useEffect(() => {
    if (recienPublicada)
      document
        .getElementById(`resena-${nueva}`)
        ?.scrollIntoView({ block: "center" });
  }, [recienPublicada, nueva]);

  const borrar = (id: string) => {
    if (window.confirm("¿Borrar tu reseña? No se puede deshacer."))
      borrarResena(id);
  };

  const toggleVoto = (id: string) =>
    setVotadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <div
        role="tablist"
        aria-label="Cátedras"
        className="mb-8 flex flex-wrap gap-2 border-b-2 border-line"
      >
        {materia.catedras.map((c) => {
          const sel = c.slug === catedra.slug;
          return (
            <button
              key={c.slug}
              role="tab"
              id={`tab-${c.slug}`}
              aria-selected={sel}
              aria-controls="panel-catedra"
              onClick={() => setActiva(c.slug)}
              className={`-mb-0.5 cursor-pointer border-b-[3px] bg-transparent px-[18px] py-3.5 text-[17px] ${
                sel
                  ? "border-brand font-bold text-brand"
                  : "border-transparent font-semibold text-body hover:text-brand"
              }`}
            >
              {c.profe}{" "}
              <span className="font-medium text-muted">· {totalDe(c)}</span>
            </button>
          );
        })}
      </div>

      <div
        id="panel-catedra"
        role="tabpanel"
        aria-labelledby={`tab-${catedra.slug}`}
        className="flex flex-wrap items-start gap-8"
      >
        <aside className="flex flex-[1_1_340px] flex-col gap-4">
          <section
            aria-label="Resumen"
            className="flex flex-col gap-5 rounded-[20px] bg-paper p-6"
          >
            <div className="flex items-center gap-4">
              <p
                className={`m-0 text-[64px] leading-none font-extrabold ${catedra.rating ? "text-brand" : "text-faint"}`}
              >
                {catedra.rating ?? "—"}
              </p>
              <div>
                <p className="m-0 mb-1 text-base font-bold">
                  {catedra.resumen?.label ??
                    (catedra.rating
                      ? "Promedio general"
                      : "Pocos datos todavía")}
                </p>
                <p className="m-0 text-sm text-muted">
                  {catedra.resumen?.detalle ?? `${totalDe(catedra)} reseñas`}
                </p>
              </div>
            </div>
            {catedra.resumen && (
              <div className="flex flex-col gap-3">
                {catedra.resumen.criterios.map((cr) => (
                  <div key={cr.nombre} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[15px]">
                      <span>{cr.nombre}</span>
                      <strong>{cr.valor}</strong>
                    </div>
                    <div className="h-2 rounded-full bg-sand">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${cr.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {catedra.evaluacion && (
            <section
              aria-labelledby="eval"
              className="flex flex-col gap-3.5 rounded-[20px] bg-paper p-6"
            >
              <h2
                id="eval"
                className="m-0 text-[13px] font-bold tracking-[0.18em] text-brand"
              >
                CÓMO EVALÚA
              </h2>
              <div className="flex flex-wrap gap-2">
                {catedra.evaluacion.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
              <p className="m-0 text-[13px] text-muted">
                Según lo que marcaron {catedra.evaluacion.votos} alumnos.
              </p>
            </section>
          )}

          <p className="m-0 flex items-start gap-2.5 rounded-2xl border border-brand-shadow p-4 text-sm leading-[1.45] text-ink">
            <ShieldCheckIcon
              size={20}
              strokeWidth={2}
              className="flex-none text-brand"
            />
            Todas las reseñas son de cuentas @udesa.edu.ar verificadas que
            cursaron con este profe.
          </p>
        </aside>

        <section
          aria-label="Reseñas"
          className="flex min-w-0 flex-[999_1_560px] flex-col gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[15px] text-muted">Ordenar:</span>
            {ordenes.map((o) => (
              <button
                key={o.id}
                aria-pressed={orden === o.id}
                onClick={() => setOrden(o.id)}
                className={`cursor-pointer rounded-full px-4 py-2.5 text-sm ${
                  orden === o.id
                    ? "bg-ink font-bold text-cream"
                    : "border border-line-strong bg-paper font-semibold text-ink"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {recienPublicada && (
            <p
              role="status"
              className="m-0 rounded-2xl bg-brand-tint px-5 py-4 font-semibold text-brand"
            >
              ¡Listo! Tu reseña ya está publicada. Gracias por contar cómo fue.
            </p>
          )}

          {resenas.map((r) => {
            const votada = votadas.has(r.id);
            return (
              <article
                key={r.id}
                id={`resena-${r.id}`}
                className={`flex scroll-mt-6 flex-col gap-3.5 rounded-[20px] bg-paper p-6 ${
                  r.propia && r.id === nueva
                    ? "border-2 border-brand shadow-offset"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <VerifiedAvatar />
                    {autorVisible(r)}
                    {r.meta && (
                      <span className="font-medium text-muted">· {r.meta}</span>
                    )}
                    {r.propia && (
                      <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">
                        TU RESEÑA
                      </span>
                    )}
                  </p>
                  <span className="inline-flex items-center gap-1 font-extrabold text-brand">
                    <StarIcon />
                    <span className="sr-only">Puntaje: </span>
                    {r.rating}
                  </span>
                </div>
                <p className="m-0 text-[17px] leading-[1.55] whitespace-pre-line">
                  {r.texto}
                </p>
                {r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map((t) => (
                      <Chip key={t} tone="neutral">
                        {t}
                      </Chip>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-line-soft pt-3">
                  <button
                    aria-pressed={votada}
                    onClick={() => toggleVoto(r.id)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2.5 text-sm font-semibold ${
                      votada
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-line-strong bg-transparent text-ink"
                    }`}
                  >
                    <ThumbUpIcon fill={votada ? "currentColor" : "none"} />
                    Me sirvió · {r.util + (votada ? 1 : 0)}
                  </button>
                  {r.propia && (
                    <button
                      onClick={() => borrar(r.id)}
                      className="cursor-pointer bg-transparent p-2.5 text-sm text-muted underline"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {resenas.length === 0 && (
            <div className="flex flex-col gap-2 rounded-[20px] border border-dashed border-line-strong p-8">
              <Eyebrow>SIN RESEÑAS</Eyebrow>
              <p className="m-0 text-[17px] text-body">
                No hay reseñas para este filtro todavía.
              </p>
              <Link
                href={`/resena/nueva?materia=${materia.slug}&catedra=${catedra.slug}`}
                className="self-start font-bold"
              >
                Escribir la primera →
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
