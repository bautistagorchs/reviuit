import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type Usuario = { nombre: string; email: string; imagen: string | null };

/** El usuario logueado, o null. Lee la cookie de sesión: usar dentro de un <Suspense>. */
export async function getUsuario(): Promise<Usuario | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return { nombre: session.user?.name || email.split("@")[0], email, imagen: session.user?.image ?? null };
}

/** Como getUsuario, pero manda a /entrar si no hay sesión y vuelve después a `volverA`. */
export async function requerirUsuario(volverA: string): Promise<Usuario> {
  const usuario = await getUsuario();
  if (!usuario) redirect(`/entrar?callbackUrl=${encodeURIComponent(volverA)}`);
  return usuario;
}
