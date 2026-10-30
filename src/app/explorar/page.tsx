import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { Explorador } from "./explorador";

export const metadata: Metadata = { title: "Explorá materias · Reviuit" };

export default function ExplorarPage() {
  return (
    <>
      <SiteHeader search cta active="explorar" />
      <PageMain className="pt-10">
        <Suspense>
          <Explorador />
        </Suspense>
      </PageMain>
    </>
  );
}
