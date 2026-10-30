import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { ResenaForm } from "./resena-form";

export const metadata: Metadata = { title: "Escribir una reseña · Reviuit" };

export default function NuevaResenaPage() {
  return (
    <>
      <SiteHeader cancelHref="/" />
      <PageMain className="pt-10">
        <h1 className="m-0 mb-2 text-[44px] font-extrabold tracking-[-0.01em] text-brand">Contá cómo fue</h1>
        <p className="m-0 mb-8 text-lg text-body">
          Lo que escribas le ahorra un mal cuatri a alguien.
        </p>
        <Suspense>
          <ResenaForm />
        </Suspense>
      </PageMain>
    </>
  );
}
