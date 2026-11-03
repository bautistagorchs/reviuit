# Reviuit

Reseñas de profes y materias de UdeSA, hechas por alumnos verificados y siempre anónimas.

Hecho con Next.js (App Router) + Tailwind CSS v4.

## Desarrollo

Requiere Node.js 20.9 o más nuevo.

```bash
npm install
cp .env.example .env.local   # y completá los valores (ver abajo)
npm run dev
```

## Login con Google

El login usa [Auth.js](https://authjs.dev) con Google. Solo pueden entrar cuentas `@udesa.edu.ar`
(se cambia con `AUTH_DOMINIO_PERMITIDO`). La sesión vive en una cookie firmada: no hace falta base de datos.

1. En [Google Cloud Console](https://console.cloud.google.com) creá un proyecto.
2. En **APIs y servicios → Pantalla de consentimiento de OAuth**, configurala como *Externa* con los
   permisos básicos (email, perfil).
3. En **Credenciales → Crear credenciales → ID de cliente de OAuth**, elegí *Aplicación web* y agregá:
   - Orígenes autorizados: `http://localhost:3000` (y la URL de producción).
   - URIs de redireccionamiento: `http://localhost:3000/api/auth/callback/google`
     (y `https://<tu-dominio>/api/auth/callback/google`).
4. Copiá el Client ID y el Client Secret en `.env.local` como `AUTH_GOOGLE_ID` y `AUTH_GOOGLE_SECRET`.
5. Generá `AUTH_SECRET` (un string aleatorio largo) y pegalo en `.env.local`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Ojo: no uses `npx auth secret`, porque el paquete `auth` de npm ahora es de otra librería (Better Auth)
   y escribe la variable con otro nombre.

Después de cambiar `.env.local` hay que reiniciar `npm run dev`: las variables se leen solo al arrancar.

En producción cargá las mismas variables en el hosting. Si no es Vercel, agregá también `AUTH_TRUST_HOST=true`.

## Pantallas

| Ruta | Pantalla |
| --- | --- |
| `/` | Home con buscador central |
| `/explorar` | Explorar materias por año (acepta `?q=` para buscar) |
| `/materias/[slug]` | Materia con cátedras en tabs y reseñas (acepta `?catedra=`) |
| `/materias/[slug]/comparar` | Comparador de cátedras |
| `/resena/nueva` | Escribir una reseña con vista previa (requiere login) |
| `/mis-resenas` | Tus reseñas (requiere login) |
| `/entrar` | Login con Google |

Los datos de ejemplo viven en `src/lib/data.ts` hasta que exista un backend. Las reseñas que escriben los
usuarios se guardan en el `localStorage` del navegador (`src/lib/resenas-locales.ts`).
Los colores del diseño están definidos como tokens en `src/app/globals.css` (`brand`, `ink`, `cream`, `paper`, …).
