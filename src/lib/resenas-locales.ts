// Reseñas escritas por el usuario, guardadas en localStorage del navegador.
// Es una solución para el MVP: cuando exista un backend, reemplazar estas
// funciones por llamadas a la API manteniendo la misma interfaz.

import { useSyncExternalStore } from "react";
import type { Resena } from "@/lib/data";

export type ResenaLocal = Resena & {
  id: string;
  /** Mail de quien la escribió, para saber cuáles son "tuyas". */
  autorEmail: string;
  materiaSlug: string;
  catedraSlug: string;
  creadaEn: string;
};

const KEY = "reviuit:resenas";
const EVENTO = "reviuit:resenas-cambio";
const VACIO: ResenaLocal[] = [];

// useSyncExternalStore necesita que el snapshot sea el mismo objeto si no cambió nada.
let cacheRaw: string | null = null;
let cache: ResenaLocal[] = VACIO;

function leer(): ResenaLocal[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return VACIO;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as ResenaLocal[]) : VACIO;
  } catch {
    cache = VACIO;
  }
  return cache;
}

function escribir(lista: ResenaLocal[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lista));
  } catch {
    // Sin espacio o almacenamiento bloqueado: no hay mucho más que hacer en el MVP.
  }
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(callback: () => void) {
  // "storage" avisa de cambios hechos en otras pestañas.
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO, callback);
  };
}

/** Todas las reseñas del usuario, de la más nueva a la más vieja. */
export function useResenasLocales() {
  return useSyncExternalStore(suscribir, leer, () => VACIO);
}

export function guardarResena(datos: Omit<ResenaLocal, "id" | "creadaEn" | "util">): ResenaLocal {
  const resena: ResenaLocal = {
    ...datos,
    id: crypto.randomUUID(),
    creadaEn: new Date().toISOString(),
    util: 0,
  };
  escribir([resena, ...leer()]);
  return resena;
}

export function borrarResena(id: string) {
  escribir(leer().filter((r) => r.id !== id));
}
