import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlusIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import {
  type Materia,
  anioLabel,
  getMateria,
  materias,
  pluralCatedras,
} from "@/lib/data";
import { getUsuario } from "@/lib/usuario";
import { CatedraTabs } from "./catedra-tabs";

export function generateStaticParams() {
  return materias.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(
  props: PageProps<"/materias/[slug]">,
): Promise<Metadata> {
  const materia = getMateria((await props.params).slug);
  return { title: materia ? `${materia.nombre} · Reviuit` : "Reviuit" };
}

export default async function MateriaPage(
  props: PageProps<"/materias/[slug]">,
) {
  const { slug } = await props?.params;
  const materia = getMateria(slug);
  if (!materia) notFound();

  return (
    <>
      <SiteHeader search />
      <PageMain className="pt-7">
        <nav aria-label="Ruta" className="mb-5 text-sm text-muted">
          <Link href="/explorar">Explorar</Link> /{" "}
          <Link href="/explorar">{anioLabel(materia.anio)}</Link> /{" "}
          <span aria-current="page">{materia.nombre}</span>
        </nav>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="m-0 mb-2 text-5xl font-extrabold tracking-[-0.01em] text-brand">
              {materia.nombre}
            </h1>
            <p className="m-0 text-[17px] text-body">
              {anioLabel(materia.anio)} ·{" "}
              {pluralCatedras(materia.catedras.length)} · {materia.resenas}{" "}
              reseñas de alumnos verificados
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {materia.catedras.length > 1 && (
              <Link
                href={`/materias/${materia.slug}/comparar`}
                className="rounded-[14px] border-2 border-brand px-5 py-3 font-bold no-underline"
              >
                Comparar cátedras
              </Link>
            )}
            <Link
              href={`/resena/nueva?materia=${materia.slug}`}
              className="inline-flex items-center gap-2 rounded-[14px] bg-brand px-5 py-3.5 font-bold text-white no-underline hover:bg-brand-dark hover:text-white"
            >
              <PlusIcon />
              Reseñar esta materia
            </Link>
          </div>
        </div>

        <Suspense>
          <CatedraTabsConUsuario materia={materia} />
        </Suspense>
      </PageMain>
    </>
  );
}

async function CatedraTabsConUsuario({ materia }: { materia: Materia }) {
  const usuario = await getUsuario();
  return (
    <CatedraTabs materia={materia} usuarioEmail={usuario?.email ?? null} />
  );
}
