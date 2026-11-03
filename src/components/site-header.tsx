import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/auth";
import { SearchIcon, ShieldCheckIcon } from "@/components/icons";
import { getUsuario } from "@/lib/usuario";

type SiteHeaderProps = {
  /** Muestra el buscador compacto junto al logo. */
  search?: boolean;
  /** Muestra el botón "Escribir reseña". */
  cta?: boolean;
  active?: "explorar" | "mis-resenas";
  /** Reemplaza la navegación por un link "Cancelar". */
  cancelHref?: string;
};

const navLink = "rounded-full px-3.5 py-3 font-medium text-ink no-underline hover:bg-brand-tint hover:text-brand";
const navLinkActive = "rounded-full bg-brand-tint px-3.5 py-3 font-bold text-brand no-underline";

export function Logo() {
  return (
    <Link href="/" className="text-xl font-extrabold tracking-[0.28em] text-brand no-underline">
      REVIUIT
    </Link>
  );
}

export function SiteHeader({ search, cta, active, cancelHref }: SiteHeaderProps) {
  return (
    <header className="border-b border-line">
      <div
        className={`mx-auto flex max-w-[1200px] flex-wrap items-center px-6 py-3.5 ${
          search ? "gap-6" : "justify-between gap-4"
        }`}
      >
        <Logo />
        {search && (
          <Form
            action="/explorar"
            role="search"
            className="flex h-12 max-w-[520px] flex-[1_1_320px] items-center gap-2.5 rounded-full border border-line-strong bg-paper px-4"
          >
            <SearchIcon className="text-brand" />
            <label htmlFor="q-header" className="sr-only">
              Buscar profe o materia
            </label>
            <input
              id="q-header"
              name="q"
              type="search"
              placeholder="Buscá un profe o una materia"
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none"
            />
          </Form>
        )}
        {cancelHref ? (
          <Link href={cancelHref} className="px-3.5 py-3 font-semibold no-underline">
            Cancelar
          </Link>
        ) : (
          <nav aria-label="Principal" className={`flex flex-wrap items-center gap-1 ${search ? "ml-auto" : ""}`}>
            <Link
              href="/explorar"
              aria-current={active === "explorar" ? "page" : undefined}
              className={active === "explorar" ? navLinkActive : navLink}
            >
              Explorar
            </Link>
            <Link
              href="/mis-resenas"
              aria-current={active === "mis-resenas" ? "page" : undefined}
              className={active === "mis-resenas" ? navLinkActive : navLink}
            >
              Mis reseñas
            </Link>
            {cta && (
              <Link
                href="/resena/nueva"
                className="ml-2 rounded-full bg-brand px-[18px] py-3 font-semibold text-white no-underline hover:bg-brand-dark hover:text-white"
              >
                Escribir reseña
              </Link>
            )}
            <Suspense>
              <MenuUsuario />
            </Suspense>
          </nav>
        )}
      </div>
    </header>
  );
}

async function MenuUsuario() {
  const usuario = await getUsuario();

  if (!usuario) {
    return (
      <Link href="/entrar" className={`ml-2 ${navLink}`}>
        Entrar
      </Link>
    );
  }

  async function salir() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-line bg-paper py-1.5 pr-1.5 pl-1.5 text-sm font-medium">
      <span className="inline-flex size-[30px] items-center justify-center rounded-full bg-brand-tint text-brand">
        <ShieldCheckIcon />
      </span>
      <span className="px-1.5" title={usuario.email}>
        {usuario.nombre.split(" ")[0]}
      </span>
      <form action={salir}>
        <button
          type="submit"
          className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold text-muted hover:bg-cream hover:text-ink"
        >
          Salir
        </button>
      </form>
    </span>
  );
}
