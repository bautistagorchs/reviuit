import Form from "next/form";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  HeroIllustration,
  ListIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import {
  anioLabel,
  destacadasHome,
  getMateria,
  pluralCatedras,
  sugerenciasBusqueda,
} from "@/lib/data";

const confianza: { icon: ReactNode; titulo: string; texto: string }[] = [
  {
    icon: <ShieldCheckIcon size={20} strokeWidth={2} />,
    titulo: "Solo alumnos reales",
    texto: "Entrás con tu mail @udesa.edu.ar. Nadie de afuera escribe.",
  },
  {
    icon: <SearchIcon size={20} strokeWidth={2} />,
    titulo: "Sabé con quién cursar",
    texto:
      "Cada materia tiene varias cátedras. Mirá cómo evalúa cada profe, qué tan exigente es y si toma asistencia, antes de inscribirte.",
  },
  {
    icon: <ListIcon />,
    titulo: "Todo en un solo lugar",
    texto:
      "Lo que hoy se pierde en los grupos de WhatsApp, ordenado por materia y profe, con puntajes y comentarios de quienes ya cursaron.",
  },
];

export default function Home() {
  const sugerencias = sugerenciasBusqueda
    .map(getMateria)
    .filter((m) => m !== undefined);
  const destacadas = destacadasHome
    .map(getMateria)
    .filter((m) => m !== undefined);

  return (
    <>
      <SiteHeader cta />
      <PageMain>
        <section className="flex flex-wrap items-center gap-12 pt-[72px] pb-20">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
            <p className="m-0 text-[13px] font-bold tracking-[0.22em] text-brand">
              HECHO POR ALUMNOS DE UDESA
            </p>
            <h1 className="m-0 text-5xl leading-[1.02] font-extrabold tracking-[-0.02em] text-brand sm:text-[64px]">
              ¿Con quién te anotás este cuatri?
            </h1>
            <p className="m-0 max-w-[560px] text-xl leading-normal text-body">
              Lo que se dice en los grupos de WhatsApp, pero ordenado. Reseñas
              de profes y materias escritas por alumnos verificados.
            </p>
            <Form
              action="/explorar"
              role="search"
              className="mt-3 flex max-w-[640px] flex-wrap gap-2 rounded-[20px] border-2 border-brand bg-paper p-2 shadow-offset"
            >
              <label htmlFor="q-home" className="sr-only">
                Buscar profe o materia
              </label>
              <span className="flex items-center pl-3 text-brand">
                <SearchIcon size={22} />
              </span>
              <input
                id="q-home"
                name="q"
                type="search"
                placeholder="Buscá un profe o una materia…"
                className="min-w-0 flex-[1_1_240px] bg-transparent px-1 py-3 text-lg text-ink outline-none"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-[14px] bg-brand px-6 py-3.5 text-base font-bold text-white hover:bg-brand-dark"
              >
                Buscar
              </button>
            </Form>
            <div className="flex flex-wrap items-center gap-2">
              <strong className="mr-1 text-base text-muted">Probá con:</strong>
              {sugerencias.map((m) => (
                <Link
                  key={m.slug}
                  href={`/materias/${m.slug}`}
                  className="rounded-full bg-brand-tint px-3.5 py-2.5 text-sm font-semibold no-underline"
                >
                  {m.nombreCorto ?? m.nombre}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-[1_1_320px] justify-center">
            <HeroIllustration />
          </div>
        </section>

        <section
          aria-label="Cómo cuidamos la confianza"
          className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 pb-16"
        >
          {confianza.map((c) => (
            <div
              key={c.titulo}
              className="flex items-start gap-3.5 rounded-2xl bg-paper p-5"
            >
              <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-brand-tint text-brand">
                {c.icon}
              </span>
              <div>
                <p className="m-0 mb-1 font-bold text-brand">{c.titulo}</p>
                <p className="m-0 text-[15px] leading-[1.45] text-body">
                  {c.texto}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="pb-16">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="m-0 text-[28px] font-extrabold text-brand">
              Lo más buscado esta semana
            </h2>
            <Link href="/explorar" className="text-[15px] font-semibold">
              Ver todas las materias
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {destacadas.map((m) => (
              <Link
                key={m.slug}
                href={`/materias/${m.slug}`}
                className="flex flex-col gap-3.5 rounded-[18px] border border-line bg-paper p-[22px] text-ink no-underline transition-colors hover:border-brand hover:text-ink"
              >
                <span className="self-start rounded-full bg-cream px-2.5 py-1 text-[13px] font-semibold text-body">
                  {anioLabel(m.anio)}
                </span>
                <span className="text-xl leading-[1.2] font-bold text-brand">
                  {m.nombre}
                </span>
                <span className="flex items-center gap-1.5 text-[15px] text-body">
                  <StarIcon size={18} className="text-brand" />
                  <strong className="text-ink">{m.rating}</strong> · {m.resenas}{" "}
                  reseñas
                </span>
                <span className="text-sm text-muted">
                  {pluralCatedras(m.catedras.length)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </PageMain>
    </>
  );
}
