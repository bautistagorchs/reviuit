import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Dominio de mail que puede entrar. Se puede cambiar con AUTH_DOMINIO_PERMITIDO
 * (por ejemplo "gmail.com" para probar). Con "*" entra cualquier cuenta de Google.
 */
export const dominioPermitido = process.env.AUTH_DOMINIO_PERMITIDO || "udesa.edu.ar";

// Lee AUTH_SECRET, AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET de las variables de entorno.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          // Le pide a Google que ofrezca solo cuentas del dominio. Es una ayuda visual:
          // la verificación real está en el callback signIn.
          ...(dominioPermitido !== "*" && { hd: dominioPermitido }),
        },
      },
    }),
  ],
  pages: {
    signIn: "/entrar",
    error: "/entrar",
  },
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider !== "google" || !profile?.email || !profile.email_verified) return false;
      return dominioPermitido === "*" || profile.email.toLowerCase().endsWith(`@${dominioPermitido}`);
    },
  },
});
