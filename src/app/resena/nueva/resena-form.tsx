"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, type ReactNode, useState } from "react";
import { InfoIcon, StarIcon } from "@/components/icons";
import { Eyebrow, VerifiedAvatar } from "@/components/ui";
import { anioLabel, cuatrimestres, materias, opcionesEvaluacion, usuarioDemo } from "@/lib/data";
import { guardarResena } from "@/lib/resenas-locales";

const etiquetas = ["", "Mala", "Floja", "Bien", "Muy buena", "Excelente"];

const selectClass = "rounded-xl border border-line-strong bg-white p-3 text-base font-normal text-ink";

function Paso({ titulo, className = "", children }: { titulo: string; className?: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 rounded-[20px] border-0 bg-paper p-6">
      <legend className="float-left mb-4 w-full text-[13px] font-bold tracking-[0.18em] text-brand">{titulo}</legend>
      <div className={`clear-both ${className}`}>{children}</div>
    </fieldset>
  );
}

export function ResenaForm() {
  const router = useRouter();
  const params = useSearchParams();
  const materiaInicial = materias.find((m) => m.slug === params.get("materia")) ?? materias[0];

  const [materiaSlug, setMateriaSlug] = useState(materiaInicial.slug);
  const [catedraSlug, setCatedraSlug] = useState(
    materiaInicial.catedras.find((c) => c.slug === params.get("catedra"))?.slug ?? materiaInicial.catedras[0].slug,
  );
  const [cuatri, setCuatri] = useState(cuatrimestres[0]);
  const [rating, setRating] = useState(0);
  const [evaluacion, setEvaluacion] = useState<Set<string>>(new Set());
  const [texto, setTexto] = useState("");
  const [showAnio, setShowAnio] = useState(true);
  const [showCuatri, setShowCuatri] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const materia = materias.find((m) => m.slug === materiaSlug) ?? materias[0];
  const catedra = materia.catedras.find((c) => c.slug === catedraSlug) ?? materia.catedras[0];

  // Lo que se muestra junto al nombre en la página de la materia.
  const contexto: string[] = [];
  if (showAnio) contexto.push(anioLabel(usuarioDemo.anio));
  if (showCuatri) contexto.push(`cursó ${cuatri}`);
  const meta = [`${materia.nombre} · ${catedra.profe}`, ...contexto];

  const cambiarMateria = (slug: string) => {
    const m = materias.find((x) => x.slug === slug) ?? materias[0];
    setMateriaSlug(m.slug);
    setCatedraSlug(m.catedras[0].slug);
  };

  const toggleEvaluacion = (op: string) =>
    setEvaluacion((prev) => {
      const next = new Set(prev);
      if (next.has(op)) next.delete(op);
      else next.add(op);
      return next;
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rating) return setError("Elegí un puntaje de 1 a 5.");
    if (texto.trim().length < 20) return setError("Contanos un poco más: al menos 20 caracteres.");
    setError(null);
    const resena = guardarResena({
      materiaSlug: materia.slug,
      catedraSlug: catedra.slug,
      autor: usuarioDemo.nombre,
      meta: contexto.join(" · "),
      cuatri,
      rating,
      texto: texto.trim(),
      tags: opcionesEvaluacion.filter((op) => evaluacion.has(op)),
    });
    router.push(`/materias/${materia.slug}?catedra=${catedra.slug}&nueva=${resena.id}`);
  };

  return (
    <div className="flex flex-wrap items-start gap-8">
      <form onSubmit={onSubmit} noValidate className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
        <Paso titulo="1 · QUÉ CURSASTE" className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Materia
            <select value={materiaSlug} onChange={(e) => cambiarMateria(e.target.value)} className={selectClass}>
              {materias.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Profe
            <select value={catedra.slug} onChange={(e) => setCatedraSlug(e.target.value)} className={selectClass}>
              {materia.catedras.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.profe}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Cuatrimestre
            <select value={cuatri} onChange={(e) => setCuatri(e.target.value)} className={selectClass}>
              {cuatrimestres.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </Paso>

        <Paso titulo="2 · TU PUNTAJE" className="flex flex-col gap-4">
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Puntaje">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} de 5`}
                onClick={() => setRating(n)}
                className="inline-flex size-[52px] cursor-pointer items-center justify-center rounded-xl bg-transparent text-brand hover:bg-brand-tint"
              >
                <StarIcon size={36} filled={n <= rating} />
              </button>
            ))}
            <span className="ml-2 text-lg font-bold text-brand">{etiquetas[rating]}</span>
          </div>
          <p className="m-0 text-sm font-semibold">¿Cómo evalúa?</p>
          <div className="flex flex-wrap gap-2">
            {opcionesEvaluacion.map((op) => {
              const checked = evaluacion.has(op);
              return (
                <label
                  key={op}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2.5 text-[15px] font-semibold ${
                    checked ? "bg-brand-tint text-brand" : "bg-cream text-ink"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEvaluacion(op)}
                    className="size-[18px] accent-brand"
                  />
                  {op}
                </label>
              );
            })}
          </div>
        </Paso>

        <Paso titulo="3 · TU EXPERIENCIA" className="flex flex-col gap-3">
          <label htmlFor="txt" className="text-sm font-semibold">
            ¿Qué le dirías a alguien que se está por anotar?
          </label>
          <textarea
            id="txt"
            rows={5}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Cómo explica, cómo evalúa, qué tan exigente es…"
            className="resize-y rounded-[14px] border border-line-strong bg-white p-3.5 text-base leading-normal text-ink"
          />
          <p className="m-0 flex items-start gap-2 text-sm leading-[1.45] text-body">
            <InfoIcon className="mt-px flex-none text-brand" />
            Para cuidarte: no pongas tu nota exacta, tu grupo de TP ni anécdotas que solo vos viviste.
          </p>
        </Paso>

        <Paso titulo="4 · QUÉ MOSTRAMOS DE VOS" className="flex flex-col gap-3.5">
          <label className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
            Tu año de carrera
            <input
              type="checkbox"
              role="switch"
              checked={showAnio}
              onChange={() => setShowAnio((v) => !v)}
              className="size-[22px] accent-brand"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
            El cuatrimestre que cursaste
            <input
              type="checkbox"
              role="switch"
              checked={showCuatri}
              onChange={() => setShowCuatri((v) => !v)}
              className="size-[22px] accent-brand"
            />
          </label>
          <p className="m-0 text-sm text-muted">
            Tu nombre siempre aparece en la reseña. El resto del contexto lo elegís vos.
          </p>
        </Paso>

        {error && (
          <p role="alert" className="m-0 text-[15px] font-semibold text-warn">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-[14px] bg-brand px-7 py-4 text-[17px] font-bold text-white hover:bg-brand-dark"
          >
            Publicar reseña
          </button>
          <span className="text-sm text-muted">Podés borrarla cuando quieras desde Mis reseñas.</span>
        </div>
      </form>

      <aside aria-label="Vista previa" className="flex flex-[1_1_340px] flex-col gap-4">
        <Eyebrow>ASÍ LA VA A VER EL RESTO</Eyebrow>
        <article className="flex flex-col gap-3 rounded-[20px] border-2 border-brand bg-paper p-[22px] shadow-offset">
          <div className="flex items-center justify-between gap-3">
            <p className="m-0 flex items-center gap-2 text-sm font-semibold">
              <VerifiedAvatar size={30} />
              {usuarioDemo.nombre}
            </p>
            <span className="font-extrabold text-brand">★ {rating || "–"}</span>
          </div>
          <p className="m-0 text-[13px] text-muted">{meta.join(" · ")}</p>
          <p className={`m-0 text-base leading-[1.55] whitespace-pre-line ${texto ? "" : "text-faint"}`}>
            {texto || "Acá va a aparecer lo que escribas."}
          </p>
          {evaluacion.size > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {opcionesEvaluacion
                .filter((op) => evaluacion.has(op))
                .map((op) => (
                  <span key={op} className="rounded-full bg-cream px-2.5 py-[5px] text-[13px] font-semibold text-body">
                    {op}
                  </span>
                ))}
            </div>
          )}
        </article>
        <section className="flex flex-col gap-2.5 rounded-[18px] bg-brand-tint p-5">
          <p className="m-0 font-extrabold text-brand">Lo que no se muestra</p>
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-[15px] leading-[1.4]">
            <li>Tu mail</li>
            <li>Tu legajo y tus notas</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
