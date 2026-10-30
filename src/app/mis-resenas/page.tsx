import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { MisResenas } from "./mis-resenas";

export const metadata: Metadata = { title: "Mis reseñas · Reviuit" };

export default function MisResenasPage() {
  return (
    <>
      <SiteHeader search cta active="mis-resenas" />
      <PageMain className="pt-10">
        <h1 className="m-0 mb-2 text-[44px] font-extrabold tracking-[-0.01em] text-brand">Mis reseñas</h1>
        <p className="m-0 mb-8 text-[17px] text-body">Las reseñas que escribiste. Podés borrarlas cuando quieras.</p>
        <MisResenas />
      </PageMain>
    </>
  );
}
