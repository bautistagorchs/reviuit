import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { dominioPermitido, signIn } from "@/auth";
import { ShieldCheckIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { PageMain } from "@/components/ui";
import { getUsuario } from "@/lib/usuario";

export const metadata: Metadata = { title: "Entrar · Reviuit" };

const errores: Record<string, string> = {
  AccessDenied: `Solo pueden entrar cuentas @${dominioPermitido}. Probá de nuevo con tu mail de la facultad.`,
  Configuration: "El login con Google todavía no está configurado en este servidor.",
};

// Solo rutas internas, para no redirigir a otro sitio después del login.
function rutaSegura(valor: string | string[] | undefined) {
  return typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//") ? valor : "/";
}

export default function EntrarPage(props: PageProps<"/entrar">) {
  return (
    <>
      <SiteHeader />
      <PageMain className="flex justify-center pt-16">
        <Suspense>
          <Entrar searchParams={props.searchParams} />
        </Suspense>
      </PageMain>
    </>
  );
}

async function Entrar({ searchParams }: Pick<PageProps<"/entrar">, "searchParams">) {
  const params = await searchParams;
  const volverA = rutaSegura(params.callbackUrl);
  if (await getUsuario()) redirect(volverA);

  const codigo = typeof params.error === "string" ? params.error : null;
  const error = codigo ? (errores[codigo] ?? "No pudimos completar el login. Probá de nuevo.") : null;

  async function entrarConGoogle() {
    "use server";
    await signIn("google", { redirectTo: volverA });
  }

  return (
    <section className="flex w-full max-w-[480px] flex-col gap-6 rounded-[20px] border-2 border-brand bg-paper p-8 shadow-offset">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-[13px] font-bold tracking-[0.22em] text-brand">SOLO ALUMNOS DE UDESA</p>
        <h1 className="m-0 text-[40px] leading-[1.05] font-extrabold tracking-[-0.01em] text-brand">Entrá a Reviuit</h1>
        <p className="m-0 text-[17px] leading-normal text-body">
          Usá tu cuenta @{dominioPermitido === "*" ? "de Google" : dominioPermitido} para escribir reseñas y ver las
          tuyas.
        </p>
      </div>

      {error && (
        <p role="alert" className="m-0 rounded-2xl bg-cream px-4 py-3 text-[15px] font-semibold text-warn">
          {error}
        </p>
      )}

      <form action={entrarConGoogle}>
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] bg-brand px-6 py-4 text-[17px] font-bold text-white hover:bg-brand-dark"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="12" fill="#fff" />
            <path
              fill="#004aad"
              d="M17.6 12.2c0-.4 0-.8-.1-1.2H12v2.3h3.2a2.7 2.7 0 0 1-1.2 1.8v1.5h1.9c1.1-1 1.7-2.5 1.7-4.4zM12 18c1.6 0 3-.5 3.9-1.4L14 15.1c-.5.4-1.2.6-2 .6-1.6 0-2.9-1-3.3-2.4H6.7v1.5A6 6 0 0 0 12 18zm-3.3-4.7a3.6 3.6 0 0 1 0-2.3V9.5H6.7a6 6 0 0 0 0 5.3l2-1.5zM12 8.3c.9 0 1.7.3 2.3.9l1.7-1.7A6 6 0 0 0 6.7 9.5l2 1.5c.4-1.4 1.7-2.7 3.3-2.7z"
            />
          </svg>
          Continuar con Google
        </button>
      </form>

      <p className="m-0 flex items-start gap-2.5 text-sm leading-[1.45] text-body">
        <ShieldCheckIcon size={18} strokeWidth={2} className="mt-px flex-none text-brand" />
        Solo usamos tu nombre y tu mail para verificar que sos alumno. Nunca publicamos en tu nombre sin que escribas
        una reseña.
      </p>
    </section>
  );
}
