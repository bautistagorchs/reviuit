import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { requerirUsuario } from "@/lib/usuario";
import { ResenaForm } from "./resena-form";

export const metadata: Metadata = { title: "Escribir una reseña · Reviuit" };

export default function NuevaResenaPage(props: PageProps<"/resena/nueva">) {
  return (
    <>
      <SiteHeader cancelHref="/" />
      <PageMain className="pt-10">
        <h1 className="m-0 mb-2 text-[44px] font-extrabold tracking-[-0.01em] text-brand">Contá cómo fue</h1>
        <p className="m-0 mb-8 text-lg text-body">Lo que escribas le ahorra un mal cuatri a alguien.</p>
        <Suspense>
          <FormularioConUsuario searchParams={props.searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}

async function FormularioConUsuario({ searchParams }: Pick<PageProps<"/resena/nueva">, "searchParams">) {
  // Volver con la misma materia y cátedra preseleccionadas después del login.
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(await searchParams)) {
    if (typeof valor === "string") query.set(clave, valor);
  }
  const { nombre, email } = await requerirUsuario(`/resena/nueva${query.size ? `?${query}` : ""}`);
  return <ResenaForm usuario={{ nombre, email }} />;
}
